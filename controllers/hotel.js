const { ObjectId } = require("mongodb");
const Hotel = require("../models/hotel");

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  // str = str.replace(/ + /g, " ");
  // bỏ tất cả khoảng trắng
  str = str.replace(/ /g, "");
  str = str.trim();
  // // Remove punctuations
  // // Bỏ dấu câu, kí tự đặc biệt
  // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  //in hoa toàn bộ
  str = str.toUpperCase();
  return str;
}

function removedate(str) {
  day = str.getDate();
  month = str.getMonth() + 1;
  year = str.getFullYear();
  return (str = year + "-" + month + "-" + day);
}

exports.getHotels = (req, res, next) => {
  Hotel.find()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSearchHotels = (req, res, next) => {
  const dateStart = req.query.DateStart;
  const dateEnd = req.query.DateEnd;
  const destination = req.query.searchDestination;
  const optionsPeople = Number(req.query.People);
  const optionsRoom = Number(req.query.Room);
  Hotel.find()
    .populate("rooms")
    .then((data) => {
      // filter theo tên thành phố
      let Arr = [];
      // filter theo ngày các phòng của khách sạn còn trống
      const Arr1 = [];
      // filter số lượng người và phòng còn trống theo nhu cầu của người dùng
      let Arr2 = [];
      if (destination !== "") {
        const filterhotel = data.filter((x) => {
          return (
            x &&
            x.city &&
            removeVietnameseTones(x.city) === removeVietnameseTones(destination)
          );
        });

        if (filterhotel) {
          Arr = [...filterhotel];
        }
      } else {
        Arr = [...data];
      }

      if (Arr.length > 0) {
        for (let key in Arr) {
          const filterRooms = Arr[key].rooms.filter(
            (item) =>
              (removedate(new Date(dateEnd)) > removedate(item.updatedAt) &&
                removedate(new Date(dateStart)) > removedate(item.createdAt)) ||
              (removedate(new Date(dateEnd)) < removedate(item.updatedAt) &&
                removedate(new Date(dateStart)) < removedate(item.createdAt))
          );

          const totalPeople = filterRooms.reduce((total, item) => {
            return total + item.maxPeople * item.roomNumbers.length;
          }, 0);

          const totalRoom = filterRooms.reduce((total, item) => {
            return total + item.roomNumbers.length;
          }, 0);

          if (filterRooms.length > 0) {
            Arr1.push({
              hotel: Arr[key],
              dataRoomTrue: filterRooms,
              haveRoom: totalRoom,
              peopel: totalPeople,
            });
          }
        }
      }

      if (Arr1.length > 0) {
        const filterPeopleAndRoom = Arr1.filter((item) => {
          return item.haveRoom >= optionsRoom && item.peopel >= optionsPeople;
        });

        Arr2 = [...filterPeopleAndRoom];
      }

      if (Arr2.length > 0) {
        return Arr2;
      }
    })
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteHotel = (req, res, next) => {
  const hotelId = req.body.hotelId;
  Hotel.findByIdAndRemove(hotelId)
    .then((data) => {
      console.log("DESTROYED HOTEL");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddHotels = (req, res, next) => {
  const name = req.body.name;
  const city = req.body.city;
  const type = req.body.type;
  const title = req.body.title;
  const cheapestPrice = req.body.cheapestPrice;
  const address = req.body.address;
  const distance = req.body.distance;
  const photos = req.body.photos;
  const desc = req.body.desc;
  const rating = req.body.rating;
  const featured = req.body.featured;
  const room = req.body.room;

  const hotels = new Hotel({
    name: name,
    city: city,
    type: type,
    title: title,
    cheapestPrice: cheapestPrice,
    address: address,
    distance: distance,
    photos: photos,
    desc: desc,
    rating: rating,
    featured: featured,
    rooms: room,
  });

  hotels
    .save()
    .then((data) => {
      console.log("Create A New Hotel!!");
    })
    .catch((er) => {
      console.log(err);
    });
};

exports.getFindByIdHotel = (req, res, next) => {
  const idhotel = req.query.idhotel;
  Hotel.findById(idhotel)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditHotel = (req, res, next) => {
  const idHotel = req.body.id;
  const name = req.body.name;
  const city = req.body.city;
  const type = req.body.type;
  const title = req.body.title;
  const cheapestPrice = req.body.cheapestPrice;
  const address = req.body.address;
  const distance = req.body.distance;
  const photos = req.body.photos;
  const desc = req.body.desc;
  const rating = req.body.rating;
  const featured = req.body.featured;
  const room = req.body.room;

  Hotel.findById(idHotel)
    .then((data) => {
      data.name = name;
      data.city = city;
      data.type = type;
      data.title = title;
      data.cheapestPrice = cheapestPrice;
      data.address = address;
      data.distance = distance;
      data.photos = photos;
      data.desc = desc;
      data.rating = rating;
      data.featured = featured;
      data.rooms = room;
      return data.save();
    })
    .then((data) => {
      console.log("UPDATED HOTEL");
    })
    .catch((err) => {
      console.log(err);
    });
};
