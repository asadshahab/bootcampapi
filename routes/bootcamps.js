const express = require("express");
const bootcampRouter = express.Router();
const bootCampController = require("../controller/bootcamps");
// const{getBotCamps}=require('../coyyy')
const advancedResult = require("../middleware/advancedResultes");
const Bootcamp = require("../models/Bootcamps");
const { protect, authorize } = require("../middleware/auth");

// include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

// Router of bootcamps
bootcampRouter.get(
  "/",
  protect,
  advancedResult(Bootcamp, "courses"),
  bootCampController.getBotCamps
);
// bootcampRouter
//   .route("/api/v1/bootcamp")
//   .get(advancedResult(Bootcamp), bootCampController.getBotCamps);
bootcampRouter.get("/:id", bootCampController.getOneBotCamps);
// bootcampRouter.
bootcampRouter.post(
  "/",
  protect,
  authorize("admin", "publisher"),
  bootCampController.createBotCamps
);
bootcampRouter.put(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  bootCampController.updateBotCamps
);
bootcampRouter.delete(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  bootCampController.deleteBotCamps
);
bootcampRouter.get(
  "/api/v1/bootcamp/radius/:zipcode/:distance",
  bootCampController.getBootcampsInRadius
);
bootcampRouter.put(":id/photo", bootCampController.bootcampPhotoUpload);

// re-route into other resource routers
bootcampRouter.use("/:bootcampId/courses", courseRouter);
bootcampRouter.use("/:bootcampId/reviews", reviewRouter);

module.exports = bootcampRouter;
