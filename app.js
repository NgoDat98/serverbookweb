const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

// app.set("view engine", "ejs");
// app.set("views", "views");

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

const userRoutes = require("./routes/user");
const hotelRoutes = require("./routes/hotel");
const roomRoutes = require("./routes/rooms");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");

app.use(cors()); // Use this after the variable declaration

app.use("/user", userRoutes);
app.use("/hotel", hotelRoutes);
app.use("/room", roomRoutes);

// app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://bookingweb:aA190010@products1.xrmt4gr.mongodb.net/bookingweb?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("Ok!!");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
