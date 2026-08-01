import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  try {
    return (
      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-3 mb-2 border-b border-amber-200/60 dark:border-stone-800 pb-1" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-2.5 mb-1.5" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-2 mb-1" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-xs text-stone-700 dark:text-stone-300 mb-2 leading-relaxed" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-stone-900 dark:text-stone-100" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic text-stone-700 dark:text-stone-300" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside space-y-1 mb-3 text-xs text-stone-700 dark:text-stone-300 pl-1" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside space-y-1 mb-3 text-xs text-stone-700 dark:text-stone-300 pl-1" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-xs text-stone-700 dark:text-stone-300 leading-normal" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-2 border-orange-500 pl-3 py-1 bg-amber-50/60 dark:bg-amber-950/40 rounded-r-lg text-xs text-stone-800 dark:text-stone-200 italic my-2" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-3 border border-amber-200/80 dark:border-stone-800 rounded-xl">
                <table className="w-full text-xs text-left border-collapse" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-[#FAF6EE] dark:bg-stone-900 border-b border-amber-200/60 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-semibold" {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="divide-y divide-amber-100 dark:divide-stone-800" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-amber-50/50 dark:hover:bg-stone-800/50 transition-colors" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="px-3 py-2 font-semibold text-stone-900 dark:text-stone-100 border-r border-amber-200/50 dark:border-stone-800 last:border-r-0" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-3 py-2 text-stone-700 dark:text-stone-300 border-r border-amber-200/50 dark:border-stone-800 last:border-r-0" {...props} />
            ),
            code: ({ node, inline, ...props }) =>
              inline ? (
                <code className="bg-amber-100/60 dark:bg-stone-800 text-orange-700 dark:text-orange-300 font-mono text-[11px] px-1 py-0.5 rounded border border-amber-200 dark:border-stone-700" {...props} />
              ) : (
                <pre className="bg-stone-900 text-stone-100 font-mono text-[11px] p-3 rounded-xl overflow-x-auto my-2 border border-stone-800">
                  <code {...props} />
                </pre>
              ),
            hr: ({ node, ...props }) => (
              <hr className="my-4 border-amber-200/60 dark:border-stone-800" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  } catch (e) {
    return <div className="text-xs text-stone-700 dark:text-stone-300 whitespace-pre-wrap">{content}</div>;
  }
}
