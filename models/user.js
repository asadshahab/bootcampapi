const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Add Name"],
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    required: [true, "E-mail is Required"],
    unique: [true, "E-mail Already Exist"],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please Add Password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt Password with bcrypt

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign Jwt and Return
UserSchema.methods.getSingendJwtToken = function () {
  return jwt.sign({ id: this.id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match User Enter Password and Match with Hash Password

UserSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Generate and Hash password
UserSchema.methods.getResetPasswordToken = function () {
  // generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and reset Password Token Fields
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set Expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
