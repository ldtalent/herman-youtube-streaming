const {
  TOKEN_PATH,
  SCOPES,
  TOKEN_DIR,
  PRIVATE,
  UNLISTED,
  YOUTUBE_CHANNEL_ID,
} = require("../config");

class LiveStream {
  constructor(youtube) {
    this.youtube = youtube;
  }
  async newBroadcast(broadcast, auth) {
    const service = this.youtube({ version: "v3", auth });
    const { title, description, privacyStatus, scheduledStartTime, scheduledEndTime } = broadcast;

    const res = await service.liveBroadcasts.insert({
      part: "id,snippet,status",
      requestBody: {
        snippet: {
          title,
          description,
          scheduledStartTime,
          scheduledEndTime
        },
        status: {
          privacyStatus,
        },
      },
    });
    const newBroadcast = { id: res.data.id, ...broadcast };
    return newBroadcast;
  }

  async bindStream(bind, auth) {
    const service = this.youtube({ version: "v3", auth });
    const { id, streamId } = bind;

    const res = await service.liveBroadcasts.bind({
      part: "id, snippet",
      id,
      streamId,
    });

    return { data: res.data };
  }

  async startBroadcast(data, auth) {
    const service = this.youtube({ version: "v3", auth });

    const res = await service.liveBroadcasts.transition({
      part: "id, snippet, status",
      id: data.id,
      broadcastStatus: data.broadcastStatus,
    });

    return { data: res.data };
  }

  async newStream(stream, auth) {
    const service = this.youtube({ version: "v3", auth });

    const res = await service.liveStreams.insert({
      part: "snippet, cdn, status",
      requestBody: {
        snippet: {
          title: stream.title,
        },
        cdn: {
          ingestionType: "hls",
          resolution: "variable",
          frameRate: "variable",
        }
      },
    });

    return { id: res.data };
  }

  async updateStream(stream, auth) {
    const service = this.youtube({ version: "v3", auth });

    const res = await service.liveStreams.update({
      part: "snippet, status",
      requestBody: {
        id: stream.id,
        snippet: {
          title: stream.title,
        },
        status: {
          streamStatus: "active",
        },
      },
    });

    return { id: res.data };
  }

  async allBroadcasts(auth) {
    const youtube = this.youtube({ version: "v3", auth });

    const res = await youtube.liveBroadcasts.list({
      part: "snippet,contentDetails",
      mine: true,
    });

    return { data: res.data };
  }

  async allStreams(auth) {
    const youtube = this.youtube({ version: "v3", auth });

    const res = await youtube.liveStreams.list({
      part: "id,snippet,status,contentDetails",
      mine: true,
    });

    return { data: res.data };
  }
}

module.exports = LiveStream;
