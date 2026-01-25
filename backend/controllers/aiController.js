import Document from '../models/Document.js'
import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import ChatHistory from '../models/ChatHistory.js'
import * as geminiService from '../utils/geminiService.js'
import { findRelevantChunks } from '../utils/textChunker.js'

//desc generate flashcard from document
// routes post /api/ai//generate-flashcards
// access private

export const generateFlashcards=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}

//desc generate quiz from document
// routes post /api/ai/generate-quiz
// access private

export const generateQuiz=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}

//desc generate document summary
// routes post /api/ai/generate-summary
// access private

export const generateSummary=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}

//desc explain concept from document
// routes post /api/ai/explain-conecpt
// access private

export const explainConcept=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}

//desc get cha history for a document
// routes get /api/ai/chat-history/:document:Id
// access private

export const getChatHistory=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}