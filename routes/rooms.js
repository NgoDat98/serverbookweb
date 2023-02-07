const express = require("express");

const router = express.Router();

const roomController = require("../controllers/rooms");

// / => GET all dữ liệu của rooms
router.get("/", roomController.getAllRooms);

// /delete => POST room có id chuyền vào
router.post("/delete", roomController.postDeleteRooms);

// /add-room => POST new room
router.post("/add-room", roomController.postAddRoom);

// /roomid => GET data hotel của một ID nhất định
router.get("/roomid", roomController.getFindByIdRoom);

// /edit-room => POST dữ liệu thay đổi của một hotel có id cụ thế
router.post("/edit-room", roomController.postEditRoom);

module.exports = router;
