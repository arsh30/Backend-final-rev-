const mongoose = require("mongoose");
const { DB_PASSWORD } = require("../secret");
const validator = require("email-validator");
let db_link = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.eeqwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(db_link)
  .then(function () {
    console.log("booking DB is connected");
  })
  .catch(function (err) {
    console.log("err", err);
  });

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  bookedAt: {
    type: Date,
  },
  priceAtThatTime: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pendaing",
    required: true,
  },
});
const bookingModel = mongoose.model("bookingModel", bookingSchema);
module.exports = bookingModel;
