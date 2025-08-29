const express = require("express");
const app = express();

const serverHttp = require("http").createServer(app);

const { Server } = require("socket.io");
const Io = new Server(serverHttp, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

const PORT = 3000 || process.env.PORT;

serverHttp.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

let users = [];
Io.on("connection", (socket) => {
  socket.on("joinRoom", (name) => {
    let isUser = users.find((user) => user.name === name);
    if (!isUser) {
      users.push({
        name: name,
        id: socket.id,
      });
      Io.emit("updateUsers", {newUser: name, allUsers: users});
    } else {
      isUser.id = socket.id;
    }
  });

  console.log(`Usuário conectado no servidor: ${socket.id}`);
  let cont = 0;
  let interval = null;

  socket.on("startTimer", () => {
    if (interval) return;
    interval = setInterval(() => {
      cont += 1;
      socket.emit("setSeconds", cont);
    }, 1000);
  });

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado do servidor: ${socket.id}`);
    users = users.filter((user) => user.id != socket.id);
    clearInterval(interval);
  });
});

module.exports = { serverHttp, Io };
