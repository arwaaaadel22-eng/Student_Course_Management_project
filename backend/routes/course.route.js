const express = require("express")
const router = express.Router()
const courseController = require("../controllers/course.controller")
const authMiddleware = require("../middleware/auth.middleware")
const adminMiddleware = require("../middleware/admin.middleware")
router.use(authMiddleware)
router.get("/", courseController.getCourses)
router.get("/search", courseController.getCoursesByTitle)
router.get("/:id", courseController.getCourseById)
router.post("/", adminMiddleware, courseController.createCourse)
router.put("/:id", adminMiddleware, courseController.updateCourse)
router.delete("/:id", adminMiddleware, courseController.deleteCourse)

module.exports = router
