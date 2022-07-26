const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: "./config/config.env" });

// load modals
const Bootcamp = require("./models/Bootcamps");
const Course = require("./models/course");
const User = require("./models/user");
const Review = require("./models/reviews");

// connect to Db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"));
const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"));
const review = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8"));

// impoert data into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(user);
    await Review.create(review);
    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Deleted...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
