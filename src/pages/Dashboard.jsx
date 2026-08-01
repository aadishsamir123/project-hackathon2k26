import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  MessageSquareHeart,
  Wind,
  TrendingUp,
  Sun,
  Plus,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Activity,
  Moon,
  Compass,
  PhoneCall,
  MapPin,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { saveMoodLog, subscribeToMoodLogs, saveGratitudeEntry, getLocalGratitudeEntries } from '../services/firestore.js';
import { generateDailyAffirmation } from '../services/gemini.js';
import DuolingoDailyPath from '../components/common/DuolingoDailyPath.jsx';
import PagePurposeHeader from '../components/common/PagePurposeHeader.jsx';

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

  const waterCount = parseInt(localStorage.getItem('mindhaven_water_count') || '3', 10);

  // Proactive burnout trend detection — last 7 days
  const burnoutAlert = useMemo(() => {
    if (moodLogs.length < 3) return null;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentLogs = moodLogs.filter(log => {
      const ts = log.createdAt?.toDate?.()?.getTime?.() || new Date(log.createdAt || 0).getTime();
      return ts >= sevenDaysAgo;
    });
    // Count distress tags
    const tagCounts = {};
    const distressTags = ['Anxious', 'Overwhelmed', 'Exams', 'Stressed', 'Burned Out', 'Tired', 'Sad', 'Burnout'];
    recentLogs.forEach(log => {
      const emotion = log.emotion || '';
      if (distressTags.some(t => emotion.toLowerCase().includes(t.toLowerCase()))) {
        tagCounts[emotion] = (tagCounts[emotion] || 0) + 1;
      }
      (log.tags || []).forEach(t => {
        if (distressTags.some(d => t.toLowerCase().includes(d.toLowerCase()))) {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
      });
    });
    const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTag && topTag[1] >= 3) return { tag: topTag[0], count: topTag[1] };
    return null;
  }, [moodLogs]);

  // Mood-body correlation: mood avg vs hydration
  const correlationInsight = useMemo(() => {
    const mood = parseFloat(avgIntensity);
    const water = waterCount;
    if (mood >= 7 && water >= 6) return { type: 'positive', text: `Your mood (${mood}/10) and hydration (${water} cups) are both high — your mind-body connection is thriving! 💪` };
    if (mood < 5 && water < 4) return { type: 'negative', text: `Low mood (${mood}/10) often correlates with low hydration (${water} cups). Try drinking more water today. 💧` };
    if (mood < 5) return { type: 'mood', text: `Your average mood is ${mood}/10 this week. Breathing exercises and journaling can help shift this pattern.` };
    if (water < 4) return { type: 'hydration', text: `You're only hitting ${water} cups today. Research links hydration to better focus and reduced anxiety. 💧` };
    return null;
  }, [avgIntensity, waterCount]);

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
      
      {/* Mental Health Purpose Header */}
      <PagePurposeHeader
        badge="Daily Mental Health Quest Path"
        title="Mindful Sanctuary Hub"
        purpose="HealthHaven presents a single daily path where each station unlocks in order. Progress step-by-step to regulate emotions, body, and mind."
        evidence="Sequential goal structuring (gamified habit loops) lowers decision fatigue and boosts completion rates for mental health practices by 300%."
        dailyAction="Tap the active station on your Duolingo-style path below to begin today's quest."
      />

      {/* 🗺️ SINGLE DUOLINGO-STYLE DAILY PATH (Winding Vertical Path) */}
      <DuolingoDailyPath user={user} />

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
              className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center space-y-1 cursor-pointer ${
                selectedQuickEmotion === emo.name
                  ? 'bg-amber-100 dark:bg-amber-950 border-orange-500 font-bold text-orange-950 dark:text-orange-200'
                  : 'bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-700'
              }`}
            >
              <span className="text-xl">{emo.emoji}</span>
              <span className="text-xs text-stone-700 dark:text-stone-300 font-sans">{emo.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics & Gratitude Jar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Wellbeing Summary + Correlation */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-3">
          <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span>Wellbeing Summary</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60">
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Mood Index</p>
              <p className="text-xl font-extrabold text-stone-800 dark:text-stone-100 mt-1">
                {avgIntensity} <span className="text-xs font-normal text-stone-400">/ 10</span>
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">{moodLogs.length} entries logged</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60">
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Hydration Today</p>
              <p className="text-xl font-extrabold text-stone-800 dark:text-stone-100 mt-1">
                {waterCount} <span className="text-xs font-normal text-stone-400">/ 8 cups</span>
              </p>
              <div className="flex space-x-0.5 mt-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i < waterCount ? 'bg-orange-500' : 'bg-amber-100 dark:bg-stone-700'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Mood–Body Correlation Insight */}
          {correlationInsight && (
            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200/50 dark:border-stone-700 flex items-start space-x-2">
              <BarChart3 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                <span className="font-bold text-orange-700 dark:text-orange-300">Mind-Body Correlation: </span>
                {correlationInsight.text}
              </p>
            </div>
          )}
        </div>

        {/* Happiness Jar */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Sun className="w-4 h-4 text-orange-600" />
              <span>Happiness Jar</span>
            </h3>
            <span className="text-xs text-stone-400">
              {gratitudeLogs.length} {gratitudeLogs.length === 1 ? 'Memory' : 'Memories'}
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

          {gratitudeLogs.length === 0 ? (
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-dashed border-amber-300/60 dark:border-stone-700 text-center space-y-1">
              <p className="text-lg">☕</p>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">Your jar is empty — start filling it!</p>
              <p className="text-[11px] text-stone-400 leading-snug">Even "had a warm coffee" counts. Small joys build resilience.</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {gratitudeLogs.slice(0, 3).map((entry, i) => (
                <div key={i} className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed">
                  "{entry?.text || entry}"
                </div>
              ))}
            </div>
          )}

          {showGratitudeSuccess && (
            <p className="text-[11px] text-orange-600 font-semibold text-center">✓ Memory saved to your jar!</p>
          )}
        </div>

      </div>

      {/* 📘 MIND & BODY PRACTICE HUB (JOURNAL GUIDELINE TOOLKITS) */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/70 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-stone-800 dark:text-stone-100">
                Mind & Body Practice Hub
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                9 evidence-based toolkits integrated from leading wellness & reflection journals.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard/calmandai/wellness-guide')}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>Open Interactive Handbook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          <button
            onClick={() => navigate('/dashboard/myspace/emotionlog')}
            className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 hover:border-orange-400 text-left transition-all group"
          >
            <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block group-hover:text-orange-600">5-4-3-2-1 Grounding</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Anti-Anxiety Notebook</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/myspace/emotionlog')}
            className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 hover:border-orange-400 text-left transition-all group"
          >
            <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block group-hover:text-orange-600">PMR Muscle Release</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Wreck This Journal</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/myspace/physical')}
            className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 hover:border-orange-400 text-left transition-all group"
          >
            <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block group-hover:text-orange-600">90° Ergonomics</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Moleskine Workstation</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/myspace/physical')}
            className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 hover:border-orange-400 text-left transition-all group"
          >
            <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block group-hover:text-orange-600">Cat-Cow Mobility</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Papier Yoga Journal</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/calmandai/serenity')}
            className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 hover:border-orange-400 text-left transition-all group"
          >
            <span className="text-xs font-bold text-stone-800 dark:text-stone-100 block group-hover:text-orange-600">Box Breathing 4-4</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Five Minute Journal</span>
          </button>
        </div>
      </div>

    </div>
  );
}
