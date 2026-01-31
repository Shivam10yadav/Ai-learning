import React, { useState, useEffect } from 'react'
import flashcardService from '../../services/flashcardService'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard'
import toast from 'react-hot-toast'
import { BookOpen, Sparkles } from 'lucide-react'

const FlashcardListPage = () => {
  // BUG FIX #1: Variable name was flashcardSet but you used FlashcardSets (capital F)
  const [flashcardSets, setFlashcardSets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets()
        console.log("Fetchflashcardsets__", response.data)
        // BUG FIX #1: Use correct setter name
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      )
    }

    // BUG FIX #2: Use correct variable name (flashcardSets not FlashcardSets)
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
        {/* BUG FIX #3: Missing return statement in map */}
        {/* BUG FIX #4: Prop name should be flashcardSet (lowercase) */}
        {flashcardSets.map((set) => (
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <PageHeader title="All Flashcard Sets" />
      {/* BUG FIX #5: Missing () to call the function */}
      {renderContent()}
    </div>
  )
}

export default FlashcardListPage