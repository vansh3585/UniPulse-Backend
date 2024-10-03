const Tag = require("../models/Tag");
const User=require("../models/User")
const Event = require("../models/Event");

exports.createTag = async (req, res) => {
	try {
        const userId = req.user.id;
        const checkAdmin = await User.findById(userId)
        if (!(checkAdmin.accountType=="Admin")) {
			return res.status(404).json({
				success: false,
				message: "Entry Restricted for Admin",
			});
		}
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
        if(name=="Trans"){
			return res
				.status(696)
				.json({ success: false, message: "Bhaag ja chakke" });
		}
        // if () {
		// 	return res
		// 		.status(400)
		// 		.json({ success: false, message: "All fields are required" });
		// }
		const TagsDetails = await Tag.create({
			name: name,
			description: description,
		});
		console.log(TagsDetails);
		return res.status(200).json({
			success: true,
			message: "Tags Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllTags = async (req, res) => {
	try {
		const allTags = await Tag.find(
			{},
			{ name: true, description: true }
		)
		.populate({
			path: "Event",
			match: { deleted: false }
		})
		.exec()
		res.status(200).json({
			success: true,
			data: allTags,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
//there is still some glitches with filterTag , but mostly it is fine 
exports.filterTag = async (req, res) => {
	try {
		const { tagNames } = req.body;

		// Check if tag names are provided in the request body
		if (!tagNames) {
			return res.status(400).json({
				success: false,
				message: "Tag names are mandatory and should be provided as a non-empty array.",
			});
		}
		console.log(tagNames);

		// Find tags based on the provided tag names
		const tagIds = await Promise.all(
			tagNames.map(async (tag) => {
				const tagDetail = await Tag.findOne({ name: tag });
				return tagDetail._id;
			})
		);

		// Extract event IDs from the found tags
		const eventIds = [];

		await Promise.all(
			tagIds.map(async (tagId) => {
				const tagDetail = await Tag.findById(tagId);
				if (tagDetail && Array.isArray(tagDetail.Event)) {
					eventIds.push(...tagDetail.Event);
				}
			})
		);

		// Find events with the extracted event IDs and where deleted is false
		const filteredEvents = await Event.find({
			_id: { $in: eventIds },
			deleted: false, // Only select events that are not deleted
			Tag: { $all: tagIds }, // Match events that have all the specified tags
		})
			.populate({
				path: "Tag",
				select: "name", // Specify the field(s) you want to select from the populated document
			})
			// Select the fields you want to return

		return res.status(200).json({
			success: true,
			data: filteredEvents,
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


// //TagPageDetails 

// exports.TagPageDetails = async (req, res) => {
//     try {
//             //get TagId
//             const {TagId} = req.body;
//             //get courses for specified TagId
//             const selectedTag = await Tag.findById(TagId)
//                                             .populate("courses")
//                                             .exec();
//             //validation
//             if(!selectedTag) {
//                 return res.status(404).json({
//                     success:false,
//                     message:'Data Not Found',
//                 });
//             }
//             //get coursesfor different categories
//             const differentCategories = await Tag.find({
//                                          _id: {$ne: TagId},
//                                          })
//                                          .populate("courses")
//                                          .exec();

//             //get top 10 selling courses
//             //HW - write it on your own

//             //return response
//             return res.status(200).json({
//                 success:true,
//                 data: {
//                     selectedTag,
//                     differentCategories,
//                 },
//             });

//     }
//     catch(error ) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
// }