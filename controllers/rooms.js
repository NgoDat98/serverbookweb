const Room = require("../models/room");
const Hotel = require("../models/hotel");
const { ObjectID, ObjectId } = require("bson");

exports.getAllRooms = (req, res, next) => {
  Room.find()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteRooms = (req, res, next) => {
  const roomId = req.body.roomId;
  Room.findByIdAndRemove(roomId)
    .then((data) => {
      console.log("DESTROYED ROOM");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddRoom = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const maxPeople = req.body.maxPeople;
  const desc = req.body.desc;
  const createdAt = req.body.createdAt;
  const updatedAt = req.body.updatedAt;
  const roomNumbers = req.body.roomNumbers;
  const idHotel = req.body.idHotel;

  const room = new Room({
    title: title,
    price: price,
    maxPeople: maxPeople,
    desc: desc,
    createdAt: createdAt,
    updatedAt: updatedAt,
    roomNumbers: roomNumbers,
  });

  room
    .save()
    .then((data) => {
      return data.addRoomToHotel({
        idHotel: idHotel,
        idRoom: data._id,
      });
    })
    .then((data) => {
      Hotel.updateMany();
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getFindByIdRoom = (req, res, next) => {
  const idRoom = req.query.idroom;
  if (idRoom) {
    Room.findById(idRoom)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.postEditRoom = (req, res, next) => {
  const roomId = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const maxPeople = req.body.maxPeople;
  const desc = req.body.desc;
  const createdAt = req.body.createdAt;
  const updatedAt = req.body.updatedAt;
  const roomNumbers = req.body.roomNumbers;

  Room.findById(roomId)
    .then((data) => {
      data.title = title;
      data.price = price;
      data.maxPeople = maxPeople;
      data.desc = desc;
      data.createdAt = createdAt;
      data.updatedAt = updatedAt;
      data.roomNumbers = roomNumbers;
      return data.save();
    })
    .then((data) => {
      console.log("UPDATED ROOM!");
    })
    .catch((err) => {
      console.log(err);
    });
};
