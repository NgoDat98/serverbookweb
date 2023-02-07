const User = require("../models/user");

exports.getCheckAccount = (req, res, next) => {
  User.find()
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  const id = req.query.id;
  if (id !== "") {
    User.findById(id)
      .then((data) => {
        res.json({ isLogin: true, data: data });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({ isLogin: false, data: [] });
  }
};

exports.postUserAccount = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const isAdmin = req.body.isAdmin;
  User.find()
    .then((users) => {
      const user = new User({
        username: username,
        password: password,
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        isAdmin: isAdmin,
      });
      const findUserName = users.find((u) => u.username === user.username);
      if (!findUserName) return user.save();
      else {
        res.json({ message: "Username is available" });
      }
    })
    .then(() => {
      console.log("Create User");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditUserAndPostTRansaction = (req, res, next) => {
  const userId = req.body.userId;
  const username = req.body.username;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const isAdmin = req.body.isAdmin;
  const transaction = req.body.transaction;
  const hotel = req.body.hotel;
  const room = req.body.room;
  const date = req.body.date;
  const totalPrice = req.body.totalPrice;
  const payment = req.body.payment;
  const timebook = req.body.timebook;
  const idhotel = req.body.idhotel;
  User.findById(userId)
    .then((data) => {
      data.userId = userId;
      data.username = username;
      data.password = password;
      data.fullName = fullName;
      data.phoneNumber = phoneNumber;
      data.email = email;
      data.isAdmin = isAdmin;
      data.transaction = transaction;
      return data.save();
    })
    .then((data) => {
      return data.addToTransaction({
        username,
        hotel,
        room,
        date,
        totalPrice,
        payment,
        timebook,
        idhotel,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getTransaction = (req, res, next) => {
  //lấy dữ liệu transaction trong tất cả các users
  User.find()
    .then((data) => {
      const transactionArr = [];

      data.forEach((item, index) =>
        data[index].transaction.items.forEach((item, index) =>
          transactionArr.push(item)
        )
      );
      return transactionArr;
    })
    .then((data) => {
      // sắp xếp theo thứ tự thời gian book gần nhất
      const recently = data.sort(function (a, b) {
        return -a.timebook.getTime() + b.timebook.getTime();
      });

      const page = recently;
      const PAGE_SIZE = 8;
      const curruntPage = parseInt(req.query.page)
        ? parseInt(req.query.page)
        : 1;
      const start = (curruntPage - 1) * PAGE_SIZE;
      const end = (curruntPage - 1) * PAGE_SIZE + PAGE_SIZE;
      const item = page.slice(start, end);
      const total_pages = Math.ceil(page.length / PAGE_SIZE);
      if (curruntPage) {
        if (curruntPage <= total_pages) {
          res.status(200).json({
            results: item,
            page: curruntPage,
            total_pages: total_pages,
          });
        } else {
          res
            .status(404)
            .send(
              `<h1>This page is out of data!</h1> <br /> <p>This page only has data up to ${total_pages} pages</p>`
            );
        }
      } else {
        res.status(200).json({
          results: dataMovie,
          page: total_pages,
          total_pages: total_pages,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllTransaction = (req, res, next) => {
  //lấy dữ liệu transaction trong tất cả các users
  User.find()
    .then((data) => {
      const transactionArr = [];

      data.forEach((item, index) =>
        data[index].transaction.items.forEach((item, index) =>
          transactionArr.push(item)
        )
      );
      return transactionArr;
    })
    .then((data) => {
      // sắp xếp theo thứ tự thời gian book gần nhất
      const recently = data.sort(function (a, b) {
        return -a.timebook.getTime() + b.timebook.getTime();
      });
      res.json(recently);
    })
    .catch((err) => {
      console.log(err);
    });
};
