const fs = require("fs");

exports.createRooms = (id) => {
  let data = fs.readFileSync("rooms.json", "utf-8");
  let rooms = JSON.parse(data);
  rooms[id] = { message: [] };
  fs.writeFileSync("rooms.json", JSON.stringify(rooms), "utf-8");
};


exports.saveData =(id,message)=>{
    let data = fs.readFileSync("rooms.json", "utf-8");
    let rooms = JSON.parse(data);
    rooms[id].message.push(message)
    fs.writeFileSync("rooms.json", JSON.stringify(rooms), "utf-8");
}

exports.readChats = ()=>{
  let data = fs.readFileSync("rooms.json", "utf-8");
  let rooms = JSON.parse(data);
  return rooms
}