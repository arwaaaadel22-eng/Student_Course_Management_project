const Enrollment = require("../models/enrollment.model")
const Course = require("../models/course.model")

exports.enroll = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userId = req.user?._id || req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" })
        }

        if (!courseId) {
            return res.status(400).json({ success: false, message: "courseId is required" })
        }

        const foundCourse = await Course.findById(courseId);
        if (!foundCourse) {
            return res.status(404).json({ success: false, message: "Course not found" })
        }

        const existing = await Enrollment.findOne({ userId, courseId, status: "active" })
        if (existing) {
            return res.status(409).json({ success: false, message: "Already enrolled in this course" })
        }


        const enrollment = await Enrollment.create({ userId, courseId, status: "active" })
        return res.status(201).json({ success: true, enrollment })
    } catch (error) {
        next(error)
    }
}

exports.getMyEnrollments = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id
        
        const enrollments = await Enrollment.find({ userId })
            .populate("courseId")
            .sort({ enrolledAt: -1 })
        if (enrollments.length===0){
            return res.status(200).json({ 
            success: true,
            count: enrollments.length,
            enrollments,
            message:"the user is not enrolled in any courses"
        })
        }
        

        return res.status(200).json({
            success: true,
            count: enrollments.length,
            enrollments
        })
    } catch (error) {
        next(error)
    }
}

exports.cancelEnrollment = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id
        const enrollment = await Enrollment.findById(req.params.id)

        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" })
        }

        if (enrollment.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this enrollment"
            })
        }

        enrollment.status = "cancelled"
        await enrollment.save()

        return res.status(200).json({
            success: true,
            message: "Enrollment cancelled",
            enrollment
        })
    } catch (error) {
        next(error)
    }
}
exports.cancelEnrollment = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id
        const userRole = req.user?.role 
        
        const enrollment = await Enrollment.findById(req.params.id)

        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" })
        }

        const isOwner=enrollment.userId.toString() === userId.toString()
        const isAdmin= userRole === "admin"

        if (!(isOwner || isAdmin)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this enrollment"
            })
        }

       enrollment.status = "cancelled"
        await enrollment.save()
        
        return res.status(200).json({
            success: true,
            message: "Enrollment canceld",
            enrollment
        })
    } catch (error) {
        next(error)
    }
}
