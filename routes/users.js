const express = require("express");
const userRouter = express.Router({ mergeParams: true });
const usersController = require("../controller/users");
const asyncHandler = require("../middleware/asynce");

const User = require("../models/user");
const advancedResult = require("../middleware/advancedResultes");
const { protect, authorize } = require("../middleware/auth");

userRouter.get("/findall", advancedResult(User), asyncHandler(usersController.getUsers));
userRouter.get("/findone/:id", asyncHandler(usersController.singleUser));
userRouter.post("/create", asyncHandler(usersController.create));
userRouter.put("/update/:id", asyncHandler(usersController.update));
userRouter.delete("/delete/:id", asyncHandler(usersController.delete));

module.exports = userRouter;
