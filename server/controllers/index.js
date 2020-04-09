const { google } = require('googleapis');
const Auth = require('./auth');
const Playlists = require('./playlists');
const LiveStream = require('./liveStream');

module.exports = {
  liveStream: new LiveStream(google.youtube),
  auth: new Auth(),
  playlists: new Playlists(google.youtube)
}