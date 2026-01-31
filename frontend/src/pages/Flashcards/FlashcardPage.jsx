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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 mx-auto">
            <Brain className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <Spinner />
          <p className="text-sm text-slate-400 mt-3 font-medium">
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
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 mx-auto">
            <Brain className="w-8 h-8 text-emerald-400" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-slate-400 mb-6">
            Generate flashcards from your document to start learning.
          </p>
          <button
            onClick={handleBackToDocument}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition"
          >
            <ArrowLeft size={18} />
            Back to Document
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcardSet.cards[currentCardIndex];
  const totalCards = flashcardSet.cards.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToDocument}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition mb-6"
          >
            <ArrowLeft size={18} />
            Back to Document
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Brain size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-white">Study Flashcards</h1>
          </div>
        </div>

        {/* Main Card Section */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Card Counter and Star */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-400">
                Card {currentCardIndex + 1} of {totalCards}
              </div>

              <button
                onClick={() => handleToggleStar(currentCard._id)}
                className={`p-2 rounded-lg transition ${
                  currentCard.isStarred
                    ? "text-yellow-400 bg-yellow-500/10"
                    : "text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                }`}
              >
                <Star
                  size={20}
                  fill={currentCard.isStarred ? "currentColor" : "none"}
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
                disabled={totalCards <= 1}
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition"
              >
                <RotateCcw size={18} />
                Flip Card
              </button>

              <button
                onClick={handleNextCard}
                disabled={totalCards <= 1}
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
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