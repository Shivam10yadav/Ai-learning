import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  RotateCcw,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import Spinner from "../../components/common/Spinner";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const navigate = useNavigate();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashcardSet();
  }, [documentId]);

  const fetchFlashcardSet = async () => {
    setLoading(true);
    try {
      // Fetch the first flashcard set for this document
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      if (response.data && response.data.length > 0) {
        setFlashcardSet(response.data[0]); // Get the first set
      }
    } catch (error) {
      toast.error("Failed to load flashcards");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextCard = () => {
    if (flashcardSet && flashcardSet.cards.length > 0) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % flashcardSet.cards.length
      );
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (flashcardSet && flashcardSet.cards.length > 0) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + flashcardSet.cards.length) %
          flashcardSet.cards.length
      );
      setIsFlipped(false);
    }
  };

  const handleReview = async (index) => {
    const currentCard = flashcardSet?.cards[index];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id);
      const updatedCards = flashcardSet.cards.map((card, i) => {
        if (i === index) {
          return { ...card, reviewed: true };
        }
        return card;
      });
      setFlashcardSet({ ...flashcardSet, cards: updatedCards });
    } catch (error) {
      console.error("Failed to review flashcard", error);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStarFlashcard(cardId);

      const updatedCards = flashcardSet.cards.map((card) => {
        if (card._id === cardId) {
          return { ...card, isStarred: !card.isStarred };
        }
        return card;
      });

      setFlashcardSet({ ...flashcardSet, cards: updatedCards });
      toast.success("Flashcard starred!");
    } catch (error) {
      toast.error("Failed to star flashcard");
    }
  };

  const handleBackToDocument = () => {
    navigate(`/documents/${documentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2} />
          </div>
          <Spinner />
          <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3 font-medium">
            Loading flashcards...
          </p>
        </div>
      </div>
    );
  }

  if (!flashcardSet || !flashcardSet.cards || flashcardSet.cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" strokeWidth={2} />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6">
            Generate flashcards from your document to start learning.
          </p>
          <button
            onClick={handleBackToDocument}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition"
          >
            <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            Back to Document
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcardSet.cards[currentCardIndex];
  const totalCards = flashcardSet.cards.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={handleBackToDocument}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Back to Document</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Study Flashcards</h1>
          </div>
        </div>

        {/* Main Card Section */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Card Counter and Star */}
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm font-medium text-slate-400">
                {currentCardIndex + 1} / {totalCards}
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
                disabled={totalCards <= 1}
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
                disabled={totalCards <= 1}
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
                    width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;