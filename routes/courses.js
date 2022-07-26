const express = require("express");
const courseRouter = express.Router({ mergeParams: true });
const bootCampController = require("../controller/courses");

const Course = require("../models/course");
const advancedResult = require("../middleware/advancedResultes");
const { protect, authorize } = require("../middleware/auth");

courseRouter.get(
  "/",
  advancedResult(Course, {
    path: "bootcamp",
    select: "name description",
  }),
  bootCampController.getCourses
);
courseRouter.get("/:id", bootCampController.getCourse);
courseRouter.put("/:id", protect, authorize("admin", "publisher"), bootCampController.updateCourse);
courseRouter.delete("/:id", protect, bootCampController.deleteCourse);
courseRouter.post("/api/v1/:bootcampId/course", protect, bootCampController.addCourse);

module.exports = courseRouter;
