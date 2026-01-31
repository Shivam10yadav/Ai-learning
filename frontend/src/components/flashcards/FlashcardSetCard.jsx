import React from "react";
import { useNavigate } from "react-router-dom";
import { Book, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  };

  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed,
  ).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div 
      className="bg-slate-800 border border-slate-700 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all group"
      onClick={handleStudyNow}
    >
      <div className="space-y-4">
        {/* Header - Icon and Title */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="text-emerald-400" size={24} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-white text-lg mb-1 truncate group-hover:text-emerald-300 transition"
              title={flashcardSet?.documentId?.title}
            >
              {flashcardSet?.documentId?.title}
            </h3>
            <p className="text-sm text-slate-400">
              Created {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-300 font-medium">
              {totalCards} {totalCards === 1 ? "Card" : "Cards"}
            </span>
          </div>
          {reviewedCount > 0 && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
              <TrendingUp size={16} strokeWidth={2.5} />
              <span className="font-semibold">{progressPercentage}%</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalCards > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Progress
              </span>
              <span className="text-slate-400">
                {reviewedCount}/{totalCards} reviewed
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Study Button */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={16} strokeWidth={2.5} />
          Study Now
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;