const rateLimit = require('express-rate-limit');

const createRateLimiter = (options) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000, // Default 15 minutes
        max: options.max || 5, // Limit each IP to 5 requests per windowMs
        message: options.message || {
            status: false,
            message: "Too many login attempts. Please try again later.",
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
    });
};

module.exports = {
    createRateLimiter,
};
