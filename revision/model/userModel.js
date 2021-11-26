const mongoose = require("mongoose");
const { DB_PASSWORD } = require('../secret');
const validator = require("email-validator");

let db_link =
    `mongodb+srv://admin:${DB_PASSWORD}@cluster0.eeqwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(db_link).then(function (connection) {
    console.log('Database is connected');
}).catch(function (err) {
    console.log('err',err);
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            //3rd party library: npm package
            return validator.validate(this.email);  //this.email means issi schema ki email
        }
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
            this.password = this.confirmPassword
        }
    },
    createdAt: {
        type:String
    }
})

//hooks -> pre cook , save is the event listner , we can delete update as well
userSchema.pre('save', function () {
    this.confirmPassword = undefined;
})

//2nd make model from userschema
const userModel = mongoose.model("userModel", userSchema);

//to use this we export this module
module.exports = userModel;