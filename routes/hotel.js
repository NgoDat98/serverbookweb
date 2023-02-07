const express = require("express");

const router = express.Router();

const hotelControllers = require("../controllers/hotel");

// / => GET data Hotel
router.get("/", hotelControllers.getHotels);

// /search => GET data theo value nhập vào!
router.get("/search", hotelControllers.getSearchHotels);

// /delete => POST xóa hotel theo id
router.post("/delete", hotelControllers.postDeleteHotel);

// /add-new-hotels => POST thêm khách sạn vào mongoDb
router.post("/add-new-hotels", hotelControllers.postAddHotels);

// /hotelid => GET data hotel của một ID nhất định
router.get("/hotelid", hotelControllers.getFindByIdHotel);

// /edit-hotel => POST dữ liệu thay đổi của một hotel có id cụ thế
router.post("/edit-hotel", hotelControllers.postEditHotel);

module.exports = router;
