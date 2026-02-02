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
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
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
    <div className="min-h-screen bg-slate-900 pb-28 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-3"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Quiz
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Answer all questions to submit
            </p>

            <div className="mt-3 text-sm">
              <span className="text-slate-400">Progress: </span>
              <span className="text-emerald-400 font-semibold">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 sm:space-y-6 mt-6">
          {quiz.questions.map((q, i) => (
            <div
              key={i}
              className={`bg-slate-800 border rounded-xl p-4 sm:p-6 ${
                answers[i]
                  ? "border-emerald-500/50"
                  : "border-slate-700"
              }`}
            >
              <div className="flex gap-2 mb-3">
                {answers[i] && (
                  <CheckCircle size={18} className="text-emerald-400 mt-1" />
                )}
                <h3 className="text-white font-medium text-sm sm:text-base">
                  {i + 1}. {q.question}
                </h3>
              </div>

              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(i, opt)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm sm:text-base transition active:scale-[0.98]
                      ${
                        answers[i] === opt
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Submit Bar (Mobile Optimized) */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 p-3">
        <button
          onClick={handleSubmit}
          disabled={answeredCount !== totalQuestions}
          className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {answeredCount === totalQuestions
            ? "Submit Quiz"
            : `Answer all (${answeredCount}/${totalQuestions})`}
        </button>
      </div>
    </div>
  );
};

export default QuizTakePage;
