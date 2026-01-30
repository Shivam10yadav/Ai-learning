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
    } catch (error) {
      toast.error('Failed to explain concept.')
    } finally {
      setLoadingAction(null)
    }
  }

 return (
  <div className="w-full h-full p-6">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
        <Sparkles size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <p className="text-sm text-gray-500">Powered by advanced AI</p>
      </div>
    </div>

    {/* Big Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      
      {/* Generate Summary Card */}
      <div className="flex flex-col justify-between p-6 border rounded-2xl bg-white shadow-sm min-h-[260px]">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <BookOpen size={22} />
            </div>
            <h3 className="text-xl font-semibold">Generate Summary</h3>
          </div>

          <p className="text-gray-500">
            Get a clean and concise summary of the entire document in seconds.
          </p>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={loadingAction === 'summary'}
          className="w-full py-3 mt-6 text-base font-medium text-white rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60"
        >
          {loadingAction === 'summary' ? 'Summarizing…' : 'Summarize Document'}
        </button>
      </div>

      {/* Explain Concept Card */}
      <form
        onSubmit={handleExplainConcept}
        className="flex flex-col justify-between p-6 border rounded-2xl bg-white shadow-sm min-h-[260px]"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
              <Lightbulb size={22} />
            </div>
            <h3 className="text-xl font-semibold">Explain a Concept</h3>
          </div>

          <p className="mb-4 text-gray-500">
            Enter any topic from the document and get a detailed AI explanation.
          </p>

          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g. React JSX"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loadingAction === 'explain'}
          className="w-full py-3 mt-6 text-base font-medium text-white rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60"
        >
          {loadingAction === 'explain' ? 'Explaining…' : 'Explain Concept'}
        </button>
      </form>
    </div>

    {/* Output */}
    {content && (
      <div className="mt-8 p-6 border rounded-2xl bg-white shadow-sm">
        <h3 className="mb-4 text-xl font-semibold">{title}</h3>
        <MarkdownRenderer content={content} />
      </div>
    )}
  </div>
)

}

export default AIActions
