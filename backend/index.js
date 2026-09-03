const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config({ path: path.join(__dirname, "config.env") })

const authRoutes = require("./routes/auth.route")
const userRoutes = require("./routes/user.route")
const courseRoutes = require("./routes/course.route")
const enrollmentRoutes = require("./routes/enrollment.route")
const errorMiddleware = require("./middleware/err.middelware")

const app = express()
const PORT = Number(process.env.PORT || process.env.port || 3000)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.mongourl
const JWT_SECRET = process.env.JWT_SECRET || process.env.secret_key

if (JWT_SECRET) {
    process.env.JWT_SECRET = JWT_SECRET
}

app.use(express.json())
app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.get("/", (req, res) => {
    res.json({ success: true, message: "Student Course Management API is running" })
})

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/courses", courseRoutes)
app.use("/enrollments", enrollmentRoutes)

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

app.use(errorMiddleware)

const startServer = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MongoDB connection string is not configured in config.env")
        }

        await mongoose.connect(MONGO_URI)
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