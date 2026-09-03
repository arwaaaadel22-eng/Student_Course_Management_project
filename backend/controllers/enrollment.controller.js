const Enrollment = require('../models/enrollment.model')
const Course = require('../models/course.model')

exports.enroll = async (req, res, next) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id

        if (!courseId) {
            return res.status(400).json({ success: false, message: 'courseId is required' })
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' })
        }

        const existing = await Enrollment.findOne({ userId, courseId, status: 'active' })
        if (existing) {
            return res.status(409).json({ success: false, message: 'Already enrolled in this course' })
        }

        if (course.enrolledCount >= course.capacity) {
            return res.status(409).json({ success: false, message: 'This course is full' })
        }

        const enrollment = await Enrollment.create({ userId, courseId, status: 'active' })
        await Course.updateOne({ _id: courseId }, { $inc: { enrolledCount: 1 } })

        return res.status(201).json({ success: true, message: 'Enrolled successfully', enrollment })
    } catch (error) {
        next(error)
    }
}

exports.getMyEnrollments = async (req, res, next) => {
    try {
        const userId = req.user.id

        const enrollments = await Enrollment.find({ userId })
            .populate('courseId', 'title description instructor duration price capacity')
            .sort({ enrolledAt: -1 })

        return res.status(200).json({ success: true, count: enrollments.length, enrollments })
    } catch (error) {
        next(error)
    }
}

exports.cancelEnrollment = async (req, res, next) => {
    try {
        const userId = req.user.id
        const userRole = req.user.role

        const enrollment = await Enrollment.findById(req.params.id)

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' })
        }

        if (enrollment.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Enrollment is already cancelled' })
        }

        const isOwner = enrollment.userId.toString() === userId.toString()
        const isAdmin = userRole === 'admin'

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this enrollment' })
        }

        enrollment.status = 'cancelled'
        await enrollment.save()
        await Course.updateOne({ _id: enrollment.courseId }, { $inc: { enrolledCount: -1 } })

        return res.status(200).json({ success: true, message: 'Enrollment cancelled', enrollment })
    } catch (error) {
        next(error)
    }
}
