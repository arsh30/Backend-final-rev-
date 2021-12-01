const express = require("express");
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");
const reviewModel = require("../model/reviewModel");
const planModel = require("../model/planModel");
const {
  updateElement,
  getElement,
  getElements,
} = require("../helpers/factory");

const reviewRouter = express.Router();

const updateReview = updateElement(reviewModel);
const getReview = getElement(reviewModel);
const getReviews = getElements(reviewModel);

const createReview = async function (req, res) {
  try {
    //put the entry
    let review = await reviewModel.create(req.body); //isme review bhi h and plan bhi
    //2nd plan ki Id nikali review se
    let planId = review.plan;
    let plan = await planModel.findById(planId);
    plan.reviews.push(review["_id"]);

    //3rd plan: average rating update
    if (plan.averageRating) {
      let sum = plan.averageRating * plan.reviews.length;
      let finalAvgRating = (sum + review.rating) / (plan.reviews.length + 1);
      plan.averageRating = finalAvgRating;
    } else {
      plan.averageRating = review.rating; //jo review ke andr rating hai uske equal krdo agar 1st time aaya h koi
    }

    await plan.save();
    res.status(200).json({
      message: "review created",
      review: review,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteReview = async function (req, res) {
  try {
    let review = await reviewModel.findByIdAndDelete(req.body.id);
    console.log("review", review);
    let planId = review.plan;
    let plan = await planModel.findById(planId);
    let idxOfReview = plan.reviews.indexOf(review["_id"]);
    plan.reviews.splice(idxOfReview, 1);
    await plan.save();

    res.status(200).json({
      message: "review created",
      review: review,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

reviewRouter.use(protectRoute); //it is necessary to add protect route every function
//now do crud for this
reviewRouter
  .route("/")
  // .post(bodyChecker, isAuthorized(["admin"]), createReview)
  .get(bodyChecker, isAuthorized(["admin", "ce"]), getReviews);
reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateReview)
  .delete(bodyChecker, isAuthorized(["admin"]), deleteReview);

//export -> coz use in app1.js
module.exports = reviewRouter;
