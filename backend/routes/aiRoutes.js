import express from 'express'
import {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory
} from '../controllers/aiController.js'
import protect from '../middleware/authMiddleware.js'
import geminiRateLimiter from '../middleware/RateLimiter.js'

const router = express.Router()

router.use(protect)

router.post('/generate-flashcards', geminiRateLimiter, generateFlashcards)
router.post('/generate-quiz', geminiRateLimiter, generateQuiz)
router.post('/generate-summary', geminiRateLimiter, generateSummary)
router.post('/chat', geminiRateLimiter, chat)
router.post('/explain-concept', geminiRateLimiter, explainConcept)

// ❌ No rate limit needed here (no Gemini call)
router.get('/chat-history/:documentId', getChatHistory)

export default router
