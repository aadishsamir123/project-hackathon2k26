import React, { useState, useEffect } from 'react';
import {
  Activity,
  Droplet,
  Moon,
  Zap,
  Eye,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Plus,
  Play,
  Pause
} from 'lucide-react';
import { markDailyPathStepCompleted } from '../services/firestore.js';
import PagePurposeHeader from '../components/common/PagePurposeHeader.jsx';

export default function PhysicalWellbeing({ user }) {
  // Hydration state
  const [waterCups, setWaterCups] = useState(() => {
    const saved = localStorage.getItem('mindhaven_water_count');
    return saved ? parseInt(saved, 10) : 3;
  });

  // Sleep state — persisted to localStorage
  const [sleepHours, setSleepHours] = useState(() => {
    const saved = localStorage.getItem('mindhaven_sleep_hours');
    return saved ? parseFloat(saved) : 7;
  });
  const [sleepQuality, setSleepQuality] = useState(() => {
    return localStorage.getItem('mindhaven_sleep_quality') || 'Restful';
  });
  const [sleepSaved, setSleepSaved] = useState(false);

  // Eye Rest 20-20-20 Timer state
  const [eyeTimerActive, setEyeTimerActive] = useState(false);
  const [eyeSeconds, setEyeSeconds] = useState(20 * 60); // 20 min

  // Physical Stretches Active Step
  const [activeStretchIndex, setActiveStretchIndex] = useState(0);

  const stretches = [
    {
      title: "Neck & Shoulder Release",
      desc: "Gently tilt your head toward your right shoulder for 15 seconds, then left. Roll shoulders backward 5 times.",
      duration: "30 secs",
      icon: "🧘‍♂️",
      tip: "Relieves tension from staring at textbooks and laptops."
    },
    {
      title: "Desk Wrist & Finger Flex",
      desc: "Extend right arm forward, palm up. Gently pull fingers back with left hand. Switch arms.",
      duration: "30 secs",
      icon: "✋",
      tip: "Prevents strain from heavy typing and writing notes."
    },
    {
      title: "Spine Lengthening Stretch",
      desc: "Sit tall, clasp hands overhead, and stretch upward toward the ceiling while taking 3 slow deep breaths.",
      duration: "30 secs",
      icon: "🌱",
      tip: "Improves posture and increases oxygen flow to your brain."
    }
  ];

  const handleAddWater = () => {
    const nextCount = Math.min(12, waterCups + 1);
    setWaterCups(nextCount);
    localStorage.setItem('mindhaven_water_count', nextCount.toString());
    markDailyPathStepCompleted('step-2');
  };

  const handleResetWater = () => {
    setWaterCups(0);
    localStorage.setItem('mindhaven_water_count', '0');
  };

  const handleSaveSleep = (e) => {
    e.preventDefault();
    // Persist sleep data to localStorage
    localStorage.setItem('mindhaven_sleep_hours', sleepHours.toString());
    localStorage.setItem('mindhaven_sleep_quality', sleepQuality);
    markDailyPathStepCompleted('step-2');
    setSleepSaved(true);
    setTimeout(() => setSleepSaved(false), 3000);
  };

  useEffect(() => {
    let interval = null;
    if (eyeTimerActive && eyeSeconds > 0) {
      interval = setInterval(() => setEyeSeconds((s) => s - 1), 1000);
    } else if (eyeSeconds === 0) {
      setEyeTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [eyeTimerActive, eyeSeconds]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Mental Health Purpose Header */}
      <PagePurposeHeader
        badge="Somatic Vitality & Rest"
        title="Student Body & Mind Harmony"
        purpose="Regulate your physical body to support your emotional health — track hydration, sleep recovery, 20-20-20 eye strain breaks, and ergonomic study stretches."
        evidence="Dehydration directly spikes cortisol levels and reduces cognitive processing. Somatic stretches trigger parasympathetic rest-and-digest states."
        dailyAction="Log your daily glasses of water, record last night's sleep quality, and take a 20-second screen break."
        stepNumber={2}
        totalSteps={6}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Hydration Tracker Card */}
        <div id="tour-hydration-card" className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5 fill-current text-orange-600" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-stone-800 dark:text-stone-100">
                  Daily Hydration Log
                </h3>
                <p className="text-[11px] text-stone-400">Target: 8 Cups (2 Liters)</p>
              </div>
            </div>
            <button
              onClick={handleResetWater}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-all text-xs"
              title="Reset counter for today"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">
              {waterCups} / 8 <span className="text-sm font-normal text-stone-400">cups</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {waterCups >= 8 ? '🎉 Daily hydration target reached!' : `${8 - waterCups} more cups to reach your goal.`}
            </p>
          </div>

          <button
            onClick={handleAddWater}
            className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Glass of Water (+250ml)</span>
          </button>
        </div>

        {/* 2. Sleep Quality Tracker */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold">
              <Moon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-stone-800 dark:text-stone-100">
                Sleep Recovery Tracker
              </h3>
              <p className="text-[11px] text-stone-400">Log nightly rest & energy</p>
            </div>
          </div>

          <form onSubmit={handleSaveSleep} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-700 dark:text-stone-300">
                <span>Duration:</span>
                <span className="font-bold text-orange-600">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-orange-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-700 dark:text-stone-300 font-medium">Quality:</label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="w-full bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl p-2.5 text-xs text-stone-800 dark:text-stone-100"
              >
                <option value="Restful">🌟 Restful & Energized</option>
                <option value="Fair">🌤️ Fair / Light Sleep</option>
                <option value="Restless">🌧️ Restless / Exam Stress</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-xs"
            >
              {sleepSaved ? 'Saved to Health Log ✓' : 'Save Sleep Entry'}
            </button>
          </form>
        </div>

        {/* 3. Eye Rest 20-20-20 Break Timer */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-stone-800 dark:text-stone-100">
                20-20-20 Eye Strain Break
              </h3>
              <p className="text-[11px] text-stone-400">Look 20ft away every 20m</p>
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-3xl font-extrabold font-mono text-orange-600 dark:text-orange-400">
              {formatTime(eyeSeconds)}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {eyeSeconds === 0 ? '👀 Take a 20-second break and look 20 feet away!' : 'Countdown until next screen break.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEyeTimerActive(!eyeTimerActive)}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all text-white shadow-xs flex items-center justify-center space-x-1.5 ${
                eyeTimerActive ? 'bg-amber-800' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {eyeTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{eyeTimerActive ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={() => {
                setEyeTimerActive(false);
                setEyeSeconds(20 * 60);
              }}
              className="p-3 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800 transition-all text-xs"
              title="Reset timer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Guided Desk Stretches Section */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 sm:p-8 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-amber-200/60 dark:border-stone-800">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-orange-700 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-stone-800 dark:text-stone-100">
              Quick Study Stretches (1-Minute Resets)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Simple ergonomics exercises to release desk tension during long study sessions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stretches.map((s, idx) => {
            const isSel = activeStretchIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStretchIndex(idx)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  isSel
                    ? 'bg-amber-100/80 dark:bg-amber-950/80 border-orange-400 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                    : 'bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/60 dark:border-stone-700 text-stone-600 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    {s.duration}
                  </span>
                </div>

                <h4 className="font-heading text-sm font-bold text-stone-800 dark:text-stone-100">
                  {s.title}
                </h4>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {s.desc}
                </p>

                <p className="text-[11px] text-orange-700 dark:text-orange-300 italic pt-1 border-t border-amber-200/40">
                  💡 {s.tip}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
