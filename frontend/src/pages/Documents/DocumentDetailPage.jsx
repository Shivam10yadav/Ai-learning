import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import documentService from '../../services/documentService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import ChatInterface from '../../components/chat/ChatInterface'

const DocumentDetailPage = () => {
  const { id } = useParams()
  
  // FIX: Use square brackets for useState, not curly braces
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Content') // Match tab name exactly

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id)
        console.log('Document data:', data) // Debug log
        setDocument(data)
      } catch (error) {
        toast.error("Failed to fetch document details")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocumentDetails()
  }, [id])

  // Helper function to get the full PDF URL
 const getPdfUrl = () => {
  if (!document?.data?.filePath) return null;

  const filePath = document.data.filePath;
  if (filePath.startsWith('http')) return filePath;

  // ✅ Vite syntax
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
}

  const renderContent = () => {
    if (!document || !document.data || !document.data.filePath) {
      return <div className='text-center py-8'>PDF not available</div>
    }

    const pdfUrl = getPdfUrl()

    return (
      <div className='bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm'>
        <div className='flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300'>
          <span className='text-sm font-medium text-gray-700'>Document Viewer</span>
          <a 
            href={pdfUrl} 
            target='_blank' 
            rel="noopener noreferrer" 
            className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        {/* FIX: Moved this div inside properly */}
        <div className='bg-gray-100 p-1'>
          <iframe 
            src={pdfUrl} 
            className='w-full h-[70vh] bg-white rounded border border-gray-300' 
            title='PDF Viewer' 
            frameBorder="0"
            style={{
              colorScheme: "light"
            }}
          />
        </div>
      </div>
    )
  }

const renderChat = () => {
  return <ChatInterface />
}


  const renderAIActions = () => {
    return (
      <div className='bg-white p-8 rounded-lg border border-gray-300'>
        <p className='text-gray-600'>AI Actions coming soon...</p>
      </div>
    )
  }

  const renderFlashcardsTab = () => {
    return (
      <div className='bg-white p-8 rounded-lg border border-gray-300'>
        <p className='text-gray-600'>Flashcards will be displayed here...</p>
      </div>
    )
  }

  const renderQuizzesTab = () => {
    return (
      <div className='bg-white p-8 rounded-lg border border-gray-300'>
        <p className='text-gray-600'>Quizzes will be displayed here...</p>
      </div>
    )
  }

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
  ]

  if (loading) {
    return <Spinner />
  }

  if (!document) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Document not found.</p>
        <Link 
          to="/documents" 
          className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className='mb-4'>
        <Link 
          to="/documents" 
          className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors'
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
      
      <PageHeader title={document.data.title} />
      
      {/* FIX: Removed typo 't abs' -> 'tabs' */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default DocumentDetailPage