import React, { useState, useEffect } from 'react'
import flashcardService from '../../services/flashcardService'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { BookOpen, Trash2, Star, X, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const FlashcardListPage = () => {
  const navigate = useNavigate()
  const [flashcardSets, setFlashcardSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [setToDelete, setSetToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets()
        console.log("Fetchflashcardsets__", response.data)
        setFlashcardSets(response.data)
      } catch (error) {
        toast.error("Failed to fetch Flashcards")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchFlashcardSets()
  }, [])

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation()
    setSetToDelete(set)
  }

  const handleConfirmDelete = async () => {
    if (!setToDelete) return

    setDeleting(true)
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id)
      toast.success("Flashcard set deleted successfully!")
      setFlashcardSets(flashcardSets.filter((set) => set._id !== setToDelete._id))
      setSetToDelete(null)
    } catch (error) {
      toast.error("Failed to delete flashcard set")
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  const handleCardClick = (set) => {
    // Navigate to the document's flashcard page
    navigate(`/documents/${set.documentId._id}/flashcards`)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      )
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <BookOpen className="text-emerald-400" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            No Flashcard Sets Yet
          </h3>
          <p className="text-slate-400 mb-6">
            Create flashcards from your documents to start studying
          </p>
        </div>
      )
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {flashcardSets.map((set) => {
          const reviewedCount = set.cards?.filter((card) => card.lastReviewed).length || 0
          const totalCards = set.cards?.length || 0
          const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0

          return (
            <div
              key={set._id}
              onClick={() => handleCardClick(set)}
              className="group relative bg-slate-800 border border-slate-700 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition"
                title="Delete flashcard set"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                {/* Icon and Title */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-emerald-400" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-emerald-300 transition">
                      {set.documentId?.title || 'Flashcard Set'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {moment(set.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-300 font-medium">
                      {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
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
                      <span className="text-slate-400">Progress</span>
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

                {/* Starred count */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                    {set.cards?.filter((c) => c.isStarred).length || 0} starred
                  </span>
                </div>
              </div>

              {/* View indicator */}
              <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-center text-emerald-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                Study Now →
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <PageHeader title="All Flashcard Sets" />
      {renderContent()}

      {/* Delete Confirmation Modal */}
      {setToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Delete Flashcard Set?
              </h3>
              <button
                onClick={() => setSetToDelete(null)}
                disabled={deleting}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Message */}
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete this flashcard set with <span className="text-white font-semibold">{setToDelete.cards?.length || 0} cards</span>? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSetToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashcardListPage