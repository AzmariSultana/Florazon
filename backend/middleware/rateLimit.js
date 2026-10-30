import rateLimit from 'express-rate-limit'

// Slows down password guessing on the login, registration and password-change endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' }
})
