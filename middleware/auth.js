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
    return next(new ErrorResponse("Not Authorize to Access this Route ", 401));
  }
  try {
    // verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
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
