import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // Limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export default limiter;
