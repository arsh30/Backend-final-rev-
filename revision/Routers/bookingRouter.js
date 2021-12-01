const express = require("express");
const bookingRouter = express.Router();
let bookingModel = require("../model/bookingModel");
const userModel = require("../model/userModel");
const razorPay = require("razorpay");
const {
  createElement,
  deleteElement,
  updateElement,
  getElement,
  getElements,
} = require("../helpers/factory");
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

const updatebooking = updateElement(bookingModel);
const getbooking = getElement(bookingModel);
const getbookings = getElements(bookingModel);

bookingRouter.use(protectRoute); //it is necessary to add protect route every function

//createBooking
const initiateBooking = async function (req, res) {
  try {   //aise tab krte h jb 2 cheezo ko link krwana ho
    let booking = await bookingModel.create(req.body);   //booking create krri 
    let bookingId = booking["_id"]; //yeh id nikali jo mongo db bnata hai
    let userId = req.body.user;  //ab  booking router me,request ki body me user hai usse id miljaegi
    let user = await userModel.findById(userId);  //id se hmne user nikala
    user.bookings.push(bookingId);  //or jitne bhhi user jo bhi book krte hai unko hmne userRouter me booking se bnaya hai usme jakr store krwali
    await user.save();  //and save krdiya
    res.status(200).json({
      message: "booking created",
      booking: booking,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//delete booking  -> same jese review me kara tha
const deletebooking = async function (req, res) {
  //aise tab krte hai jab 2 bndo ko sync krwana ho
  try {
    let booking = await bookingModel.findByIdAndDelete(req.body.id);
    console.log("booking", booking);
    let userId = booking.user;
    let user = await userModel.findById(userId);
    let idxOfBooking = user.bookings.indexOf(booking["_id"]);
    user.booking.splice(idxOfBooking, 1);
    await user.save();

    res.status(200).json({
      message: "booking deleted",
      booking: booking,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//now do crud for this

bookingRouter
  .route("/:id")
  .get(getbooking)
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatebooking)
  .delete(bodyChecker, isAuthorized(["admin"]), deletebooking);

bookingRouter
  .route("/")
  // .post(bodyChecker, isAuthorized(["admin"]), createbooking)
  .get(bodyChecker, isAuthorized(["admin", "ce"]), getbookings);

module.exports = bookingRouter;
