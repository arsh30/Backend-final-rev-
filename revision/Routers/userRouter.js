const express = require("express");
const userModel = require("../model/userModel");
const { protectRoute } = require('./utilFns');

// Make routes in particular folder
const userRouter = express.Router();

userRouter.route("/").get(protectRoute, getUsers);

async function getUsers(req, res) {
  //It will give the details of all users
    try {
        let users = await userModel.find();   //find -> it gives the detail of all the users
        res.status(200).json({
            message: users
        })
  } catch (err) {
    console.log(
      "error to get details of user!! please verify your email first"
    );
    res.status(500).json({
      message: " please verify your email first",
    });
  }
}

module.exports = userRouter;
