import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Activity,
  Wind,
  Bot,
  MessageSquareHeart,
  Sun,
  MapPin,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function DailyPathGuide({ user }) {
  const navigate = useNavigate();

  const dailySteps = [
    {
      id: 'step-1',
      num: 1,
      title: 'Morning Heart & Emotion Check-in',
      purpose: 'Identify your emotional state & set intention for today.',
      icon: BookOpen,
      path: '/dashboard/myspace/emotionlog',
      btnText: 'Log Emotion & Intention'
    },
    {
      id: 'step-2',
      num: 2,
      title: 'Body Vitality & Hydration Check',
      purpose: 'Log your sleep recovery, drink water & do 1-min desk stretch.',
      icon: Activity,
      path: '/dashboard/myspace/physical',
      btnText: 'Check Hydration & Stretches'
    },
    {
      id: 'step-3',
      num: 3,
      title: 'Serenity Breathing & Soundscape',
      purpose: 'Engage in 3 minutes of Box Breathing or 4-7-8 relaxation.',
      icon: Wind,
      path: '/dashboard/calmandai/serenity',
      btnText: 'Start Breathing Exercise'
    },
    {
      id: 'step-4',
      num: 4,
      title: 'MindPal AI Thought Reframing',
      purpose: 'Reflect with MindPal or reframe 1 unhelpful thought.',
      icon: Bot,
      path: '/dashboard/calmandai/mindpal',
      btnText: 'Chat with MindPal'
    },
    {
      id: 'step-5',
      num: 5,
      title: 'Peer Support Connection',
      purpose: 'Read or leave 1 supportive word on the Peer Haven Wall.',
      icon: MessageSquareHeart,
      path: '/dashboard/connect/peerhaven',
      btnText: 'Visit Peer Haven'
    },
    {
      id: 'step-6',
      num: 6,
      title: 'Evening Gratitude Jar Moment',
      purpose: 'Save 1 happy memory from today to build long-term resilience.',
      icon: Sun,
      path: '/dashboard/myspace/homehub',
      btnText: 'Add Gratitude Note'
    }
  ];

  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('mindhaven_daily_path_completed');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['step-1', 'step-2']; // default initial progress for warm demo
  });

  useEffect(() => {
    localStorage.setItem('mindhaven_daily_path_completed', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const toggleStepCompleted = (stepId, e) => {
    e.stopPropagation();
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const resetPathProgress = () => {
    setCompletedSteps([]);
  };

  const progressPercent = Math.round((completedSteps.length / dailySteps.length) * 100);

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60 dark:border-stone-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800">
              🧭 Daily Holistic Wellness Roadmap
            </span>
            <span className="text-xs text-stone-400 font-serif">
              Step-by-step guidance
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Your Daily Mental Health Path</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            A guided routine designed to regulate emotions, recharge energy, and foster peer support daily.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-orange-600 dark:text-orange-400">
              {progressPercent}%
            </span>
            <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">
              {completedSteps.length} of {dailySteps.length} Complete
            </span>
          </div>
          <button
            onClick={resetPathProgress}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-all text-xs"
            title="Reset Today's Path Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Daily Path Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-[#FAF6EE] dark:bg-stone-900 rounded-full overflow-hidden border border-amber-200/50 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {progressPercent === 100 && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-center space-x-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Congratulations! You've completed your entire Daily Mental Health Path today 🎉</span>
          </div>
        )}
      </div>

      {/* Path Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {dailySteps.map((step) => {
          const Icon = step.icon;
          const isDone = completedSteps.includes(step.id);
          return (
            <div
              key={step.id}
              onClick={() => navigate(step.path)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start space-x-3.5 ${
                isDone
                  ? 'bg-amber-50/60 dark:bg-stone-900/80 border-amber-200/80 dark:border-stone-800 opacity-90'
                  : 'bg-[#FAF6EE] dark:bg-stone-900 border-amber-200/70 dark:border-stone-800 hover:border-orange-400 dark:hover:border-orange-600 shadow-xs'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={(e) => toggleStepCompleted(step.id, e)}
                className="mt-0.5 text-orange-600 dark:text-orange-400 hover:scale-110 transition-transform shrink-0 cursor-pointer"
                title={isDone ? 'Mark step as incomplete' : 'Mark step as completed'}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 fill-orange-500 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-amber-300 dark:text-stone-700" />
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isDone ? 'bg-amber-200/70 text-amber-900' : 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200'
                  }`}>
                    STEP {step.num}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    <span>Go</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className={`font-heading text-xs sm:text-sm font-bold truncate ${
                  isDone ? 'text-stone-600 dark:text-stone-400 line-through' : 'text-stone-900 dark:text-stone-100'
                }`}>
                  {step.title}
                </h3>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-snug font-serif">
                  {step.purpose}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
