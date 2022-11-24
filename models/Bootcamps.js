const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootCampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter The Name"],
      trim: true,
      unique: true,
      maxlength: [50, "Name can't be more than 50 character's"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Kindly add the Descriptions"],
      maxlength: [500, "Descripton cant be more than 500 characters"],
      trim: true,
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone Number can not be longer 20 digits"],
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    address: {
      type: String,
      required: [true, "Please Add the Address"],
    },

    location: {
      // GeoJson Type
      type: {
        type: String,
        enum: ["Point"],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: ["Web Development", "Mobile Development", "UI/UX", "Data Science", "Business", "Other"],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating at least 1"],
      max: [10, "Rating must can not more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: true,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarentee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please Add User Id"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// create a Slug for Name
BootCampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode and create location field
// BootCampSchema.pre("save", async function(next){
//     const loc= await geocoder.geocode(this.address)
//     this.location={
//         type: "Point",
//         coordinates: [loc[0].longitude, loc[0].latitude],
//         formattedAddress: loc[0].formattedAddress,
//         street: loc[0].streetName,
//         city: loc[0].city,
//         state: loc[0].stateCode,
//         zipcode: loc[0].zipcode,
//         country: loc[0].countryCode
//     }
//     // Do not save address in DB
//     this.address=undefined
//     next();
// })

// cascade delete bootcamp when a course is deleted
BootCampSchema.pre("remove", async function (next) {
  console.log("Course is removed");
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// Reverse Populate with virtuals
BootCampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});
module.exports = mongoose.model("Bootcamp", BootCampSchema);
