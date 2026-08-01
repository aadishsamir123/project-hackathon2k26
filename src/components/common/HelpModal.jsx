import React from 'react';
import { X, Heart, Shield, Sparkles, MessageSquare, PhoneCall } from 'lucide-react';

export default function HelpModal({ isOpen, onClose, onOpenResources }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Header background accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-emerald-100 dark:bg-emerald-950/40 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-emerald-600/20" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                About HealthHaven
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safe, anonymous student mental & physical health space
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-600 dark:text-slate-300 max-h-[65vh] overflow-y-auto pr-1">
          
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>100% Student Privacy & Safety</span>
            </div>
            <p className="leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
              HealthHaven is designed with a privacy-first mindset. You can log daily moods, monitor physical vitality, ask for help on the Anonymous Peer Wall without disclosing your identity, and chat safely with MindPal AI.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Core Features Guide</span>
            </h4>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">Emotion Log:</strong> Track how you feel each day with intensity ratings, context tags (exams, sleep, workload), and personal journal notes.
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">Peer Haven:</strong> Share feelings anonymously, receive warm peer reactions (🤍 warmth, 🤝 support), and read comforting thoughts from fellow students.
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">MindPal AI:</strong> Your non-judgmental AI companion for validating feelings, cognitive reframing (CBT), and 5-4-3-2-1 sensory grounding.
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">Breathing & Soundscapes:</strong> Interactive 4-7-8 and Box breathing timers alongside synthesized rain, wave, and breeze soundscapes.
                </div>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60">
            <div className="flex items-center space-x-1.5 font-bold text-rose-700 dark:text-rose-300 mb-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>In Crisis or Need Urgent Help?</span>
            </div>
            <p className="text-[11px] text-rose-800 dark:text-rose-200 leading-relaxed mb-2">
              If you or someone you know is in immediate danger or severe emotional distress, please reach out to 24/7 crisis support immediately.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenResources();
              }}
              className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all shadow-xs"
            >
              View Crisis Helplines & Contacts →
            </button>
          </div>

        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
