const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  ],
});

HotelSchema.methods.removeRoomInHotel = function (item) {
  const room = [...this.rooms];
};

module.exports = mongoose.model("Hotel", HotelSchema);
