const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
require("dotenv").config();
const { playlists, liveStream, auth } = require("./controllers");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(busboy());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/authorize", (req, res) => {
  const url = auth.youtubeAuthUrl();
  return res.json({ url });
});

app.use("/api/auth", async (req, res) => {
  const { code } = req.query;
  const client = await auth.youtubeAccess(code);
  return res.status(200).json({ client });
});

app.post("/api/playlists", async (req, res) => {
  const { body: newPlaylist } = req;
  const client = await auth.isYoutubeToken();
  const playlist = await playlists.newPlaylist(newPlaylist, client);
  return res.status(200).json({ playlist });
});
app.post("/api/playlists/:id", async (req, res) => {
  const {
    params: { id },
    body: video,
  } = req;

  const client = await auth.isYoutubeToken();
  const resp = await playlists.uploadPlaylistVideo(video, id, client);
  return res.status(200).json({ resp });
});

app.get("/api/playlists/:id", async (req, res) => {
  const { id } = req.params;
  const client = await auth.isYoutubeToken();
  const data = await playlists.playlistItems(id, client);
  return res.status(200).json(data);
});

app.get("/api/playlists", async (req, res) => {
  const client = await auth.isYoutubeToken();
  const data = await playlists.allPlaylists(client);
  return res.status(200).json(data);
});

app.post("/api/live/broadcasts", async (req, res) => {
  const { body: broadcast } = req;
  const client = await auth.isYoutubeToken();
  const resp = await liveStream.newBroadcast(broadcast, client);
  return res.status(201).json(resp);
});

app.get("/api/live/broadcasts", async (req, res) => {
  const client = await auth.isYoutubeToken();
  const data = await liveStream.allBroadcasts(client);
  return res.status(200).json(data);
});

app.post("/api/live/streams", async (req, res) => {
  const { body: stream } = req;
  const client = await auth.isYoutubeToken();
  const resp = await liveStream.newStream(stream, client);
  return res.status(200).json(resp);
});

app.put("/api/live/streams", async (req, res) => {
  const { body: stream } = req;
  const client = await auth.isYoutubeToken();
  const resp = await liveStream.updateStream(stream, client);
  return res.status(200).json(resp);
});

app.post("/api/live/broadcast/bind", async (req, res) => {
  const { body: bind } = req;
  const client = await auth.isYoutubeToken();
  const resp = await liveStream.bindStream(bind, client);
  return res.status(200).json(resp);
});

app.post("/api/live/broadcast/start", async (req, res) => {
  const { body: data } = req;
  const client = await auth.isYoutubeToken();
  const resp = await liveStream.startBroadcast(data, client);
  return res.status(200).json(resp);
});

app.get("/api/streams", async (req, res) => {
  const client = await auth.isYoutubeToken();
  const data = await liveStream.allStreams(client);
  return res.status(200).json(data);
});
app.get("/api/broadcasts", async (req, res) => {
  const client = await auth.isYoutubeToken();
  const data = await liveStream.allBroadcasts(client);
  return res.status(200).json(data);
});

app.post("/api/upload", (req, res, next) => {
  let fstream;

  req.pipe(req.busboy);
  req.busboy.on("file", function (fieldname, file, filename) {
    console.log("Uploading: " + filename);

    //Path where image will be uploaded
    const filePath = "public/video/" + filename;
    fstream = fs.createWriteStream(filePath);
    file.pipe(fstream);
    fstream.on("close", function () {
      console.log("Upload Finished of " + filename);
      res.status(200).json({ filePath });
    });
  });
});

app.server = app.listen(port, () =>
  console.log(`server has started on port ${port}`)
);

module.exports = app;
