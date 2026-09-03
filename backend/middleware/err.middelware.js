const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack)

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map(e => e.message).join(', ')
        })
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`
        })
    }

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'This value already exists'
        })
    }

    const status = err.statusCode || 500
    const message = status < 500 ? err.message : 'Internal Server Error'

    res.status(status).json({ success: false, message })
}

module.exports = errorMiddleware
