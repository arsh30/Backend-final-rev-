const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../secret');

module.exports.bodyChecker = function bodyChecker(req, res, next) {
    console.log("body checker reached");
    let isPresent = Object.keys(req.body).length; //means check anything is present in body
    console.log("ispresent", isPresent);
    if (isPresent) {
      //if the length is 1 ie true then this will execute
      next();
    } else {
      res.json({
        message: "kindly send the details in the body",
      });
    }
}

module.exports.protectRoute =  function protectRoute(req, res, next) {
    console.log("protectRoute reached");
    console.log("cookies", req.cookies); //cookieparser
  
    //token verify -> do this when we do the reqest multiple times
    let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET); //req.cookies.JWT -> JWTis the cookie name jo request me thi AND 2nd argument is the secret code
    console.log("decryptedToken 68", decryptedToken);
  
    //2) verify everytime that if bringing the token to get your response
  if (decryptedToken) {
    let userId = decryptedToken.id;
    req.userId = userId;  //request ki body me and userId name ki bnaya or save krdiya with userId jo abhi nikali hai
    console.log('body:',req.userId);
      next();
    } else {
      res.send("kindly login to access this resource");
    }
}

module.exports.isAuthorized = function isAuthorized(roles) {
  //id -> user get -> then define roles 
  //roles -> then check the role is present in the array or not  && otherwise not
  return async function (req, res, next) {
    let { userId } = req;  //yeh hmko milegi through protect route
    console.log("isAuthorized body:", id);
    try {
      let user = await userModel.findOne({ userId });
      let isAuthorized = roles.includes(user.role);
      if (isAuthorized) {
        next();
      } else {
        res.status().json({
          message:"user Not Authorized"
        })
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message:"server error"
      })
    }
  }
}
  
  
//NOTE: module.exports.filename that we want to create