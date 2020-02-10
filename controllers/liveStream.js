const { TOKEN_PATH, SCOPES, TOKEN_DIR, PRIVATE, UNLISTED, YOUTUBE_CHANNEL_ID } = require('../config');

class LiveStream {

  constructor(youtube) {
    this.youtube = youtube;
  }
  async newBroadcast(broadcast, auth) {
    const service = this.youtube({ version: 'v3', auth });
  
    const res = await service.liveBroadcasts.insert({
      part: 'id,snippet,status',
      requestBody: {
        snippet: {
          title: broadcast.title,
          scheduledStartTime: new Date(),
        },
        status: {
          privacyStatus: PRIVATE,
        },
      },
    });
    const newCourse = { id: res.data.id, ...broadcast};
    return newCourse;
  }

  async bindStream(bind, auth) {
    const service = this.youtube({ version: 'v3', auth});

    const res = await service.liveBroadcasts.bind({
      part: 'id, snippet',
      id: bind.id,
      streamId: bind.streamId
    })

    return { data: res.data };
  }

  async startBroadcast(data, auth) {
    const service = this.youtube({ version: 'v3', auth});

    const res = await service.liveBroadcasts.transition({
      part: 'id, snippet, status',
      id: data.id,
      broadcastStatus: data.broadcastStatus
    })

    return { data: res.data };
  }

  async newStream(stream, auth) {
    const service = this.youtube({ version: 'v3', auth});

    const res = await service.liveStreams.insert({
      part: 'snippet, cdn, status',
      requestBody: {
        snippet: {
        title: stream.title
      },
      cdn: {
        ingestionType: 'rtmp',
        resolution: '720p',
        frameRate: '60fps'
      },
      status: {
        streamStatus: 'active'
      }
      }
    })

    return { id: res.data};
  }

  async updateStream(stream, auth) {
    const service = this.youtube({ version: 'v3', auth});

    const res = await service.liveStreams.update({
      part: 'snippet, status',
      requestBody: {
        snippet: {
        title: stream.title
      },
      status: {
        streamStatus: 'active'
      }
      }
    })

    return { id: res.data};
  }
}

module.exports = LiveStream;
