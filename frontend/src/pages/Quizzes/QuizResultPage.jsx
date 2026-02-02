import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  CheckCircle,
  XCircle,
  Target,
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

  // Collect wrong answers
  const wrongAnswers = [];
  quiz.questions.forEach((q, i) => {
    if (answers[i] !== q.correctAnswer) {
      wrongAnswers.push({
        questionIndex: i,
        question: q.question,
        options: q.options,
        userAnswer: answers[i] || "Not answered",
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
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

  return (
    <div className="min-h-screen bg-slate-900 pb-32 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-4 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Quizzes
        </button>

        {/* Score Card */}
        <div className={`bg-gradient-to-br ${getScoreGradient()} rounded-2xl p-[2px] mb-6`}>
          <div className="bg-slate-900 rounded-2xl p-5 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
              <Trophy className="text-emerald-400" size={32} />
            </div>

            <h1 className="text-xl sm:text-3xl font-bold text-white">
              Quiz Complete!
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg mt-1">
              {getScoreMessage()}
            </p>

            <div className={`text-5xl sm:text-7xl font-bold mt-4 ${getScoreColor()}`}>
              {percentage}%
            </div>
            <p className="text-slate-400 text-sm sm:text-lg mt-1">
              {score} / {total} correct
            </p>
          </div>
        </div>

     
        {/* Wrong Answers */}
        {wrongAnswers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <Target className="text-red-400" size={20} />
              Review Mistakes
            </h2>

            <div className="space-y-4">
              {wrongAnswers.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-red-500/30 rounded-xl p-4 sm:p-6"
                >
                  <h3 className="text-white font-medium text-sm sm:text-base mb-3">
                    Q{item.questionIndex + 1}. {item.question}
                  </h3>

                  <div className="space-y-2 mb-3">
                    {item.options.map((opt, i) => {
                      const correct = opt === item.correctAnswer;
                      const user = opt === item.userAnswer;

                      return (
                        <div
                          key={i}
                          className={`px-3 py-2 rounded-lg text-sm border
                            ${
                              correct
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                                : user
                                ? "bg-red-500/10 border-red-500 text-red-300"
                                : "bg-slate-700 border-slate-600 text-slate-400"
                            }`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {item.explanation && (
                    <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-sm text-slate-300">
                      💡 {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky Action Bar */}
       <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 py-2 flex justify-center">
  <div className="flex gap-4">
    <button
      onClick={() => navigate(-1)}
      className="px-6 h-9 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm"
    >
      Back
    </button>

    <button
      onClick={() => window.location.reload()}
      className="px-6 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-semibold"
    >
      Retake
    </button>
  </div>
</div>


      </div>
    </div>
  );
};

export default QuizResultPage;


 
