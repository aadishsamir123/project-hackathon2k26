import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Tag,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  CheckCircle2,
  Sliders,
  BookOpen,
  Filter,
  BarChart3,
  Heart
} from 'lucide-react';
import { saveMoodLog, subscribeToMoodLogs } from '../services/firestore.js';

export default function MoodTracker({ user }) {
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('Calm');
  const [selectedEmoji, setSelectedEmoji] = useState('🌿');
  const [intensity, setIntensity] = useState(7);
  const [selectedTags, setSelectedTags] = useState(['Exams', 'Sleep']);
  const [journalNote, setJournalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filterTag, setFilterTag] = useState('All');

  const emotionsList = [
    { name: 'Joyful', emoji: '🌟', defaultRating: 9, bg: 'bg-amber-500 text-white' },
    { name: 'Calm', emoji: '🌿', defaultRating: 8, bg: 'bg-emerald-500 text-white' },
    { name: 'Motivated', emoji: '🔥', defaultRating: 9, bg: 'bg-orange-500 text-white' },
    { name: 'Hopeful', emoji: '🌈', defaultRating: 8, bg: 'bg-teal-500 text-white' },
    { name: 'Tired', emoji: '🌙', defaultRating: 5, bg: 'bg-slate-500 text-white' },
    { name: 'Anxious', emoji: '🌧️', defaultRating: 4, bg: 'bg-indigo-500 text-white' },
    { name: 'Overwhelmed', emoji: '⚡', defaultRating: 3, bg: 'bg-purple-500 text-white' },
    { name: 'Sad', emoji: '💧', defaultRating: 3, bg: 'bg-sky-500 text-white' },
    { name: 'Frustrated', emoji: '😤', defaultRating: 4, bg: 'bg-rose-500 text-white' },
  ];

  const availableTags = [
    'Exams', 'Academic Pressure', 'Sleep & Rest', 'Social & Friends',
    'Family', 'Health & Body', 'Finances', 'Personal Growth', 'Loneliness'
  ];

  useEffect(() => {
    const unsub = subscribeToMoodLogs(user?.uid, (logs) => {
      setMoodLogs(logs);
    });
    return unsub;
  }, [user]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectEmotion = (item) => {
    setSelectedEmotion(item.name);
    setSelectedEmoji(item.emoji);
    setIntensity(item.defaultRating);
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const logEntry = {
      emotion: selectedEmotion,
      emoji: selectedEmoji,
      intensity: parseInt(intensity),
      tags: selectedTags,
      note: journalNote || `Logged ${selectedEmotion.toLowerCase()} feeling.`,
    };

    await saveMoodLog(user?.uid, logEntry);
    setIsSubmitting(false);
    setSaveSuccess(true);
    setJournalNote('');

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Filtering logs
  const filteredLogs = filterTag === 'All'
    ? moodLogs
    : moodLogs.filter((log) => log.tags && log.tags.includes(filterTag));

  // Analytics calculation
  const totalEntries = moodLogs.length;
  const avgIntensity = totalEntries
    ? (moodLogs.reduce((acc, curr) => acc + (curr.intensity || 5), 0) / totalEntries).toFixed(1)
    : 7.0;

  // Most frequent emotion
  const emotionCounts = {};
  moodLogs.forEach((l) => {
    emotionCounts[l.emotion] = (emotionCounts[l.emotion] || 0) + 1;
  });
  const topEmotion = Object.keys(emotionCounts).reduce((a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b), 'Calm');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Personal Reflection Space
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-1">
            Emotion & Mood Tracker 📊
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Log how you feel, track intensity, record context triggers, and gain deep emotional awareness over time.
          </p>
        </div>

        {/* Quick Metrics Header Pill */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="px-3 border-r border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-medium block">Total Entries</span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">{totalEntries}</span>
          </div>
          <div className="px-3 border-r border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-medium block">Avg Wellness</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{avgIntensity}/10</span>
          </div>
          <div className="px-3 text-center">
            <span className="text-[10px] text-slate-400 font-medium block">Dominant Vibe</span>
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{topEmotion}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Log New Emotion (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/80">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                  New Journal Entry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  How are you feeling at this moment?
                </p>
              </div>
            </div>

            {saveSuccess && (
              <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitLog} className="space-y-6">
            
            {/* Step 1: Emotion Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                1. Select Primary Emotion
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {emotionsList.map((item) => {
                  const isSelected = selectedEmotion === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => handleSelectEmotion(item)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105 font-bold'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-xs">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Intensity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  2. Intensity Rating ({intensity} / 10)
                </label>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {intensity <= 3 ? 'Low / Struggling' : intensity <= 6 ? 'Moderate' : 'High / Flourishing'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 px-1 font-mono">
                <span>1 (Heavy)</span>
                <span>5 (Neutral)</span>
                <span>10 (Thriving)</span>
              </div>
            </div>

            {/* Step 3: Context Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                3. What's influencing this feeling?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        active
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Journal Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                4. Personal Journal Thoughts (Private)
              </label>
              <textarea
                rows="3"
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Write whatever is on your mind today. No judgement, just release..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Journal Entry…' : 'Save Emotion Log'}</span>
            </button>
          </form>
        </div>

        {/* Right Columns: Visual Analytics & Timeline History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Visual Intensity Distribution Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Recent Emotion Breakdown</span>
            </h3>

            {moodLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">
                Your emotion trends will appear here after your first log.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.keys(emotionCounts).map((emotionKey) => {
                  const count = emotionCounts[emotionKey];
                  const percentage = Math.round((count / totalEntries) * 100);
                  return (
                    <div key={emotionKey} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{emotionKey}</span>
                        <span className="text-slate-400 font-mono">{count} logs ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Timeline History & Tag Filter */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Journal History</span>
              </h3>

              {/* Tag filter dropdown */}
              <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px]">
                <Filter className="w-3 h-3 text-slate-400" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
                >
                  <option value="All">All Contexts</option>
                  {availableTags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs italic">
                No logs match the selected tag filter.
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {filteredLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{log.emoji || '🌿'}</span>
                        <div>
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{log.emotion}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {log.intensity}/10
                      </span>
                    </div>

                    {log.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic pl-1 border-l-2 border-slate-200 dark:border-slate-700">
                        "{log.note}"
                      </p>
                    )}

                    {log.tags && log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {log.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
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
