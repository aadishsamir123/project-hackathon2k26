import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles
} from 'lucide-react';
import { completeTutorialFlag } from '../../services/firestore.js';

export default function GuidedTourOverlay({ isOpen, user, onClose }) {
  // If tour is not active, return null immediately so nothing renders in DOM
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const tourSteps = [
    {
      path: '/dashboard/myspace/homehub',
      targetId: 'tour-mindful-path',
      stepNum: '1 / 7',
      title: 'Mindful Sanctuary Path',
      text: 'Explore your daily 6-step path for emotional tracking, body rest, and care.'
    },
    {
      path: '/dashboard/myspace/emotionlog',
      targetId: 'tour-emotion-entry',
      stepNum: '2 / 7',
      title: 'Private Reflection Journal',
      text: 'Log your feelings, intensity score, and context tags privately.'
    },
    {
      path: '/dashboard/myspace/physical',
      targetId: 'tour-hydration-card',
      stepNum: '3 / 7',
      title: 'Body Vitality & Hydration',
      text: 'Log daily water glasses, track sleep quality, and take 20-20-20 eye breaks.'
    },
    {
      path: '/dashboard/calmandai/serenity',
      targetId: 'tour-serenity-header',
      stepNum: '4 / 7',
      title: 'Guided Breathing Orb',
      text: 'Tap the glowing central orb directly to start 4-7-8 or Equal Calm breathing.'
    },
    {
      path: '/dashboard/calmandai/mindpal',
      targetId: 'tour-mindpal-header',
      stepNum: '5 / 7',
      title: 'MindPal AI Companion',
      text: 'Chat with an empathetic listener or reframe anxious thoughts into clear insights.'
    },
    {
      path: '/dashboard/connect/peerhaven',
      targetId: 'tour-peer-wall',
      stepNum: '6 / 7',
      title: 'Peer Haven Support Wall',
      text: 'Read and post 100% anonymous support messages with fellow students.'
    },
    {
      path: '/dashboard/connect/resources',
      targetId: 'tour-crisis-banner',
      stepNum: '7 / 7',
      title: '24/7 Immediate Crisis Lines',
      text: 'Instant access to free, confidential SOS 1767 and student emergency hotlines.'
    }
  ];

  const activeStep = tourSteps[currentStep] || tourSteps[0];

  // Navigate to step path if location differs
  useEffect(() => {
    if (location.pathname !== activeStep.path) {
      navigate(activeStep.path);
    }
  }, [currentStep, activeStep.path]);

  // Track target element bounding rectangle
  useEffect(() => {
    const updatePosition = () => {
      const el = document.getElementById(activeStep.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        setTargetRect(null);
      }
    };

    updatePosition();
    const timeout = setTimeout(updatePosition, 300);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep, location.pathname, activeStep.targetId]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      if (user?.uid) {
        await completeTutorialFlag(user.uid);
      }
    } catch (e) {
      console.warn("Complete tutorial flag warning:", e);
    } finally {
      if (onClose) onClose();
      navigate('/dashboard/myspace/homehub');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      
      {/* Target Element Glowing Orange Spotlight Ring */}
      {targetRect && (
        <div
          className="fixed transition-all duration-500 rounded-3xl border-2 border-orange-500 ring-4 ring-orange-500/40 shadow-[0_0_35px_rgba(234,88,12,0.45)] pointer-events-none animate-pulse-soft"
          style={{
            top: `${Math.max(10, targetRect.top - 8)}px`,
            left: `${Math.max(10, targetRect.left - 8)}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`
          }}
        />
      )}

      {/* Floating Spotlight Popover Tooltip */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-[99999] transition-all duration-300 w-[92vw] max-w-sm"
        style={
          targetRect && window.innerWidth >= 640
            ? {
                top: `${Math.min(window.innerHeight - 220, Math.max(80, targetRect.top + targetRect.height + 16))}px`,
                left: `${Math.min(window.innerWidth - 380, Math.max(20, targetRect.left))}px`,
                transform: 'none'
              }
            : {}
        }
      >
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/80 dark:border-stone-700 shadow-2xl space-y-3">
          
          {/* Header & Close */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-orange-700 dark:text-orange-300">
              {activeStep.stepNum}
            </span>

            <button
              onClick={handleFinish}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-amber-100/60 transition-all text-xs"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-1">
            <h4 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>{activeStep.title}</span>
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {activeStep.text}
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-amber-200/50 dark:border-stone-800">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-30 text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleFinish}
              className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-semibold"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-xs flex items-center space-x-1"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
