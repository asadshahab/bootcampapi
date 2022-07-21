const jwt = require("jsonwebtoken");
const asyncHandler = require("./asynce");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

// Protector

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   else if (req.cookie.token) {
  //     token = req.cookie.token;
  //   }

  // Make Sure Token Is Exist
  if (!token) {
    console.log("no TOken");
    return next(new ErrorResponse("Not Authorize to Access this Route ", 401));
  }
  try {
    // verify Token
    console.log(token, process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "decoded");
    req.user = await User.findById(decoded.id);
    console.log(req.user, "user");
    next();
  } catch (err) {
    console.log("error");
    return next(new ErrorResponse("Not Authorize to Access this Route", 401));
  }
});

// Grant only Specific Users

exports.authorize = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorResponse(`role ${req.user.role}, is not authorized to access this route `, 403)
      );
    }
    next();
  };
};
