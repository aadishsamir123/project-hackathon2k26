import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Heart,
  Activity,
  Wind,
  ShieldCheck,
  MessageSquareHeart
} from 'lucide-react';

export default function GuidedTourOverlay({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const tourSteps = [
    {
      path: '/dashboard/myspace/homehub',
      targetId: 'tour-home-hub',
      badge: 'Step 1 of 6 · Home Sanctuary',
      title: 'Welcome to Your Home Hub 🌿',
      icon: Heart,
      color: 'from-emerald-500 to-teal-500',
      description: 'Your central hub for tracking daily emotions, recording quick feelings, and building your Happiness Jar collection.',
      highlight: 'Notice your weekly happiness index and daily affirmation at the top.'
    },
    {
      path: '/dashboard/myspace/physical',
      targetId: 'tour-physical-header',
      badge: 'Step 2 of 6 · Physical Vitality',
      title: 'Physical Wellbeing & Movement ⚡',
      icon: Activity,
      color: 'from-sky-500 to-indigo-500',
      description: 'Physical health powers emotional health! Track hydration, sleep quality, 20-20-20 eye rest breaks, and guided desk stretches.',
      highlight: 'Use the 1-click hydration tracker and study stretch guides.'
    },
    {
      path: '/dashboard/calmandai/mindpal',
      targetId: 'tour-mindpal-header',
      badge: 'Step 3 of 6 · MindPal AI Companion',
      title: 'Empathetic AI & CBT Reframer 🤖',
      icon: Compass,
      color: 'from-purple-500 to-pink-500',
      description: 'Talk with MindPal AI for empathetic support, practice CBT thought reframing, or follow 5-4-3-2-1 sensory grounding.',
      highlight: 'Your conversations are private and protected by strict model quota rules.'
    },
    {
      path: '/dashboard/calmandai/serenity',
      targetId: 'tour-serenity-header',
      badge: 'Step 4 of 6 · Serenity Corner',
      title: 'Breathing Exercises & Soundscapes 🌬️',
      icon: Wind,
      color: 'from-teal-500 to-emerald-500',
      description: 'Relax with animated 4-7-8 breathing exercises and browser-synthesized ambient rain and ocean soundscapes.',
      highlight: 'Click the ambient audio toggle in the top bar anytime to play calm audio.'
    },
    {
      path: '/dashboard/connect/peerhaven',
      targetId: 'tour-peerhaven-header',
      badge: 'Step 5 of 6 · Peer Support',
      title: 'Peer Haven Anonymous Wall 🤝',
      icon: MessageSquareHeart,
      color: 'from-indigo-500 to-purple-500',
      description: 'Share experiences and offer warm encouragement to fellow students completely anonymously.',
      highlight: 'Post a supportive note or send a warm reaction.'
    },
    {
      path: '/dashboard/connect/resources',
      targetId: 'tour-crisis-header',
      badge: 'Step 6 of 6 · Help & Crisis',
      title: '24/7 Safety & Hotlines 📞',
      icon: ShieldCheck,
      color: 'from-amber-500 to-rose-500',
      description: 'Access 24/7 professional hotlines (988, 1767 SOS) and your step-by-step Personal Safety Plan whenever needed.',
      highlight: 'Always available from the top safety banner.'
    }
  ];

  const step = tourSteps[currentStep];

  // Navigate to current step path when step changes
  useEffect(() => {
    if (isOpen && step && location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [isOpen, currentStep, step, navigate, location.pathname]);

  // Scroll target element into view and apply highlight outline
  useEffect(() => {
    if (!isOpen || !step) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-emerald-500/80', 'ring-offset-4', 'transition-all', 'duration-500');
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      const el = document.getElementById(step.targetId);
      if (el) {
        el.classList.remove('ring-4', 'ring-emerald-500/80', 'ring-offset-4');
      }
    };
  }, [isOpen, currentStep, step]);

  if (!isOpen) return null;

  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-slideUp">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 rounded-3xl shadow-2xl p-5 space-y-4 ring-1 ring-slate-900/5">
        
        {/* Step Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/80">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {step.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center space-x-1"
          >
            <span>Skip Tour</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Card */}
        <div className="flex items-start space-x-3.5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md shrink-0 mt-0.5`}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
              {step.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {step.description}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              ✨ {step.highlight}
            </p>
          </div>
        </div>

        {/* Progress Bar & Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/80">
          {/* Progress dots */}
          <div className="flex items-center space-x-1.5">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-6 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1 ${
                currentStep === 0
                  ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Finish Tour 🌿' : 'Next Page'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
