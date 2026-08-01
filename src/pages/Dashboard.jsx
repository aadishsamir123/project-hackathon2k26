import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  MessageSquareHeart,
  Wind,
  ShieldCheck,
  TrendingUp,
  Smile,
  Sun,
  RefreshCw,
  Plus,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Activity,
  Droplet,
  Moon,
  Compass,
  PhoneCall,
  MapPin,
  Sparkle
} from 'lucide-react';
import { saveMoodLog, subscribeToMoodLogs, saveGratitudeEntry, getLocalGratitudeEntries } from '../services/firestore.js';
import { generateDailyAffirmation } from '../services/gemini.js';

export default function Dashboard({ user, onOpenHelp }) {
  const navigate = useNavigate();
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedQuickEmotion, setSelectedQuickEmotion] = useState(null);
  const [affirmation, setAffirmation] = useState('');
  const [gratitudeLogs, setGratitudeLogs] = useState([]);
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [showGratitudeSuccess, setShowGratitudeSuccess] = useState(false);

  const quickEmotions = [
    { name: 'Joyful', emoji: '✨', color: 'bg-amber-100/80 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800' },
    { name: 'Calm', emoji: '🌿', color: 'bg-orange-100/80 text-orange-900 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800' },
    { name: 'Anxious', emoji: '☁️', color: 'bg-stone-200/80 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700' },
    { name: 'Overwhelmed', emoji: '⚡', color: 'bg-amber-200/60 text-amber-950 border-amber-400 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700' },
    { name: 'Tired', emoji: '🌙', color: 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700' },
    { name: 'Sad', emoji: '💧', color: 'bg-orange-50 text-orange-900 border-orange-200 dark:bg-stone-800 dark:text-orange-300 dark:border-stone-700' },
  ];

  useEffect(() => {
    const unsub = subscribeToMoodLogs(user?.uid, (logs) => {
      setMoodLogs(logs);
    });
    setGratitudeLogs(getLocalGratitudeEntries());
    fetchAffirmation('Calm');
    return unsub;
  }, [user]);

  const fetchAffirmation = (mood) => {
    const text = generateDailyAffirmation(mood);
    setAffirmation(text);
  };

  const handleQuickCheckin = async (emotion) => {
    setSelectedQuickEmotion(emotion.name);
    const intensityMap = { Joyful: 9, Calm: 8, Anxious: 4, Overwhelmed: 3, Tired: 5, Sad: 3 };
    const newLog = {
      emotion: emotion.name,
      intensity: intensityMap[emotion.name] || 5,
      note: `Quick check-in logged from Mindful Path (${emotion.name})`,
      tags: ['Daily Path'],
    };

    await saveMoodLog(user?.uid, newLog);
    fetchAffirmation(emotion.name);
  };

  const handleAddGratitude = (e) => {
    e.preventDefault();
    if (!gratitudeInput.trim()) return;
    const updated = saveGratitudeEntry(gratitudeInput.trim());
    setGratitudeLogs(updated);
    setGratitudeInput('');
    setShowGratitudeSuccess(true);
    setTimeout(() => setShowGratitudeSuccess(false), 3000);
  };

  const avgIntensity = moodLogs.length
    ? (moodLogs.reduce((acc, curr) => acc + (curr.intensity || 5), 0) / moodLogs.length).toFixed(1)
    : '7.5';

  const waterCount = localStorage.getItem('mindhaven_water_count') || '3';

  // Mindful Journey Roadmap Steps
  const journeyPath = [
    {
      step: '01',
      title: 'Heart & Emotion Check-in',
      subtitle: 'Emotion Journal',
      desc: 'Pause and reflect on how your heart is feeling right now. Log deep emotion ratings and private thoughts.',
      icon: BookOpen,
      path: '/dashboard/myspace/emotionlog',
      tag: 'Mindful Step 1',
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300/60'
    },
    {
      step: '02',
      title: 'Body Vitality & Rest',
      subtitle: 'Physical Health',
      desc: 'Track your water intake, sleep quality, and take a gentle 20-20-20 eye strain break from screens.',
      icon: Activity,
      path: '/dashboard/myspace/physical',
      tag: 'Mindful Step 2',
      badgeColor: 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200 border-orange-300/60'
    },
    {
      step: '03',
      title: 'Stillness & Breathing',
      subtitle: 'Serenity Corner',
      desc: 'Slow down your breath with guided breathing cycles and soothing warm ambient soundscapes.',
      icon: Wind,
      path: '/dashboard/calmandai/serenity',
      tag: 'Mindful Step 3',
      badgeColor: 'bg-amber-200/70 dark:bg-amber-900 text-amber-950 dark:text-amber-100 border-amber-400/60'
    },
    {
      step: '04',
      title: 'Gentle AI Companion',
      subtitle: 'MindPal AI',
      desc: 'Talk with an empathetic AI listener, reframe anxious thoughts, or practice 5-4-3-2-1 grounding.',
      icon: Compass,
      path: '/dashboard/calmandai/mindpal',
      tag: 'Mindful Step 4',
      badgeColor: 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-300'
    },
    {
      step: '05',
      title: 'Safe Community Support',
      subtitle: 'Peer Haven Wall',
      desc: 'Read anonymous words of encouragement from fellow students or post your own safe reflection.',
      icon: MessageSquareHeart,
      path: '/dashboard/connect/peerhaven',
      tag: 'Mindful Step 5',
      badgeColor: 'bg-orange-200/70 dark:bg-stone-800 text-orange-950 dark:text-orange-200 border-orange-300'
    },
    {
      step: '06',
      title: '24/7 Emergency Care',
      subtitle: 'Crisis Helplines',
      desc: 'Access free, confidential 24/7 student hotlines and professional crisis support anytime.',
      icon: PhoneCall,
      path: '/dashboard/connect/resources',
      tag: 'Immediate Care',
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-300'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-serif">
      
      {/* Serene Warm Welcome Header */}
      <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF3E8] to-[#FFF9EE] dark:from-[#262220] dark:via-[#1F1C1A] dark:to-[#262220] p-8 rounded-3xl border border-amber-200/70 dark:border-stone-800 shadow-sm space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-200/60 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-300/50">
              🌿 Peaceful Sanctuary Path
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-2">
              Welcome to your quiet space, {user?.displayName ? user.displayName.split(' ')[0] : 'Friend'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif italic max-w-xl">
              Take a slow breath. Walk through the peaceful path below to nourish your emotional and physical wellbeing today.
            </p>
          </div>

          <button
            onClick={onOpenHelp}
            className="px-4 py-2.5 rounded-2xl bg-amber-100/70 dark:bg-stone-800 hover:bg-amber-200/70 text-amber-950 dark:text-amber-200 border border-amber-300/60 dark:border-stone-700 text-xs font-serif font-bold transition-all shrink-0 flex items-center space-x-1.5"
          >
            <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            <span>Sanctuary Guide</span>
          </button>
        </div>

        {/* Preset Daily Affirmation Box */}
        {affirmation && (
          <div className="mt-4 p-5 rounded-2xl bg-amber-50/90 dark:bg-stone-900/80 border border-amber-200 dark:border-amber-900/50 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed flex items-start space-x-3 text-left">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                Today's Calm Reflection
              </span>
              <p className="whitespace-pre-line font-serif italic text-stone-700 dark:text-stone-300">
                {affirmation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Heart State Selector */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] p-6 rounded-3xl border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-amber-600 fill-amber-600/20" />
            <span>How is your heart feeling right now?</span>
          </h2>
          {selectedQuickEmotion && (
            <span className="text-xs text-amber-800 dark:text-amber-300 font-serif italic">
              Logged: {selectedQuickEmotion} ✓
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {quickEmotions.map((emo) => (
            <button
              key={emo.name}
              onClick={() => handleQuickCheckin(emo)}
              className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center space-y-1.5 ${
                selectedQuickEmotion === emo.name
                  ? 'ring-2 ring-amber-600 scale-105 bg-amber-100 dark:bg-amber-950 font-bold'
                  : 'bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/60 dark:border-stone-700 hover:bg-amber-100/50 dark:hover:bg-stone-750'
              }`}
            >
              <span className="text-2xl">{emo.emoji}</span>
              <span className="text-xs font-serif text-stone-800 dark:text-stone-200 font-medium">
                {emo.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 🛣️ THE MINDFUL PATHWAY (Walkthrough Journey) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-serif font-semibold bg-amber-200/50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200">
            Guided Wellness Journey
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            The Path of Stillness & Vitality
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic">
            Walk through each station along your personal path at your own peaceful pace.
          </p>
        </div>

        {/* Connected Journey Line & Stations */}
        <div className="relative space-y-6 before:absolute before:left-6 sm:before:left-1/2 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-orange-300 before:to-rose-400 before:-translate-x-1/2 before:hidden sm:before:block">
          {journeyPath.map((station, idx) => {
            const Icon = station.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={station.step}
                onClick={() => navigate(station.path)}
                className={`relative flex flex-col sm:flex-row items-center cursor-pointer group ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Station Card */}
                <div className="w-full sm:w-[46%] bg-[#FFFDF9] dark:bg-[#262220] p-6 rounded-3xl border border-amber-200/70 dark:border-stone-800 shadow-sm group-hover:border-amber-400 dark:group-hover:border-amber-600 transition-all duration-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold border font-serif ${station.badgeColor}`}>
                      {station.tag}
                    </span>
                    <span className="text-xs font-extrabold font-mono text-amber-800/50 dark:text-amber-200/40">
                      STEP {station.step}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/80 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100 font-serif flex items-center space-x-1.5">
                        <span>{station.title}</span>
                        <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-xs text-amber-800/70 dark:text-amber-200/60 font-serif italic mt-0.5">
                        {station.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                    {station.desc}
                  </p>
                </div>

                {/* Center Node Marker on Path */}
                <div className="hidden sm:flex z-10 w-10 h-10 rounded-full bg-amber-500 text-white font-extrabold text-xs items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-[#FAF6EE] dark:border-[#1C1917] group-hover:scale-125 transition-transform duration-300 shrink-0 mx-auto">
                  {station.step}
                </div>

                {/* Empty Spacer Column for layout symmetry */}
                <div className="hidden sm:block w-[46%]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Peaceful Stats & Happiness Jar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Wellbeing Metrics Panel */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2 font-serif">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Wellbeing Summary</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800">
              <p className="text-[10px] text-amber-900/70 dark:text-amber-200/60 font-serif">Happiness Index</p>
              <p className="text-2xl font-extrabold text-amber-800 dark:text-amber-300 mt-1 font-serif">
                {avgIntensity} / 10
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800">
              <p className="text-[10px] text-amber-900/70 dark:text-amber-200/60 font-serif">Hydration Log</p>
              <p className="text-2xl font-extrabold text-amber-800 dark:text-amber-300 mt-1 font-serif">
                {waterCount} / 8 <span className="text-xs font-normal">cups</span>
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 flex items-center space-x-2 font-serif">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Consistency Streak: <strong>{moodLogs.length ? 'Active 🔥' : 'Start Your Path Today 🌿'}</strong></span>
          </div>
        </div>

        {/* Happiness Jar (Gratitude Collection) */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2 font-serif">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>Happiness Jar</span>
            </h3>
            <span className="text-xs text-amber-800 dark:text-amber-300 font-serif italic">
              {gratitudeLogs.length} Memories Saved
            </span>
          </div>

          <form onSubmit={handleAddGratitude} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={gratitudeInput}
                onChange={(e) => setGratitudeInput(e.target.value)}
                placeholder="Drop a small happy memory or gratitude..."
                className="flex-1 bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl px-4 py-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-serif"
              />
              <button
                type="submit"
                disabled={!gratitudeInput.trim()}
                className="p-2.5 rounded-2xl bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white font-bold transition-all shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {showGratitudeSuccess && (
              <p className="text-[11px] text-amber-800 dark:text-amber-300 font-serif italic">
                ✨ Added to your Happiness Jar!
              </p>
            )}
          </form>

          {/* Gratitude Notes */}
          <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
            {gratitudeLogs.length === 0 ? (
              <div className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900/60 text-center text-xs text-stone-400 font-serif italic">
                Your Happiness Jar is ready for your first joyful memory 🌿
              </div>
            ) : (
              gratitudeLogs.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-amber-50/60 dark:bg-stone-900 border border-amber-100 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 font-serif flex items-center justify-between"
                >
                  <span className="truncate pr-2">"{item.text}"</span>
                  <span className="text-[10px] text-amber-800/50 dark:text-amber-300/40 shrink-0 font-mono">
                    {item.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
