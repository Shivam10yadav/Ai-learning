import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashCardManager from "../../components/flashcards/FlashCardManager";
import QuizManager from "../../components/quiz/QuizManager";

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        console.log("Document data:", data);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

 const getPdfUrl = () => {
  if (!document?.data?.filePath) return null;

  const filePath = document.data.filePath;
  
  // If it's already a full URL, return as is
  if (filePath.startsWith("http")) return filePath;

  // Get base URL from environment variable
  const baseUrl = import.meta.env.VITE_API_URL || "https://flashmind-backend-3lji.onrender.com";
  
  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure filePath starts with /
  const cleanFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  
  return `${cleanBaseUrl}${cleanFilePath}`;
};

  const renderContent = () => {
  if (!document || !document.data || !document.data.filePath) {
    return (
      <div className="text-center py-6 sm:py-8 backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8">
        <p className="text-sm sm:text-base text-slate-300">PDF not available</p>
      </div>
    );
  }

  const pdfUrl = getPdfUrl();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 border-b border-white/10">
        <span className="text-xs sm:text-sm font-medium text-slate-200">
          Document Viewer
        </span>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
        >
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Open in new tab</span>
          <span className="sm:hidden">Open</span>
        </a>
      </div>
      <div className="bg-white/5 p-0.5 sm:p-1">
        {isMobile ? (
          // Mobile fallback - show direct link
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded border border-white/20 p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {document.data.fileName}
            </h3>
            <p className="text-sm text-slate-600 mb-6 text-center">
              Tap the button below to view the PDF
            </p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
              Open PDF
            </a>
          </div>
        ) : (
          // Desktop - use iframe
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-[60vh] sm:h-[70vh] bg-white rounded border border-white/20"
            title="PDF Viewer"
            type="application/pdf"
            frameBorder="0"
            allow="fullscreen"
          />
        )}
      </div>
    </div>
  );
};

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAIActions = () => {
    return <AIActions />;
  };

  const renderFlashcardsTab = () => {
    return <FlashCardManager documentId={id}/>
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id}/>
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-500 to-red-900 flex items-center justify-center">
      <Spinner />
    </div>
  )
}

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-500 to-red-900 flex items-center justify-center relative overflow-hidden p-3 sm:p-4">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8 relative z-10 max-w-md mx-auto">
          <p className="text-sm sm:text-base text-slate-300 mb-4">Document not found.</p>
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-500 to-red-900 p-3 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="space-y-4 sm:space-y-6 relative z-10 max-w-7xl mx-auto">
        <div className="mb-3 sm:mb-4">
          <Link
            to="/documents"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-3 py-2 sm:px-4 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Documents</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <PageHeader title={document.data.title} />

        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default DocumentDetailPage;