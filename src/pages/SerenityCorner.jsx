import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import AmbientSoundPlayer from '../components/common/AmbientSoundPlayer.jsx';
import MicroMeditationCards from '../components/common/MicroMeditationCards.jsx';
import PagePurposeHeader from '../components/common/PagePurposeHeader.jsx';

export default function SerenityCorner({ isAudioPlaying, onToggleAudio }) {
  const [breathingTechnique, setBreathingTechnique] = useState('478'); // '478', 'box', 'equal'
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Ready'); // 'Inhale', 'Hold', 'Exhale', 'Ready'
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [maxPhaseSeconds, setMaxPhaseSeconds] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const phaseRef = useRef('Inhale');
  const [elapsedMs, setElapsedMs] = useState(0);

  const techniques = {
    '478': { name: '4-7-8 Relaxing Breath', desc: 'Inhale 4s, Hold 7s, Exhale 8s for nervous system calm', inhale: 4, hold: 7, exhale: 8 },
    'box': { name: 'Box Breathing (4-4)', desc: 'Inhale 4s, Hold 4s, Exhale 4s for focus under pressure', inhale: 4, hold: 4, exhale: 4 },
    'equal': { name: 'Equal Calm (5-5)', desc: 'Balanced 5s Inhale, 5s Exhale for heart rate harmony', inhale: 5, hold: 0, exhale: 5 },
  };

  const phaseInstructions = {
    Inhale: 'Inhale deeply through your nose',
    Hold: 'Hold gently and relax your shoulders',
    Exhale: 'Exhale slowly through your mouth',
    Ready: 'Tap the circle to begin session'
  };

  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      const config = techniques[breathingTechnique];
      phaseRef.current = 'Inhale';
      setBreathingPhase('Inhale');
      setMaxPhaseSeconds(config.inhale);
      setTimerSeconds(config.inhale);
      setElapsedMs(0);

      const tickMs = 50;

      interval = setInterval(() => {
        const currentConfig = techniques[breathingTechnique];
        const currentMax = phaseRef.current === 'Inhale'
          ? currentConfig.inhale
          : phaseRef.current === 'Hold'
            ? currentConfig.hold
            : currentConfig.exhale;

        const currentMaxMs = currentMax * 1000;

        setElapsedMs((prev) => {
          const next = prev + tickMs;
          if (next >= currentMaxMs) {
            // Move to next phase
            if (phaseRef.current === 'Inhale') {
              if (currentConfig.hold > 0) {
                phaseRef.current = 'Hold';
                setMaxPhaseSeconds(currentConfig.hold);
              } else {
                phaseRef.current = 'Exhale';
                setMaxPhaseSeconds(currentConfig.exhale);
              }
            } else if (phaseRef.current === 'Hold') {
              phaseRef.current = 'Exhale';
              setMaxPhaseSeconds(currentConfig.exhale);
            } else if (phaseRef.current === 'Exhale') {
              phaseRef.current = 'Inhale';
              setMaxPhaseSeconds(currentConfig.inhale);
              setCompletedCycles((c) => c + 1);
            }

            const nextMax = phaseRef.current === 'Inhale'
              ? currentConfig.inhale
              : phaseRef.current === 'Hold'
                ? currentConfig.hold
                : currentConfig.exhale;

            setBreathingPhase(phaseRef.current);
            setTimerSeconds(nextMax);
            return 0;
          } else {
            setTimerSeconds(Math.ceil((currentMaxMs - next) / 1000));
            return next;
          }
        });
      }, tickMs);
    } else {
      setBreathingPhase('Ready');
      setTimerSeconds(0);
      setElapsedMs(0);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingTechnique]);

  const handleResetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('Ready');
    setTimerSeconds(0);
    setElapsedMs(0);
    setCompletedCycles(0);
  };

  const progressPercent = maxPhaseSeconds > 0
    ? (elapsedMs / (maxPhaseSeconds * 1000)) * 100
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Mental Health Purpose Header */}
      <PagePurposeHeader
        badge="Nervous System Regulation"
        title="Breathing & Stillness Sanctuary"
        purpose="De-escalate high anxiety, lower physical heart rate, and re-anchor your attention through guided rhythmic breathing and ambient soundscapes."
        evidence="Rhythmic breathing (such as 4-7-8 and Box Breathing) stimulates the vagus nerve, reducing heart rate variability stress indicators within 180 seconds."
        dailyAction="Select a breathing rhythm, tap the pulsing orb to start, and complete 4 full breath cycles."
        stepNumber={3}
        totalSteps={6}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Breathing Orb Container */}
        <div className="lg:col-span-7 bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-6 flex flex-col justify-between">
          
          {/* Technique Selector */}
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(techniques).map((key) => {
              const isSel = breathingTechnique === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setBreathingTechnique(key);
                    handleResetBreathing();
                  }}
                  className={`p-3 rounded-2xl text-left transition-all ${
                    isSel
                      ? 'bg-amber-100 dark:bg-amber-950/80 border border-orange-400 text-stone-900 dark:text-stone-100 font-bold'
                      : 'bg-[#FAF6EE] dark:bg-stone-800 border border-amber-200/50 text-stone-600 dark:text-stone-300 hover:bg-amber-50'
                  }`}
                >
                  <p className="text-xs font-bold">{techniques[key].name}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                    {key === '478' ? '4-7-8' : key === 'box' ? '4-4' : '5-5'} rhythm
                  </p>
                </button>
              );
            })}
          </div>

          {/* 🔘 THE INTERACTIVE BREATHING ORB BUTTON (Clickable Orb) */}
          <div className="flex flex-col items-center justify-center py-4 space-y-5">
            <div
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center cursor-pointer group select-none"
              title={isBreathingActive ? 'Tap to Pause' : 'Tap to Start Breathing'}
            >
              
              {/* Outer Ambient Glow Aura */}
              <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                breathingPhase === 'Inhale'
                  ? 'scale-125 bg-orange-500/25 blur-2xl opacity-100'
                  : breathingPhase === 'Hold'
                    ? 'scale-125 bg-amber-500/30 blur-2xl animate-pulse-soft'
                    : breathingPhase === 'Exhale'
                      ? 'scale-85 bg-orange-500/10 blur-xl opacity-40'
                      : 'scale-95 bg-amber-400/10 blur-lg group-hover:scale-105'
              }`} />

              {/* Rotating Concentric Dash Ring */}
              <div className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-orange-400/30 dark:border-orange-500/20 transition-all duration-1000 ${
                isBreathingActive ? 'animate-spin-slow' : ''
              }`} />

              {/* SVG Circular Progress Arc */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-amber-200/40 dark:stroke-stone-800 fill-none"
                  strokeWidth="2.5"
                />
                {isBreathingActive && (
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-orange-500 fill-none transition-[stroke-dashoffset] duration-75 ease-linear"
                    strokeWidth="3.5"
                    strokeDasharray="276.46"
                    strokeDashoffset={Math.max(0, 276.46 - (276.46 * Math.min(100, progressPercent)) / 100)}
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Central Orb Button */}
              <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white flex flex-col items-center justify-center shadow-xl transition-all duration-1000 cubic-bezier(0.4,0,0.2,1) z-10 group-hover:scale-105 ${
                breathingPhase === 'Inhale'
                  ? 'scale-125 shadow-orange-500/50'
                  : breathingPhase === 'Hold'
                    ? 'scale-125 shadow-amber-500/40 animate-pulse-soft'
                    : breathingPhase === 'Exhale'
                      ? 'scale-85 opacity-85'
                      : 'scale-100 shadow-orange-500/20'
              }`}>
                {isBreathingActive ? (
                  <>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-100">
                      {breathingPhase}
                    </span>
                    <span className="text-4xl font-extrabold mt-0.5 font-mono">
                      {timerSeconds}s
                    </span>
                    <span className="text-[10px] opacity-80 mt-1 flex items-center space-x-1">
                      <Pause className="w-3 h-3 inline" />
                      <span>Tap to Pause</span>
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-8 h-8 text-white ml-1 fill-white" />
                    <span className="text-xs font-bold uppercase tracking-wider mt-2">
                      Start
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Micro Guidance Prompt */}
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium text-center">
              {phaseInstructions[breathingPhase] || phaseInstructions.Ready}
            </p>

            {/* Cycle Count & Reset */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-stone-500">
                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                <span>Completed: <strong className="text-orange-700 dark:text-orange-300">{completedCycles} cycles</strong></span>
              </div>

              <button
                onClick={handleResetBreathing}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-amber-100/60 transition-all text-xs flex items-center space-x-1"
                title="Reset counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right: Soundscapes */}
        <div className="lg:col-span-5 space-y-6">
          <AmbientSoundPlayer
            isPlaying={isAudioPlaying}
            onTogglePlay={onToggleAudio}
          />
        </div>

      </div>

      {/* 🧘 MICRO-MEDITATION GUIDED AUDIO CARDS SECTION */}
      <MicroMeditationCards />

    </div>
  );
}
