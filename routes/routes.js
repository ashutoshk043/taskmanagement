const express = require('express')
const router = express.Router()
const loginAndRegister = require('../controllers/loginAndRegister')
const userDetails = require('../controllers/userDetails')
const {createRateLimiter} = require('../common/rateLimiter')
const {authenticate} = require('../middlewares/authenticate')

// Create a rate limiter specifically for login
const loginRateLimiter = createRateLimiter({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 3, // Allow only 3 attempts per 2 minutes
    message: {
        status: false,
        message: "Too many login attempts. Try again after 2 minutes.",
    },
});

//login apiss
router.post('/register', loginAndRegister.register)
router.post('/login',loginRateLimiter, loginAndRegister.login)
router.post('/logout',loginRateLimiter, loginAndRegister.logout)

//user Details

router.get('/getUserDetails', authenticate, userDetails.getUserProfile)




module.exports = router

