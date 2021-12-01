const mongoose = require('mongoose');
const { DB_PASSWORD } = require("../secret");
const validator = require("email-validator");
let db_link = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.eeqwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(db_link).then(function () {
    console.log("plan db is connected");
}).catch(function (err) {
    console.log("err", err)
})

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly pass the name"],
        unique: true,
        maxlength:[40,"YOUR PLAN LENGTH IS MORE THAN 40 CHARACTERS"]
    },
    duration: {
        type: Number,
        required: [true, "you need to provide the duration"]
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price;
            },
            message:"your discount should be less than you actual to "
        }
    },
    planImages: {
        type: [String],
    },
    //add 2 things reviews and average rating
    reviews: {
        type: [mongoose.Schema.ObjectId],  //means idr array of enteries aayegi jo review dalega vo idr put hojega
        ref:"reviewModel"
    },
    averageRating: Number,
})

const planModel = mongoose.model("planModel", planSchema);

//to use this we export this module
module.exports = planModel;
