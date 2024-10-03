// Import the required modules
const express = require("express")
const router = express.Router()
const { auth, isInstructor, isStudent} = require("../middlewares/auth")
// Import the Controllers

// Event Controllers Import
const {
    createBookmark,
    getAllBookmarks,
    deleteBookmark,
    registerNow,
    
} = require("../controllers/Student")




// const{
//     createSection,
//     // getEventDetails,
// } = require("../controllers/Section")


router.post("/createBookmark",auth,isStudent,createBookmark)
router.get("/getAllBookmarks",auth,isStudent,getAllBookmarks)
router.post("/deleteBookmark",auth,isStudent,deleteBookmark)
router.post("/registerNow",auth,isStudent,registerNow)

// router.post("/createTag", auth, createTag)
// router.get("/showAllTags", showAllTags)
// router.get("/getAllEvents", getAllEvents)
// router.get("/getEventDetails", getEventDetails)
// router.post("/getCategoryPageDetails", categoryPageDetails)
// router.post("/createSection", auth, createSection)

module.exports = router