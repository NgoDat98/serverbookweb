const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

// /user => GET data toàn bộ user
router.get("/user", userController.getCheckAccount);

// /user => POST thêm data user

router.post("/add-user", userController.postUserAccount);

// /id => GET data duy trì đăng nhập

router.get("/id", userController.getLogin);

// /edit-user => POST sửa thông tin user (fullName, phoneNumber, Email...) nêu thay đổi và POST thông tin giao dịch
router.post("/edit-user", userController.postEditUserAndPostTRansaction);

// /transaction => GET tất cả các giao dịch của tất cả users
router.get("/transaction", userController.getTransaction);

// /alltransaction => GET tất cả các giao dịch nhưng không phân trang
router.get("/alltransaction", userController.getAllTransaction);

module.exports = router;
