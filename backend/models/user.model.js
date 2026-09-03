const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "first name is required"],
        minlength: [3, "first name must be at least 3 characters"],
        maxlength: [50, "first name must be less than 50 characters"]
    },

    lastName: {
        type: String,
        required: [true, "last name is required"],
        minlength: [3, "last name must be at least 3 characters"],
        maxlength: [50, "last name must be less than 50 characters"]
    },

    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "please enter valid email"
        ]
    },

    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password must be at least 6 characters"]
    },

    age: {
        type: Number,
        min: [16, "age must be at least 16"],
        max: [100, "age must be less than 100"]
    },

    phone: {
        type: String,
        trim: true,
        maxlength: [20, "phone must be less than 20 characters"]
    },

    role: {
        type: String,
        enum: {
            values: ["student", "admin"],
            message: "role must be student or admin"
        },
        default: "student"
    }

}, { timestamps: true })

module.exports = mongoose.model("Users", userSchema)