import React, { useState } from 'react';
import {
  Heart,
  BookOpen,
  Sparkles,
  Wind,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Smile,
  Compass
} from 'lucide-react';

export default function OnboardingTutorialModal({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: Heart,
      badge: "Welcome to MindHaven 🌿",
      title: "Your Student Emotional Safe Space",
      desc: "MindHaven is a minimalistic, comforting platform built for students to track feelings, build resilience, and receive gentle guidance without judgment.",
      highlights: [
        "100% Private & Student-Focused",
        "Calming Dark & Light Design",
        "Built-in Crisis Safety & Support"
      ],
      color: "from-emerald-500 to-teal-500",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
    },
    {
      icon: BookOpen,
      badge: "My Space & Journaling 📖",
      title: "Track Your Emotions & Happiness Jar",
      desc: "Log daily feelings using quick emotion buttons, record private journal entries, and save small moments of joy inside your Happiness Jar.",
      highlights: [
        "Weekly Emotional Wellbeing Graphs",
        "Happiness Jar Gratitude Log",
        "Reflective Journaling Prompts"
      ],
      color: "from-indigo-500 to-purple-500",
      accentBg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
    },
    {
      icon: Compass,
      badge: "MindPal AI 🤖",
      title: "Empathetic Listener & CBT Tools",
      desc: "Chat with MindPal AI for empathetic listening, reframe negative thoughts using CBT techniques, or complete 5-4-3-2-1 sensory grounding exercises.",
      highlights: [
        "CBT Thought Reframer",
        "5-4-3-2-1 Grounding Exercises",
        "Strict Model Quota Protection"
      ],
      color: "from-purple-500 to-pink-500",
      accentBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300"
    },
    {
      icon: Wind,
      badge: "Serenity Corner 🌬️",
      title: "Breathing & Calming Soundscapes",
      desc: "Practice guided 4-7-8 breathing cycles to reduce anxiety and listen to soothing browser-generated ambient rain and ocean soundscapes.",
      highlights: [
        "Interactive 4-7-8 Breathing Pacer",
        "Continuous Background Soundscapes",
        "Instant Calming Mode"
      ],
      color: "from-teal-500 to-emerald-500",
      accentBg: "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300"
    },
    {
      icon: ShieldCheck,
      badge: "Support & Connect 🤝",
      title: "Peer Haven & 24/7 Crisis Lifelines",
      desc: "Share experiences anonymously with fellow students on Peer Haven or instantly connect to 24/7 emergency hotlines (988, 1767 SOS) whenever needed.",
      highlights: [
        "Anonymous Peer Advice Wall",
        "Direct 988 & 1767 Emergency Helplines",
        "Personal Safety Plan Checklist"
      ],
      color: "from-amber-500 to-orange-500",
      accentBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
    }
  ];

  const activeStep = steps[currentStep];
  const Icon = activeStep.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header & Progress */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${activeStep.accentBg}`}>
              {activeStep.badge}
            </span>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center space-x-1"
          >
            <span>Skip</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Main Visual Icon Card */}
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${activeStep.color} text-white flex items-center justify-center shadow-lg shrink-0`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                {activeStep.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {activeStep.desc}
              </p>
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Key Features:
            </span>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {activeStep.highlights.map((h, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-8 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="p-6 pt-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1 ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
          >
            <span>{currentStep === steps.length - 1 ? 'Start Exploring MindHaven 🌿' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
