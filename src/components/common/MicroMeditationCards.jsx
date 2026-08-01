import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export default function MicroMeditationCards() {
  const [activeMeditationId, setActiveMeditationId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const gainNodeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const meditations = [
    {
      id: 'exam-panic',
      title: 'Pre-Exam Panic Relief',
      duration: 120, // 2 mins
      durationLabel: '2 mins',
      tag: 'Academic Stress',
      freq1: 216, // A3 216Hz
      freq2: 432, // A4 432Hz harmonic
      bg: 'from-orange-500 to-amber-600',
      description: 'Slow down racing thoughts before a test or high-stakes presentation.',
      steps: [
        { time: 0, text: "Place both feet flat on the floor. Unclench your jaw and rest your hands on your lap." },
        { time: 25, text: "Inhale slowly for 4 seconds... feel your stomach gently expand." },
        { time: 55, text: "Exhale through soft lips. Remind yourself: 'My worth is not defined by one exam.'" },
        { time: 85, text: "Take 3 more slow deep breaths. You have prepared, and you are ready for this step." },
        { time: 110, text: "Gently open your eyes. Carry this quiet focus into your room." }
      ]
    },
    {
      id: 'sleep-drift',
      title: 'Nighttime Sleep Drift',
      duration: 180, // 3 mins
      durationLabel: '3 mins',
      tag: 'Sleep Recovery',
      freq1: 174, // Solfeggio 174Hz deep relaxing
      freq2: 528, // 528Hz transformation tone
      bg: 'from-amber-600 to-amber-700',
      description: 'Drift away from textbook stress into deep, restorative sleep.',
      steps: [
        { time: 0, text: "Lie back in a comfortable position. Allow your eyelids to grow heavy and close." },
        { time: 40, text: "Release tension in your forehead, shoulders, and lower back." },
        { time: 80, text: "Imagine all your study notes floating away like gentle leaves on a quiet stream." },
        { time: 120, text: "Inhale peace... exhale all leftover effort from today." },
        { time: 160, text: "Rest deeply now. Tomorrow brings a fresh, quiet beginning." }
      ]
    },
    {
      id: 'grounding-reset',
      title: '5-Sense Grounding Reset',
      duration: 90, // 1.5 mins
      durationLabel: '1.5 mins',
      tag: 'Anxiety Reset',
      freq1: 285,
      freq2: 396,
      bg: 'from-orange-600 to-amber-500',
      description: 'Rapid sensory grounding for sudden overwhelm or anxiety spikes.',
      steps: [
        { time: 0, text: "Take one deep breath in... and let it out with a soft sigh." },
        { time: 20, text: "Notice 3 physical contact points: your feet, your chair, and your hands." },
        { time: 45, text: "Listen to 2 quiet ambient sounds around your environment." },
        { time: 70, text: "Inhale the air softly. You are safe, grounded, and present in this moment." }
      ]
    },
    {
      id: 'self-compassion',
      title: 'Self-Compassion Reset',
      duration: 120, // 2 mins
      durationLabel: '2 mins',
      tag: 'Mindful Care',
      freq1: 396,
      freq2: 432,
      bg: 'from-amber-500 to-orange-500',
      description: 'Release self-criticism, academic burnout, and imposter thoughts.',
      steps: [
        { time: 0, text: "Place a hand over your heart. Feel the steady rhythm of your breathing." },
        { time: 30, text: "Acknowledge how hard you have been working. You are doing the best you can." },
        { time: 60, text: "Silently repeat: 'I am allowed to rest. I am enough as I am right now.'" },
        { time: 95, text: "Exhale all self-doubt. Breathe in warmth and kindness toward yourself." }
      ]
    }
  ];

  // Stop web audio synthesis
  const stopAudio = () => {
    try {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.2);
      }
      setTimeout(() => {
        if (osc1Ref.current) { osc1Ref.current.stop(); osc1Ref.current.disconnect(); osc1Ref.current = null; }
        if (osc2Ref.current) { osc2Ref.current.stop(); osc2Ref.current.disconnect(); osc2Ref.current = null; }
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
      }, 250);
    } catch (e) {
      console.warn("Stop audio warning:", e);
    }
  };

  // Start web audio ambient synthesis
  const startAudio = (meditation) => {
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 2.5);
      gainNodeRef.current = gain;

      // Soft ambient tone 1
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(meditation.freq1, ctx.currentTime);

      // Harmonious ambient tone 2
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(meditation.freq2, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
    } catch (e) {
      console.warn("Web audio synth warning:", e);
    }
  };

  const handleTogglePlay = (meditation) => {
    if (activeMeditationId === meditation.id && isPlaying) {
      // Pause current
      setIsPlaying(false);
      stopAudio();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      // Start or Resume
      setActiveMeditationId(meditation.id);
      setIsPlaying(true);
      if (activeMeditationId !== meditation.id) {
        setSecondsRemaining(meditation.duration);
        setCurrentStepIndex(0);
      }

      startAudio(meditation);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsPlaying(false);
            stopAudio();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const activeMeditation = meditations.find((m) => m.id === activeMeditationId);

  // Sync step transcript with timer
  useEffect(() => {
    if (activeMeditation && isPlaying) {
      const elapsed = activeMeditation.duration - secondsRemaining;
      const stepIdx = activeMeditation.steps.findLastIndex((s) => elapsed >= s.time);
      if (stepIdx !== -1) {
        setCurrentStepIndex(stepIdx);
      }
    }
  }, [secondsRemaining, activeMeditation, isPlaying]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 sm:p-8 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200/50 dark:border-stone-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
            Audio Guided Sessions
          </span>
          <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2 mt-0.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Micro-Meditation Audio Cards</span>
          </h2>
        </div>
        <span className="text-xs text-stone-400 font-medium">
          Quick 1 to 3-Minute Resets
        </span>
      </div>

      {/* Live Active Audio Player Banner */}
      {activeMeditation && (
        <div className="p-5 rounded-3xl bg-amber-100/90 dark:bg-amber-950/80 border border-orange-300 dark:border-amber-800 shadow-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shrink-0">
                {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Pause className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-amber-950 dark:text-amber-100">
                  {activeMeditation.title}
                </h3>
                <span className="text-xs font-mono font-extrabold text-orange-700 dark:text-orange-300">
                  {secondsRemaining > 0 ? `${formatTime(secondsRemaining)} remaining` : 'Session Completed ✓'}
                </span>
              </div>
            </div>

            {/* Equalizer Visualizer */}
            {isPlaying && (
              <div className="flex items-end space-x-1 h-5 shrink-0">
                <span className="w-1 bg-orange-600 rounded-full h-3 animate-pulse" />
                <span className="w-1 bg-orange-500 rounded-full h-5 animate-pulse delay-100" />
                <span className="w-1 bg-amber-600 rounded-full h-2 animate-pulse delay-200" />
                <span className="w-1 bg-orange-600 rounded-full h-4 animate-pulse delay-300" />
              </div>
            )}
          </div>

          {/* Live Sync Transcript Prompt */}
          {activeMeditation.steps[currentStepIndex] && (
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 italic leading-relaxed pt-2 border-t border-amber-200/80 dark:border-amber-900/60">
              "{activeMeditation.steps[currentStepIndex].text}"
            </p>
          )}
        </div>
      )}

      {/* Grid of Micro Meditation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meditations.map((m) => {
          const isCurrent = activeMeditationId === m.id;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <div
              key={m.id}
              className={`p-5 rounded-3xl border transition-all space-y-3.5 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-100/60 dark:bg-amber-950/60 border-orange-400 dark:border-orange-600 shadow-xs'
                  : 'bg-[#FAF6EE] dark:bg-stone-900/80 border-amber-200/60 dark:border-stone-800 hover:border-amber-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200">
                    {m.tag}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-stone-500 dark:text-stone-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{m.durationLabel}</span>
                  </span>
                </div>

                <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100">
                  {m.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <button
                onClick={() => handleTogglePlay(m)}
                className={`w-full py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-2 ${
                  isCurrentPlaying
                    ? 'bg-amber-800 text-white hover:bg-amber-900'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {isCurrentPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCurrent && secondsRemaining > 0 ? 'Resume Audio' : 'Play Meditation'}</span>
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
