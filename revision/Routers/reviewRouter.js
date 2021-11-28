const express = require("express");
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");
const reviewModel = require("../model/reviewModel");
const {
  createElement,
  deleteElement,
  updateElement,
  getElement,
  getElements,
} = require("../helpers/factory");

const reviewRouter = express.Router();

const createReview = createElement(reviewModel);
const deleteReview = deleteElement(reviewModel);
const updateReview = updateElement(reviewModel);
const getReview = getElement(reviewModel);
const getReviews = getElements(reviewModel);

reviewRouter.use(protectRoute); //it is necessary to add protect route every function
//now do crud for this
reviewRouter
  .route("/")
  .post(bodyChecker, isAuthorized(["admin"]), createReview)
  .get(bodyChecker, isAuthorized(["admin", "ce"]), getReviews);
reviewRouter
  .route("/:id")
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateReview)
  .delete(bodyChecker, isAuthorized(["admin"]), deleteReview);

//export -> coz use in app1.js
module.exports = reviewRouter;
