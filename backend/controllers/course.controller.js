const Course = require('../models/course.model')

// Create Course
exports.createCourse = async (req, res, next) => {
    try {
        const course = new Course(req.body)
        await course.save()
        res.status(201).json({ success: true, message: 'Course created successfully', course })
    } catch (err) {
        next(err)
    }
}

// Get All Courses
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 })
        res.status(200).json({ success: true, courses })
    } catch (err) {
        next(err)
    }
}

// Search Courses by Title
exports.getCoursesByTitle = async (req, res, next) => {
    try {
        const { title } = req.query

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title query is required' })
        }

        const courses = await Course.find({ title: { $regex: title, $options: 'i' } })
        res.status(200).json({ success: true, courses })
    } catch (err) {
        next(err)
    }
}

// Get Course By ID
exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' })
        }
        res.status(200).json({ success: true, course })
    } catch (err) {
        next(err)
    }
}

// Update Course
exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' })
        }
        res.status(200).json({ success: true, message: 'Course updated successfully', course })
    } catch (err) {
        next(err)
    }
}

// Delete Course
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id)
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' })
        }
        res.status(200).json({ success: true, message: 'Course deleted successfully' })
    } catch (err) {
        next(err)
    }
}