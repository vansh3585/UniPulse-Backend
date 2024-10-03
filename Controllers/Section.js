const Section = require("../models/Section");
const Event = require("../models/Event");
const Instructor = require("../models/Instructor");
// CREATE a new section

exports.createSection = async (req, res) => {
	try {
        const userId=req.user.id;
        const instructorByUserId = await Instructor.findOne({ UserID: userId });

        
		// Extract the required properties from the request body
		const { Title,Text, EventId } = req.body;
        const EventById=await Event.findById(EventId)
        
        if(!(instructorByUserId._id.toString()==EventById.InstructorID.toString())){
			return res.status(404).json({
				success: false,
				message: "Unauthorised Access",
			});
		}

		// Validate the input
		if (!Title || !Text || !EventId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ 
			Event:EventId, 
			Text:Text,
			Title:Title,
			});
		console.log(newSection)

		// Add the new section to the course's content array
		const updatedEvent = await Event.findByIdAndUpdate(
			EventId,
			{
			  $push: {
				section: newSection._id,
			  },
			  $inc: {
				sectionCount: 1, // Use $inc to increment the sectionCount field by 1
			  },
			},
			{
			  new: true,
			}
		  )
		  .populate({
			path: "section",
			match: { deleted: false },
		  })
		  .exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedEvent,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
// exports.updateSection = async (req, res) => {
// 	try {
// 		const { sectionName, sectionId } = req.body;
// 		const section = await Section.findByIdAndUpdate(
// 			sectionId,
// 			{ sectionName },
// 			{ new: true }
// 		); 
// 		res.status(200).json({
// 			success: true,
// 			message: section,
// 		});
// 	} catch (error) {
// 		console.error("Error updating section:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
	  const { sectionId } = req.body;
  
	  // Find the section to get the eventId
	  const section = await Section.findById(sectionId);
	  if (!section) {
		return res.status(404).json({
		  success: false,
		  message: "Section not found",
		});
	  }
  
	  const eventId = section.Event// Assuming 'event' is the field that stores the eventId
      console.log(eventId)
	  
	  if(!section.Event){
		return res.status(404).json({
		  success: false,
		  message: "Event not found",
		});
	  }
	 
	  // Delete the section
	  const deletedSection = await Section.findByIdAndUpdate(
		sectionId,
		{ deleted: true },
		{ new: true }
	);
	
  
	  // Remove the sectionId from the corresponding event's sections array
	  await Event.findByIdAndUpdate(
		eventId,
		{ $pull: { section: sectionId }, $inc: { sectionCount: -1 } }, // Decrease sectionCount by 1
		{ new: true }
	  );
	  
	  res.status(200).json({
		success: true,
		message: "Section deleted",
	  });
	} catch (error) {
	  console.error("Error deleting section:", error);
	  res.status(500).json({
		success: false,
		message: "Internal server error",
	  });
	}
  };