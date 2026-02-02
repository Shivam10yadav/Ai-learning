import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Brain,
  Sparkles,
  ArrowLeft,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import QuizCard from "./QuizCard";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [deleting, setDeleting] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(response.data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchQuizzes();
  }, [documentId]);

  const handleGenerateQuiz = async () => {
    if (!documentId) {
      toast.error("No document selected");
      return;
    }

    setGenerating(true);
    setShowSettings(false);
    
    try {
      await aiService.generateQuiz(documentId, numQuestions);
      toast.success(`Quiz with ${numQuestions} questions generated successfully!`);
      await fetchQuizzes();
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error(error.message || "Failed to generate quiz. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (e, quiz) => {
    e.stopPropagation();
    setQuizToDelete(quiz);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;

    setDeleting(true);
    try {
      await quizService.deleteQuiz(quizToDelete._id);
      toast.success("Quiz deleted successfully!");
      
      // Update quizzes list using functional update
      setQuizzes((prevQuizzes) => 
        prevQuizzes.filter((q) => q._id !== quizToDelete._id)
      );
      
      // Clear selected quiz if it was the one deleted
      if (selectedQuiz?._id === quizToDelete._id) {
        setSelectedQuiz(null);
      }
      
      setQuizToDelete(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  };

  const handleQuizSubmit = (result) => {
    // Handle quiz submission - could save results to backend
    console.log("Quiz submitted:", result);
  };

  const renderQuizViewer = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Back to Quizzes</span>
          <span className="sm:hidden">Back</span>
        </button>
        
        <div className="text-xs sm:text-sm text-slate-400">
          {moment(selectedQuiz.createdAt).fromNow()}
        </div>
      </div>

      <QuizCard quiz={selectedQuiz} onSubmit={handleQuizSubmit} />
    </div>
  );

  const renderQuizList = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <Spinner />
          <p className="text-sm sm:text-base text-slate-400 mt-3 sm:mt-4">Loading quizzes...</p>
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <div className="flex flex-col items-center py-12 sm:py-16 text-center px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3 sm:mb-4">
            <Brain className="text-emerald-400 w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
            No Quizzes Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 sm:mb-6 max-w-md">
            Generate AI-powered quizzes from your document to test your knowledge and reinforce learning
          </p>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl w-full max-w-xs">
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="3"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                className="w-full sm:w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-xs">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-slate-700 transition"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={handleGenerateQuiz}
              disabled={generating}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" strokeWidth={2} />
                  Generate Quiz
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Your Quizzes</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm rounded-lg sm:rounded-xl transition ${
                showSettings
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {numQuestions}Q
            </button>
            <button
              onClick={handleGenerateQuiz}
              disabled={generating}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Generate</span>
                  <span className="sm:hidden">New</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-3 sm:p-4 bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl">
            <label className="block text-xs sm:text-sm text-slate-300 mb-2">
              Number of Questions (3-20)
            </label>
            <input
              type="number"
              min="3"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(3, Math.min(20, parseInt(e.target.value) || 5)))}
              className="w-full sm:w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => setSelectedQuiz(quiz)}
              className="group relative bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, quiz)}
                className="absolute top-3 right-3 p-1.5 sm:p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                title="Delete quiz"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Brain className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-white">Quiz</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    {moment(quiz.createdAt).format('MMM D, YYYY')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-slate-300">
                  {quiz.questions?.length || 0} questions
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500">
                  {moment(quiz.createdAt).fromNow()}
                </p>
              </div>

              {/* View indicator */}
              <div className="mt-3 sm:mt-4 flex items-center justify-end text-emerald-400 text-xs sm:text-sm font-medium opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                Take Quiz →
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
      {selectedQuiz ? renderQuizViewer() : renderQuizList()}

      {/* Delete Confirmation Modal */}
      {quizToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Delete Quiz?
            </h3>
            <p className="text-sm sm:text-base text-slate-400 mb-5 sm:mb-6">
              Are you sure you want to delete this quiz? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setQuizToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg sm:rounded-xl transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg sm:rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManager;