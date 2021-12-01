const express = require("express");
const userModel = require("../model/userModel");
const { protectRoute, bodyChecker, isAuthorized } = require('./utilFns');
const { createElement, getElement, getElements, updateElement, deleteElement } = require("../helpers/factory");

// Make routes in particular folder
const userRouter = express.Router();

const createUser = createElement(userModel);
const deleteUser = deleteElement(userModel);
const updateUser = updateElement(userModel);
const getUser =  getElement(userModel);
const getUsers = getElements(userModel);

userRouter.use(protectRoute);  //we want that before every function the protetRoute will be added in front of this we do authorization part

// userRouter
//   .route('/:id')  //we created this same route id because we make sure that the user will come to get the id, it is necessary to give the idea to them
//   .get(getUser);  //same route will not give us the error

userRouter
  .route("/")
  .post(bodyChecker,isAuthorized(["admin"]) ,createUser)
  .get(protectRoute,isAuthorized(["admin","ce"]) ,getUsers);  //locahost:8082/user/ -> get

userRouter
  .route("/:id")   //api/user/ some id  
  .get(getUser)   //(delete and create sirf admin kar skta)
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateUser)  //isAuthorized(["admin","ce"]) -> means is Authorized ko call lgay hmne and usme ik array me dalkr roles bhjdiye ki yehi allowed
  .delete(bodyChecker, isAuthorized(["admin"]), deleteUser)



// async function createUser(req, res) {
//     try {
//       let user = await userModel.create(req.body);   //normall req body se data manwakr put krdiya
//       res.status(200).json({
//         message: user
//       })
      
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({
//         message:"Server error"
//       })
//     }
// }
// async function getUser(req, res) {
//   let { id } = req.params;
//   try {  //isme data param me aayega
//     let users = await userModel.findById(id);
//     res.status(200).json({
//       message:users
//     })
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message
//     })
//   }
// }
// async function getUsers(req, res) {
//   //It will give the details of all users
//     try {
//         let users = await userModel.find();   //find -> it gives the detail of all the users
//         res.status(200).json({
//             message: users
//         })
//   } catch (err) {
//     console.log(
//       "error to get details of user!! please verify your email first"
//     );
//     res.status(500).json({
//       message: " please verify your email first",
//     });
//   }
// }

// async function updateUser(req, res) {   //isme jo id vo param me aayegi and data body me aayegi
//   let { id } = req.params;
//   try {
//     if (req.body.password || req.body.confirmPassword) {   //agar password hai or confirm password usko chnge nhi krna
//       return res.status(400).json({
//         message:"usee forget Password instead"
//       })
//     }
//     let user = await userModel.findById(id);
//     console.log("user", user);
//     if (user) {
//       // req.body.id = undefined; dont need this because data param me hai
//       for (let key in req.body) {   //update work jese hmne reset me kr tha vese hi krege means user phle mangwaege then usme updation krege
//         user[key] = req.body[key];
//       }
//       await user.save({
//         validateBeforeSave: false,  //yeh jo hai confirm password and password mangra tha toh yeh mongoose function isse sare jitne bhi validators hai vo bnd krdiya jidr password and confirmpassword match hora tha sab band krdiya, and we closed the prehook function also
//       });
//       res.status(200).json({
//         message:user
//       })
//     } else {
//       res.status(400).json({
//         message: "id not found"
//       })
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "server error"
//     })
//   }
// }

// async function deleteUser(req, res) {
//   //isme hmne param se id nikali  and find by id pr call kri or vo bnda remove hogya
//   let { id } = req.params;
//   try {
//     let user = await userModel.findByIdAndDelete(id);
//     res.status(500).json({
//       user:user
//     })    
//   }catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "server error"
//     })
//   }
// }
 
// function isAuthorized(roles) {
//   //id -> user get -> then define roles 
//   //roles -> then check the role is present in the array or not  && otherwise not
//   return async function (req, res, next) {
//     let { userId } = req;  //yeh hmko milegi through protect route
//     console.log("isAuthorized body:", id);
//     try {
//       let user = await userModel.findOne({ userId });
//       let isAuthorized = roles.includes(user.role);
//       if (isAuthorized) {
//         next();
//       } else {
//         res.status().json({
//           message:"user Not Authorized"
//         })
//       }
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({
//         message:"server error"
//       })
//     }
//   }
// }
// async function isAuthorized(req, res) {
//   let { userId } = req;
//   let roles = ["admin"];
//   //id -> user get -> define role of the user
//   try {
//     let user = await userModel.findById(userId);   
//     let userIsAuthorized = roles.includes(user.role);
//     if (userIsAuthorized) {
//       next();
//     }
//     else {
//       res.status(404).json({
//         message:"user not autherized"
//       })
//     }
//   }catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message:"server error"
//     })
//   }
// }
// async function isAuthorizedCE(req, res) {
//   let { userId } = req;
//   let roles = ["admin","ce"];
//   //id -> user get -> define role of the user
//   try {
//     let user = await userModel.findById(userId);   
//     let userIsAuthorized = roles.includes(user.role);
//     if (userIsAuthorized) {
//       next();
//     } else {
//       res.status(404).json({
//         message:"user not autherized"
//       })
//     }
//   }catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message:"server error"
//     })
//   }
// }
module.exports = userRouter;
