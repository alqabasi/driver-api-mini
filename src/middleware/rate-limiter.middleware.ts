import rateLimit from 'express-rate-limit';

const WINDOW = 2; // 1 minutes
const REQUESTS = 100; // 100 REQUEST PER WINDOWS

export const apiLimiter = rateLimit({
  windowMs: WINDOW * 60 * 1000, // 1 minutes
  max: REQUESTS, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: `Too many requests from this IP, please try again after ${WINDOW} minutes`
});
