const Student = require("../models/Student");
const Event = require("../models/Event");

// CREATE a new section
exports.createBookmark = async (req, res) => {
	try {

        const userId=req.user.id;

        const studentByUserId = await Student.findOne({ UserID: userId });
        console.log(studentByUserId)
        if(!studentByUserId)
        return res.status(404).json({
            success: false,
            message: "Entry Restricted for Student",
        });
        console.log(studentByUserId)
        
        
		// Extract the required properties from the request body
		const {EventId} = req.body;
       
    

		// Validate the input
		if (!EventId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}
        //check if event is deleted

        if (studentByUserId.eventsBookmarked.includes(EventId)) {
            return res.status(400).json({
                success: false,
                message: "Event is already bookmarked",
            });
        }


		// Add the new section to the course's content array
		const updatedStudent = await Student.findByIdAndUpdate(
			studentByUserId,
			{
				$push: {
					eventsBookmarked: EventId,
				},
			},
			{ new: true }
		)
			.populate({
				path: "eventsEnrolled",
			})
			.exec();
		
		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Bookmark created successfully",
		});
	} catch (error) {
		// Handle errors
        console.log(error.message)
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

exports.deleteBookmark = async (req, res) => {
	try {
		const userId = req.user.id;
		const studentByUserId = await Student.findOne({ UserID: userId });

		if (!studentByUserId) {
			return res.status(404).json({
				success: false,
				message: 'Student not found',
			});
		}

		const { EventId } = req.body;

		if (!EventId) {
			return res.status(400).json({
				success: false,
				message: 'Missing required properties',
			});
		}

		if (!studentByUserId.eventsBookmarked.includes(EventId)) {
			return res.status(400).json({
				success: false,
				message: 'Event is not bookmarked',
			});
		}

		const updatedStudent = await Student.findByIdAndUpdate(
			studentByUserId,
			{
				$pull: {
					eventsBookmarked: EventId,
				},
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: 'Bookmark deleted successfully',
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
};

// Function to get all bookmarks for a particular student
exports.getAllBookmarks = async (req, res) => {
	try {
		const userId = req.user.id;
		const studentByUserId = await Student.findOne({ UserID: userId });

		if (!studentByUserId) {
			return res.status(404).json({
				success: false,
				message: 'Student not found',
			});
		}

		// Retrieve all bookmarked events
		const bookmarkedEvents = studentByUserId.eventsBookmarked;
		const allBookmark =await Student.findOne(
    
			{ UserID: userId },
			{ eventsBookmarked: true }
		  )
			.populate({
			  path: 'eventsBookmarked',
			  match: { deleted: false }, // Filter events with deleted set to false
			  select: 'EventName Description DeadlineDate Tag sectionCount', // Specify fields to select
			})
			.populate({
				path: 'eventsBookmarked',
				populate: {
				  path: 'Tag',
				  select: ['name','description'] // Only select the name field from the user
				},
				match: { deleted: false },})
			.exec();

			console.log
		res.status(200).json({
			success: true,
			message: 'Bookmarks retrieved successfully',
			allBookmark,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: error.message,
		});
	}
};

exports.registerNow = async (req, res) => {
    try {
        const userId = req.user.id;

        const studentByUserId = await Student.findOne({ UserID: userId });
        if (!studentByUserId) {
            return res.status(404).json({
                success: false,
                message: "Entry Restricted for Student",
            });
        }

        // Extract the required properties from the request body
        const { EventId } = req.body;

        // Validate the input
        if (!EventId) {
            return res.status(400).json({
                success: false,
                message: "Missing required properties",
            });
        }

        // Check if the event is already enrolled
        if (studentByUserId.eventsEnrolled.includes(EventId)) {
            return res.status(400).json({
                success: false,
                message: "Event is already enrolled",
            });
        }

        // Add the new event to the student's eventsEnrolled array
        const updatedStudent = await Student.findByIdAndUpdate(
            studentByUserId._id, // Use _id to identify the student document
            {
                $push: {
                    eventsEnrolled: EventId,
                },
            },
            { new: true }
        ).exec();
		const updatedEvent = await Event.findByIdAndUpdate(
			EventId, // Use EventId to identify the event document
			{
				$inc: {
					studentEnrolled: 1,
				},
			},
			{ new: true }
		).exec();
        // Return the updated student object in the response
        res.status(200).json({
            success: true,
            message: "Event enrolled successfully",
            updatedStudent: updatedStudent,
        });
    } catch (error) {
        // Handle errors
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
