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

// logger Middleware
app.use(logger("tiny"));
app.use(express.json());

// fileupload Middleware
app.use(fileupload());

//set a static folder
app.use(express.static(path.join(__dirname, "public")));

// DB Connection
dbConnection();

// Routers
app.use(bootcampRouter);
app.use(courseRouter);

// Error Handler
app.use(errorHandler);

const server = require("http").createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, (req, res) => {
  console.log(`Server is Runing on PORT:${PORT}`);
});
