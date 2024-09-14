const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  FirstName: {
    type: String,
    required: true,
    trim: true,
  }, 
  LastName: {
    type: String,
    required: true,
    trim: true,
  },
  PhoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
}, { timestamps: true });



// Student Schema


// Instructor Schema


module.exports = mongoose.model("User", userSchema);
