const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3003;

const app = express();
const server = http.createServer(app);
// const io = socketio(server);

server
  .listen(PORT, () => console.log(`Server has started on port ${PORT}`))
  .on("error", function(err) {
    if (err.errno === "EADDRINUSE") {
      console.log(
        `----- Port ${PORT} is busy, trying with port ${PORT + 1} -----`
      );
      server.listen(PORT + 1);
    } else {
      console.log(err);
    }
  });
