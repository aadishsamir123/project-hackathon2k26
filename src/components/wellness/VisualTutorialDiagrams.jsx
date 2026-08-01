import React, { useState, useEffect } from 'react';
import {
  Wind,
  Eye,
  Activity,
  Zap,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Monitor,
  Calendar,
  Layers,
  Dumbbell
} from 'lucide-react';

/* ====================================================================
   1. Box Breathing (4-4-4-4) Diagram (The Five Minute Journal)
   ==================================================================== */
export function BoxBreathingDiagram() {
  const [phase, setPhase] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
  const [counter, setCounter] = useState(4);
  const [isRunning, setIsRunning] = useState(false);

  const phases = [
    { name: '1. INHALE', action: 'Expand Chest & Belly', color: 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40' },
    { name: '2. HOLD', action: 'Retain Air Calmly', color: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
    { name: '3. EXHALE', action: 'Slowly Release Tension', color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
    { name: '4. HOLD', action: 'Empty Lungs & Stillness', color: 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40' },
  ];

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            setPhase((p) => (p + 1) % 4);
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const current = phases[phase];

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Wind className="w-4 h-4 text-orange-600" />
          <span>Interactive Box Breathing (4-4-4-4) Visualizer</span>
        </span>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1 transition-all"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Start Cycle'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {phases.map((p, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-center transition-all ${
              phase === idx && isRunning
                ? `${p.color} ring-2 ring-orange-500 scale-105 shadow-xs font-bold`
                : 'border-amber-200/50 dark:border-stone-800 text-stone-500 dark:text-stone-400 bg-[#FFFDF9] dark:bg-[#262220]'
            }`}
          >
            <p className="text-[11px] font-mono">{p.name}</p>
            <p className="text-[10px] mt-0.5 opacity-80">{p.action}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/60 dark:border-stone-800 relative overflow-hidden">
        <div
          className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${current.color}`}
          style={{
            transform: phase === 0 ? 'scale(1.25)' : phase === 2 ? 'scale(0.85)' : 'scale(1.0)',
          }}
        >
          <span className="text-2xl font-extrabold font-mono">{isRunning ? counter : '4s'}</span>
          <span className="text-[10px] font-bold mt-0.5 uppercase tracking-wider">{current.name.split('.')[1]}</span>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   2. Diaphragmatic Vagal & 5-4-3-2-1 Sensory Grounding (Anti-Anxiety Notebook)
   ==================================================================== */
export function GroundingVagalDiagram() {
  const [activeStep, setActiveStep] = useState(5);

  const groundingSteps = [
    { count: 5, label: 'SEE', desc: '5 Objects around you (desk, window, light)' },
    { count: 4, label: 'TOUCH', desc: '4 Physical textures (clothing, chair, keys)' },
    { count: 3, label: 'HEAR', desc: '3 Distant sounds (fan, footsteps, hum)' },
    { count: 2, label: 'SMELL', desc: '2 Pleasant scents (coffee, fresh air)' },
    { count: 1, label: 'TASTE', desc: '1 Flavor in your mouth (mint, water)' },
  ];

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Eye className="w-4 h-4 text-orange-600" />
          <span>Vagal Breathing & 5-4-3-2-1 Sensory Grounding</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Diaphragm Expansion Card */}
        <div className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-rose-200/80 dark:border-rose-900/50 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-12 h-16 rounded-3xl border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center relative animate-pulse">
            <span className="w-8 h-8 rounded-full bg-rose-400/40 border border-rose-500 animate-ping absolute" />
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 font-mono z-10">BELLY</span>
          </div>
          <p className="text-xs font-bold text-stone-800 dark:text-stone-100">Diaphragm Expansion</p>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-snug">Belly rises on deep inhalation to stimulate the vagus nerve.</p>
        </div>

        {/* Interactive Sensory Step Selector */}
        <div className="md:col-span-2 space-y-2">
          <p className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">Tap a Sensory Grounding Step:</p>
          <div className="grid grid-cols-5 gap-1.5">
            {groundingSteps.map((step) => (
              <button
                key={step.count}
                onClick={() => setActiveStep(step.count)}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  activeStep === step.count
                    ? 'border-orange-500 bg-orange-600 text-white font-bold shadow-xs scale-105'
                    : 'border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220] text-stone-700 dark:text-stone-300 hover:bg-amber-50'
                }`}
              >
                <p className="text-sm font-black font-mono">{step.count}</p>
                <p className="text-[9px] uppercase tracking-wider">{step.label}</p>
              </button>
            ))}
          </div>

          {/* Active Step Display Box */}
          {activeStep && (
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">Step {activeStep} ({groundingSteps.find(s => s.count === activeStep)?.label}): </span>
                <span>{groundingSteps.find(s => s.count === activeStep)?.desc}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   3. Morning Somatic Stretch Sequence (Positive Wellness Journal)
   ==================================================================== */
export function SomaticStretchDiagram() {
  const [activePose, setActivePose] = useState(0);

  const poses = [
    { name: '1. Mountain Pose', posture: 'Stand tall, feet grounded, shoulders relaxed, arms at side.', focus: 'Inhale deeply & align spine' },
    { name: '2. Extended Reach', posture: 'Sweep arms upward, interlock fingers, stretch side to side.', focus: 'Expand ribs & open intercostal muscles' },
    { name: '3. Forward Fold', posture: 'Hinge at hips, soft knees, let head hang heavy toward floor.', focus: 'Exhale fully & decompress lumbar spine' },
    { name: '4. Cobra Pose', posture: 'Lie prone, press palms down, lift chest gently, shoulders down.', focus: 'Inhale & extend thoracic spine' },
  ];

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-orange-600" />
          <span>Morning Somatic Stretch Sequence (Mind-Body Alignment)</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {poses.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActivePose(idx)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activePose === idx
                ? 'border-orange-500 bg-orange-600 text-white font-bold shadow-xs scale-102'
                : 'border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220] text-stone-700 dark:text-stone-300 hover:bg-amber-50'
            }`}
          >
            <p className="text-xs font-bold font-serif">{p.name}</p>
            <p className={`text-[10px] mt-1 line-clamp-2 ${activePose === idx ? 'text-orange-100' : 'text-stone-400'}`}>
              {p.focus}
            </p>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/60 dark:border-stone-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
          {activePose + 1}
        </div>
        <div className="text-xs space-y-1">
          <p className="font-bold text-stone-800 dark:text-stone-100">{poses[activePose].name}</p>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{poses[activePose].posture}</p>
          <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">{poses[activePose].focus}</p>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   4. PMR Progressive Muscle Relaxation Protocol (Wreck This Journal)
   ==================================================================== */
export function PMRProtocolDiagram() {
  const [pmrState, setPmrState] = useState('idle'); // 'idle', 'tense', 'release'

  const startPmrCycle = () => {
    setPmrState('tense');
    setTimeout(() => {
      setPmrState('release');
      setTimeout(() => {
        setPmrState('idle');
      }, 5000);
    }, 5000);
  };

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-orange-600" />
          <span>Somatic PMR Protocol (Tactile Motor Stress Release)</span>
        </span>
        <button
          onClick={startPmrCycle}
          disabled={pmrState !== 'idle'}
          className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs disabled:opacity-50 transition-all cursor-pointer"
        >
          {pmrState === 'idle' ? 'Start 10s PMR Test' : pmrState === 'tense' ? 'Tensing (5s)...' : 'Releasing (5s)...'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className={`p-4 rounded-xl border transition-all ${pmrState === 'tense' ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 ring-2 ring-rose-500 scale-105' : 'border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220]'}`}>
          <span className="text-xs font-bold text-rose-600 block mb-1">1. Tense Muscle Group</span>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">Squeeze fists & shoulders tightly for 5s. Inhale deeply.</p>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${pmrState === 'release' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500 scale-105' : 'border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220]'}`}>
          <span className="text-xs font-bold text-emerald-600 block mb-1">2. Sudden Exhale & Drop</span>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">Sudden forceful exhale. Drop shoulders & unclench completely.</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220]">
          <span className="text-xs font-bold text-orange-600 block mb-1">3. Tactile Expressive Prompt</span>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">Tear page, puncture holes, or spill paint without perfectionism.</p>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   5. Strength & Progressive Overload Mechanics (SaltWrap Planner)
   ==================================================================== */
export function ProgressiveOverloadDiagram() {
  const [baseWeight, setBaseWeight] = useState(100);

  const w1 = baseWeight;
  const w2 = Math.round(baseWeight * 1.025 * 10) / 10;
  const w3 = Math.round(baseWeight * 1.05 * 10) / 10;

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Dumbbell className="w-4 h-4 text-emerald-600" />
          <span>Compound Form Mechanics & 3-Week Progressive Overload</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Form Mechanics Card */}
        <div className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">Squat Depth Mechanics</span>
          <div className="w-20 h-14 mx-auto border-b-2 border-emerald-500 flex items-center justify-center text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 rounded-t-lg">
            &lt; 90° Depth
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-snug">Ensure hip crease drops below knee joint line before advancing load.</p>
        </div>

        {/* Interactive Load Progression Calculator */}
        <div className="md:col-span-2 p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/60 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Starting Working Load (kg):</span>
            <input
              type="number"
              value={baseWeight}
              onChange={(e) => setBaseWeight(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-20 px-2 py-1 text-xs text-center border rounded-lg bg-[#FAF6EE] dark:bg-stone-900 border-amber-300 dark:border-stone-700 font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">WEEK 1</span>
              <span className="text-xs font-extrabold font-mono text-emerald-700 dark:text-emerald-400 block">{w1} kg × 5</span>
              <span className="text-[9px] text-emerald-600">RPE 7.5</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">WEEK 2 (+2.5%)</span>
              <span className="text-xs font-extrabold font-mono text-emerald-700 dark:text-emerald-400 block">{w2} kg × 5</span>
              <span className="text-[9px] text-emerald-600">RPE 8.0</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-200/60 dark:bg-emerald-800/40 border border-emerald-400 dark:border-emerald-600">
              <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-200 block">WEEK 3 (+5.0%)</span>
              <span className="text-xs font-extrabold font-mono text-emerald-800 dark:text-emerald-300 block">{w3} kg × 5</span>
              <span className="text-[9px] text-emerald-700">RPE 8.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   6. Cat-Cow Spinal Decompression Routine (Papier Wellness)
   ==================================================================== */
export function CatCowMobilityDiagram() {
  const [poseState, setPoseState] = useState('cat'); // 'cat' or 'cow'

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-teal-600" />
          <span>Full-Body Spinal Decompression (Cat-Cow Routine)</span>
        </span>

        <div className="flex items-center space-x-1 bg-[#FFFDF9] dark:bg-[#262220] p-1 rounded-xl border border-amber-200 dark:border-stone-800">
          <button
            onClick={() => setPoseState('cat')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${poseState === 'cat' ? 'bg-teal-600 text-white' : 'text-stone-600 dark:text-stone-400'}`}
          >
            Cat Pose
          </button>
          <button
            onClick={() => setPoseState('cow')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${poseState === 'cow' ? 'bg-teal-600 text-white' : 'text-stone-600 dark:text-stone-400'}`}
          >
            Cow Pose
          </button>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-teal-200 dark:border-teal-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <span className="text-xs font-extrabold text-teal-700 dark:text-teal-400 block uppercase">
            {poseState === 'cat' ? '1. Cat Pose (Spinal Flexion / Exhale)' : '2. Cow Pose (Spinal Extension / Inhale)'}
          </span>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            {poseState === 'cat'
              ? 'Tuck chin toward chest, pull belly button firmly up toward spine, and round back smoothly like a cat.'
              : 'Drop belly down toward floor, lift chest and tailbone upward, broaden shoulders, and look gently ahead.'}
          </p>
          <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
            {poseState === 'cat' ? '🫁 Action: Exhale completely & pull abdomen inward' : '🫁 Action: Inhale fully & lift chest forward'}
          </div>
        </div>

        <div className="w-36 h-20 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-800 flex flex-col items-center justify-center text-center p-2 shrink-0">
          <span className="text-xs font-bold text-teal-800 dark:text-teal-200">10 Reps Daily</span>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 leading-snug">Lubricates intervertebral discs & releases lumbar stiffness</span>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   7. HIIT 2:1 Ratio Conditioning Wave Protocol (Fitlosophy Fitbook)
   ==================================================================== */
export function HIITProtocolDiagram() {
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isSprint, setIsSprint] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let t = null;
    if (isTimerRunning) {
      t = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsSprint((s) => !s);
            return isSprint ? 60 : 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isTimerRunning, isSprint]);

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-orange-600" />
          <span>High-Intensity Interval Training (HIIT 2:1 Ratio) Protocol</span>
        </span>
        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
        >
          {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isTimerRunning ? 'Pause Protocol' : 'Start HIIT Timer'}</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/60 dark:border-stone-800 space-y-3">
        <div className="text-center font-mono space-y-1">
          <span className={`text-xs font-bold tracking-widest uppercase ${isSprint ? 'text-rose-600' : 'text-amber-600'}`}>
            {isSprint ? '🔥 SPRINT PHASE (85-90% HR)' : '🧘 RECOVERY WALK (ZONE 2)'}
          </span>
          <p className="text-3xl font-black">{secondsLeft}s</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-3 rounded-xl border transition-all ${isSprint ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 ring-2 ring-rose-500' : 'border-amber-200/50 dark:border-stone-800 bg-[#FAF6EE] dark:bg-stone-900'}`}>
            <span className="font-bold text-rose-700 dark:text-rose-300 block">30s SPRINT</span>
            <span className="text-[10px] text-stone-500">All-Out Effort</span>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${!isSprint ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-500' : 'border-amber-200/50 dark:border-stone-800 bg-[#FAF6EE] dark:bg-stone-900'}`}>
            <span className="font-bold text-amber-700 dark:text-amber-300 block">60s RECOVERY</span>
            <span className="text-[10px] text-stone-500">Zone 2 Walk</span>
          </div>

          <div className="p-3 rounded-xl border border-amber-200/50 dark:border-stone-800 bg-[#FAF6EE] dark:bg-stone-900">
            <span className="font-bold text-orange-700 dark:text-orange-300 block">REPEAT 10×</span>
            <span className="text-[10px] text-stone-500">20-Min Total Block</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   8. Workplace Ergonomics & 90° Posture Alignment (Moleskine Wellness)
   ==================================================================== */
export function ErgonomicsPostureDiagram() {
  const [checkedRules, setCheckedRules] = useState({ r1: true, r2: true, r3: false });

  const toggle = (k) => setCheckedRules((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Monitor className="w-4 h-4 text-indigo-600" />
          <span>Workplace Ergonomics & 90° Spinal Neutrality Checklist</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <button
            onClick={() => toggle('r1')}
            className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
              checkedRules.r1 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200' : 'border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220] text-stone-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${checkedRules.r1 ? 'text-indigo-600' : 'text-stone-300'}`} />
            <div className="text-xs">
              <span className="font-bold block">1. Eye-line at top 1/3 of screen</span>
              <span className="text-[10px] text-stone-500">Prevents cervical neck extension fatigue.</span>
            </div>
          </button>

          <button
            onClick={() => toggle('r2')}
            className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
              checkedRules.r2 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200' : 'border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220] text-stone-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${checkedRules.r2 ? 'text-indigo-600' : 'text-stone-300'}`} />
            <div className="text-xs">
              <span className="font-bold block">2. Elbows & Knees at 90° Angle</span>
              <span className="text-[10px] text-stone-500">Supports neutral shoulder & hip alignment.</span>
            </div>
          </button>

          <button
            onClick={() => toggle('r3')}
            className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
              checkedRules.r3 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200' : 'border-amber-200/50 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220] text-stone-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${checkedRules.r3 ? 'text-indigo-600' : 'text-stone-300'}`} />
            <div className="text-xs">
              <span className="font-bold block">3. Feet flat on floor or footrest</span>
              <span className="text-[10px] text-stone-500">Relieves lower back hamstring pressure.</span>
            </div>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-indigo-200 dark:border-indigo-900/50 flex flex-col justify-between">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">SPINAL NEUTRALITY SCORE</span>
          <div className="text-center py-2">
            <span className="text-3xl font-black text-indigo-600 font-mono">
              {Object.values(checkedRules).filter(Boolean).length} / 3
            </span>
            <span className="text-xs block text-stone-500 mt-1">
              {Object.values(checkedRules).filter(Boolean).length === 3
                ? '✅ Excellent Ergonomic Posture Alignment'
                : '⚠️ Adjust desk height to eliminate tension headaches'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   9. Custom Hybrid Bullet Journal Matrix & Digital Dashboard Architecture
   ==================================================================== */
export function HybridSystemDiagram() {
  const [habits, setHabits] = useState([
    { name: 'Mind Meditation', days: [true, true, true, false, true, true, false] },
    { name: 'Strength Gym', days: [true, false, true, false, true, false, false] },
    { name: '7+ Hrs Sleep', days: [true, true, true, true, true, false, true] },
  ]);

  const toggleDay = (hIdx, dIdx) => {
    setHabits((prev) => {
      const next = [...prev];
      next[hIdx].days[dIdx] = !next[hIdx].days[dIdx];
      return next;
    });
  };

  const daysLabel = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-[#FAF6EE] dark:bg-stone-900 p-5 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-serif flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-purple-600" />
          <span>Unified Bullet Journal Matrix & Digital Relational Architecture</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Analog Matrix */}
        <div className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/60 dark:border-stone-800 space-y-3">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">ANALOG BULLET GRID TRACKER</span>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-1">
              <span>HABIT / DAY</span>
              <div className="flex space-x-2">
                {daysLabel.map((d, idx) => <span key={idx} className="w-4 text-center">{d}</span>)}
              </div>
            </div>

            {habits.map((h, hIdx) => (
              <div key={hIdx} className="flex items-center justify-between text-xs font-serif">
                <span className="text-stone-800 dark:text-stone-200">{h.name}</span>
                <div className="flex space-x-2">
                  {h.days.map((checked, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => toggleDay(hIdx, dIdx)}
                      className={`w-4 h-4 rounded-sm border transition-all cursor-pointer ${
                        checked ? 'bg-purple-600 border-purple-600 text-white' : 'border-stone-300 dark:border-stone-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Relational Dashboard */}
        <div className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#262220] border border-purple-200 dark:border-purple-900/50 flex flex-col justify-between space-y-3">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">DIGITAL RELATIONAL DASHBOARD</span>
          
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 block">DAILY MOOD LOG</span>
              <span className="text-sm font-extrabold text-purple-600 font-mono mt-1 block">Score: 8.5 / 10</span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 block">WORKOUT LOG</span>
              <span className="text-sm font-extrabold text-indigo-600 font-mono mt-1 block">Volume: 8,400kg</span>
            </div>
          </div>

          <p className="text-[10px] text-stone-500 dark:text-stone-400 text-center leading-snug">
            Relational correlation: High workout volume days correlate with +1.8 mood resilience score.
          </p>
        </div>
      </div>
    </div>
  );
}
