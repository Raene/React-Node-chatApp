const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const routes = require("./router");
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  console.log("We have a new conncection");

  socket.on("disconnect", () => {
    console.log("User has left")
  });
});

app.use(routes(express));
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
