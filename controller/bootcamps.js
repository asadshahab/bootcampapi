const path = require("path");
const asyncHandler = require("../middleware/asynce");
const Bootcamps = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const advancedResult = require("../middleware/advancedResultes");

//  For Finding the BootCamps

exports.getBotCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

// Finding The Sigle BootCampe

exports.getOneBotCamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({ sucess: false });
  }
  res.status(200).json({ sucess: true, data: bootcamp });
});

// create BootCams

exports.createBotCamps = asyncHandler(async (req, res, next) => {
  // Add User to req.body
  req.body.user = req.user.id;

  // check for Published Bootcamps
  const publishBootcamp = await Bootcamps.findOne({ user: req.user.id });

  // if the User is not a admin add only 1 Bootcamp

  if (publishBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`The User With Id ${req.user.id} Already Published a Bootcamp `, 400)
    );
  }

  const bootcamp = await Bootcamps.create(req.body);
  res.status(201).json({ sucess: true, msg: "Bootcamp created sucessfully", data: bootcamp });
});

// For Updateing The Bootcamps

exports.updateBotCamps = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp is Not Found With Id: ${req.params.id}`));
  }

  // Make sure user Is Owner OF bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User with this Id ${req.params.id} is not Authorized to Update `)
    );
  }
  bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, bootcamp });
});

// For Deleting A Bootcamp
exports.deleteBotCamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  // Make sure user Is Owner OF bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User with this Id ${req.params.id} is not Authorized to Delete `)
    );
  }

  bootcamp.remove();
  res.status(200).json({ sucess: true, bootcamp });
});

// Get Bootcamps In Radius
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // let lat/lng from GEOCODER
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamps.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({ sucess: true, count: bootcamps.length, data: bootcamps });
});

// upload file course
// @route   put /api/v1/update/:id
// @desc    upload a file
// @access  Public

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404));
  }
  // Make sure user Is Owner OF bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User with this Id ${req.params.id} is not Authorized to Delete `)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
    );
  }
  // CREATE A CUSTOM FILE NAME
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamps.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ sucess: true, data: file.name });
  });
});
