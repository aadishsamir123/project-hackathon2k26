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
  Moon
} from 'lucide-react';
import { saveMoodLog, subscribeToMoodLogs, saveGratitudeEntry, getLocalGratitudeEntries } from '../services/firestore.js';
import { generateDailyAffirmation } from '../services/gemini.js';

export default function Dashboard({ user, onOpenHelp }) {
  const navigate = useNavigate();
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedQuickEmotion, setSelectedQuickEmotion] = useState(null);
  const [quickNote, setQuickNote] = useState('');
  const [isSavedQuick, setIsSavedQuick] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [loadingAffirmation, setLoadingAffirmation] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [gratitudeLogs, setGratitudeLogs] = useState([]);
  const [gratitudeSaved, setGratitudeSaved] = useState(false);
  const [journalPromptIndex, setJournalPromptIndex] = useState(0);

  const journalingPrompts = [
    "What is one small thing that went well for you today?",
    "Identify a moment you felt calm. What caused it?",
    "Name a person you appreciate. Why are you grateful for them?",
    "How did you show kindness to yourself today?",
    "What is a boundary you successfully maintained today?"
  ];

  const quickEmotions = [
    { name: 'Joyful', emoji: '🌟', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' },
    { name: 'Calm', emoji: '🌿', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' },
    { name: 'Anxious', emoji: '🌧️', color: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800' },
    { name: 'Overwhelmed', emoji: '⚡', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' },
    { name: 'Tired', emoji: '🌙', color: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
    { name: 'Sad', emoji: '💧', color: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800' },
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
      emoji: emotion.emoji,
      intensity: intensityMap[emotion.name] || 5,
      tags: ['Daily Check-in'],
      note: quickNote || `Feeling ${emotion.name.toLowerCase()} today.`,
    };
    await saveMoodLog(user?.uid, newLog);
    setIsSavedQuick(true);
    fetchAffirmation(emotion.name);
    setTimeout(() => {
      setIsSavedQuick(false);
      setQuickNote('');
    }, 2500);
  };

  const handleAddGratitude = (e) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;
    const updated = saveGratitudeEntry(gratitudeText.trim());
    setGratitudeLogs(updated);
    setGratitudeText('');
    setGratitudeSaved(true);
    setTimeout(() => setGratitudeSaved(false), 2000);
  };

  const recentLogs = moodLogs.slice(0, 5);
  const avgIntensity = moodLogs.length
    ? Math.round(moodLogs.reduce((acc, curr) => acc + (curr.intensity || 5), 0) / moodLogs.length)
    : 7;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Welcome & Mood Focus Banner */}
      <div id="tour-home-hub" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-100 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>Student Happiness & Emotion Hub</span>
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Let's log your emotional state, {user?.displayName ? user.displayName.split(' ')[0] : 'friend'} 🌿
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Tracking your mood regularly builds emotional awareness and resiliency. Write in your private journal, fill your Happiness Jar, or talk to MindPal AI.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => navigate('/dashboard/myspace/emotionlog')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Write Full Journal Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Main Mood Tracker & Reflective Journal Prompt */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Check-in with Journal Prompts */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span>How is your heart today?</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select an emotion and answer the prompt below to add to your private mental health journal.
                </p>
              </div>

              {isSavedQuick && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Journal entry saved!</span>
                </span>
              )}
            </div>

            {/* Quick Emotion Picker */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {quickEmotions.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleQuickCheckin(item)}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition-all duration-200 hover:scale-105 ${
                    selectedQuickEmotion === item.name
                      ? item.color + ' shadow-xs ring-2 ring-emerald-500/50'
                      : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-semibold">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Guided Journaling Prompts Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mental Health Writing Prompt</span>
                </span>
                <button
                  onClick={() => setJournalPromptIndex((prev) => (prev + 1) % journalingPrompts.length)}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Next Prompt →
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 italic">
                "{journalingPrompts[journalPromptIndex]}"
              </p>
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Write your response here..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          {/* AI Positive Calm Affirmation */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-emerald-50/60 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-emerald-950/40 border border-indigo-100 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Daily Affirmation
                  </h4>
                  <p className="text-[10px] text-indigo-600/80 dark:text-indigo-300/80">
                    Mental wellness support and grounding prompts
                  </p>
                </div>
              </div>

              <button
                onClick={() => fetchAffirmation(selectedQuickEmotion || 'Calm')}
                disabled={loadingAffirmation}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-slate-700 hover:bg-indigo-50 text-xs transition-all flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAffirmation ? 'animate-spin' : ''}`} />
                <span className="text-[11px] font-medium hidden sm:inline">Refresh</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-serif italic py-1">
              {loadingAffirmation ? (
                <div className="py-4 text-center text-slate-400 text-xs font-sans">
                  Crafting comfort for you…
                </div>
              ) : (
                affirmation || 'You are allowed to take things one step at a time. Rest is an essential part of your growth.'
              )}
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate('/dashboard/myspace/emotionlog')}
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer group shadow-xs space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>Emotion Journal</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Log deep emotion ratings, add context tags, and view weekly graphs.
              </p>
            </div>

            <div
              onClick={() => navigate('/dashboard/myspace/physical')}
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer group shadow-xs space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>Physical Vitality</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hydration log, sleep quality, 20-20-20 eye rest & study stretches.
              </p>
            </div>

            <div
              onClick={() => navigate('/dashboard/calmandai/mindpal')}
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group shadow-xs space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>MindPal AI</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Empathetic chat assistant, CBT Thought Reframer, and grounding tools.
              </p>
            </div>

            <div
              onClick={() => navigate('/dashboard/calmandai/serenity')}
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer group shadow-xs space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>Serenity Corner</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Animated breathing exercise cycles and soothing ambient soundscapes.
              </p>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Stats, Happiness Jar, Recent Entries */}
        <div className="space-y-6">
          
          {/* Mental Health Stats Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Emotional Wellbeing Score</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Journal Entries</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                  {moodLogs.length}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Happiness Index</p>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {avgIntensity} / 10
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Consistency Streak: <strong>{moodLogs.length ? 'Active 🔥' : 'Start Log Today 🌿'}</strong></span>
            </div>
          </div>

          {/* Physical Health Summary Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-sky-500" />
                <span>Physical Vitality</span>
              </h3>
              <button
                onClick={() => navigate('/dashboard/myspace/physical')}
                className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                Track & Stretch →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
                <div className="flex items-center space-x-1 text-[10px] text-sky-700 dark:text-sky-300 font-bold">
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  <span>Hydration</span>
                </div>
                <p className="text-lg font-extrabold text-sky-700 dark:text-sky-300 mt-1">
                  {localStorage.getItem('mindhaven_water_count') || '3'} / 8 <span className="text-[10px] font-normal">cups</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center space-x-1 text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Sleep Log</span>
                </div>
                <p className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300 mt-1">
                  7.5 <span className="text-[10px] font-normal">hours</span>
                </p>
              </div>
            </div>
          </div>

          {/* Happiness Jar (Gratitude Collection) */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <Smile className="w-4 h-4 text-amber-500" />
                  <span>Happiness Jar 🍯</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Collect small moments of joy</p>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-xs font-bold text-amber-600">
                {gratitudeLogs.length}
              </div>
            </div>

            {/* Gratitude input form */}
            <form onSubmit={handleAddGratitude} className="space-y-2">
              <input
                type="text"
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder="What is 1 tiny thing you're grateful for today?"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Happiness Jar</span>
              </button>
            </form>

            {/* Gratitude log list */}
            <div className="space-y-1.5 pt-2 max-h-36 overflow-y-auto">
              {gratitudeLogs.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic"
                >
                  " {item.text} "
                </div>
              ))}
            </div>
          </div>

          {/* Recent Private Journal Log list */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100">
                Recent Journal Logs
              </h3>
              <button
                onClick={() => navigate('/dashboard/myspace/emotionlog')}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                View History
              </button>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                No entries logged yet. Answer the prompt above!
              </p>
            ) : (
              <div className="space-y-2">
                {recentLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{log.emoji || '🌿'}</span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{log.emotion}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{log.note}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {log.intensity}/10
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
