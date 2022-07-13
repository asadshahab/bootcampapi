const Courses = require("../models/course");
const bootCamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asynce");

// Get all courses
// @route   GET /api/v1/courses
// @desc    Get all courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.query.bootcampId) {
    const courses = await Courses.find({ bootcamp: req.query.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    return res.status(200).json(res.advanceResults);
  }
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
  // Make sure user Is Owner OF Course
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with this Id ${req.params.id} is not Authorized to Update Course `,
        401
      )
    );
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
  let course = await Courses.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }
  // Make sure user Is Owner OF Course
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User with this Id ${req.user.id} is not Authorized to Update Course `, 401)
    );
  }
  course = await Courses.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

// Add  course
// @route   delete /api/v1/update/:i
// @desc    delete a course with Id
// @access  Public

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await bootCamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcam not Found", 404));
  }
  // Make sure user Is Owner OF bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with this Id ${req.params.bootcampId} is not Authorized to Add Course `,
        401
      )
    );
  }

  const course = await Courses.create(req.body);
  return res.status(200).json({ success: true, data: course });
});
