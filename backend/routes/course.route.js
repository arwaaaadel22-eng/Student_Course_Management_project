const express = require("express")
const router = express.Router()
const courseController = require("../controllers/course.controller")
const authMiddleware = require("../middleware/auth.middleware")
const adminMiddleware = require("../middleware/admin.middleware")

router.get("/", courseController.getCourses)
router.get("/getall", courseController.getCourses)
router.get("/search", courseController.getCoursesByTitle)
router.get("/getbyid/:id", courseController.getCourseById)
router.get("/:id", courseController.getCourseById)

router.use(authMiddleware)

router.post("/", adminMiddleware, courseController.createCourse)
router.delete("/:id", adminMiddleware, courseController.deleteCourse)
router.put("/:id", adminMiddleware, courseController.updateCourse)

module.exports = router
