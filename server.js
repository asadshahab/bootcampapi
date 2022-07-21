const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const app = express();
const bootcampRouter = require("./routes/bootcamps");
const courseRouter = require("./routes/courses");
const logger = require("morgan");
const dbConnection = require("./config/db");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const cookieParser = require("cookie-parser");

// logger Middleware
app.use(logger("tiny"));
// body Parser
app.use(express.json());
// cookie Parser
app.use(cookieParser());

// fileupload Middleware
app.use(fileupload());

//set a static folder
app.use(express.static(path.join(__dirname, "public")));

// DB Connection
dbConnection();

// Routers
app.use(bootcampRouter);
app.use(courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// Error Handler
app.use(errorHandler);

const server = require("http").createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, (req, res) => {
  console.log(`Server is Runing on PORT:${PORT}`);
});
