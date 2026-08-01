import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
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
  Star
} from 'lucide-react';

export default function DuolingoDailyPath({ user }) {
  const navigate = useNavigate();

  const dailySteps = [
    {
      id: 'step-1',
      num: 1,
      title: 'Morning Heart Check-in',
      subtitle: 'Log your emotion & set today\'s intention',
      category: 'Heart Journal',
      icon: Heart,
      path: '/dashboard/myspace/emotionlog',
      color: 'from-rose-500 to-orange-500',
      bgColor: 'bg-rose-500',
      ringColor: 'ring-rose-400',
      offsetClass: 'translate-x-0' // Center
    },
    {
      id: 'step-2',
      num: 2,
      title: 'Body & Hydration Reset',
      subtitle: 'Log water intake & take a 1-min desk stretch',
      category: 'Physical Vitality',
      icon: Droplet,
      path: '/dashboard/myspace/physical',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500',
      ringColor: 'ring-amber-400',
      offsetClass: '-translate-x-12 sm:-translate-x-20' // Left
    },
    {
      id: 'step-3',
      num: 3,
      title: 'Serenity Breathing Break',
      subtitle: '3-min Box Breathing or 4-7-8 relaxation',
      category: 'Stillness & Audio',
      icon: Wind,
      path: '/dashboard/calmandai/serenity',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-500',
      ringColor: 'ring-orange-400',
      offsetClass: 'translate-x-12 sm:translate-x-20' // Right
    },
    {
      id: 'step-4',
      num: 4,
      title: 'MindPal AI Thought Reframe',
      subtitle: 'Chat with MindPal AI or reframe 1 anxious thought',
      category: 'Cognitive CBT',
      icon: Bot,
      path: '/dashboard/calmandai/mindpal',
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-600',
      ringColor: 'ring-amber-500',
      offsetClass: 'translate-x-0' // Center
    },
    {
      id: 'step-5',
      num: 5,
      title: 'Peer Support Connection',
      subtitle: 'Share or react to encouragement on Peer Wall',
      category: 'Community Haven',
      icon: MessageSquareHeart,
      path: '/dashboard/connect/peerhaven',
      color: 'from-orange-600 to-rose-600',
      bgColor: 'bg-orange-600',
      ringColor: 'ring-orange-500',
      offsetClass: '-translate-x-12 sm:-translate-x-20' // Left
    },
    {
      id: 'step-6',
      num: 6,
      title: 'Evening Gratitude Jar',
      subtitle: 'Save 1 happy memory from today to complete path',
      category: 'Happiness Jar',
      icon: Sun,
      path: '/dashboard/myspace/emotionlog',
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-yellow-500',
      ringColor: 'ring-yellow-400',
      offsetClass: 'translate-x-12 sm:translate-x-20' // Right
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
    return ['step-1']; // default 1st step unlocked/done for demo
  });

  const [lockedTooltip, setLockedTooltip] = useState(null);

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

  const handleStepAction = (step, index, e) => {
    e.stopPropagation();
    if (!isStepUnlocked(index)) {
      const prevStepNum = dailySteps[index - 1].num;
      setLockedTooltip(`🔒 Complete Step ${prevStepNum} (${dailySteps[index - 1].title}) first to unlock this path station!`);
      setTimeout(() => setLockedTooltip(null), 3500);
      return;
    }
    navigate(step.path);
  };

  const toggleCompleteStep = (stepId, index, e) => {
    e.stopPropagation();
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
    <div className="space-y-6 max-w-xl mx-auto py-2">
      
      {/* Top Banner with Today's Date & Duolingo Daily Refresh */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 sm:p-6 border border-amber-200/80 dark:border-stone-800 shadow-sm space-y-4 text-center relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 uppercase tracking-wider flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span>Daily Path • {formattedToday}</span>
            </span>
          </div>

          <button
            onClick={handleResetToday}
            className="text-[11px] font-bold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center space-x-1 transition-all"
            title="Reset Today's Path for Testing"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Today</span>
          </button>
        </div>

        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Today's Mental Health Quest
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-serif">
            Complete each station in order down the path to nourish your mind and body. Refreshes every midnight!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
            <span>Daily Completion</span>
            <span className="font-mono text-orange-600 dark:text-orange-400 font-extrabold">{progressPercent}% ({completedSteps.length}/{dailySteps.length})</span>
          </div>
          <div className="h-3.5 w-full bg-[#FAF6EE] dark:bg-stone-900 rounded-full overflow-hidden border border-amber-200/60 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Locked Tooltip Alert */}
        {lockedTooltip && (
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs font-bold animate-fadeIn">
            {lockedTooltip}
          </div>
        )}
      </div>

      {/* 🗺️ VERTICAL WINDING DUOLINGO PATH (Node Map) */}
      <div className="relative py-4 flex flex-col items-center space-y-12">
        
        {/* Decorative Winding Connecting Line */}
        <div className="absolute top-10 bottom-10 w-1 bg-gradient-to-b from-amber-300 via-orange-400 to-amber-500 dark:from-stone-800 dark:via-orange-950 dark:to-stone-800 rounded-full z-0 opacity-60" />

        {dailySteps.map((step, idx) => {
          const Icon = step.icon;
          const unlocked = isStepUnlocked(idx);
          const completed = isStepCompleted(step.id);
          const isNextActive = unlocked && !completed;

          return (
            <div
              key={step.id}
              className={`relative z-10 flex flex-col items-center transition-all duration-300 ${step.offsetClass}`}
            >
              
              {/* Active Crown / Star Marker */}
              {isNextActive && (
                <div className="mb-2 animate-bounce flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-orange-600 text-white shadow-lg flex items-center space-x-1 uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>START HERE</span>
                  </span>
                </div>
              )}

              {/* DUOLINGO CIRCULAR NODE BUTTON */}
              <button
                onClick={(e) => handleStepAction(step, idx, e)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group ${
                  completed
                    ? 'bg-gradient-to-tr from-emerald-500 to-green-600 text-white ring-4 ring-emerald-300 dark:ring-emerald-900 scale-100 hover:scale-105'
                    : isNextActive
                    ? `bg-gradient-to-tr ${step.color} text-white ring-8 ring-orange-400/40 dark:ring-orange-600/40 scale-110 animate-pulse`
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 ring-4 ring-stone-300/40 dark:ring-stone-700/40 cursor-not-allowed'
                }`}
              >
                {completed ? (
                  <CheckCircle2 className="w-10 h-10 text-white drop-shadow-md animate-scaleUp" />
                ) : unlocked ? (
                  <Icon className="w-9 h-9 sm:w-10 sm:h-10 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                ) : (
                  <Lock className="w-8 h-8 opacity-60" />
                )}

                {/* Step Number Badge */}
                <span className={`absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold shadow-sm ${
                  completed
                    ? 'bg-emerald-700 text-emerald-100'
                    : unlocked
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                    : 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                }`}>
                  STEP {step.num}
                </span>
              </button>

              {/* NODE CARD INFO */}
              <div
                onClick={(e) => handleStepAction(step, idx, e)}
                className={`mt-4 w-64 sm:w-72 bg-[#FFFDF9] dark:bg-[#262220] p-4 rounded-2xl border text-center transition-all shadow-xs space-y-1.5 cursor-pointer ${
                  isNextActive
                    ? 'border-orange-400 dark:border-orange-600 ring-2 ring-orange-500/30'
                    : completed
                    ? 'border-emerald-300 dark:border-emerald-800/60'
                    : 'border-amber-200/50 dark:border-stone-800 opacity-70'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                    {step.category}
                  </span>
                  {completed && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Done
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100">
                  {step.title}
                </h3>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed font-serif">
                  {step.subtitle}
                </p>

                {/* Interactive Action / Lock Button */}
                <div className="pt-2 flex items-center justify-center space-x-2">
                  <button
                    onClick={(e) => handleStepAction(step, idx, e)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 ${
                      completed
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200'
                        : unlocked
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {completed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Revisit Station</span>
                      </>
                    ) : unlocked ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Station</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </>
                    )}
                  </button>

                  {/* Manual Mark Done Toggle */}
                  {unlocked && (
                    <button
                      onClick={(e) => toggleCompleteStep(step.id, idx, e)}
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all text-xs"
                      title={completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-emerald-600 fill-emerald-600/20' : 'text-stone-400'}`} />
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}

        {/* End of Path Trophy / Celebration Node */}
        <div className="relative z-10 flex flex-col items-center pt-6 text-center space-y-2">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl ${
            progressPercent === 100
              ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-400 text-white border-amber-300 animate-bounce'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-300 dark:border-stone-700'
          }`}>
            <Star className="w-10 h-10 fill-current" />
          </div>
          <div>
            <h3 className="font-heading text-base font-extrabold text-stone-900 dark:text-stone-100">
              Daily Path Master Crown
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-serif">
              {progressPercent === 100
                ? '🎉 You finished today\'s quest path! Your mind & body are fully primed.'
                : 'Complete all 6 steps in order to claim today\'s crown.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
