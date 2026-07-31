import React from 'react';
import { PhoneCall, HeartHandshake, ShieldAlert, X } from 'lucide-react';

export default function CrisisBanner({ onOpenResources, onClose }) {
  return (
    <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-600 text-white text-xs py-2.5 px-4 shadow-sm relative transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 text-white shrink-0 animate-pulse" />
          <span className="font-semibold">Need immediate support or someone to talk to right now?</span>
          <span className="hidden lg:inline text-rose-100">
            You don't have to face distress alone. Free, confidential support is available 24/7.
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="tel:988"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-all"
          >
            <PhoneCall className="w-3 h-3" />
            <span>1767 SOS</span>
          </a>

          <a
            href="tel:1767"
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-all"
          >
            <HeartHandshake className="w-3 h-3" />
            <span>SOS (1767)</span>
          </a>

          <button
            onClick={onOpenResources}
            className="underline hover:text-rose-100 font-semibold transition-all ml-1"
          >
            All Helplines →
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-all ml-2"
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
