const express = require("express");
const courseRouter = express.Router({ mergeParams: true });
const bootCampController = require("../controller/courses");

const Course = require("../models/course");
const advancedResult = require("../middleware/advancedResultes");
const { protect, authorize } = require("../middleware/auth");

courseRouter.get(
  "/api/v1/courses",
  advancedResult(Course, {
    path: "bootcamp",
    select: "name description",
  }),
  bootCampController.getCourses
);
courseRouter.get("/api/v1/course/:id", bootCampController.getCourse);
courseRouter.put(
  "/api/v1/course/:id",
  protect,
  authorize("admin", "publisher"),
  bootCampController.updateCourse
);
courseRouter.delete("/api/v1/course/:id", protect, bootCampController.deleteCourse);

module.exports = courseRouter;
