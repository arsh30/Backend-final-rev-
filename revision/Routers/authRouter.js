const express = require("express");
const { bodyChecker } = require("./utilFns");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const { JWT_SECRET } = require("../secret");
const emailSender = require("../helpers/emailSender");

const authRouter = express.Router();

authRouter.route("/signup").post(bodyChecker, signupUser);
authRouter.route("/login").post(bodyChecker, loginUser);
authRouter.route("/forgetPassword").post(bodyChecker, forgetPassword);

async function signupUser(req, res) {
  try {
    let newUser = await userModel.create(req.body); //create is used to entries in the document
    res.status(200).json({
      message: "user created successfully",
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    let { email, password } = req.body; //email password aaya body me and then check kra usermodel ie database me ki hai ya nahi using findOne
    let user = await userModel.findOne({ email });
    if (user) {
      if (user.password == password) {
        let token = jwt.sign({ id: user["_id"] }, JWT_SECRET);
        console.log("token:", token);
        res.cookie("JWT", token, { httpOnly: true });
        res.status(200).json({
          message: "user logged In successfully",
        });
      } else {
        res.status(404).json({
          message: "email or password is incorrect",
        });
      }
    } else {
      res.status(400).json({
        message: "email or password is incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
}

async function forgetPassword(req, res) {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email }); //1st search the email on the database
    if (user) {
      let token = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1); //2nd  create token otp based
      let updateRes = await userModel.updateOne({ email }, { token }); //3rd update the database with the new token
      // console.log("updated Value", updateRes);

      let newUser = await userModel.findOne({ email });
      console.log("newUser", newUser);

      //4 step is to send the mail on the user
      await emailSender(token, user.email);

      res.status(200).json({
        message: "user Token send to your email",
        user: newUser,
        token,
      });
    } else {
      res.status(400).json({
        message: "email or password is incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
}

// function tempLoginUser(req, res) {
//     try {
//       let { email, password } = req.body;
//       let obj = content.find(function (obj) {
//         //1) Database pr loop lgaya or search kra id ko
//         return (obj.email = email); //rhs is email which is send through the frontend
//       });
//       if (obj.password == password) {
//         let token = jwt.sign({ email: obj.email }, JWT_SECRET); //1st param is payload(email -> yeh hum khud kuch bhi lik skte hai :email jidr se nikali h vo), 2nd parm is the SECRET KEY Which we make
//         console.log("tokenId", token);
//         res.cookie("JWT", token, { httpOnly: true }); //1ST PARAM is Cookie Name(khud se kuch bhi rakho) , 2nd param is(token)
//         res.status(200).json({
//           message: "user logged In",
//           user: obj,
//         });
//       } else {
//         res.status(402).json({
//           message: "kindly go on the login function",
//         });
//       }
//     } catch (err) {
//       res.json({
//         message: "Kindly do signup first",
//       });
//     }
//   }

module.exports = authRouter;
