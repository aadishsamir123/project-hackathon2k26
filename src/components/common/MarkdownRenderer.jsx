import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="prose prose-slate max-w-none text-xs leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-base font-bold text-slate-900 mt-4 mb-2 border-b border-slate-200 pb-1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm font-bold text-slate-900 mt-3 mb-1.5" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs font-bold text-slate-800 mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-xs text-slate-600 mb-2 leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-slate-900" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-slate-700" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-xs text-slate-600 pl-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-xs text-slate-600 pl-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-xs text-slate-600 leading-normal" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-50/50 rounded-r-lg text-xs text-slate-700 italic my-2" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-100" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-slate-50/50 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 font-semibold text-slate-900 border-r border-slate-100 last:border-r-0" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 text-slate-600 border-r border-slate-100 last:border-r-0" {...props} />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="bg-slate-100 text-slate-800 font-mono text-[11px] px-1 py-0.5 rounded border border-slate-200" {...props} />
            ) : (
              <pre className="bg-slate-900 text-slate-100 font-mono text-[11px] p-3 rounded-xl overflow-x-auto my-2">
                <code {...props} />
              </pre>
            ),
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-slate-200" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
