const { populate } = require("../models/Bootcamps");
const asyncHandler = require("./asynce");

const advanceResult = asyncHandler((model, result) => async (req, res) => {
  let query;
  // copy query
  const reqQuery = { ...req.query };

  //  Fields Exclude
  const removeFileds = ["select", "sort", "page", "limit"];

  // Loop on  removeFields and Delete From req Query
  removeFileds.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

  // Finding Resource
  query = model.find(JSON.parse(queryStr));

  // select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("name");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(skip).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const result = await query;
  // pagination Result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (endIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advanceResult = {
    success: true,
    count: result.length,
    pagination,
    data: result,
  };
  next();
});

module.exports = advanceResult;
