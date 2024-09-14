const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  EventID: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  EventName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
  DeadlineDate: {
    type: Date,
    required: true,
  },
  RegistrationLink: {
    type: String,
  },
  Media: {
    type: String,
  },
  InstructorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    default:null,
    // required:true,
  },
  section:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }
  ],
  sectionCount:{
    type:Number,
    default:0,
  },
  Tag:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    }
  ],
  openedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model for user data
    },
  ],
  deleted: {
    type: Boolean,
    default: false
  },
  studentEnrolled: {
    type:Number,
    default:0,
  },
  thumbnailUrl:{
    type:String
  },
  pdfUrl:{
    type:String
  },
}, { timestamps: true });


// // Define a post-save hook to send email after the document has been saved
// eventSchema.post("save", async function (doc) {
// 	try{ 

//     const mailResponse = await mailSender(
// 			"Vansh.tejwani02@gmail.com",
// 			"Confirmation Email",
//       confirmationTemplate("Vansh","Creative Design Thinking")
// 		);
// 		console.log("Email sent successfully: ", mailResponse.response);
//   }catch(error){
//     console.log(error)

//   }
// 	// Only send an email when a new document is created
// 	// if (this.isNew) {
// 	// 	await sendVerificationEmail(this.email, this.otp);
// 	// }
// });


module.exports = mongoose.model("Event", eventSchema);