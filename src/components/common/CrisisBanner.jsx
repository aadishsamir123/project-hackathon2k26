import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function CrisisBanner({ onOpenResources, onClose }) {
  return (
    <div className="bg-amber-950 dark:bg-stone-900 text-amber-100 text-xs py-1.5 px-4 relative transition-all border-b border-amber-800/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="font-serif font-medium text-[11px] sm:text-xs truncate">
            Need immediate care? 24/7 confidential student hotlines available.
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenResources}
            className="text-[11px] font-serif font-bold text-amber-300 hover:text-white underline transition-all"
          >
            Helplines →
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-amber-900 text-amber-300/80 hover:text-white transition-all"
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
