import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
  Star,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardsSets, setFlashcardsSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchFlashCardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardsSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcards");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashCardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      await fetchFlashCardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet && selectedSet.cards.length > 0) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length,
      );
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (selectedSet && selectedSet.cards.length > 0) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length,
      );
      setIsFlipped(false);
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[index];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id);
      const updatedSets = flashcardsSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card, i) => {
            if (i === index) {
              return { ...card, reviewed: true };
            }
            return card;
          });
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcardsSets(updatedSets);
      setSelectedSet({
        ...selectedSet,
        cards: updatedSets.find((s) => s._id === selectedSet._id).cards,
      });
    } catch (error) {
      console.error("Failed to review flashcard", error);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStarFlashcard(cardId);
      toast.success("Flashcard starred!");

      const updatedSets = flashcardsSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) => {
            if (card._id === cardId) {
              return { ...card, isStarred: !card.isStarred };
            }
            return card;
          });
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcardsSets(updatedSets);
      setSelectedSet({
        ...selectedSet,
        cards: updatedSets.find((s) => s._id === selectedSet._id).cards,
      });
    } catch (error) {
      toast.error("Failed to star flashcard");
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted successfully!");
      setFlashcardsSets(
        flashcardsSets.filter((set) => set._id !== setToDelete._id),
      );
      setSetToDelete(null);

      if (selectedSet?._id === setToDelete._id) {
        setSelectedSet(null);
      }
    } catch (error) {
      toast.error("Failed to delete flashcard set");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleBackToList = () => {
    setSelectedSet(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const renderFlashCardViewer = () => {
    if (!selectedSet || !selectedSet.cards || selectedSet.cards.length === 0) {
      return (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-slate-400">No cards in this set</p>
          <button
            onClick={handleBackToList}
            className="mt-4 inline-flex items-center gap-2 text-sm sm:text-base text-emerald-400 hover:text-emerald-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sets
          </button>
        </div>
      );
    }

    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Back to Sets</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="text-xs sm:text-sm font-medium text-slate-400">
            {currentCardIndex + 1} / {selectedSet.cards.length}
          </div>

          <button
            onClick={() => handleToggleStar(currentCard._id)}
            className={`p-1.5 sm:p-2 rounded-lg transition ${
              currentCard.isStarred
                ? "text-yellow-400 bg-yellow-500/10"
                : "text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            }`}
          >
            <Star
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill={currentCard.isStarred ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Flashcard */}
        <div className="flex items-center justify-center py-4 sm:py-8">
          <Flashcard
            front={currentCard.question}
            back={currentCard.answer}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            starred={currentCard.isStarred}
            onToggleStar={handleToggleStar}
            cardId={currentCard._id}
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={handlePrevCard}
            disabled={selectedSet.cards.length <= 1}
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition"
          >
            <RotateCcw className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Flip Card</span>
            <span className="sm:hidden">Flip</span>
          </button>

          <button
            onClick={handleNextCard}
            disabled={selectedSet.cards.length <= 1}
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 sm:mt-6">
          <div className="w-full h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{
                width: `${((currentCardIndex + 1) / selectedSet.cards.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12 sm:py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardsSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 mb-3 sm:mb-4">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" strokeWidth={2} />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8 text-center max-w-sm">
            Generate flashcards from your document to start learning and
            reinforce your knowledge
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 h-10 sm:px-6 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition disabled:opacity-60"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              Flashcard Sets
            </h2>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition disabled:opacity-60"
          >
            {generating ? (
              <>
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Generate New Set</span>
                <span className="sm:hidden">New</span>
              </>
            )}
          </button>
        </div>

        {/* Sets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {flashcardsSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Set Info */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Flashcard Set
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {set.cards?.length || 0} cards
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" fill="currentColor" />
                  {set.cards?.filter((c) => c.isStarred).length || 0} starred
                </span>
                <span>{moment(set.createdAt).fromNow()}</span>
              </div>

              {/* View indicator */}
              <div className="mt-3 sm:mt-4 flex items-center justify-end text-emerald-400 text-xs sm:text-sm font-medium opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                View Set →
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
      {selectedSet ? renderFlashCardViewer() : renderSetList()}

      {/* Delete Confirmation Modal */}
      {setToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Delete Flashcard Set?
            </h3>
            <p className="text-sm sm:text-base text-slate-400 mb-5 sm:mb-6">
              Are you sure you want to delete this flashcard set? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSetToDelete(null)}
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

export default FlashcardManager;