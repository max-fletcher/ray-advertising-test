import { rateLimit } from 'express-rate-limit';

export const globalLimiterOptions = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (i.e windowMs. If windowMs is 60 * 1000(1min) and limit is 100, rate-limit is 100 req/min).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});
