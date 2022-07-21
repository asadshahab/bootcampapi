const crypto = require("crypto");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asynce");
const user = require("../models/user");
const sendEmail = require("../utils/sendemail");

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

// reset Password
exports.resetPassword = async (req, res, next) => {
  // console.log(req.params.resetToken)
  // get Hash Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  console.log(resetPasswordToken);
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log(user, "user");
  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }
  // set New Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
};

// forget Password
exports.forgetPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("There is no User with that E-mail ", 404));
  }

  // Get Reset Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Create Reset Url
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
  const message = ` You are received this email for reset your Password make a post request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email Send" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email not send", 500));
  }
  res.status(200).json({ success: true, data: user });
};

// Update user Details
exports.updateDetails = async (req, res, next) => {
  const fieldsUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
};

// Update user Password
exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // check current Password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password Incorrect"));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
};
