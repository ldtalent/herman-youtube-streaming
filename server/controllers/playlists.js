const fs = require("fs-extra");
const readline = require("readline");
const {
  TOKEN_PATH,
  SCOPES,
  TOKEN_DIR,
  PRIVATE,
  UNLISTED,
  YOUTUBE_CHANNEL_ID,
} = require("../config");

class Playlists {
  constructor(youtube) {
    this.youtube = youtube;
  }
  async newPlaylist(playlist, auth) {
    const { title, description, tags, privacyStatus } = playlist;
    const service = this.youtube({ version: "v3", auth });

    const res = await service.playlists.insert({
      part: "id,snippet,status",
      requestBody: {
        snippet: {
          title,
          description,
          tags,
        },
        status: {
          privacyStatus,
        },
      },
    });
    playlist = { id: res.data.id, ...playlist };
    return playlist;
  }

  async uploadVideo(video, service) {
    const fileSize = fs.statSync(video.filePath).size;
    const { title, description, privacyStatus, filePath } = video;

    const res = await service.videos.insert(
      {
        part: "id,snippet,status",
        requestBody: {
          snippet: {
            title,
            description,
          },
          status: {
            privacyStatus,
          },
        },
        media: {
          body: fs.createReadStream(filePath),
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      }
    );
    return res.data;
  }

  async addVideoToPlaylist(videoId, playlistId, service) {
    const res = await service.playlistItems.insert({
      part: "id,snippet",
      requestBody: {
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      },
    });
    return res.data;
  }

  async uploadPlaylistVideo(video, playlistId, auth) {
    const service = this.youtube({ version: "v3", auth });
    const { title, description } = video;

    let res;
    try {
      const resp = await this.uploadVideo(video, service);
      res = await this.addVideoToPlaylist(resp.id, playlistId, service);
      res = {
        title,
        description,
        id: res.snippet.resourceId.videoId,
        playlistId,
      };
      // removeFile(this.courseUnitPath);
    } catch (err) {
      console.log(err);
      res = "An error occurred. Please try again";
    }
    return res;
  }

  async allPlaylists(auth) {
    const youtube = this.youtube({ version: "v3", auth });

    const res = await youtube.playlists.list({
      part: "snippet",
      channelId: YOUTUBE_CHANNEL_ID,
    });
    const items = res.data.items.map((item) => ({
      id: item.id,
      ...item.snippet,
    }));

    return { ...res.data, items };
  }

  async playlistItems(playlistId, auth) {
    const youtube = this.youtube({ version: "v3", auth });

    const res = await youtube.playlistItems.list({
      part: "snippet",
      playlistId,
    });
    const items = res.data.items.map((item) => ({
      id: item.id,
      ...item.snippet,
      videoId: item.snippet.resourceId.videoId,
    }));
    return { ...res.data, items };
  }
}

module.exports = Playlists;
