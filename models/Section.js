// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const sectionSchema = new mongoose.Schema({
    SectionID: {
      type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Text: {
      type: String,
      required: true,
    },
    Event:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default:null,
    },
    deleted: {
      type: Boolean,
      default: false
    },
  }, { timestamps: true });
  
// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("Section",sectionSchema);