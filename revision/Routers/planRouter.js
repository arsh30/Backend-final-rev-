const express = require("express");
const planRouter = express.Router();
let planModel = require("../model/planModel");
const {
  createElement,
  deleteElement,
  updateElement,
  getElement,
  getElements,
} = require("../helpers/factory");
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

const createPlan = createElement(planModel);
const deletePlan = deleteElement(planModel);
const updatePlan = updateElement(planModel);
const getPlan = getElement(planModel);
const getPlans = getElements(planModel);

planRouter.use(protectRoute);
planRouter
  .route("/")
  .post(bodyChecker, isAuthorized(["admin"]), createPlan)
  .get(bodyChecker, isAuthorized(["admin", "ce"]), getPlans);

planRouter.route("/sortByRating").post(getbestPlans);

planRouter
  .route("/:id")
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatePlan)
  .delete(bodyChecker, isAuthorized(["admin"]), deletePlan);

async function getbestPlans(req, res) {
  try {
    let plans = await planModel.find().sort("averageRating-1").populate({
      path: "reviews",
      select: "review",
    });
    console.log(plans);
    res.status(200).json({
      message: plans,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

//export
module.exports = planRouter;
