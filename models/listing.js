const mongoose = require("mongoose");
const review = require("./review");
const Review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  // Modified to accept objects
  image: {
    type: Schema.Types.Mixed, // This allows any type including objects
    validate: {
      validator: function(value) {
        // Check if it's a string and meets your URL requirements
        if (typeof value === 'string') {
          return value === "" || value === "https://unsplash.com/photos/sunset-on-the-beach-with-a-surfer-NgvCdjrWttF";
        }
        // Check if it's an object with your required properties
        if (typeof value === 'object' && value !== null) {
          // Add validation for object properties if needed
          return true;
        }
        return false;
      },
      url: String,
      filename: String,
      message: 'Image must be either a valid URL string or an object with required properties'
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;