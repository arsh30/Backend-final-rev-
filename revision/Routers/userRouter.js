const express = require("express");
const userModel = require("../model/userModel");
const { protectRoute , bodyChecker} = require('./utilFns');

// Make routes in particular folder
const userRouter = express.Router();

userRouter
  .route("/")
  .post(bodyChecker, createUser)
  .get(protectRoute, getUsers);  //locahost:8082/user/ -> get

userRouter
  .route("/:id")   //api/user/ some id
  .get(getUser)
  .patch(bodyChecker, updateUser)
  .delete(bodyChecker, deleteUser)

async function createUser(req, res) {
    try {
      let user = await userModel.create(req.body);   //normall req body se data manwakr put krdiya
      res.status(200).json({
        message: user
      })
      
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message:"Server error"
      })
    }
}
async function getUser(req, res) {
  let { id } = req.params;
  try {  //isme data param me aayega
    let users = await userModel.findById(id);
    res.status(200).json({
      message:users
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    })
  }
}
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

async function updateUser(req, res) {   //isme jo id vo param me aayegi and data body me aayegi
  let { id } = req.params;
  try {
    let user = await userModel.findById(id);
    if (user) {
      // req.body.id = undefined; dont need this because data param me hai
      for (let key in user) {   //update work jese hmne reset me kr tha vese hi krege means user phle mangwaege then usme updation krege
        user[key] = req.body[key];
      }
      await user.save();
      res.status(200).json({
        message:user
      })
    } else {
      res.status(400).json({
        message: "id not found"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error"
    })
  }
}

async function deleteUser(req, res) {
  //isme hmne param se id nikali  and find by id pr call kri or vo bnda remove hogya
  let { id } = req.params;
  try {
    let user = await userModel.findByIdAndDelete(id);
    res.status(500).json({
      user:user
    })    
  }catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error"
    })
  }
}
module.exports = userRouter;
