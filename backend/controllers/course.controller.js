const Course = require("../models/course.model")

// Create Course
exports.createCourse = async (req, res, next) => {
    try {
        const { title, description, instructor, duration, price, capacity } = req.body
        const course = new Course({
            title,
            description,
            instructor,
            duration,
            price,
            capacity
        })
        await course.save()
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        })
    } catch (err) {
        next(err)
    }
}

// Get All Courses (with optional pagination)
exports.getCourses = async (req, res, next) => {
    try {
        if (req.query.page || req.query.limit) {
            const page = Math.max(1, parseInt(req.query.page) || 1)
            const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
            const skip = (page - 1) * limit

            const [courses, total] = await Promise.all([
                Course.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
                Course.countDocuments()
            ])

            return res.status(200).json({
                success: true,
                courses,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            })
        }

        const courses = await Course.find().sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            courses
        })
    } catch (err) {
        next(err)
    }
}

// Get courses by title (with regex sanitization)
exports.getCoursesByTitle = async (req, res, next) => {
    try {
        const { title } = req.query

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title query is required"
            })
        }

        const escapedTitle = String(title).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const courses = await Course.find({
            title: { $regex: escapedTitle, $options: "i" }
        })

        return res.status(200).json({
            success: true,
            courses
        })
    } catch (err) {
        next(err)
    }
}

// Get Course By ID
exports.getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            course
        })
    } catch (err) {
        next(err)
    }
}

// Update Course
exports.updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, description, instructor, duration, price, capacity } = req.body

        const updateData = {}
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (instructor !== undefined) updateData.instructor = instructor
        if (duration !== undefined) updateData.duration = duration
        if (price !== undefined) updateData.price = price
        if (capacity !== undefined) updateData.capacity = capacity

        const course = await Course.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        })
    } catch (err) {
        next(err)
    }
}

// Delete Course
exports.deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params
        const course = await Course.findByIdAndDelete(id)
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    } catch (err) {
        next(err)
    }
}