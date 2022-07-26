const Review = require("../models/reviews");
const bootCamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");

// Get all Reviews
// @route   GET /api/v1/reviews
// @desc    Get all reviews
// @access  Public

exports.getReviews = async (req, res, next) => {
  if (req.query.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.query.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    return res.status(200).json(res.advanceResults);
  }
};

// Get single Reviews
// @route   GET /api/v1/reviews/:id
// @desc    Get single reviews
// @access  Public

exports.getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(new ErrorResponse(`no review found against this id:${req.params.id}`, 404));
  }
  return res.status(200).json({ success: true, data: review });
};

// CreateReviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @desc    Get single reviews
// @access  Public

exports.addReview = async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  console.log("skadjka");
  const review = await Review.create(req.body);
  return res.status(200).json({ success: true, data: review });
};
