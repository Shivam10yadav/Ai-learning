import Document from '../models/Document.js'
import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import {extractTextFRomPDF} from '../utils/pdfParser.js'
import {chunkText} from "../utils/textChunker.js"
import fs from 'fs/promises'
import mongoose from 'mongoose'

//desc upload pdf
//route post api/document/upload
// access private

export const uploadDocument=async(req,res,next)=>{
    try {
        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>())
        }
        next(error)
    }
}

//desc get all user documents
//route /api/document/getdocuments
//access private

export const getDocuments =async(req,res,next)=>{
  
} 

//desc get single documents with chunks
//routes api/documents/:id
//access private

export const getDocument=async(req,res,next)=>{

}

//desc delete document
//routes api/documents/:id
//access private

export const deleteDocument=async(req,res,next)=>{
    
}


//desc update document
//routes api/documents/:id
//access private

export const updateDocument=async(req,res,next)=>{
    
}

