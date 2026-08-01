import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function CrisisBanner({ onOpenResources, onClose }) {
  return (
    <div className="bg-theme-primary text-white dark:text-stone-950 text-xs py-1.5 px-4 relative transition-all duration-500 border-b border-black/10 dark:border-white/10 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-white/90 dark:text-stone-900 shrink-0 animate-pulse" />
          <span className="font-serif font-medium text-[11px] sm:text-xs truncate">
            Need immediate care? 24/7 confidential student hotlines available.
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenResources}
            className="text-[11px] font-serif font-bold text-white hover:underline transition-all opacity-95 hover:opacity-100"
          >
            Helplines →
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-white/80 hover:text-white transition-all"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
