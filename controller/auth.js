const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asynce");

// @des    Register User
// @route  post api/v1/auth/register
// @access Public

exports.register = async (req, res, next) => {
  const { email, password, name, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
};

// @des    Login User
// @route  post api/v1/auth/login
// @access Public

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // validate Email and Password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide E-mail and Password", 400));
  }
  // Validate User

  const user = await User.findOne({ email: email }).select("+password");
  console.log(user);
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // Match Password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  sendTokenResponse(user, 200, res);
};

// Get Token from Model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.getSingendJwtToken();
  const expireDate = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 24 * 3600000);
  console.log(expireDate);
  console.log(process.env.JWT_COOKIE_EXPIRE);

  const option = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, option).json({ success: true, token, user });
};
