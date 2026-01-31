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
      await fetchFlashCardSets(); // Refresh the list
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
      setIsFlipped(false); // Reset flip state
    }
  };

  const handlePrevCard = () => {
    if (selectedSet && selectedSet.cards.length > 0) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length,
      );
      setIsFlipped(false); // Reset flip state
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[index];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id);
      // Optionally update the local state to reflect review
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

      // Update local state
      const updatedSets = flashcardsSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) => {
            if (card._id === cardId) {
              return { ...card, isStarred: !card.isStarred }; // ✅ Changed to isStarred
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

      // If we're viewing the deleted set, go back to list
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
        <div className="text-center py-12">
          <p className="text-slate-600">No cards in this set</p>
          <button
            onClick={handleBackToList}
            className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Sets
          </button>
        </div>
      );
    }

    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Sets
          </button>

          <div className="text-sm font-medium text-slate-600">
            Card {currentCardIndex + 1} of {selectedSet.cards.length}
          </div>

          <button
            onClick={() => handleToggleStar(currentCard._id)}
            className={`p-2 rounded-lg transition-colors ${
              currentCard.starred
                ? "text-yellow-500 bg-yellow-50"
                : "text-slate-400 hover:text-yellow-500 hover:bg-yellow-50"
            }`}
          >
            <Star
              size={20}
              fill={currentCard.starred ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Flashcard */}
        <div className="flex items-center justify-center py-8">
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
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevCard}
            disabled={selectedSet.cards.length <= 1}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            <RotateCcw size={18} />
            Flip Card
          </button>

          <button
            onClick={handleNextCard}
            disabled={selectedSet.cards.length <= 1}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardsSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-4">
            <Brain className="w-8 h-8 text-emerald-600" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm text-slate-600 mb-8 text-center max-w-sm">
            Generate flashcards from your document to start learning and
            reinforce your knowledge
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60"
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
              <Brain size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Flashcard Sets
            </h2>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus size={18} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        {/* Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardsSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:shadow-slate-200 transition-all duration-200 cursor-pointer"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>

              {/* Set Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Flashcard Set
                </h3>
                <p className="text-sm text-slate-600">
                  {set.cards?.length || 0} cards
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" />
                  {set.cards?.filter((c) => c.isStarred).length || 0}{" "}
                  starred{" "}
                </span>
                <span>{moment(set.createdAt).fromNow()}</span>
              </div>

              {/* View indicator */}
              <div className="mt-4 flex items-center justify-end text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Set →
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      {selectedSet ? renderFlashCardViewer() : renderSetList()}

      {/* Delete Confirmation Modal */}
      {setToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Delete Flashcard Set?
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this flashcard set? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSetToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
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
