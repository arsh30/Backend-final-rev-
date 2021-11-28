const mongoose = require("mongoose");
const { DB_PASSWORD } = require("../secret");
let db_link = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.eeqwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const validator = require("email-validator");

mongoose.connect(db_link).then(function (connection) {
    console.log("db is connected");
}).catch(function (err) {
    console.log("err", err)
})

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review Can't be Empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contains some ratings"]
    },
    createdAt: {
        type: Date,  //date is javascript function
        default: Date.now
    },
    user: {   //yeh hme pura object chaiye hoga user ka ki id put kre or sare useraajaye review wale
        type: mongoose.Schema.ObjectId,  //yeh jo id hai uska pura object dega
        required: [true, "Review must belong to a user"],
        ref: "userModel"
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: [true, "Review must belong to a plan"]
    }
})

const reviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = reviewModel;
