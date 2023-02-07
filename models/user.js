const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  email: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  transaction: {
    items: [
      {
        username: {
          type: String,
          required: true,
        },
        hotel: {
          type: String,
          required: true,
        },
        room: {
          type: Array,
          required: true,
        },
        date: {
          type: Array,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        payment: {
          type: String,
          required: true,
        },
        timebook: {
          type: Date,
          required: true,
        },
        idhotel: {
          type: Schema.Types.ObjectId,
          ref: "Hotel",
          required: true,
        },
      },
    ],
  },
});

UserSchema.methods.addToTransaction = function (items) {
  const updatedTransactionItems = [...this.transaction.items];
  updatedTransactionItems.push({
    username: items.username,
    hotel: items.hotel,
    room: items.room,
    date: items.date,
    totalPrice: items.totalPrice,
    payment: items.payment,
    timebook: items.timebook,
    idhotel: items.idhotel,
  });

  const updatedTransaction = {
    items: updatedTransactionItems,
  };

  this.transaction = updatedTransaction;
  return this.save();
};

module.exports = mongoose.model("User", UserSchema);

// const mongoose = require("mongoose");
// const { schema } = require("./product");

// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   cart: {
//     items: [
//       {
//         productId: {
//           type: Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: { type: Number, required: true },
//       },
//     ],
//   },
// });

// UserSchema.methods.addToCart = function (product) {
//   const cartProductIndex = this.cart.items.findIndex((cp) => {
//     return cp.productId.toString() === product._id.toString();
//   });
//   let newQuantity = 1;
//   const updatedCartItems = [...this.cart.items];

//   if (cartProductIndex >= 0) {
//     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//   } else {
//     updatedCartItems.push({
//       productId: product._id,
//       quantity: newQuantity,
//     });
//   }
//   const updatedCart = {
//     items: updatedCartItems,
//   };
//   this.cart = updatedCart;
//   return this.save();
// };

// UserSchema.methods.removeFormCart = function (productId) {
//   const updatedItems = this.cart.items.filter((item) => {
//     return item.productId.toString() !== productId.toString();
//   });
//   this.cart.items = updatedItems;
//   return this.save();
// };

// UserSchema.methods.clearCart = function () {
//   this.cart = { items: [] };
//   return this.save();
// };

// module.exports = mongoose.model("User", UserSchema);

// // const mongodb = require("mongodb");
// // const ObjectId = mongodb.ObjectId;

// // class User {
// //   constructor(username, email, cart, id) {
// //     this.username = username;
// //     this.email = email;
// //     this.cart = cart;
// //     this._id = id;
// //   }
// //   save() {
// //     const db = getDb();
// //     return db
// //       .collection("users")
// //       .insertOne(this)
// //       .then((result) => {
// //         console.log(result);
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //       });
// //   }

// //   addToCart(product) {
// //     const cartProductIndex = this.cart.items.findIndex((cp) => {
// //       return cp.productId.toString() === product._id.toString();
// //     });
// //     let newQuantity = 1;
// //     const updatedCartItems = [...this.cart.items];

// //     if (cartProductIndex >= 0) {
// //       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// //       updatedCartItems[cartProductIndex].quantity = newQuantity;
// //     } else {
// //       updatedCartItems.push({
// //         productId: new ObjectId(product._id),
// //         quantity: newQuantity,
// //       });
// //     }
// //     const updatedCart = {
// //       items: updatedCartItems,
// //     };
// //     const db = getDb();
// //     return db
// //       .collection("users")
// //       .updateOne(
// //         { _id: new ObjectId(this._id) },
// //         { $set: { cart: updatedCart } }
// //       );
// //   }

// //   getCart() {
// //     const db = getDb();
// //     const productIds = this.cart.items.map((i) => {
// //       return i.productId;
// //     });
// //     return db
// //       .collection("products")
// //       .find({ _id: { $in: productIds } })
// //       .toArray()
// //       .then((products) => {
// //         return products.map((p) => {
// //           return {
// //             ...p,
// //             quantity: this.cart.items.find((i) => {
// //               return i.productId.toString() === p._id.toString();
// //             }).quantity,
// //           };
// //         });
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //       });
// //   }

// //   deleteItemFromCart(productId) {
// //     const updatedItems = this.cart.items.filter((item) => {
// //       return item.productId.toString() !== productId.toString();
// //     });
// //     const db = getDb();
// //     return db
// //       .collection("users")
// //       .updateOne(
// //         { _id: new ObjectId(this._id) },
// //         { $set: { cart: { items: updatedItems } } }
// //       );
// //   }

// //   addOrder() {
// //     const db = getDb();
// //     return this.getCart()
// //       .then((products) => {
// //         const order = {
// //           items: products,
// //           user: {
// //             _id: new ObjectId(this._id),
// //             name: this.name,
// //           },
// //         };
// //         return db.collection("orders").insertOne(order);
// //       })
// //       .then((result) => {
// //         this.cart = { items: [] };
// //         return db
// //           .collection("users")
// //           .updateOne(
// //             { _id: new ObjectId(this._id) },
// //             { $set: { cart: { items: [] } } }
// //           );
// //       })
// //       .catch((err) => console.log(err));
// //   }

// //   getOrder() {
// //     const db = getDb();
// //     return db
// //       .collection("orders")
// //       .find({ "user._id": new ObjectId(this._id) })
// //       .toArray();
// //   }

// //   static findById(userId) {
// //     const db = getDb();
// //     return db
// //       .collection("users")
// //       .findOne({ _id: new ObjectId(userId) })
// //       .then((user) => {
// //         console.log(user);
// //         return user;
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //       });
// //   }
// // }

// // // const Sequelize = require('sequelize');

// // // const sequelize = require('../util/database');

// // // const User = sequelize.define('user', {
// // //   id: {
// // //     type: Sequelize.INTEGER,
// // //     autoIncrement: true,
// // //     allowNull: false,
// // //     primaryKey: true
// // //   },
// // //   name: Sequelize.STRING,
// // //   email: Sequelize.STRING
// // // });

// // module.exports = User;
