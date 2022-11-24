const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });
const reviewController = require("../controller/reviews");
const asyncHandler = require("../middleware/asynce");
const advanceResults = require("../middleware/advancedResultes");
const { authorize, protect } = require("../middleware/auth");

const User = require("../models/user");
const Review = require("../models/reviews");

reviewRouter.get(
  "/",
  advanceResults(Review, { path: "bootcamp", select: "name, description" }),
  asyncHandler(reviewController.getReviews)
);
reviewRouter.get("/:id", asyncHandler(reviewController.getReview));
reviewRouter.post("/:bootcampid/reviews", protect, asyncHandler(reviewController.getReview));
module.exports = reviewRouter;
