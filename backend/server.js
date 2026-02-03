import express from "express"
import cors from "cors"
import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import connectDB from './config/db.js'
import errorHandler from "./middleware/errorHandler.js"
import authRoutes from './routes/authRoutes.js'
import documentRoutes   from './routes/documentRoutes.js'
import flashcardRoutes   from './routes/flashcardRoutes.js'
import aiRoutes   from './routes/aiRoutes.js'
import quizRoutes   from './routes/quizRoutes.js'
import progressRoutes   from './routes/progressRoutes.js'

dotenv.config()

//es6 module __dirname alternative
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

//initialize express
const app=express()

//connect db
connectDB()

//middleware to handle cors
const allowedOrigins = [
    'http://localhost:5173',
    'https://flashmind-slhb.onrender.com'
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["content-type", "Authorization"],
        credentials: true
    })
)

app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//API routes
app.use('/api/auth',authRoutes)
app.use('/api/documents',documentRoutes)
app.use('/api/flashcards',flashcardRoutes)
app.use('/api/ai',aiRoutes)
app.use('/api/quizzes',quizRoutes)
app.use('/api/progress',progressRoutes)

app.use(errorHandler)

// Serve static files from React build folder in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    // Catch-all handler - use /.* instead of *
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
} else {
    // 404 handler for development
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: "Route not found",
            statusCode: 404
        });
    });
}

//server
const PORT=process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

process.on('unhandledRejection',(err)=>{
    console.error(`Error : ${err.message}`)
    process.exit(1)
})