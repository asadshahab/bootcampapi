const express = require("express");
const bootcampRouter = express.Router();
const bootCampController = require("../controller/bootcamps");

// include other resource routers
const courseRouter = require("./courses");

// re-route into other resource routers
bootcampRouter.use("/:bootcampId/courses", courseRouter);

// Router of bootcamps
bootcampRouter.get("/api/v1/bootcamp", bootCampController.getBotCamps);
bootcampRouter.get("/api/v1/bootcamp/:id", bootCampController.getOneBotCamps);
bootcampRouter.post("/api/v1/bootcamp", bootCampController.createBotCamps);
bootcampRouter.put("/api/v1/bootcamp/:id", bootCampController.updateBotCamps);
bootcampRouter.delete("/api/v1/bootcamp/:id", bootCampController.deleteBotCamps);
bootcampRouter.get(
  "/api/v1/bootcamp/radius/:zipcode/:distance",
  bootCampController.getBootcampsInRadius
);
bootcampRouter.put("/api/v1/bootcamp/:id/photo", bootCampController.bootcampPhotoUpload);
module.exports = bootcampRouter;
