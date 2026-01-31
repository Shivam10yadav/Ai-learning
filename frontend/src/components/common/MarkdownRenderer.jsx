import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '14px'
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-slate-700 text-white px-2 py-1 rounded text-sm font-mono border border-slate-600"
                {...props}
              >
                {children}
              </code>
            );
          },

          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-yellow-600 mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold text-yellow-500 mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold text-yellow-400 mt-5 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold text-yellow-300 mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-white leading-relaxed mb-4 text-base" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 text-white space-y-2 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 text-white space-y-2 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-white text-base" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-slate-300 my-4 bg-slate-800 py-3" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-emerald-400 hover:text-emerald-300 underline font-medium" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-white" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-white" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-slate-600" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-700" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-slate-600 px-4 py-3 text-left font-semibold text-yellow-400" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-slate-600 px-4 py-3 text-white" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="bg-slate-800" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-slate-600" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;