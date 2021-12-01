function createElement(elementModel) {
  return async function (req, res) {
    try {
      let user = await elementModel.create(req.body); //normall req body se data manwakr put krdiya
      res.status(200).json({
        message: user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  };
}
function getElement(elementModel) {
  return async function (req, res) {
    let { id } = req.params;
    try {
      //isme data param me aayega
      let users = await elementModel.findById(id);
      res.status(200).json({
        message: users,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  };
}
function getElements(elementModel) {
  return async function (req, res) {
    //It will give the details of all users
    try {
      let requestPromise; //yeh promise hai yeh last me hi resolve krege
      //query
      if (req.query.myQuery) {
        //request ke andr query hoti hai request is object, jo bhi param wali cheez hai vo query me aajati hai
        requestPromise = elementModel.find(req.query.myQuery);
      } else {
        requestPromise = elementModel.find(); //mean agar query hai toh upr wala if execute agar parameter me kuch nahi hai toh sab dedo
      }

      //sort
      if (req.query.sort) {
        requestPromise = requestPromise.sort(req.query.sort); //means sort krdo jo bhi user ne diya hoga parameter me vo sort krdo
      }

      //select
      if (req.query.select) {
        //means agar kuch select krna hai eg name,percentage, price unko alag alag krdege
        let params = req.query.select.split("%").join(" ");
        requestPromise = requestPromise.select(params);
      }

      //paginate
      let page = Number(req.query.page) || 1; //rhs wala bydefault one hai
      let limit = Number(req.query.limit) || 4; //means bydefault perpage pr kitne item honge ie 4
      let toSkip = (page - 1) * limit;
      requestPromise = requestPromise.skip(toSkip).limit(limit);

      let elements = await requestPromise;
      res.status(200).json({
        message: elements,
      });
    } catch (err) {
      console.log(
        "error to get details of user!! please verify your email first"
      );
      res.status(500).json({
        message: " please verify your email first",
      });
    }
  };
}

function updateElement(elementModel) {
  return async function (req, res) {
    //isme jo id vo param me aayegi and data body me aayegi
    let { id } = req.params;
    try {
      if (req.body.password || req.body.confirmPassword) {
        //agar password hai or confirm password usko chnge nhi krna
        return res.status(400).json({
          message: "usee forget Password instead",
        });
      }
      let user = await elementModel.findById(id);
      console.log("user", user);
      if (user) {
        // req.body.id = undefined; dont need this because data param me hai
        for (let key in req.body) {
          //update work jese hmne reset me kr tha vese hi krege means user phle mangwaege then usme updation krege
          user[key] = req.body[key];
        }
        await user.save({
          validateBeforeSave: false, //yeh jo hai confirm password and password mangra tha toh yeh mongoose function isse sare jitne bhi validators hai vo bnd krdiya jidr password and confirmpassword match hora tha sab band krdiya, and we closed the prehook function also
        });
        res.status(200).json({
          message: user,
        });
      } else {
        res.status(400).json({
          message: "id not found",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "server error",
      });
    }
  };
}
function deleteElement(elementModel) {
  return async function (req, res) {
    //isme hmne param se id nikali  and find by id pr call kri or vo bnda remove hogya
    let { id } = req.params;
    try {
      let user = await elementModel.findByIdAndDelete(id);
      res.status(500).json({
        user: user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "server error",
      });
    }
  };
}

module.exports.createElement = createElement;
module.exports.deleteElement = deleteElement;
module.exports.updateElement = updateElement;
module.exports.getElement = getElement;
module.exports.getElements = getElements;
