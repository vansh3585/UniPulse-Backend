const Event = require("../models/Event");
const Instructor = require("../models/Instructor");
const Tags = require("../models/Tag");
const User = require("../models/User");
const section=require("../models/Section")
const Student =require("../models/Student");
const { Console } = require("console");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require('dotenv').config()
const mime = require('mime-types');
const supportedImageTypes = ['image/jpeg', 'image/png'];
const supportedPdfType = 'application/pdf';
const supportedZipType = 'application/zip';
const maxImageSize = 200 * 1024; // 200 KB
const maxPdfSize = 200 * 1024; // 100 KB
const confirmationTemplate = require("../mail/confirmationMail");
const mailSender = require("../utils/mailSender");

exports.createEvent = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Get all required fields from request body
		let {
			EventName,
			Description,
			DeadlineDate,
            RegistrationLink,
			Tag,
		} = req.body;

		// Get thumbnail image from request files
		

		// Check if any of the required fields are missing
		if (
			!EventName ||
			!Description ||
			!DeadlineDate ||
			!Tag
			// !thumbnail ||
		){
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		// Check if the user is an instructor
		const instructorDetails = await Instructor.findOne({UserID:userId})

		// if (!instructorDetails) {
		// 	return res.status(404).json({
		// 		success: false,
		// 		message: "Instructor Details Not Found",
		// 	});
		// }
        // JSON.stringify(Tag[0])



		// Check if the tag given is valid
        const tagIds = await Promise.all(
            Tag.map(async (tag) => {
                const tagDetail = await Tags.findOne({ name: tag });
                return tagDetail._id;
            })
        );

        console.log(Tag)

        //thumbnailImage
        // 
        
		// const tagDetail = await Tags.findOne({ name: Tag });

		// if (!tagDetail) {
		// 	return res.status(404).json({
		// 		success: false,
		// 		message: "Tag Details Not Found",
		// 	});
		// }
		// Upload the Thumbnail to Cloudinary
		// const thumbnailImage = await uploadImageToCloudinary(
		// 	thumbnail,
		// 	process.env.FOLDER_NAME
		// );
		// console.log(thumbnailImage);
		// Create a new event with the given details
        console.log(tagIds)
        const parsedDate=new Date(DeadlineDate)
		const newEvent = await Event.create({
			EventName,
			Description,
			InstructorID: instructorDetails._id,
			RegistrationLink,
			DeadlineDate:parsedDate,
			Tag: tagIds,
			// thumbnail: thumbnailImage.secure_url,
			// status: status,
			// instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await Instructor.findByIdAndUpdate(
    instructorDetails._id,
    {
        $push: {
            Event: newEvent._id,
        },
    },
    { new: true }
);
		// Add the new course to the Categories
		await Tags.updateMany(
            { _id: { $in: tagIds } },
            {
                $push: {
                    Event: newEvent._id,
                },
            }
        );

        let tagsString=Tag
        try{
        let tagsSt = await tagsString.join(', ');
        const userDetails = await User.findById(userId) 
        console.log(userDetails.Email);
        const mailResponse = await mailSender(
			                    userDetails.Email,
			                    "Confirmation Email",
                                confirmationTemplate(userDetails.FirstName+" "+userDetails.LastName,EventName,Description,
                                DeadlineDate,
                                RegistrationLink,
                                tagsSt)
		);
		console.log("Email sent successfully: ", mailResponse.response);
        }catch(error){
            console.log(error)
            };
    res.status(200).json({
            success: true,
            message: "Confirmation sent",
            newEvent
    })} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

exports.imageUploader = async (req, res) => {
    try {
      const { EventId } = req.body;
      console.log(EventId);
      let updatedEvent= await Event.findByIdAndUpdate(
          EventId.toString())
      if (req.files.thumbnailImage) {
        const thumbnail = req.files.thumbnailImage;
  
        // Check if the uploaded file is a supported image type
        if (!supportedImageTypes.includes(thumbnail.mimetype)) {
          return res.status(400).json({
            success: false,
            message: 'Unsupported image file type.',
          });
        }
  console.log(thumbnail.size)
        if (thumbnail.size > maxImageSize) {
          return res.status(400).json({
            success: false,
            message: 'Image size exceeds the maximum allowed size (200 KB).',
          });
        }
  
        const image = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME,
          1000,
          1000
        );
  
         updatedEvent = await Event.findByIdAndUpdate(
          EventId.toString(),
          { thumbnailUrl: image.secure_url },
          { new: true }
        );
      }
  
      if (req.files.pdfUpload) {
        const pdf = req.files.pdfUpload;
  
  
        console.log(pdf.name.slice(pdf.name.lastIndexOf('.')+1))
        // Check if the uploaded file is a supported PDF type
      //   if (pdf.mimetype !== supportedPdfType || pdf.mimetype !== supportedZipType ) {
  
      //     return res.status(400).json({
      //       success: false,
      //       message: 'Unsupported PDF file type.',
      //     });
      //   }
  
          if(pdf.name.slice(pdf.name.lastIndexOf('.')+1)!=="zip" && pdf.name.slice(pdf.name.lastIndexOf('.')+1)!=="pdf"){
              
              return res.status(400).json({
                        success: false,
                        message: 'Unsupported PDF file type.',
                      });
                    }
  
        if (pdf.size > maxPdfSize) {
          return res.status(400).json({
            success: false,
            message: 'PDF size exceeds the maximum allowed size (100 KB).',
          });
        }
  
        const newPdf = await uploadImageToCloudinary(
          pdf,
          process.env.FOLDER_NAME,
          0,
          80
        );
  
        updatedEvent = await Event.findByIdAndUpdate(
          EventId.toString(),
          { pdfUrl: newPdf.secure_url },
          { new: true }
        );
      }
  
      res.status(200).json({
        success: true,
        message: 'Thumbnail and PDF updated successfully',
        data: updatedEvent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  };

exports.getAllEvents = async (req, res) => {
	try {
		const allEvents = await Event.find(
			{deleted:false},
			{
				EventName: true,
				Description: true,
				// thumbnail: true,
				InstructorID: true,
				DeadlineDate: true,
				Tag: true,
                deleted:true,
                sectionCount:true,
                openedBy:true,
                thumbnailUrl:true,
			}//updated it without secton with sectionCount
		)
        .populate("Tag","name description")
        .exec();
		return res.status(200).json({
			success: true,
			data: allEvents,

		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

exports.getEventDetails = async (req, res) => {
    try {
            //get id
            const {EventId} = req.body;
            //find course details
            const eventDetails = await Event.find(
                                        {_id:EventId})
                                        //.populate("ratingAndreviews")
                                        .populate({
                                            path: "section", // Only populate sections where 'deleted' is false
                                          })
                                        .populate("Tag","name description")
                                        .exec();

                //validation
                if(!eventDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${EventId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Event Details fetched successfully",
                    data:eventDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.editEvent = async (req, res) => {
    try {
        // const userId = req.user.id;
        const userId = req.user.id;
        console.log(userId)

        // Get all required fields from request body
        const {
            EventId,
            EventName,
            Description,
            DeadlineDate,
            RegistrationLink,
            Tag,
        } = req.body;

        // Check if any of the required fields are missing
        if (!EventId || !EventName || !Description || !DeadlineDate || !Tag) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }

        // Check if the user is an instructor
        const instructorDetails = await Instructor.findOne({ UserID: userId });

        // Check if the tag given is valid
        const tagIds = await Promise.all(
            Tag.map(async (tag) => {
                const tagDetail = await Tags.findOne({ name: tag });
                return tagDetail._id;
            })
        );
//to do : validate tags
        // Update the event with the given details
        const parsedDate = new Date(DeadlineDate);
        const updatedEvent = await Event.findByIdAndUpdate(
            EventId,
            {
                EventName,
                Description,
                InstructorID: instructorDetails._id,
                RegistrationLink,
                DeadlineDate: parsedDate,
                Tag: tagIds,
            },
            { new: true }
        );

        // Update the event reference in the instructor's schema
        // await Instructor.findByIdAndUpdate(
        //     instructorDetails._id,
        //     {
        //         $addToSet: {
        //             Event: EventId
        //         },
        //     },
        //     { new: true }
        // );

        // Update the event reference in the tag's schema
        await Tags.updateMany(
            { _id: { $in: tagIds } },
            {
                $addToSet: {
                    Event: EventId,
                },
            } 
        );
        //Write code to handle section while editing event , what happens to event ? 
        // Return the updated event and a success message
        res.status(200).json({
            success: true,
            data: updatedEvent,
            message: "Event Updated Successfully",
        });
    } catch (error) {
        // Handle any errors that occur during the update of the event
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update event",
            error: error.message,
        });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const instructorByUserId = await Instructor.findOne({ UserID: userId });
        const { EventId } = req.body;
        
        const EventById=await Event.findById(EventId)
        // Get EventId from request body
        
        if(!(instructorByUserId._id.toString()==EventById.InstructorID.toString())){
			return res.status(404).json({
				success: false,
				message: "Unauthorised Access",
			});
		}

        // Check if EventId is provided
        if (!EventId) {
            return res.status(400).json({
                success: false,
                message: "EventId is mandatory",
            });
        }
        
        // Mark the event as deleted (soft delete)
        const deletedEvent = await Event.findByIdAndUpdate(
            EventId,
            { deleted: true },
            { new: true }
        );
        
        // If the event has an associated instructor, update the instructor's schema
        await Instructor.findByIdAndUpdate(
                (instructorByUserId._id.toString()),
                { $pull: { Event: EventId } }
            );

        // If the event has associated tags, update the tags' schema
        if (deletedEvent.Tag && deletedEvent.Tag.length > 0) {
            await Tags.updateMany(
                { _id: { $in: deletedEvent.Tag } },
                { $pull: { Event: EventId } }
            );
        }

        // Return a success message
        res.status(200).json({
            success: true,
            message: "Event marked as deleted successfully",
            deletedEvent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to mark event as deleted",
            error: error.message,
        });
    }
};

exports.openEvent = async (req, res) => {
    const { EventId} = req.body;
    const userId =req.user.id

    try {
        // Find the event and check if it exists
        const event = await Event.findById(EventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const studentByUserId = await Student.findOne({ UserID: userId });




        console.log(studentByUserId.eventsBookmarked.includes(EventId))
        

        // Update the event only if userId is not already in the openedBy array
        const updatedEvent = await Event.findByIdAndUpdate(
            EventId,
            { $addToSet: { openedBy: userId } }, // $addToSet avoids duplicates
            { new: true }
          )
          .populate('section')
          .populate({
            path: 'InstructorID',
            populate: {
              path: 'UserID',
              select: ['FirstName','LastName'] // Only select the name field from the user
            },
            select: 'UserID'
          })
          .populate("Tag","name description")
          .exec();
        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: 'Unable to update event' });
        }

        return res.status(200).json({
            success: true,
            message: "Event Details fetched successfully",
            data: {event:updatedEvent,
                ifBook:studentByUserId.eventsBookmarked.includes(EventId),
                ifReg:studentByUserId.eventsEnrolled.includes(EventId),
                ifRegCount:updatedEvent.studentEnrolled}
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOpenedByCount = async (req, res) => {
    const { EventId } = req.body;

    try {
        // Find the event and check if it exists
        const event = await Event.findById(EventId).populate('openedBy').exec();
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Calculate the count of unique user IDs in the openedBy array
        const openedByCount = event.openedBy ? event.openedBy.length : 0;

        return res.status(200).json({
            success: true,
            message: "Opened by count fetched successfully",
            count: openedByCount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
