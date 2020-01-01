const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const routes = require("./router");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  console.log("We have a new connection");
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      users: "admin",
      text: `${user.name}, welcome to the room ${user.room}`
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined` });
    socket.join(user.room);

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User has left");
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
