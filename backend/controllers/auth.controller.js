const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const createToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured")
    }

    return jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    )
}

const publicUser = (user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    age: user.age,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
})

exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, age, phone, role } = req.body || {}

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "firstName, lastName, email and password are required"
            })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            age,
            phone,
            role
        })

        const token = createToken(user)

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: publicUser(user)
        })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {}

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            })
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() })
        const passwordMatches = user && await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = createToken(user)

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: publicUser(user)
        })
    } catch (error) {
        next(error)
    }
}

module.exports.createToken = createToken
module.exports.publicUser = publicUser
