const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const sanitizeMiddleware = require("./middleware/sanitize.middleware")

// Load environment configuration strictly from .env
dotenv.config({ path: path.join(__dirname, ".env") })

const authRoutes = require("./routes/auth.route")
const userRoutes = require("./routes/user.route")
const courseRoutes = require("./routes/course.route")
const enrollmentRoutes = require("./routes/enrollment.route")
const errorMiddleware = require("./middleware/err.middelware")

const app = express()
const PORT = Number(process.env.PORT || 3000)
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:4200"
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_AUTH_MAX || 20)

app.use(helmet())
app.use(express.json({ limit: "10kb" }))
app.use(sanitizeMiddleware)
app.use(cors({
    origin: CORS_ORIGIN.includes(",") ? CORS_ORIGIN.split(",").map(o => o.trim()) : CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: RATE_LIMIT_MAX,
    message: { success: false, message: "Too many authentication attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false
})

app.get("/", (req, res) => {
    res.json({ success: true, message: "Student Course Management API is running" })
})

app.use("/auth", authLimiter, authRoutes)
app.use("/users", userRoutes)
app.use("/courses", courseRoutes)
app.use("/enrollments", enrollmentRoutes)

// Error-handling middleware
app.use(errorMiddleware)

// 404 Route Not Found
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

// If the DB connection ever drops after startup, fail in-flight queries
// immediately instead of buffering them forever with no timeout and no error.
mongoose.set("bufferCommands", false)

mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message)
})
mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected")
})

const startServer = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI connection string is not configured in .env")
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured in .env")
        }

        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })

    } catch (error) {
        console.error("Failed to start server:", error.message)
        process.exit(1)
    }
}

startServer()

module.exports = app