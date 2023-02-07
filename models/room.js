const mongoose = require("mongoose");
const Hotel = require("./hotel");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  maxPeople: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  roomNumbers: [
    {
      type: Number,
      required: true,
    },
  ],
});

roomSchema.methods.addRoomToHotel = function (item) {
  Hotel.findById(item.idHotel)
    .then((data) => {
      data.rooms.push(item.idRoom);
      return data.save();
    })
    .then((data) => {
      console.log("add new room to hotel success");
    })
    .catch((err) => {
      console.log(err);
    });
};

roomSchema.methods.addRoomToHotel = function (item) {
  Hotel.findById(item.idHotel)
    .then((data) => {
      data.rooms.push(item.idRoom);
      return data.save();
    })
    .then((data) => {
      console.log("add new room to hotel success");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoose.model("Room", roomSchema);
