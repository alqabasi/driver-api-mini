import rateLimit from 'express-rate-limit';

const WINDOW: number = 1; // minutes
const MAX_REQUESTS: number = 5;


export const rateLimiter = rateLimit({
  windowMs: WINDOW * 60 * 1000, // 1 minutes
  max: MAX_REQUESTS, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
