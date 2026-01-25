import Quiz from "../models/Quiz.js";

export const getQuizzes=async(req,res,next)=>{
try {
  const quizzes = await Quiz.find({
    userId: req.user._id,
    documentId: req.params.documentId,
  })
    .populate('documentId', 'title fileName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
} catch (error) {
  next(error);
}

}

export const getQuizById=async(req,res,next)=>{
   try {
  const quiz = await Quiz.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!quiz) {
    return res.status(404).json({
      success: false,
      error: 'Quiz not found',
      statusCode: 404,
    });
  }

  res.status(200).json({
    success: true,
    data: quiz,
  });
} catch (error) {
  next(error);
}

}

export const submitQuiz=async(req,res,next)=>{
    try {
    
} catch (error) {
    next(error)
}
}

export const getQuizResults=async(req,res,next)=>{
    try {
    
} catch (error) {
    next(error)
}
}

export const deleteQuiz=async(req,res,next)=>{
    try {
    
} catch (error) {
    next(error)
}
}