const fs = require('fs-extra');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { TOKEN_PATH, SCOPES, TOKEN_DIR, PRIVATE, UNLISTED, YOUTUBE_CHANNEL_ID } = require('../config');

class Auth {
  constructor() {
    const OAuth2 = google.auth.OAuth2;
    const secret = fs.readFileSync('./client_id.json');
    const secretContent = JSON.parse(secret);
    const clientSecret = secretContent.web.client_secret;
    const clientId = secretContent.web.client_id;
    const redirectUrl = secretContent.web.redirect_uris[0];
    this.oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
  }

  youtubeAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  }

  async youtubeAccess(authCode = null) {
    try {
      const token = await fs.readFile(TOKEN_PATH);
      this.oauth2Client.credentials = JSON.parse(token);
    } catch (err) {
      await this.getNewToken(authCode);
    }
    return this.oauth2Client;
  }

  async getNewToken(code) {
    const token = await this.oauth2Client.getToken(code);
    storeToken(token);
    this.oauth2Client.credentials = token;
    return this.oauth2Client;
  }
  
  storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
      if (err) {
        console.log(err);
        throw err;
      }
    });
  }

  async isYoutubeToken() {
    const token = await fs.readFile(TOKEN_PATH);
    this.oauth2Client.credentials =  {...JSON.parse(token).tokens, ...JSON.parse(token).res};
    return this.oauth2Client
  }
}

module.exports = Auth;
