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

Io.on("connection", (socket) => {
  console.log(`Usuário conectado no servidor: ${socket.id}`);
  let cont = 0;
  let interval = null;

  socket.on("startTimer", () => {
    
    if (interval) return
      interval = setInterval(() => {
        cont += 1;
        socket.emit("setSeconds", cont);
      }, 1000);
  });

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado do servidor: ${socket.id}`);
    clearInterval(interval);
  });
});

module.exports = { serverHttp, Io };
