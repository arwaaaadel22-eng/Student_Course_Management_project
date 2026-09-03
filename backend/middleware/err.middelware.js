const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const isValidationError = err.name === "ValidationError";

    let message = "Internal Server Error";
    if (statusCode < 500) {
        message = err.message || message;
    } else if (isValidationError) {
        message = Object.values(err.errors).map(e => e.message).join(", ");
    }

    res.status(isValidationError ? 400 : statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;
