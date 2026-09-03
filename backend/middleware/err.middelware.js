const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map(e => e.message).join(", ")
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "field";
        return res.status(409).json({
            success: false,
            message: `Duplicate value for ${field}`
        });
    }

    if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
        return res.status(400).json({
            success: false,
            message: "Invalid request body"
        });
    }

    const statusCode = err.statusCode || 500;
    const message = statusCode < 500 ? (err.message || "Request failed") : "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;
