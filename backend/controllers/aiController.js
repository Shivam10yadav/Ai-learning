import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";
// import ChatHistory from "../models/ChatHistory.js";

//desc generate flashcard from document
// routes post /api/ai//generate-flashcards
// access private

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }
    const docuement = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: ready,
    });
    if (!docuement) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }
    //generate flashcard usimng gemini
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count),
    );
    //save to database
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answe: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });

    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: "Flashcard created successfully",
    });
  } catch (error) {
    next(error);
  }
};

//desc generate quiz from document
// routes post /api/ai/generate-quiz
// access private

export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "please provide documentId",
        statusCode: 404,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }
    //generate quz using gemini

    const questions = await generateQuiz.generateFlashcards(
      document.extractedText,
      parseInt(numQuestions),
    );

    //save to db
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });

    res.status(200).json({
        success:true,
        data:quiz,
        message:"QUiz generated successfully",
        

    })
  } catch (error) {
    next(error);
  }
};

//desc generate document summary
// routes post /api/ai/generate-summary
// access private

export const generateSummary = async (req, res, next) => {
  try {
    const{documentId}=req.body

        if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }
        const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

      if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }
    //generate summary

    const summary=await geminiService.generateSummary(document.extractedText)

    res.status(200).json({
        success:true,
        data:{
            documentId:document._id,
            title:document.title,
            summary
        },
        message:"Summary generated successfully"
    })
  } catch (error) {
    next(error);
  }
};

//desc chat with document
// routes post /api/ai/chat
// access private

export const chat = async (req, res, next) => {
  try {
    const {documentId,question}=req.body

    if(!documentId || !question){
        return res.status(400).json({
            success:false,
            error:'Please provide documentId and questions',
            statusCode:400
        })
    }

    const document=await Document.findOne({
        _id:documentId,
        userId:req.user._id,
        status:ready,
    })

          if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    //find relevant chunks

    const relevantChunks=findRelevantChunks(document.chunks,question,3)
    const chunkIndices=relevantChunks.map(c=>c.chunkIndex)

    //get or create chat history

    let chatHistory=await ChatHistory.findOne({
        userId:req.user._id,
        documentId:document._id
    })

    if(!chatHistory){
        chatHistory=await ChatHistory.create({
            userId:req.user._id,
            documentId:document._id,
            messages:[]
        })

    }

    //generate resonse using gemini

    const answer=await geminiService.chatWithContext(question,relevantChunks)
    //save convo

   chatHistory.messages(
    {
        role:'user',
        conetnt:question,
        timestamp:new date(),
        relevantChunks:[]
    },
    {
         role:'assistant',
        conetnt:answer,
        timestamp:new date(),
        relevantChunks:chunkIndices
    }
   )
   await chatHistory.save()

   res.status(200).json({
     success:true,
     data:{
        question,
        answer,
        relevantChunks:chunkIndices,
        chatHistoryId:chatHistory._id
     },
     message:"Response generated successfully "
   })

  } catch (error) {
    next(error);
  }
};
//desc explain concept from document
// routes post /api/ai/explain-conecpt
// access private

export const explainConcept = async (req, res, next) => {
  try {
    const{documentId, concept}=req.body

    if(!documentId || !concept){
        return res.status(400).json({
         success:false,
         error:'please provide documentId and concept',
         statusCode:400
        })
    }

    const document=await Document.findOne({
        _id:documentId,
        userId:req.user._id,
        status:'ready'
    })
              if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }
//find relevant chunk for the concept

const relevantChunks=findRelevantChunks(document.chunks, concept,3)
const context=relevantChunks.map(c=>c.content).join('\n\n')
    
//generate explanation using gemini

const explanation=await geminiService.explainConcept(concept,context)

 res.status(200).json({
   success:true,
   data:{
    concept,
    explanation,
    relevantChunks:relevantChunks.map(c=>c.chunkIndex)
   },
   message:'Explanation generated successfully'
 })
  } catch (error) {
    next(error);
  }
};

//desc get cha history for a document
// routes get /api/ai/chat-history/:document:Id
// access private

export const getChatHistory = async (req, res, next) => {
  try {
    const {documentId}=req.params

            if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }

    const chatHistory=await ChatHistory.findOne({
        userId:req.user._id,
        documentId:documentId
    }).select('messages')//only retrive the message array


    if(!chatHistory){
        return res.status(200).json({
            success:true,
            data:[],//return an empty error if no chat history found
            message:'No chat history found for this document'
        })
    }res.status(200).json({
        success:true,
        data:chatHistory.messages,
        message:'Chat history retrived successfully'
    })

  } catch (error) {
    next(error);
  }
};
