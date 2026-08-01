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

export default function PhysicalWellbeing({ user }) {
  // Hydration state
  const [waterCups, setWaterCups] = useState(() => {
    const saved = localStorage.getItem('mindhaven_water_count');
    return saved ? parseInt(saved, 10) : 3;
  });

  // Sleep state
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState('Restful');
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
      title: "Seated Spine Lengthening",
      desc: "Sit tall, place left hand on right knee, and gently twist torso to the right. Breathe deeply 3 times. Switch sides.",
      duration: "45 secs",
      icon: "✨",
      tip: "Re-engages posture and boosts oxygen flow to your brain."
    }
  ];

  // Hydration handler
  const handleAddWater = () => {
    const nextCount = Math.min(waterCups + 1, 12);
    setWaterCups(nextCount);
    localStorage.setItem('mindhaven_water_count', nextCount.toString());
  };

  const handleResetWater = () => {
    setWaterCups(0);
    localStorage.setItem('mindhaven_water_count', '0');
  };

  // Sleep Save handler
  const handleSaveSleep = (e) => {
    e.preventDefault();
    setSleepSaved(true);
    setTimeout(() => setSleepSaved(false), 3000);
  };

  // Eye Timer Countdown
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
      
      {/* Header */}
      <div id="tour-physical-header" className="space-y-1">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
          Physical Vitality & Movement ⚡
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Student Body & Mind Harmony
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Physical wellbeing directly powers your emotional health. Track hydration, sleep quality, eye breaks, and quick study stretches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Hydration Tracker Card */}
        <div id="tour-hydration-card" className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100">
                  Daily Hydration Log
                </h3>
                <p className="text-[11px] text-slate-400">Target: 8 Cups (2 Liters)</p>
              </div>
            </div>
            <button
              onClick={handleResetWater}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-xs"
              title="Reset counter for today"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
              {waterCups} / 8 <span className="text-sm font-normal text-slate-400">cups</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {waterCups >= 8 ? '🎉 Hydration Goal Reached!' : `${8 - waterCups} cups left for optimal focus.`}
            </p>
          </div>

          {/* Water Cup Grid */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`h-9 rounded-xl flex items-center justify-center transition-all ${
                  i < waterCups
                    ? 'bg-sky-500 text-white shadow-xs scale-105'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-slate-300 dark:text-slate-700'
                }`}
              >
                <Droplet className="w-4 h-4" />
              </div>
            ))}
          </div>

          <button
            onClick={handleAddWater}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Drink 1 Cup (+250ml)</span>
          </button>
        </div>

        {/* 2. Sleep Quality Tracker */}
        <div id="tour-sleep-card" className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100">
                  Sleep & Recovery
                </h3>
                <p className="text-[11px] text-slate-400">Log nightly rest quality</p>
              </div>
            </div>
            {sleepSaved && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Logged!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSleep} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Hours Slept</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Sleep Feeling
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Restful', 'Interrupted', 'Late Study'].map((q) => (
                  <button
                    type="button"
                    key={q}
                    onClick={() => setSleepQuality(q)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      sleepQuality === q
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs"
            >
              Save Rest Log
            </button>
          </form>
        </div>

        {/* 3. Eye Rest 20-20-20 Timer Card */}
        <div id="tour-eyerest-card" className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100">
                20-20-20 Eye Reset
              </h3>
              <p className="text-[11px] text-slate-400">Study screen strain prevention</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 text-center space-y-2">
            <div className="text-3xl font-extrabold font-mono text-teal-700 dark:text-teal-300">
              {formatTime(eyeSeconds)}
            </div>
            <p className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">
              Every 20 mins, look at an object 20 feet away for 20 seconds.
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setEyeTimerActive(!eyeTimerActive)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                eyeTimerActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {eyeTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{eyeTimerActive ? 'Pause Timer' : 'Start Study Timer'}</span>
            </button>

            <button
              onClick={() => {
                setEyeTimerActive(false);
                setEyeSeconds(20 * 60);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold"
            >
              Reset
            </button>
          </div>
        </div>

      </div>

      {/* 4. Physical Movement & Study Stretches */}
      <div id="tour-stretches-card" className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                Desk Movement & Quick Student Stretches
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                30-second physical reset breaks to relieve posture fatigue
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            3 Guided Movement Routines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stretches.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStretchIndex(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                activeStretchIndex === idx
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {item.duration}
                </span>
              </div>

              <div>
                <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium italic">
                💡 {item.tip}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
