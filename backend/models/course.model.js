const mongoose = require("mongoose")

const courseschema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "title is required"],
        minlength: [3, "title must be atleast 3 characters"],
        maxlength: [100, "title must be less then 100 characters"]
    },

    description: {
        type: String,
        required: [true, "description is required"],
        minlength: [10, "description must be atleast 10 characters"]
    },

    instructor: {
        type: String,
        required: [true, "instructor is required"]
    },

    duration: {
        type: Number,
        required: [true, "duration is required"],
        min: [1, "duration must be at least 1"]
    },

    price: {
        type: Number,
        required: [true, "price is required"],
        min: [0, "price cannot be negative"]
    },

    capacity: {
        type: Number,
        required: [true, "capacity is required"],
        min: [1, "capacity must be at least 1"]
    },

    enrolledCount: {
        type: Number,
        default: 0,
        min: 0
    }

}, { timestamps: true })

module.exports = mongoose.model("Courses", courseschema)