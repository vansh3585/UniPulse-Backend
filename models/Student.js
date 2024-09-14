const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
    StudentID: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    Branch: {
      type: String,
    },
    YearOfJoining: {
      type: Number,
      required: true,
    },
    CurrentYear: {
      type: Number,
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null
    },
    eventsBookmarked: [
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        default:null
    }],
    eventsEnrolled: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        default:null
    }] ,
  });
  
  module.exports = mongoose.model("Student", studentSchema);