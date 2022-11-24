const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const app = express();
const logger = require("morgan");
const dbConnection = require("./config/db");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const router = require("./routes/index");

// logger Middleware
app.use(logger("tiny"));
// body Parser
app.use(express.json());
// cookie Parser
app.use(cookieParser());

// sanitize Data
app.use(mongoSanitize());
// set SEcurity
app.use(helmet());
// fileupload Middleware
app.use(fileupload());

//set a static folder
app.use(express.static(path.join(__dirname, "public")));

// DB Connection
dbConnection();

// All Router
app.use(router);

// Error Handler
app.use(errorHandler);

const server = require("http").createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, (req, res) => {
  console.log(`Server is Runing on PORT:${PORT}`);
});
