const mongoose = require("mongoose");
const { DB_PASSWORD } = require("../secret");
const validator = require("email-validator");

let db_link = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.eeqwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(db_link)
  .then(function (connection) {
    console.log("user Database is connected");
  })
  .catch(function (err) {
    console.log("err", err);
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      //3rd party library: npm package
      return validator.validate(this.email); //this.email means issi schema ki email
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    min: 8,
    validate: function () {
      this.password = this.confirmPassword;
    },
  },
  token: String,
  validUpto: {
    type: Date,
    default: Date.now(),
  },
  roles: {
    type: String,
    enum: ["admin", "ce", "user"],
    default: "user",
  },
  createdAt: {
    type: String,
  },
  bookings: {
    type: [mongoose.Schema.ObjectId], //means idr array of enteries aayegi jo review dalega vo idr put hojega
    ref: "bookingModel",
  },
});

//hooks -> pre cook , save is the event listner , we can delete update as well
userSchema.pre("save", function (next) {
  this.confirmPassword = undefined;
  next();
});
//METHODS:  use RESET HANDLER CODE
userSchema.methods.resetHandler = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.token = undefined;
};

//2nd make model from userschema
const userModel = mongoose.model("userModel", userSchema);

//to use this we export this module
module.exports = userModel;
