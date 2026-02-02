import rateLimit from "express-rate-limit";

const geminiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please wait 1 minute ⏳"
    });
  }
});

export default geminiRateLimiter;
