// Strips Mongo operator keys ($..., or keys containing '.') from request bodies
// to prevent NoSQL injection via crafted JSON payloads (e.g. { "$gt": "" }).
const sanitizeValue = (value) => {
    if (Array.isArray(value)) {
        return value.forEach(sanitizeValue);
    }

    if (value && typeof value === "object") {
        for (const key of Object.keys(value)) {
            if (key.startsWith("$") || key.includes(".")) {
                delete value[key];
            } else {
                sanitizeValue(value[key]);
            }
        }
    }
};

const sanitizeMiddleware = (req, res, next) => {
    sanitizeValue(req.body);
    next();
};

module.exports = sanitizeMiddleware;
