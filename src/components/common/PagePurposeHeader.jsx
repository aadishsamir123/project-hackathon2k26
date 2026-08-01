import React, { useState } from 'react';
import { Compass, HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PagePurposeHeader({
  badge = "Mental Health Feature",
  title,
  purpose,
  evidence,
  dailyAction,
  stepNumber,
  totalSteps = 6,
  onActionClick,
  actionText
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 sm:p-6 border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-3 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800">
              {badge}
            </span>
            {stepNumber && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                Daily Path Step {stepNumber}/{totalSteps}
              </span>
            )}
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
          {actionText && onActionClick && (
            <button
              onClick={onActionClick}
              className="px-3.5 py-2 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{actionText}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 rounded-2xl bg-[#FAF6EE] dark:bg-stone-800 border border-amber-200/70 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-amber-100/60 transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Toggle Purpose Details"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">{isExpanded ? "Hide Purpose" : "Why This Matters"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Purpose Pitch */}
      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
        {purpose}
      </p>

      {/* Expanded Purpose & Evidence Details */}
      {isExpanded && (
        <div className="pt-3 border-t border-amber-200/60 dark:border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-fadeIn">
          {evidence && (
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 space-y-1">
              <span className="font-bold text-orange-700 dark:text-orange-300 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Evidence-Based Foundation</span>
              </span>
              <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                {evidence}
              </p>
            </div>
          )}

          {dailyAction && (
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 space-y-1">
              <span className="font-bold text-orange-700 dark:text-orange-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Daily Path Action</span>
              </span>
              <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                {dailyAction}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
