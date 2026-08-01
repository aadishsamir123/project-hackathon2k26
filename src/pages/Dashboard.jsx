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
  MapPin
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
    { name: 'Joyful', emoji: '✨' },
    { name: 'Calm', emoji: '🌿' },
    { name: 'Anxious', emoji: '☁️' },
    { name: 'Overwhelmed', emoji: '⚡' },
    { name: 'Tired', emoji: '🌙' },
    { name: 'Sad', emoji: '💧' },
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
      note: `Quick check-in logged (${emotion.name})`,
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

  // Simple, Serene Path Stations
  const pathStations = [
    {
      num: '01',
      title: 'Heart & Emotion Journal',
      desc: 'Reflect on how your heart feels right now and log deep entries.',
      icon: BookOpen,
      path: '/dashboard/myspace/emotionlog'
    },
    {
      num: '02',
      title: 'Body Vitality & Rest',
      desc: 'Track hydration, sleep quality, and practice 20-20-20 eye breaks.',
      icon: Activity,
      path: '/dashboard/myspace/physical'
    },
    {
      num: '03',
      title: 'Serenity & Breathing',
      desc: 'Guided breathing techniques and relaxing ambient soundscapes.',
      icon: Wind,
      path: '/dashboard/calmandai/serenity'
    },
    {
      num: '04',
      title: 'MindPal AI Companion',
      desc: 'Chat with a gentle AI listener and reframe unhelpful thoughts.',
      icon: Compass,
      path: '/dashboard/calmandai/mindpal'
    },
    {
      num: '05',
      title: 'Peer Haven Support',
      desc: 'Read or share anonymous encouragement with fellow students.',
      icon: MessageSquareHeart,
      path: '/dashboard/connect/peerhaven'
    },
    {
      num: '06',
      title: '24/7 Emergency Care',
      desc: 'Immediate access to free 24/7 student crisis lines and hotlines.',
      icon: PhoneCall,
      path: '/dashboard/connect/resources'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Calm Welcome Header */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] p-6 sm:p-8 rounded-3xl border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-200">
              🌿 Peaceful Sanctuary Path
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-2">
              Welcome, {user?.displayName ? user.displayName.split(' ')[0] : 'Friend'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Follow the simple path below to care for your mind and body today.
            </p>
          </div>

          <button
            onClick={onOpenHelp}
            className="px-3.5 py-2 rounded-2xl bg-[#FAF6EE] dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-200/60 text-xs font-semibold hover:bg-amber-100/60 transition-all shrink-0 flex items-center space-x-1.5"
          >
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>Guide</span>
          </button>
        </div>

        {/* Preset Daily Affirmation */}
        {affirmation && (
          <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300 block">
                Today's Calm Affirmation
              </span>
              <p className="whitespace-pre-line text-stone-700 dark:text-stone-300">
                {affirmation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Heart Check-in */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] p-5 rounded-3xl border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <Heart className="w-4 h-4 text-orange-600 fill-orange-600/20" />
            <span>Quick Check-in</span>
          </h2>
          {selectedQuickEmotion && (
            <span className="text-xs text-orange-700 dark:text-orange-300">
              Logged: {selectedQuickEmotion} ✓
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickEmotions.map((emo) => (
            <button
              key={emo.name}
              onClick={() => handleQuickCheckin(emo)}
              className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center space-y-1 ${
                selectedQuickEmotion === emo.name
                  ? 'bg-amber-100 dark:bg-amber-950 border-orange-500 font-bold'
                  : 'bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/60 dark:border-stone-700 hover:bg-amber-50'
              }`}
            >
              <span className="text-xl">{emo.emoji}</span>
              <span className="text-xs text-stone-700 dark:text-stone-300">{emo.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🛣️ SIMPLE MINDFUL PATH (Vertical List) */}
      <div id="tour-mindful-path" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>Mindful Path</span>
          </h2>
          <span className="text-xs text-stone-400">6 Steps</span>
        </div>

        <div className="space-y-3">
          {pathStations.map((station) => {
            const Icon = station.icon;
            return (
              <div
                key={station.num}
                onClick={() => navigate(station.path)}
                className="bg-[#FFFDF9] dark:bg-[#262220] p-4 sm:p-5 rounded-2xl border border-amber-200/70 dark:border-stone-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all cursor-pointer group shadow-xs flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-amber-100/80 dark:bg-amber-950/80 px-2.5 py-1 rounded-xl shrink-0">
                    {station.num}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-stone-800 text-orange-600 dark:text-orange-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                      {station.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {station.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Metrics & Gratitude Jar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Wellbeing Summary */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-3">
          <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span>Wellbeing Summary</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60">
              <p className="text-[10px] text-stone-500 font-medium">Happiness Index</p>
              <p className="text-xl font-extrabold text-stone-800 dark:text-stone-100 mt-1">
                {avgIntensity} / 10
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60">
              <p className="text-[10px] text-stone-500 font-medium">Hydration Log</p>
              <p className="text-xl font-extrabold text-stone-800 dark:text-stone-100 mt-1">
                {waterCount} / 8 <span className="text-xs font-normal">cups</span>
              </p>
            </div>
          </div>
        </div>

        {/* Happiness Jar */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Sun className="w-4 h-4 text-orange-600" />
              <span>Happiness Jar</span>
            </h3>
            <span className="text-xs text-stone-400">
              {gratitudeLogs.length} Memories
            </span>
          </div>

          <form onSubmit={handleAddGratitude} className="flex items-center space-x-2">
            <input
              type="text"
              value={gratitudeInput}
              onChange={(e) => setGratitudeInput(e.target.value)}
              placeholder="Add a small happy memory..."
              className="flex-1 bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl px-3.5 py-2 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />
            <button
              type="submit"
              disabled={!gratitudeInput.trim()}
              className="p-2 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {gratitudeLogs.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300 truncate">
              "{gratitudeLogs[0].text}"
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
