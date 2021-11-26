//npm init -y
const express = require("express");
let fs = require("fs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require('./model/userModel');
const { JWT_SECRET } = require("./secret");

const app = express();

let content = JSON.parse(fs.readFileSync("./data.json"));
//crud functions

app.use(express.static("Frontend_Folder"));
app.use(express.json());
app.use(cookieParser()); //from this we send cookie to anyone (cookie ie token)

// Make routes in particular folder
const userRouter = express.Router();
const authRouter = express.Router();

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// userRouter.route("/user").post(bodyChecker, createUser); //bodyChecker is the middle ware -> toh uske aagla chljaega function && we send middleware next or jo next hoga toh uske next chljaega
userRouter.route("/").get(protectRoute, getUsers);

// userRouter
//     .route('/:id')  //localhost:8082/user/10 -> post
//     .get(getUser)

authRouter.route("/signup").post(bodyChecker, signupUser);
authRouter.route("/login").post(bodyChecker, loginUser);

function bodyChecker(req, res, next) {
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

function protectRoute(req, res, next) {
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

async function signupUser(req, res) {
  try {
    let newUser = await userModel.create(req.body);  //create is used to entries in the document
    res.status(200).json({
      message: "user created successfully",
      user: newUser
    })
  } catch (err) {
    res.status(500).json({
      message: "error"
    })
  }
}

function loginUser(req, res) {
  try {
    let { email, password } = req.body;
    let obj = content.find(function (obj) {
      //1) Database pr loop lgaya or search kra id ko
      return (obj.email = email); //rhs is email which is send through the frontend
    });
    if (obj.password == password) {
      let token = jwt.sign({ email: obj.email }, JWT_SECRET); //1st param is payload(email -> yeh hum khud kuch bhi lik skte hai :email jidr se nikali h vo), 2nd parm is the SECRET KEY Which we make
      console.log("tokenId", token);
      res.cookie("JWT", token, { httpOnly: true }); //1ST PARAM is Cookie Name(khud se kuch bhi rakho) , 2nd param is(token)
      res.status(200).json({
        message: "user logged In",
        user: obj,
      });
    } else {
      res.status(402).json({
        message: "kindly go on the login function",
      });
    }
  } catch (err) {
    res.json({
      message: "Kindly do signup first",
    });
  }
}

function createUser(req, res) {
  console.log("users");
  let body = req.body; //the body that can be store in which we had added
  console.log(body);
  content.push(req.body); //jo bhi body me aaya vo push kr diya
  //put data in data storage
  fs.writeFileSync("./data.json", JSON.stringify(content));
  res.json({
    message: content,
  });
}

function getUsers(req, res) {
  //It will give the details of all users
  res.status(200).json({
    message: content,
  });
}

// function getUser(req, res) {
//   res.send({
//     message: content,
//   });
// }

app.listen(8082, function () {
  console.log("server is started");
});

app.use(function (req, res) {
  res.sendFile("./Frontend_Folder/404.html", { root: __dirname }); //dirname has 2 underscore
});

// NEXT in Middleware =================================
// app.post('/', function (req, res, next) {
//     let body = req.body;
//     console.log('inside first post', body);
//     next();
// })
// app.use(function (req, res, next) {
//     console.log('inside app.use');
//     next();
// })

// app.get('/', function (req, res, next) {
//     console.log('inside get');
// })

// app.post('/', function (req, res, next) {
//     let body = req.body;
//     console.log('inside first post', body);
//     res.send('tested next')
// })
// ========================

// CRUD OPERATIONS:===============================

//2) Post -> for post -> hm add krege 1st app.use(express.json())
// app.use("/", function (req, res, next) {
//     let body = req.body;
//     console.log("before", body);
//     next();
//   });

// app.use(express.json());

//   app.post("/", function (req, res) {
//     let body = req.body;
//     console.log("after", body);
//     res.status(200).json({
//       message: body,
//     });
//   });

//   // 1) read
//   app.get("/", function (req, res) {
//     console.log("hello from backend");
//     //    res.send( '<h1>Hello from backend </h1>')
//     res.status(200).json({
//       message: content,
//     });
//   });

//   //3) update-> post req -> it add parameter
//   app.put("/", function (req, res) {
//     console.log("hello from homepage");
//     res.send("<h1>Helloe from home Page</h1>");
//   });

//   // 4)Delete
//   app.delete("/", function (req, res) {
//     console.log("hello from homepage");
//     res.send("<h1>Helloe from home Page</h1>");
//   });
