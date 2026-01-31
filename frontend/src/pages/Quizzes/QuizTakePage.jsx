import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const QuizTakePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const quiz = state?.quiz;

  const [answers, setAnswers] = useState({});

  if (!quiz) {
    toast.error("Quiz data not found");
    navigate(-1);
    return null;
  }

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    navigate("/quiz-result", {
      state: {
        quiz,
        answers,
        score,
        total: quiz.questions.length,
      },
    });
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-white mb-2">Quiz</h1>
            <p className="text-slate-400">
              Answer all questions and submit to see your results
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-sm">
                <span className="text-slate-400">Progress: </span>
                <span className="text-emerald-400 font-semibold">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
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
                <h3 className="font-semibold text-white flex-1">
                  {i + 1}. {q.question}
                </h3>
              </div>

              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(i, opt)}
                    className={`block w-full text-left px-4 py-3 rounded-lg border transition ${
                      answers[i] === opt
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-slate-500"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 sticky bottom-4">
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
      </div>
    </div>
  );
};

export default QuizTakePage;