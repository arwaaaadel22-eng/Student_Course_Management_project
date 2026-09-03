const mongoose = require("mongoose")

const enrollmentschema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: [true, "userId is required"]
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Courses",
        required: [true, "courseId is required"]
    },

    enrolledAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: {
            values: ["active", "cancelled"],
            message: "status must be active or cancelled"
        },
        default: "active"
    }

}, { timestamps: true })

// Prevents duplicate concurrent active enrollments for the same user/course.
enrollmentschema.index(
    { userId: 1, courseId: 1 },
    { unique: true, partialFilterExpression: { status: "active" } }
)

module.exports = mongoose.model("Enrollments", enrollmentschema)