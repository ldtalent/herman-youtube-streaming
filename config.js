const TOKEN_DIR = ".credentials/";

module.exports = {
  SCOPES: [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/youtube.force-ssl"
  ],
  TOKEN_DIR,
  TOKEN_PATH: TOKEN_DIR + "youtube-auth-token.json",
  UNLISTED: "unlisted",
  PRIVATE: "private",
  YOUTUBE_CHANNEL_ID: 'UCkJLiWhvWBqFKMk-m6mInWg'
};
