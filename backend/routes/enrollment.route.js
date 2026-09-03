const express = require("express")
const router = express.Router()
const enrollmentController = require("../controllers/enrollment.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.use(authMiddleware)

router.post("/", enrollmentController.enroll)
router.get("/", enrollmentController.getMyEnrollments)
router.delete("/:id", enrollmentController.cancelEnrollment)

module.exports = router
