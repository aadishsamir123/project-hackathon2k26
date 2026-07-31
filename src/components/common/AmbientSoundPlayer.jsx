import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Waves, Sparkles, Wind, Sliders } from 'lucide-react';

export default function AmbientSoundPlayer({ isPlaying, onTogglePlay }) {
  const [soundType, setSoundType] = useState('rain'); // 'rain', 'waves', 'binaural', 'breeze'
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef(null);
  const activeNodesRef = useRef([]);

  useEffect(() => {
    if (isPlaying) {
      startSound(soundType, volume);
    } else {
      stopSound();
    }
    return () => stopSound();
  }, [isPlaying, soundType]);

  useEffect(() => {
    if (audioCtxRef.current && isPlaying) {
      activeNodesRef.current.forEach((node) => {
        if (node.gainNode) {
          node.gainNode.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
        }
      });
    }
  }, [volume]);

  const stopSound = () => {
    if (activeNodesRef.current) {
      activeNodesRef.current.forEach((item) => {
        try {
          if (item.source) item.source.stop();
          if (item.source) item.source.disconnect();
        } catch (e) {}
      });
      activeNodesRef.current = [];
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const startSound = (type, vol) => {
    stopSound();

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'rain') {
        // Pink noise generator for soothing rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        activeNodesRef.current.push({ source: whiteNoise, gainNode: masterGain });
      } else if (type === 'waves') {
        // Low oscillating noise for gentle ocean waves
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        // LFO for wave modulation
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // wave cycle ~8 secs
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(300, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        noise.connect(filter);
        filter.connect(masterGain);

        noise.start();
        lfo.start();
        activeNodesRef.current.push({ source: noise, gainNode: masterGain }, { source: lfo });
      } else if (type === 'binaural') {
        // Alpha waves (10Hz difference between left & right ears: 200Hz and 210Hz)
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        oscLeft.type = 'sine';
        oscRight.type = 'sine';
        oscLeft.frequency.setValueAtTime(200, ctx.currentTime);
        oscRight.frequency.setValueAtTime(210, ctx.currentTime);

        const merger = ctx.createChannelMerger(2);
        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);

        const softGain = ctx.createGain();
        softGain.gain.setValueAtTime(0.2, ctx.currentTime);

        merger.connect(softGain);
        softGain.connect(masterGain);

        oscLeft.start();
        oscRight.start();
        activeNodesRef.current.push({ source: oscLeft, gainNode: masterGain }, { source: oscRight });
      } else if (type === 'breeze') {
        // Soft forest breeze modulation
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.Q.setValueAtTime(3.0, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        activeNodesRef.current.push({ source: noise, gainNode: masterGain });
      }
    } catch (err) {
      console.warn("Web Audio API Soundscape error:", err);
    }
  };

  const soundOptions = [
    { id: 'rain', name: 'Gentle Rain', icon: CloudRain, color: 'text-sky-500' },
    { id: 'waves', name: 'Ocean Waves', icon: Waves, color: 'text-teal-500' },
    { id: 'binaural', name: 'Alpha Beats (10Hz)', icon: Sparkles, color: 'text-indigo-500' },
    { id: 'breeze', name: 'Forest Breeze', icon: Wind, color: 'text-emerald-500' },
  ];

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
            {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Ambient Soundscape Studio</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Procedural calming background audio</p>
          </div>
        </div>

        <button
          onClick={onTogglePlay}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isPlaying
              ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          }`}
        >
          {isPlaying ? 'Pause Sound' : 'Play Sound'}
        </button>
      </div>

      {/* Sound Type Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {soundOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = soundType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSoundType(opt.id)}
              className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-semibold'
                  : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
              <span className="truncate">{opt.name}</span>
            </button>
          );
        })}
      </div>

      {/* Volume Slider */}
      <div className="flex items-center space-x-3 px-1">
        <VolumeX className="w-3.5 h-3.5 text-slate-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] text-slate-500 font-mono w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}
