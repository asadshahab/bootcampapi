const express = require("express");
const asyncHandler = require("../middleware/asynce");
const authController = require("../controller/auth");
const { protect } = require("../middleware/auth");

const authRouter = express.Router();
authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));

module.exports = authRouter;
