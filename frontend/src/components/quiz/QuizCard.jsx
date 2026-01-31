import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    // Navigate to YOUR EXISTING route
    navigate(`/quizzes/${quiz._id}/results`, {
      state: {
        quiz,
        answers,
        score,
        total: quiz.questions.length,
      },
    });
  };

  const getOptionStyle = (qIndex, option) => {
    return answers[qIndex] === option
      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
      : "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-slate-500";
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm font-semibold text-emerald-400">
            {answeredCount}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(answeredCount / totalQuestions) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Questions */}
      {quiz.questions.map((q, i) => (
        <div
          key={i}
          className={`bg-slate-800 border rounded-xl p-6 transition-all ${
            answers[i] ? "border-emerald-500/50" : "border-slate-700"
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            {answers[i] && (
              <CheckCircle className="text-emerald-400 mt-1" size={20} />
            )}
            <h4 className="font-semibold text-white flex-1">
              {i + 1}. {q.question}
            </h4>
          </div>

          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(i, opt)}
                className={`block w-full text-left px-4 py-3 rounded-lg border transition ${getOptionStyle(i, opt)}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={answeredCount !== totalQuestions}
        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {answeredCount === totalQuestions
          ? "Submit Quiz"
          : `Answer all questions (${answeredCount}/${totalQuestions})`}
      </button>
    </div>
  );
};

export default QuizCard;