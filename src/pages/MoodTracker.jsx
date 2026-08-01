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
import PagePurposeHeader from '../components/common/PagePurposeHeader.jsx';

export default function MoodTracker({ user }) {
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('Calm');
  const [selectedEmoji, setSelectedEmoji] = useState('🌿');
  const [intensity, setIntensity] = useState(7);
  const [selectedTags, setSelectedTags] = useState(['Exams', 'Rest']);
  const [journalNote, setJournalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filterTag, setFilterTag] = useState('All');

  const emotionsList = [
    { name: 'Joyful', emoji: '✨', defaultRating: 9 },
    { name: 'Calm', emoji: '🌿', defaultRating: 8 },
    { name: 'Motivated', emoji: '🔥', defaultRating: 9 },
    { name: 'Hopeful', emoji: '🌱', defaultRating: 8 },
    { name: 'Tired', emoji: '🌙', defaultRating: 5 },
    { name: 'Anxious', emoji: '☁️', defaultRating: 4 },
    { name: 'Overwhelmed', emoji: '⚡', defaultRating: 3 },
    { name: 'Sad', emoji: '💧', defaultRating: 3 },
  ];

  const availableTags = [
    'Exams', 'Academic Pressure', 'Rest & Sleep', 'Friends',
    'Family', 'Health', 'Personal Growth'
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

  const handleSelectEmotion = (emo) => {
    setSelectedEmotion(emo.name);
    setSelectedEmoji(emo.emoji);
    setIntensity(emo.defaultRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const newLog = {
      emotion: selectedEmotion,
      emoji: selectedEmoji,
      intensity: intensity,
      tags: selectedTags,
      note: journalNote.trim(),
    };

    await saveMoodLog(user?.uid, newLog);
    setJournalNote('');
    setIsSubmitting(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredLogs = filterTag === 'All'
    ? moodLogs
    : moodLogs.filter((l) => l.tags && l.tags.includes(filterTag));

  const totalEntries = moodLogs.length;
  const avgIntensity = totalEntries
    ? (moodLogs.reduce((acc, curr) => acc + (curr.intensity || 5), 0) / totalEntries).toFixed(1)
    : '7.5';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Mental Health Purpose Header */}
      <PagePurposeHeader
        badge="Heart & Emotion Journaling"
        title="Heart & Emotion Journal"
        purpose="Track, articulate, and understand your daily emotional patterns, triggers, and cognitive insights."
        evidence="Emotional granular labeling (affect labeling) reduces amygdala reactivity and helps transition out of stress response."
        dailyAction="Log your current emotion, rate intensity from 1-10, attach context tags, and write a brief reflection note."
        stepNumber={1}
        totalSteps={6}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* New Entry Card */}
        <div id="tour-emotion-entry" className="lg:col-span-7 bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-5">
          <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span>New Reflection Entry</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Emotion Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Select Emotion:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {emotionsList.map((emo) => (
                  <button
                    key={emo.name}
                    type="button"
                    onClick={() => handleSelectEmotion(emo)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1 ${
                      selectedEmotion === emo.name
                        ? 'bg-amber-100 dark:bg-amber-950 border-orange-500 font-bold scale-105'
                        : 'bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/50 text-stone-600 dark:text-stone-300 hover:bg-amber-50'
                    }`}
                  >
                    <span className="text-xl">{emo.emoji}</span>
                    <span className="text-[10px] truncate">{emo.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                <span className="font-bold">Intensity Level:</span>
                <span className="font-mono font-bold text-orange-600">{intensity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                className="w-full accent-orange-600"
              />
            </div>

            {/* Context Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Context Tags:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSel = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isSel
                          ? 'bg-orange-600 text-white font-bold'
                          : 'bg-[#FAF6EE] dark:bg-stone-800 border border-amber-200/50 text-stone-600 dark:text-stone-300 hover:bg-amber-50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Journal Note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Private Journal Note:
              </label>
              <textarea
                rows="3"
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Write your private thoughts here..."
                className="w-full bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl p-3.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs"
            >
              {saveSuccess ? 'Saved to Private Journal ✓' : 'Save Entry'}
            </button>

          </form>
        </div>

        {/* Previous Entries List */}
        <div className="lg:col-span-5 bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
              Journal Entries
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              {totalEntries} Total
            </span>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterTag('All')}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                filterTag === 'All'
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#FAF6EE] dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              All
            </button>
            {availableTags.slice(0, 4).map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                  filterTag === tag
                    ? 'bg-orange-600 text-white'
                    : 'bg-[#FAF6EE] dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-dashed border-amber-300/60 dark:border-stone-700 text-center space-y-2">
                <p className="text-2xl">🌱</p>
                <p className="text-xs font-bold text-stone-700 dark:text-stone-200">Your journal is waiting</p>
                <p className="text-[11px] text-stone-400 leading-relaxed max-w-xs mx-auto">
                  Log your first emotion on the left to begin tracking your personal wellbeing journey. Every entry helps MindPal understand you better.
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{log.emoji || '🌿'}</span>
                      <span className="font-bold text-stone-800 dark:text-stone-100">{log.emotion}</span>
                    </div>
                    <span className="font-mono text-[10px] text-orange-700 dark:text-orange-300 font-bold">
                      {log.intensity}/10
                    </span>
                  </div>

                  {log.note && (
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                      "{log.note}"
                    </p>
                  )}

                  {log.tags && log.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {log.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
