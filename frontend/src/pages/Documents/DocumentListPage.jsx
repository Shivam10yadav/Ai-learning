import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import documentService from '../../services/documentService'
import toast from 'react-hot-toast'
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  BookOpen,
  BrainCircuit,
  Clock,
  FileWarning,
  Loader2,
  Search,
  Filter,
  X,
  Edit2
} from 'lucide-react'
import Spinner from '../../components/common/Spinner'

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedFile, setSelectedFile] = useState(null)
  const [documentTitle, setDocumentTitle] = useState('') // NEW: Title state

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentService.getDocuments()
      setDocuments(data || [])
    } catch (error) {
      toast.error(error.message || 'Failed to fetch documents')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, TXT, and DOCX files are allowed')
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      // Auto-fill title with filename (without extension)
      const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.')
      setDocumentTitle(fileNameWithoutExt)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setDocumentTitle('')
    document.getElementById('file-input').value = ''
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    if (!documentTitle.trim()) {
      toast.error('Please provide a document title')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('title', documentTitle.trim())

    try {
      setUploading(true)
      await documentService.uploadDocument(formData)
      toast.success('Document uploaded successfully')
      handleRemoveFile() // Clear form
      fetchDocuments()
    } catch (error) {
      toast.error(error.message || 'Failed to upload document')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

const formatDate = (date) => {
  if (!date) return 'N/A'
  
  const d = new Date(date)
  
  // Format: "Jan 28, 2026 • 3:45 PM"
  const dateStr = d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
  
  const timeStr = d.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  
  return `${dateStr} • ${timeStr}`
}

  const getStatusColor = (status) => {
    const colors = {
      processing: 'bg-blue-100 text-blue-700',
      ready: 'bg-emerald-100 text-emerald-700',
      failed: 'bg-red-100 text-red-700'
    }
    return colors[status] || colors.processing
  }

  const getStatusIcon = (status) => {
    if (status === 'processing') return <Loader2 className="w-4 h-4 animate-spin" />
    if (status === 'failed') return <FileWarning className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      await documentService.deleteDocument(id)
      toast.success('Document deleted successfully')
      setDocuments(documents.filter(doc => doc._id !== id))
    } catch (error) {
      toast.error(error.message || 'Failed to delete document')
      console.error(error)
    }
  }

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Documents</h1>
          <p className="text-slate-600">Upload and manage your learning materials</p>
        </div>
      </div>

      {/* Upload Section - UPDATED */}
    {/* Upload Section - UPDATED */}
<div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
      <Upload className="w-5 h-5" />
    </div>
    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Upload Document</h2>
  </div>

  <div className="space-y-4">
    {/* File Selection */}
    <div>
      <input
        id="file-input"
        type="file"
        onChange={handleFileSelect}
        accept=".pdf,.txt,.docx"
        className="hidden"
      />
      <label
        htmlFor="file-input"
        className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer group"
      >
        <div className="text-center">
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mx-auto mb-3" />
          {selectedFile ? (
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1 px-4 break-words">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div className="px-4">
              <p className="text-sm font-medium text-slate-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, TXT, or DOCX (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </label>
    </div>

    {/* Title Input - Shows when file is selected */}
    {selectedFile && (
      <div className="space-y-3">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Document Title *
          </label>
          <div className="relative">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            />
            <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || !documentTitle.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Document
              </>
            )}
          </button>
          <button
            onClick={handleRemoveFile}
            disabled={uploading}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm sm:text-base font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
</div>  

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
        >
          <option value="all">All Status</option>
          <option value="ready">Ready</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Documents List */}
      {/* Documents List */}
{filteredDocuments.length === 0 ? (
  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
      <FileText className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">
      {searchQuery || filterStatus !== 'all' ? 'No documents found' : 'No documents yet'}
    </h3>
    <p className="text-slate-600 mb-6">
      {searchQuery || filterStatus !== 'all'
        ? 'Try adjusting your search or filters'
        : 'Upload your first document to get started with AI-powered learning'}
    </p>
  </div>
) : (
  <div className="grid gap-4">
    {filteredDocuments.map((doc) => (
      <div
        key={doc._id}
        className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg hover:shadow-slate-200 transition-all duration-200"
      >
        {/* Mobile & Desktop Layout */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-md shadow-blue-500/30 flex-shrink-0">
            <FileText className="w-6 h-6" strokeWidth={2.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            {/* Title and Status */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate mb-1">
                  {doc.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 truncate">{doc.fileName}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${getStatusColor(doc.status)}`}>
                {getStatusIcon(doc.status)}
                <span className="hidden sm:inline">{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">{formatDate(doc.uploadDate || doc.createdAt)}</span>
              </span>
              <span className="whitespace-nowrap">{formatFileSize(doc.fileSize)}</span>
            </div>

            {/* Actions - Responsive Grid */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
              <Link
                to={`/documents/${doc._id}`}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>View</span>
              </Link>
              <Link
                to={`/documents/${doc._id}/flashcards`}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Flashcards</span>
                <span className="sm:hidden">Cards</span>
              </Link>
              <button
                onClick={() => handleDelete(doc._id)}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
  
    </div>
  )
}

export default DocumentListPage