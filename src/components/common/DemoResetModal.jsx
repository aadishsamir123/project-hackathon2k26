import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  RotateCcw,
  CheckSquare,
  Square,
  AlertCircle,
  Sparkles,
  BookOpen,
  Activity,
  MessageSquareHeart,
  Bot,
  UserCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { resetUserDataForDemo } from '../../services/firestore.js';

export default function DemoResetModal({ isOpen, onClose, user, onResetSuccess }) {
  const [selectedModules, setSelectedModules] = useState({
    mood: true,
    physical: true,
    community: true,
    ai: true,
    profile: true
  });
  const [isResetting, setIsResetting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const modulesList = [
    {
      key: 'mood',
      title: 'Heart Journal & Mood Logs',
      desc: 'Clears custom mood entries & seeds 7 days of realistic mood logs and 5 gratitude memories.',
      icon: BookOpen
    },
    {
      key: 'physical',
      title: 'Body & Physical Vitality Metrics',
      desc: 'Resets hydration (8 cups), sleep quality (8 hrs Restful), and ergonomics stretch logs.',
      icon: Activity
    },
    {
      key: 'community',
      title: 'Anonymous Community Help Wall',
      desc: 'Resets your peer posts & comments to rich prefilled encouragement messages.',
      icon: MessageSquareHeart
    },
    {
      key: 'ai',
      title: 'MindPal AI Companion Chat',
      desc: 'Clears chat history and resets CBT thought reframer to a fresh empathetic state.',
      icon: Bot
    },
    {
      key: 'profile',
      title: 'User Profile & Daily Path Progress',
      desc: 'Resets daily path completion, streak stats, and tutorial status for your account.',
      icon: UserCheck
    }
  ];

  const handleToggleModule = (key) => {
    setSelectedModules((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedModules).every(Boolean);
    const nextState = !allSelected;
    setSelectedModules({
      mood: nextState,
      physical: nextState,
      community: nextState,
      ai: nextState,
      profile: nextState
    });
  };

  const handleConfirmReset = async () => {
    if (!user?.uid) return;
    setIsResetting(true);
    try {
      await resetUserDataForDemo(user.uid, selectedModules);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setIsResetting(false);
        if (onResetSuccess) onResetSuccess();
        onClose();
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.warn("Demo reset error:", err);
      setIsResetting(false);
    }
  };

  const selectedCount = Object.values(selectedModules).filter(Boolean).length;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !isResetting && onClose()}
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs animate-fadeIn"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#FAF6EE] dark:bg-[#1C1917] rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-2xl p-6 space-y-5 z-[10000] max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100">
                Reset Data for Demo
              </h2>
              <span className="text-[11px] font-mono text-orange-700 dark:text-orange-300">
                Debug Mode • Target User: {user?.email || user?.uid}
              </span>
            </div>
          </div>

          <button
            onClick={() => !isResetting && onClose()}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Note */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
            <span>Hackathon Demo Data Reset</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-300/80">
            This operation will delete data <strong>ONLY for your user account</strong> (`{user?.uid?.slice(0, 8)}...`). Other users in Firestore will remain completely untouched. Selected modules will be prefilled with rich hackathon demo data.
          </p>
        </div>

        {/* Checkbox Menu Header */}
        <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 px-1">
          <span>Select Modules to Reset:</span>
          <button
            onClick={handleSelectAll}
            className="text-orange-700 dark:text-orange-300 hover:underline cursor-pointer font-semibold text-[11px]"
          >
            {Object.values(selectedModules).every(Boolean) ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Checkbox Menu List */}
        <div className="space-y-2.5">
          {modulesList.map((mod) => {
            const isChecked = selectedModules[mod.key];
            const Icon = mod.icon;
            return (
              <div
                key={mod.key}
                onClick={() => handleToggleModule(mod.key)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-[#FFFDF9] dark:bg-[#262220] border-orange-400 dark:border-orange-500 shadow-xs'
                    : 'bg-[#FAF6EE]/50 dark:bg-stone-900/50 border-amber-200/50 dark:border-stone-800 opacity-60'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-orange-600 dark:text-orange-400 shrink-0 cursor-pointer"
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-orange-500 text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-amber-300 dark:text-stone-700" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-orange-600 shrink-0" />
                    <h3 className="font-heading text-xs font-bold text-stone-900 dark:text-stone-100">
                      {mod.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    {mod.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Successfully deleted portal data & prefilled demo metrics!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-amber-200/60 dark:border-stone-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isResetting}
            className="px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-amber-100/60 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmReset}
            disabled={isResetting || selectedCount === 0}
            className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
          >
            {isResetting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Resetting & Prefilling ({selectedCount})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Reset Selected Data ({selectedCount})</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
