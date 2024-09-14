// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const tagSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: { type: String },
    Event:[ {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Event",
    }],
  });
  

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("Tag", tagSchema);
