const path = require("path");
const asyncHandler = require("../middleware/asynce");
const Bootcamps = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const dotenv = require("dotenv").config({ path: "./config/config.env" });

//  For Finding the BootCamps

exports.getBotCamps = asyncHandler(async (req, res, next) => {
  let query;
  // copy query
  const reqQuery = { ...req.query };

  //  Fields Exclude
  const removeFileds = ["select", "sort", "page", "limit"];

  // Loop on  removeFields and Delete From req Query
  removeFileds.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

  // Finding Resource
  query = Bootcamps.find(JSON.parse(queryStr)).populate("courses");

  // select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("name");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamps.countDocuments();
  query = query.skip(skip).limit(limit);

  const bootcamps = await query;
  // const bootcamps= await Bootcamps.find(req.query)
  // pagination Result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (endIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({ sucess: true, count: bootcamps.length, pagination, data: bootcamps });
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
  const bootcamp = await Bootcamps.create(req.body);
  res.status(201).json({ sucess: true, msg: "Bootcamp created sucessfully", data: bootcamp });
});

// For Updateing The Bootcamps

exports.updateBotCamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({ sucess: false });
  }
  res.status(200).json({ sucess: true, bootcamp });
});

// For Deleting A Bootcamp
exports.deleteBotCamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({ sucess: false });
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
