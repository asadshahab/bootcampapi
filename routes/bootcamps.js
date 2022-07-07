const express = require("express");
const bootcampRouter = express.Router();
const bootCampController = require("../controller/bootcamps");
// const{getBotCamps}=require('../coyyy')
const advancedResult = require("../middleware/advancedResultes");
const Bootcamp = require("../models/Bootcamps");
const { protect, authorize } = require("../middleware/auth");

// include other resource routers
const courseRouter = require("./courses");

// re-route into other resource routers
bootcampRouter.use("/:bootcampId/courses", courseRouter);

// Router of bootcamps
bootcampRouter.get(
  "/api/v1/bootcamp",
  advancedResult(Bootcamp, "courses"),
  bootCampController.getBotCamps
);
// bootcampRouter
//   .route("/api/v1/bootcamp")
//   .get(advancedResult(Bootcamp), bootCampController.getBotCamps);
bootcampRouter.get("/api/v1/bootcamp/:id", bootCampController.getOneBotCamps);
// bootcampRouter.
bootcampRouter.post(
  "/api/v1/bootcamp",
  protect,
  authorize("admin", "publisher"),
  bootCampController.createBotCamps
);
bootcampRouter.put(
  "/api/v1/bootcamp/:id",
  protect,
  authorize("admin", "publisher"),
  bootCampController.updateBotCamps
);
bootcampRouter.delete(
  "/api/v1/bootcamp/:id",
  protect,
  authorize("admin", "publisher"),
  bootCampController.deleteBotCamps
);
bootcampRouter.get(
  "/api/v1/bootcamp/radius/:zipcode/:distance",
  bootCampController.getBootcampsInRadius
);
bootcampRouter.put(
  "/api/v1/bootcamp/:id/photo",
  authorize("admin", "publisher"),
  bootCampController.bootcampPhotoUpload
);
module.exports = bootcampRouter;
