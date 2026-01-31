import React, { useState } from 'react'
import { Star } from 'lucide-react'

const Flashcard = ({ front, back, isFlipped, onFlip, starred, onToggleStar, cardId }) => {
  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000">
      {/* Card Container */}
      <div
        onClick={onFlip}
        className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl shadow-xl p-8 flex flex-col">
            {/* Front Label */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                Question
              </span>
              {onToggleStar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleStar(cardId)
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    starred
                      ? 'text-yellow-500 bg-yellow-50'
                      : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
                  }`}
                >
                  <Star size={20} fill={starred ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>

            {/* Front Content */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl font-semibold text-slate-900 text-center">
                {front}
              </p>
            </div>

            {/* Hint */}
            <div className="text-center text-sm text-slate-500 mt-4">
              Click to reveal answer
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-xl p-8 flex flex-col">
            {/* Back Label */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Answer
              </span>
              {onToggleStar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleStar(cardId)
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    starred
                      ? 'text-yellow-500 bg-yellow-50'
                      : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
                  }`}
                >
                  <Star size={20} fill={starred ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>

            {/* Back Content */}
            <div className="flex-1 flex items-center justify-center overflow-y-auto">
              <p className="text-lg text-slate-900 text-center">
                {back}
              </p>
            </div>

            {/* Hint */}
            <div className="text-center text-sm text-slate-500 mt-4">
              Click to see question
            </div>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS or Tailwind config */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

export default Flashcard