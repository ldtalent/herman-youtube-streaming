const { TOKEN_PATH, SCOPES, TOKEN_DIR, PRIVATE, UNLISTED, YOUTUBE_CHANNEL_ID } = require('../config');

class Playlists {

  constructor(youtube) {
    this.youtube = youtube;
  }
  async newPlaylist(course, auth) {
    const service = this.youtube({ version: 'v3', auth });
  
    const res = await service.playlists.insert({
      part: 'id,snippet,status',
      requestBody: {
        snippet: {
          title: course.title,
          description: course.description,
          tags: course.tags,
        },
        status: {
          privacyStatus: PRIVATE,
        },
      },
    });
    const newCourse = { id: res.data.id, ...course };
    return newCourse;
  }
  
  async uploadVideo(video, service) {
    const fileSize = fs.statSync(video.filePath).size;
  
    const res = await service.videos.insert(
      {
        part: 'id,snippet,status',
        requestBody: {
          snippet: {
            title: video.title,
            description: video.description,
          },
          status: {
            privacyStatus: UNLISTED,
          },
        },
        media: {
          body: fs.createReadStream(video.filePath),
        },
      },
      {
        onUploadProgress: evt => {
          const progress = (evt.bytesRead / fileSize) * 100;
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      },
    );
    return res.data;
  }
  
  async addVideoToPlaylist (
    videoId,
    playlistId,
    service,
  ) {
    const res = await service.playlistItems.insert({
      part: 'id,snippet',
      requestBody: {
        snippet: {
          playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId,
          },
        },
      },
    });
    return res.data;
  }
  
  async uploadPlaylistVideo(
    video,
    playlistId,
    auth,
  ) {
    const service = this.youtube({ version: 'v3', auth });
    let res;
    try {
      const resp = await this.uploadVideo(video, service);
      res = await this.addVideoToPlaylist(resp.id, playlistId, service);
      res = {
        title: video.title,
        description: video.description,
        id: res.snippet.resourceId.videoId,
        playlistId,
      };
      // removeFile(this.courseUnitPath);
    } catch (err) {
      console.log(err);
      res = 'An error occurred. Please try again';
    }
    return res;
  }
  
  async allPlaylists(auth) {
    const youtube = this.youtube({ version: 'v3', auth });
  
    const res = await youtube.playlists.list({
      part: 'snippet',
      channelId: YOUTUBE_CHANNEL_ID,
    });
    return res.data;
  }
  
  async playlistItems(auth) {
    const youtube = this.youtube({ version: 'v3', auth });
  
    const res = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: 'PLlGEpYu_Yave1TtZIutvxeYIasQXSq4IX',
    });
    return res.data;
  }
}

module.exports = Playlists;
