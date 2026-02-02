import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks,
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user'
    return (
      <div key={index} className={`flex items-start gap-2 sm:gap-3 my-3 sm:my-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 flex-shrink-0">
            <Sparkles className="text-white w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
          </div>
        )}
        
        <div className={`max-w-[85%] sm:max-w-lg p-3 sm:p-4 rounded-2xl shadow-sm ${
          isUser 
          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-md' 
          : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-md'
        }`}>
          {isUser ? (
            <p className="text-sm sm:text-base break-words">{msg.content}</p>
          ) : (
            <div className="prose prose-sm sm:prose-base prose-invert max-w-none">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[60vh] sm:h-[70vh] bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 sm:mb-4">
          <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3 font-medium">
          Loading chat history...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[60vh] sm:h-[70vh] bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
      
      {/* messages */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto bg-slate-900">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">
              Start a conversation
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Ask me anything about the document
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />

        {loading && (
          <div className="flex items-start gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex gap-1 mt-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full animate-bounce" />
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-slate-700 bg-slate-800 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3"
      >
        <div className="flex gap-2 sm:gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something…"
            className="flex-1 rounded-lg sm:rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 sm:px-4 text-sm sm:text-base text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-500/20 transition flex-shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* AI Disclaimer */}
        <p className="text-[10px] sm:text-xs text-slate-500 text-center px-2">
          <span className="font-bold">AI can make mistakes.</span> Please verify important information.
        </p>
      </form>
    </div>
  );
};

export default ChatInterface;