import express from "express"
import {
    getFlashCards,
    getAllFlashcardSets,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSet
} from '../controllers/flashcardController.js'
import protect from "../middleware/authMiddleware.js"

const router=express.Router()

router.use(protect)

router.get('/',getAllFlashcardSets)
router.get('/:documentId',getFlashCards)
router.post('/:cardId/review',reviewFlashcard)
router.put('/:cardId/start',toggleStarFlashcard)
router.delete('/:id',deleteFlashcardSet)

export default router