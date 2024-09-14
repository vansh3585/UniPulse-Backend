// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const instructorSchema = new mongoose.Schema({
  InstructorID: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  Department: {
    type: String,
  },
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  NewAttribute: {
    type: String,
  },
  Event:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  }
]
});

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("Instructor", instructorSchema);