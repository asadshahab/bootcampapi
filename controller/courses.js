const Courses = require("../models/course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asynce");

// Get all courses
// @route   GET /api/v1/courses
// @desc    Get all courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.query.bootcampId) {
    query = Courses.find({ bootcamp: req.query.bootcampId });
  } else {
    query = Courses.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// Get single course
// @route   GET /api/v1/courses/:id
// @desc    Get single course
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Update course
// @route   GET /api/v1/update/:id
// @desc    update a course with Id
// @access  Public

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    re;
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Delete course
// @route   delete /api/v1/update/:id
// @desc    delete a course with Id
// @access  Public

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
