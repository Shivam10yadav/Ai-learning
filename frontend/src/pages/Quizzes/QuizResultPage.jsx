import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Award,
  Target,
  XCircle,
  CheckCircle,
  BarChart3,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

const QuizResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.quiz || !state.answers) {
    toast.error("Result data not found");
    navigate(-1);
    return null;
  }

  const { quiz, answers, score, total } = state;
  const percentage = Math.round((score / total) * 100);

  // Calculate wrong answers
  const wrongAnswers = [];
  quiz.questions.forEach((q, i) => {
    if (answers[i] !== q.correctAnswer) {
      wrongAnswers.push({
        questionIndex: i,
        question: q.question,
        userAnswer: answers[i] || "Not answered",
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        options: q.options
      });
    }
  });

  const getScoreColor = () => {
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreGradient = () => {
    if (percentage >= 80) return "from-emerald-500 to-teal-500";
    if (percentage >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! 🎉";
    if (percentage >= 80) return "Excellent work! 👏";
    if (percentage >= 70) return "Good job! 👍";
    if (percentage >= 60) return "Not bad! 📚";
    return "Keep practicing! 💪";
  };

  // Mock statistics (you can replace with real data from backend later)
  const statistics = {
    averageScore: percentage, // For now, same as current score
    bestScore: percentage,
    totalAttempts: 1
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to Quizzes
        </button>

        {/* Main Score Card */}
        <div className={`bg-gradient-to-br ${getScoreGradient()} rounded-2xl p-1 mb-8`}>
          <div className="bg-slate-900 rounded-2xl p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4">
                <Trophy className="text-emerald-400" size={40} />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                Quiz Complete!
              </h1>
              <p className="text-lg text-slate-400 mb-6">{getScoreMessage()}</p>

              {/* Score Display */}
              <div className={`text-7xl font-bold ${getScoreColor()} mb-2`}>
                {percentage}%
              </div>
              <p className="text-slate-400 text-lg mb-6">
                {score} out of {total} correct
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Current Score */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-400">Your Score</p>
                <p className="text-2xl font-bold text-white">
                  {percentage}%
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {score}/{total} questions correct
            </p>
          </div>

          {/* Correct Answers */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-400">Correct</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {score}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Well done!
            </p>
          </div>

          {/* Wrong Answers */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="text-red-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-400">Incorrect</p>
                <p className="text-2xl font-bold text-red-400">
                  {wrongAnswers.length}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {wrongAnswers.length === 0 ? "Perfect!" : "Review below"}
            </p>
          </div>
        </div>

        {/* Wrong Answers Section - This is what you wanted! */}
        {wrongAnswers.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-red-400" size={24} />
              <h2 className="text-2xl font-bold text-white">
                Questions to Review
              </h2>
              <span className="ml-auto text-sm text-slate-400">
                {wrongAnswers.length} incorrect
              </span>
            </div>

            <div className="space-y-4">
              {wrongAnswers.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-red-500/30 rounded-xl p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <XCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-3">
                        Question {item.questionIndex + 1}: {item.question}
                      </h3>

                      {/* Options Display */}
                      <div className="space-y-2 mb-4">
                        {item.options.map((option, idx) => {
                          const isUserAnswer = option === item.userAnswer;
                          const isCorrect = option === item.correctAnswer;
                          
                          let className = "px-4 py-2 rounded-lg border ";
                          if (isCorrect) {
                            className += "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                          } else if (isUserAnswer) {
                            className += "bg-red-500/10 border-red-500 text-red-300";
                          } else {
                            className += "bg-slate-700/50 border-slate-600 text-slate-400";
                          }

                          return (
                            <div key={idx} className={className}>
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {isCorrect && (
                                  <CheckCircle size={16} className="text-emerald-400" />
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <XCircle size={16} className="text-red-400" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Answer Summary */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-slate-400 min-w-24">Your answer:</span>
                          <span className="text-red-400 font-medium">{item.userAnswer}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-slate-400 min-w-24">Correct answer:</span>
                          <span className="text-emerald-400 font-medium">{item.correctAnswer}</span>
                        </div>
                      </div>

                      {/* Explanation */}
                      {item.explanation && (
                        <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <p className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
                            💡 Explanation
                          </p>
                          <p className="text-sm text-slate-400">{item.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center mb-8">
            <CheckCircle className="text-emerald-400 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-2">Perfect Score! 🎉</h3>
            <p className="text-slate-400">
              You got all questions correct! Excellent work!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 h-12 bg-slate-800 border border-slate-700 text-white rounded-xl hover:bg-slate-700 transition font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Quizzes
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;