// Import the required modules
const express = require("express")
const router = express.Router()
const { auth, isInstructor, isStudent} = require("../middlewares/auth")
// Import the Controllers

// Event Controllers Import
const {
  createEvent,
  getAllEvents,
  getEventDetails,
  editEvent,
  deleteEvent,
  openEvent,
  getOpenedByCount,
  imageUploader
} = require("../controllers/Event")


// Tag Controllers Import
const {
//   showAllCategories,
  createTag, showAllTags,
  filterTag
//   categoryPageDetails,
} = require("../controllers/Tag")

// Section Controllers Import
const {
    createSection,
    deleteSection,
  } = require("../controllers/Section")
// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createEvent", auth, createEvent)

router.post("/createTag", auth, createTag)

router.get("/showAllTags", showAllTags)

router.get("/getAllEvents", getAllEvents)

router.get("/getEventDetails", getEventDetails)

router.post("/openEvent", auth,openEvent)

router.post("/imageUploader", auth,imageUploader)

router.get("/getOpenedByCount", auth,getOpenedByCount)

router.post("/editEvent",auth,isInstructor,editEvent)

router.post("/deleteEvent",auth,isInstructor,deleteEvent)

router.post("/deleteSection",auth,isInstructor,deleteSection)

// router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/createSection", auth, isInstructor,createSection)

router.post("/filterTag", filterTag)

module.exports = router

