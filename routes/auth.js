const express = require("express");
const asyncHandler = require("../middleware/asynce");
const authController = require("../controller/auth");
const { protect } = require("../middleware/auth");

const authRouter = express.Router();
authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.post("/forgotpassword", asyncHandler(authController.forgetPassword));
authRouter.put("/resetpassword/:resetToken", asyncHandler(authController.resetPassword));
authRouter.put("/updatedetails", protect, asyncHandler(authController.updateDetails));
authRouter.put("/updatepassword", protect, asyncHandler(authController.updatePassword));

module.exports = authRouter;
