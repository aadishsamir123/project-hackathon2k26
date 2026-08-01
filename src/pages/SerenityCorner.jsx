import React, { useState, useEffect } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  BookOpen,
  Heart,
  CheckCircle2
} from 'lucide-react';
import AmbientSoundPlayer from '../components/common/AmbientSoundPlayer.jsx';

export default function SerenityCorner({ isAudioPlaying, onToggleAudio }) {
  const [breathingTechnique, setBreathingTechnique] = useState('478'); // '478', 'box', 'equal'
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Ready'); // 'Inhale', 'Hold', 'Exhale'
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const techniques = {
    '478': { name: 'Relaxing Breath (4-7-8)', desc: 'Inhale 4s, Hold 7s, Exhale 8s for deep nervous system calm', inhale: 4, hold: 7, exhale: 8 },
    'box': { name: 'Box Breathing (4-4)', desc: 'Inhale 4s, Hold 4s, Exhale 4s. Used by Navy SEALs & athletes to regain focus under pressure', inhale: 4, hold: 4, exhale: 4 },
    'equal': { name: 'Equal Calm (5-5)', desc: 'Balanced 5s Inhale, 5s Exhale for smooth heart rate variability', inhale: 5, hold: 0, exhale: 5 },
  };

  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      const config = techniques[breathingTechnique];
      let currentPhase = 'Inhale';
      let sec = config.inhale;

      setBreathingPhase(currentPhase);
      setTimerSeconds(sec);

      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phase
          if (currentPhase === 'Inhale') {
            if (config.hold > 0) {
              currentPhase = 'Hold';
              sec = config.hold;
            } else {
              currentPhase = 'Exhale';
              sec = config.exhale;
            }
          } else if (currentPhase === 'Hold') {
            currentPhase = 'Exhale';
            sec = config.exhale;
          } else if (currentPhase === 'Exhale') {
            currentPhase = 'Inhale';
            sec = config.inhale;
            setCompletedCycles((c) => c + 1);
          }

          setBreathingPhase(currentPhase);
          return sec;
        });
      }, 1000);
    } else {
      setBreathingPhase('Ready');
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingTechnique]);

  const handleResetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('Ready');
    setTimerSeconds(0);
    setCompletedCycles(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div id="tour-serenity-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Mindfulness & De-stressing Suite
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-1">
            Serenity Corner 🌿🧘
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Practice visual guided breathing, reset your nervous system, and immerse in relaxing ambient soundscapes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Breathing Exercise (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6 flex flex-col justify-between">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                  Guided Breathing Visualizer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Follow the expanding circle to slow down your pulse
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
              {completedCycles} Cycles Completed
            </span>
          </div>

          {/* Technique Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.keys(techniques).map((key) => {
              const tech = techniques[key];
              const isSelected = breathingTechnique === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setBreathingTechnique(key);
                    handleResetBreathing();
                  }}
                  className={`p-3 rounded-2xl border text-left space-y-1 transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-bold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{tech.name}</p>
                  <p className={`text-[10px] line-clamp-5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {tech.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Animated Visual Circle Container */}
          <div className="py-10 flex flex-col items-center justify-center relative min-h-[280px]">
            
            {/* Pulsing expanding circle */}
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-indigo-400 flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 ${
                isBreathingActive && breathingPhase === 'Inhale'
                  ? 'scale-125 opacity-100 shadow-emerald-500/50'
                  : isBreathingActive && breathingPhase === 'Hold'
                  ? 'scale-125 opacity-90 shadow-indigo-500/50'
                  : isBreathingActive && breathingPhase === 'Exhale'
                  ? 'scale-90 opacity-70 shadow-slate-500/30'
                  : 'scale-100 opacity-80'
              }`}
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-100 drop-shadow-xs">
                {breathingPhase}
              </span>
              <span className="text-4xl font-extrabold my-1 font-mono">
                {timerSeconds > 0 ? timerSeconds : '–'}
              </span>
              <span className="text-[10px] text-white/80 font-medium">
                {isBreathingActive ? 'Breathe with rhythm' : 'Press Start'}
              </span>
            </div>

          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-8 py-3 rounded-2xl text-xs font-extrabold text-white shadow-md transition-all flex items-center space-x-2 ${
                isBreathingActive
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isBreathingActive ? 'Pause Session' : 'Start Breathing'}</span>
            </button>

            <button
              onClick={handleResetBreathing}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Soundscape Generator Studio (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <AmbientSoundPlayer
            isPlaying={isAudioPlaying}
            onTogglePlay={onToggleAudio}
          />

          <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-indigo-50/80 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-indigo-950/40 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="font-heading text-xs font-bold text-slate-800 dark:text-slate-100">
                Why Breathing & Soundscapes Help Students
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Slowing your breath to 6 cycles per minute triggers the parasympathetic nervous system, lowering cortisol (stress hormone) and restoring calm focus during intense study sessions.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
