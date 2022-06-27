const express = require("express");
const courseRouter = express.Router({ mergeParams: true });
const bootCampController = require("../controller/courses");

courseRouter.get("/api/v1/courses", bootCampController.getCourses);
courseRouter.get("/api/v1/course/:id", bootCampController.getCourse);
courseRouter.put("/api/v1/course/:id", bootCampController.updateCourse);
courseRouter.delete("/api/v1/course/:id", bootCampController.deleteCourse);

module.exports = courseRouter;
