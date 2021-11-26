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
    console.log("decryptedToken", decryptedToken);
  
    //2) verify everytime that if bringing the token to get your response
    if (decryptedToken) {
      next();
    } else {
      res.send("kindly login to access this resource");
    }
}
  
  
  
//NOTE: module.exports.filename that we want to create