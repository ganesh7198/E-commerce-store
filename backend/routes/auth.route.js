import express from 'express';
import { logincontroller, logoutcontroller, signupcontroller } from '../controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';

const router=express.Router();
// RATE LIMITER -------------
// 5 requests per 15 minutes per IP
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per window
  message: {
    status: 429,
    message: "Too many signup attempts. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  // Disable `X-RateLimit-*` headers
});


router.post('/signup',signupLimiter,signupcontroller);
router.post('/login',logincontroller);
router.post('/logout',logoutcontroller)



export default router;