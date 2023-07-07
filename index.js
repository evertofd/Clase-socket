const express = require("express");
const app = express();
// Configuracion de socket.io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// Importacion de handlebars
const exphbs = require("express-handlebars");
const port = 3000;

// Importo las funciones desde utils.js
const { createRooms, saveData, readChats } = require("./utils");

app.set("view engine", "handlebars");

const handlebars = exphbs.create({
  // defaultLayout: __dirname + "/views/layout/main.handlebars"
  layoutsDir: __dirname + "/views",
  partialsDir: __dirname + "/views/partials",
});

app.engine("handlebars", handlebars.engine);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/admin", async (req, res) => {
  let chats = await readChats();
  let rooms = Object.keys(chats);
  res.render("admin", { rooms: rooms });
});

app.get("/info_chat/:id", async (req, res) => {
  let { id } = req.params;
  let data = await readChats();
  res.status(200).send(data[id]);
});
/*
Bloque donde trabajare toda la logica del socket.io
room_id_usuario
room_z4wvFHSazukptNRiAAAD
room_admin
*/

io.on("connection", (socket) => {
  socket.on("conectado", async (client) => {
    if (client !== "admin") {
      let new_room = `room_${socket.id}`;
      await createRooms(new_room);
      socket.join(`room_${socket.id}`);
    } else {
      socket.join("room_admin");
    }
  });

  socket.on("chat message", async (msg) => {
    if (msg.id !== undefined) {
      await saveData(msg.id, msg.msg);
      io.sockets
        .to(msg.id)
        .to("room_admin")
        .emit("chat message", { msg: msg.msg, id: msg.id });
    } else {
      await saveData(`room_${socket.id}`, msg);
      io.sockets
        .to(`room_${socket.id}`)
        .to("room_admin")
        .emit("chat message", { msg, id: `room_${socket.id}` });
    }
  });
});
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
