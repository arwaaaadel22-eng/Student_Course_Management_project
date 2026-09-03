const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

dotenv.config()

const authRoutes = require('./routes/auth.route')
const userRoutes = require('./routes/user.route')
const courseRoutes = require('./routes/course.route')
const enrollmentRoutes = require('./routes/enrollment.route')
const errorMiddleware = require('./middleware/err.middelware')

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(express.json())
app.use(cors({ origin: 'http://localhost:4200' }))

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many attempts. Please try again later.' }
})

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Student Course Management API is running' })
})

app.use('/auth', authLimiter, authRoutes)
app.use('/users', userRoutes)
app.use('/courses', courseRoutes)
app.use('/enrollments', enrollmentRoutes)

app.use(errorMiddleware)

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
})

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not set in .env')
        }

        await mongoose.connect(process.env.MONGO_URI)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error.message)
        process.exit(1)
    }
}

startServer()

module.exports = app