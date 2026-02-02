import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react'
import aiService from '../../services/aiService'
import toast from 'react-hot-toast'
import MarkdownRenderer from '../common/MarkdownRenderer'

const AIActions = () => {
  const { id: documentId } = useParams()

  const [loadingAction, setLoadingAction] = useState(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [concept, setConcept] = useState('')

  const handleGenerateSummary = async () => {
    setLoadingAction('summary')
    try {
      const { summary } = await aiService.generateSummary(documentId)
      setTitle('Generated Summary')
      setContent(summary)
      toast.success('Summary generated successfully!')
    } catch (error) {
      toast.error('Failed to generate summary.')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleExplainConcept = async (e) => {
    e.preventDefault()
    if (!concept.trim()) {
      toast.error('Please enter a concept to explain.')
      return
    }

    setLoadingAction('explain')
    try {
      const { explanation } = await aiService.explainConcept(documentId, concept)
      setTitle(`Explanation of "${concept}"`)
      setContent(explanation)
      setConcept('')
      toast.success('Concept explained successfully!')
    } catch (error) {
      toast.error('Failed to explain concept.')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">AI Assistant</h2>
          <p className="text-xs sm:text-sm text-slate-400">Powered by advanced AI</p>
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="p-3 sm:p-4 border-l-4 border-yellow-500 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-xs sm:text-sm text-yellow-300">
          <span className="font-semibold">⚠️ AI can make mistakes.</span> Please verify important information.
        </p>
      </div>

      {/* Action Cards Grid - Stack on mobile, grid on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Generate Summary Card */}
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Generate Summary</h3>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow">
            Get a clean and concise summary of the entire document in seconds.
          </p>

          <button
            onClick={handleGenerateSummary}
            disabled={loadingAction === 'summary'}
            className="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loadingAction === 'summary' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Summarizing…
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                Summarize Document
              </>
            )}
          </button>
        </div>

        {/* Explain Concept Card */}
        <form
          onSubmit={handleExplainConcept}
          className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">Explain a Concept</h3>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">
            Enter any topic from the document and get a detailed AI explanation.
          </p>

          <div className="mb-4 sm:mb-6 flex-grow">
            <label htmlFor="concept-input" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Concept or Topic
            </label>
            <input
              id="concept-input"
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. React JSX, Machine Learning"
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white bg-slate-700 border border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loadingAction === 'explain' || !concept.trim()}
            className="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loadingAction === 'explain' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Explaining…
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4" />
                Explain Concept
              </>
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      {content && (
        <div className="p-4 sm:p-6 bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-700">
            <Sparkles className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
            <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
          </div>
          <div className="prose prose-invert prose-slate prose-sm sm:prose-base max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AIActions