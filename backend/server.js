import express from "express"
import cors from "cors"
import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { error } from "console"
import connectDB from './config/db.js'
import errorHandler from "./middleware/errorHandler.js"
import authRoutes from './routes/authRoutes.js'
import documentRoutes   from './routes/documentRoutes.js'
import flashcardRoutes   from './routes/flashcardRoutes.js'
import aiRoutes   from './routes/aiRoutes.js'

dotenv.config()


//es6 module __dirname alternative

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

//inialize express

const app=express()

//connect db
connectDB()


//midddleware to handle cors

app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["content-type","Authorization"],
        credentials:true
    })
)

app.use(express.json())
app.use(express.urlencoded({extended:true}));

//routes

app.use('/api/auth',authRoutes)
app.use('/api/documents',documentRoutes)
app.use('/api/flashcards',flashcardRoutes)
app.use('/api/aiRoutes',aiRoutes)

app.use(errorHandler)

//404 handler
app.use((req,res)=>{
res.status(404).json({
    success:false,
    error:"Route not found",
    statusCode:404
});
})

//server

const PORT=process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    
})

process.on('unhandledRejection',(err)=>{
    console.error(`Error : ${err.message}`)
    process.exit(1)
})
