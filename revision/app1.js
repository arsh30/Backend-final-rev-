//npm init -y
const express = require("express");
let fs = require("fs");
const app = express();

let content = JSON.parse(fs.readFileSync("./data.json"));
//crud functions

app.use(express.json());

// Make routes in particular folder
const userRouter = express.Router();
const authRouter = express.Router();

app.use('/user', userRouter);
app.use('/auth', authRouter);

userRouter
    .route('/')
    .post(bodyChecker, createUser);  //bodyChecker is the middle ware -> toh uske aagla chljaega function && we send middleware next or jo next hoga toh uske next chljaega
userRouter
    .route('/:id')  //localhost:8082/user/10 -> post
    .get(getUser)

function createUser(req, res) {
    console.log('users');
    let body = req.body;  //the body that can be store in which we had added
    console.log(body);
    content.push(req.body);  //jo bhi body me aaya vo push kr diya
    //put data in data storage
    fs.writeFileSync("./data.json",JSON.stringify(content))
    res.json({
        message: content
    }) 
}
function bodyChecker(req, res, next) {
    console.log('body checker reached');
    let isPresent = Object.keys(req.body).length;  
    console.log('ispresent', isPresent);
    if (isPresent) {  //if the length is 1 ie true then this will execute
        next();  
    } else {
        res.json({
            message:"kindly send the details in the body"
        })
    }
}
function getUser(req, res) {
    res.send({
        message:content,
    })
}

app.listen(8082, function () {
  console.log("server is started");
});

// NEXT in Middleware =================================
app.post('/', function (req, res, next) {
    let body = req.body;
    console.log('inside first post', body);
    next();
})
app.use(function (req, res, next) {  
    console.log('inside app.use');
    next();
})

app.get('/', function (req, res, next) {  
    console.log('inside get');
})

app.post('/', function (req, res, next) {
    let body = req.body;
    console.log('inside first post', body);
    res.send('tested next')
})




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
  