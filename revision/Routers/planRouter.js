const express = require("express");
const planRouter = express.Router();
let planModel = require("../model/planModel");
const { createElement, deleteElement, updateElement, getElement, getElements } = require("../helpers/factory");
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

planRouter
  .route("/:id")
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatePlan)
  .delete(bodyChecker, isAuthorized(["admin"]), deletePlan);

//export
module.exports = planRouter;
