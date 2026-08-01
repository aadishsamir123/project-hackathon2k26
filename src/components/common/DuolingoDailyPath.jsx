import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  Play,
  Heart,
  Droplet,
  Wind,
  Bot,
  MessageSquareHeart,
  Sun,
  Crown,
  RotateCcw,
  ArrowRight,
  Flame,
  Star,
  X,
  Sparkles,
  Info
} from 'lucide-react';

export default function DuolingoDailyPath({ user }) {
  const navigate = useNavigate();

  const dailySteps = [
    {
      id: 'step-1',
      num: 1,
      title: 'Morning Mood Check-in',
      subtitle: 'Log your current emotion & set today\'s mental health intention.',
      category: 'Heart Journal',
      icon: Heart,
      path: '/dashboard/myspace/emotionlog',
      color: 'from-rose-500 to-orange-500',
      offsetClass: 'translate-x-0'
    },
    {
      id: 'step-2',
      num: 2,
      title: 'Body & Hydration Reset',
      subtitle: 'Record your daily water intake & do a 1-minute ergonomics stretch.',
      category: 'Physical Vitality',
      icon: Droplet,
      path: '/dashboard/myspace/physical',
      color: 'from-amber-500 to-orange-500',
      offsetClass: '-translate-x-12 sm:-translate-x-20'
    },
    {
      id: 'step-3',
      num: 3,
      title: 'Serenity Breathing Break',
      subtitle: '3-minute Box Breathing or 4-7-8 relaxation for vagal nerve calm.',
      category: 'Stillness & Audio',
      icon: Wind,
      path: '/dashboard/calmandai/serenity',
      color: 'from-orange-500 to-amber-600',
      offsetClass: 'translate-x-12 sm:translate-x-20'
    },
    {
      id: 'step-4',
      num: 4,
      title: 'MindPal AI Thought Reframe',
      subtitle: 'Chat with MindPal AI or transform 1 anxious thought into CBT clarity.',
      category: 'Cognitive CBT',
      icon: Bot,
      path: '/dashboard/calmandai/mindpal',
      color: 'from-amber-600 to-orange-600',
      offsetClass: 'translate-x-0'
    },
    {
      id: 'step-5',
      num: 5,
      title: 'Peer Support Connection',
      subtitle: 'Send anonymous encouragement or react to fellow students on the Peer Wall.',
      category: 'Community Haven',
      icon: MessageSquareHeart,
      path: '/dashboard/connect/peerhaven',
      color: 'from-orange-600 to-rose-600',
      offsetClass: '-translate-x-12 sm:-translate-x-20'
    },
    {
      id: 'step-6',
      num: 6,
      title: 'Evening Gratitude Jar',
      subtitle: 'Save 1 happy memory from today to complete your daily quest path.',
      category: 'Happiness Jar',
      icon: Sun,
      path: '/dashboard/myspace/emotionlog',
      color: 'from-amber-500 to-yellow-500',
      offsetClass: 'translate-x-12 sm:translate-x-20'
    }
  ];

  const getTodayStr = () => new Date().toISOString().slice(0, 10);

  const [completedSteps, setCompletedSteps] = useState(() => {
    const savedDate = localStorage.getItem('mindhaven_daily_path_date');
    const todayStr = getTodayStr();
    if (savedDate !== todayStr) {
      localStorage.setItem('mindhaven_daily_path_date', todayStr);
      localStorage.setItem('mindhaven_daily_path_completed', JSON.stringify([]));
      return [];
    }
    const saved = localStorage.getItem('mindhaven_daily_path_completed');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['step-1']; // default initial progress for warm demo
  });

  const [selectedModalStep, setSelectedModalStep] = useState(null);

  useEffect(() => {
    localStorage.setItem('mindhaven_daily_path_completed', JSON.stringify(completedSteps));
    localStorage.setItem('mindhaven_daily_path_date', getTodayStr());
  }, [completedSteps]);

  const isStepUnlocked = (index) => {
    if (index === 0) return true;
    return completedSteps.includes(dailySteps[index - 1].id);
  };

  const isStepCompleted = (stepId) => {
    return completedSteps.includes(stepId);
  };

  const handleNodeClick = (step, idx) => {
    setSelectedModalStep({ ...step, index: idx });
  };

  const handleStartStation = (path) => {
    setSelectedModalStep(null);
    navigate(path);
  };

  const toggleCompleteStep = (stepId, index) => {
    if (!isStepUnlocked(index)) return;
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleResetToday = () => {
    setCompletedSteps([]);
  };

  const progressPercent = Math.round((completedSteps.length / dailySteps.length) * 100);
  const formattedToday = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6 max-w-xl mx-auto py-2 font-sans">
      
      {/* Top Banner: Simple, Clean Progress Header */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-3 text-center">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 flex items-center space-x-1 font-sans">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span>Daily Path • {formattedToday}</span>
          </span>

          <button
            onClick={handleResetToday}
            className="text-xs font-bold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center space-x-1 font-sans transition-all cursor-pointer"
            title="Reset Today's Path"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Path</span>
          </button>
        </div>

        <div>
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Daily Mental Health Quest
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-sans">
            Tap any unlocked node to view details & start the station.
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="space-y-1 pt-1 font-sans">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
            <span>Daily Progress</span>
            <span className="font-mono text-orange-600 dark:text-orange-400">{progressPercent}% ({completedSteps.length}/{dailySteps.length})</span>
          </div>
          <div className="h-2.5 w-full bg-[#FAF6EE] dark:bg-stone-900 rounded-full overflow-hidden border border-amber-200/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 🗺️ MINIMAL WINDING DUOLINGO ICON PATH */}
      <div className="relative py-6 flex flex-col items-center space-y-12">
        
        {/* Curved Center Connector Line */}
        <div className="absolute top-12 bottom-12 w-1.5 bg-gradient-to-b from-amber-300 via-orange-400 to-amber-500 dark:from-stone-800 dark:via-orange-950 dark:to-stone-800 rounded-full z-0 opacity-60" />

        {dailySteps.map((step, idx) => {
          const Icon = step.icon;
          const unlocked = isStepUnlocked(idx);
          const completed = isStepCompleted(step.id);
          const isNextActive = unlocked && !completed;

          return (
            <div
              key={step.id}
              className={`relative z-10 flex flex-col items-center transition-all duration-300 font-sans ${step.offsetClass}`}
            >
              {/* Pulsing Active Marker */}
              {isNextActive && (
                <div className="mb-2 animate-bounce flex items-center justify-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-600 text-white shadow-md flex items-center space-x-1 font-sans uppercase">
                    <Crown className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>START HERE</span>
                  </span>
                </div>
              )}

              {/* ICON NODE BUTTON */}
              <button
                onClick={() => handleNodeClick(step, idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer group ${
                  completed
                    ? 'bg-gradient-to-tr from-emerald-500 to-green-600 text-white ring-4 ring-emerald-300 dark:ring-emerald-900 scale-100 hover:scale-110'
                    : isNextActive
                    ? `bg-gradient-to-tr ${step.color} text-white ring-8 ring-orange-400/40 dark:ring-orange-600/40 scale-110 animate-pulse`
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 ring-4 ring-stone-300/30 dark:ring-stone-700/30 hover:scale-105'
                }`}
                title={unlocked ? `${step.title} (Click for details)` : `Step ${step.num} is Locked`}
              >
                {completed ? (
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
                ) : unlocked ? (
                  <Icon className="w-7 h-7 sm:w-9 sm:h-9 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                ) : (
                  <Lock className="w-6 h-6 opacity-60" />
                )}

                {/* Step Number Tag */}
                <span className={`absolute -bottom-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-xs ${
                  completed
                    ? 'bg-emerald-700 text-emerald-100'
                    : unlocked
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                    : 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                }`}>
                  {step.num}
                </span>
              </button>

              {/* Minimal Node Title Label */}
              <div
                onClick={() => handleNodeClick(step, idx)}
                className="mt-3 cursor-pointer text-center space-y-0.5 max-w-[150px]"
              >
                <h4 className={`text-xs font-bold font-sans transition-colors ${
                  completed
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : unlocked
                    ? 'text-stone-900 dark:text-stone-100 hover:text-orange-600'
                    : 'text-stone-400 dark:text-stone-600'
                }`}>
                  {step.title}
                </h4>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-sans block">
                  {completed ? '✓ Completed' : unlocked ? 'Click for description' : '🔒 Locked'}
                </span>
              </div>

            </div>
          );
        })}

        {/* Master Trophy Node */}
        <div className="relative z-10 flex flex-col items-center pt-4 text-center space-y-1.5 font-sans">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg ${
            progressPercent === 100
              ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-400 text-white border-amber-300 animate-bounce'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-300 dark:border-stone-700'
          }`}>
            <Star className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-stone-900 dark:text-stone-100 font-sans">
              Daily Path Master Crown
            </h4>
            <p className="text-[11px] text-stone-400 font-sans">
              {progressPercent === 100 ? '🎉 All stations completed today!' : 'Complete steps 1–6 in order to claim.'}
            </p>
          </div>
        </div>

      </div>

      {/* 💡 INTUITIVE STATION DESCRIPTION MODAL */}
      {selectedModalStep && (() => {
        const step = selectedModalStep;
        const idx = selectedModalStep.index;
        const unlocked = isStepUnlocked(idx);
        const completed = isStepCompleted(step.id);
        const Icon = step.icon;

        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
            {/* Backdrop */}
            <div
              onClick={() => setSelectedModalStep(null)}
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs animate-fadeIn"
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-md bg-[#FAF6EE] dark:bg-[#1C1917] rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-2xl p-6 space-y-5 z-[10000] animate-scaleUp">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-stone-800">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
                    completed ? 'bg-emerald-600' : unlocked ? 'bg-orange-600' : 'bg-stone-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300 font-sans block">
                      Station {step.num} of 6 • {step.category}
                    </span>
                    <h3 className="font-sans text-base font-extrabold text-stone-900 dark:text-stone-100">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedModalStep(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                {completed ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 flex items-center space-x-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Station Completed Today</span>
                  </span>
                ) : unlocked ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200 border border-orange-300 flex items-center space-x-1 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Station Unlocked & Active</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400 border border-stone-300 flex items-center space-x-1 font-sans">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked — Complete Step {dailySteps[idx - 1].num} First</span>
                  </span>
                )}
              </div>

              {/* Description Body */}
              <div className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/70 dark:border-stone-800 space-y-2">
                <span className="text-[11px] font-bold uppercase text-stone-400 font-sans block">Station Description</span>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  {step.subtitle}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-amber-200/60 dark:border-stone-800 flex items-center justify-between gap-3">
                {unlocked ? (
                  <>
                    <button
                      onClick={() => handleStartStation(step.path)}
                      className="flex-1 py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer font-sans"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{completed ? 'Revisit Station' : 'Start Station Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleCompleteStep(step.id, idx)}
                      className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-amber-100/60 transition-all cursor-pointer font-sans"
                      title={completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-emerald-600 fill-emerald-600/20' : 'text-stone-400'}`} />
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs font-bold text-stone-500 font-sans">
                    🔒 Complete <strong className="text-stone-800 dark:text-stone-200">Step {dailySteps[idx - 1].num}: {dailySteps[idx - 1].title}</strong> to unlock this station!
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
