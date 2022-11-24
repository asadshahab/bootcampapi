const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asynce");
const sendEmail = require("../utils/sendemail");

// @desc     GetAll Users
// @route     Get api/v1/auth/users
// @access    Private/Admin

exports.getUsers = async (req, res, next) => {
  res.status(200).json(res.advanceResults);
};

// @desc     Get Single Users
// @route     Get api/v1/auth/user/:id
// @access    Private/Admin

exports.singleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
};

// @desc     Create User
// @route     post api/v1/auth/users
// @access    Private/Admin

exports.create = async (req, res, next) => {
  console.log("user");
  const user = await User.create(req.body);
  console.log(user, "user");
  res.status(201).json({ success: true, data: user });
};

// @desc     update User
// @route     put api/v1/auth/update/:id
// @access    Private/Admin

exports.update = async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: updateUser });
};

// @desc     delete User
// @route     delete api/v1/auth/delete/:id
// @access    Private/Admin

exports.delete = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: user });
};
