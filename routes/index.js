const router = require("express").Router();
const authRouter = require("./auth");
const userRouter = require("./users");
const reviewRouter = require("./reviews");
const bootcampRouter = require("./bootcamps");
const courseRouter = require("./courses");

router.use("/api/v1/bootcamp", bootcampRouter);
router.use("/api/v1/course", courseRouter);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/user", userRouter);
router.use("/api/v1/review", reviewRouter);

module.exports = router;
