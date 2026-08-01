import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Smile,
  ShieldCheck,
  TrendingUp,
  LogOut,
  Sparkles,
  Save,
  CheckCircle2,
  Palette,
  Check,
  Sun,
  Moon,
  RotateCcw,
  Wrench,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { updateUserName, logOut } from '../services/auth.js';
import { subscribeToMoodLogs, getLocalGratitudeEntries, getUserProfile, setUserDebugFlag } from '../services/firestore.js';
import { useTheme, themeOptionsList } from '../theme/ThemeContext.jsx';
import DemoResetModal from '../components/common/DemoResetModal.jsx';
import PagePurposeHeader from '../components/common/PagePurposeHeader.jsx';

export default function ProfilePage({ user }) {
  const { theme, setTheme, isDarkMode, setIsDarkMode } = useTheme();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [moodLogs, setMoodLogs] = useState([]);
  const [gratitudeLogs, setGratitudeLogs] = useState([]);
  const [userDoc, setUserDoc] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isTogglingDebug, setIsTogglingDebug] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMoodLogs(user?.uid, (logs) => {
      setMoodLogs(logs);
    });
    setGratitudeLogs(getLocalGratitudeEntries());

    if (user?.uid) {
      getUserProfile(user.uid).then((docData) => {
        if (docData) setUserDoc(docData);
      });
    }

    return unsub;
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim() || isUpdating) return;
    setIsUpdating(true);

    const { error } = await updateUserName(user, displayName.trim());
    setIsUpdating(false);

    if (!error) {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  const handleSignOut = async () => {
    await logOut();
    window.location.reload();
  };

  const totalEntries = moodLogs.length;
  const avgIntensity = totalEntries
    ? (moodLogs.reduce((acc, curr) => acc + (curr.intensity || 5), 0) / totalEntries).toFixed(1)
    : '7.5';

  const calculateStreak = (logs) => {
    if (!logs || logs.length === 0) return 0;
    
    const logDates = Array.from(new Set(
      logs.map(log => {
        const dateStr = log.createdAt || log.timestamp;
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) 
          ? null 
          : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }).filter(Boolean)
    )).sort((a, b) => new Date(b) - new Date(a));

    if (logDates.length === 0) return 0;

    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
    
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;

    const hasToday = logDates.includes(todayStr);
    const hasYesterday = logDates.includes(yesterdayStr);

    if (!hasToday && !hasYesterday) return 0;

    let streak = 0;
    let currentDate = hasToday ? todayObj : yesterdayObj;

    while (true) {
      const checkStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      if (logDates.includes(checkStr)) {
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak(moodLogs);

  const getStreakLevelBadge = (streak) => {
    if (streak === 0) return 'Starting Fresh 🌱 (Log today to begin!)';
    if (streak <= 2) return 'Mindful Beginner ⚡';
    if (streak <= 5) return 'Consistent Contributor 🔥';
    if (streak <= 9) return 'Sanctuary Seeker 🛡️';
    return 'Zen Master 🧘';
  };

  const isDebugMode = userDoc?.debug === true || userDoc?.debug === 'true';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Mental Health Purpose Header */}
      <PagePurposeHeader
        badge="Account Sanctuary & Controls"
        title="Profile & Demo Settings"
        purpose="Manage your personal sanctuary account details, view emotional wellness statistics, and access hackathon demo controls."
        evidence="Personalization and self-monitoring increase emotional engagement and sense of agency in digital wellness tools."
        dailyAction="Review your streak status, update your display nickname, and configure hackathon demo data."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Avatar & Sign Out Card */}
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs flex flex-col items-center justify-between text-center min-h-[350px]">
          <div className="space-y-4 w-full flex flex-col items-center pt-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-200 dark:border-stone-700 shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white flex items-center justify-center font-extrabold text-4xl shadow-md font-mono">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}

            <div>
              <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                {user?.displayName || 'Student Friend'}
              </h2>
              <p className="text-xs text-stone-400 font-mono mt-0.5">{user?.email}</p>
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
              Verified Student Account
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full mt-6 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Edit Form & Stats Panels */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Edit Display Name Profile Form */}
          <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/40 dark:border-stone-800">
              <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <User className="w-4 h-4 text-orange-600" />
                <span>Profile Details</span>
              </h3>

              {updateSuccess && (
                <span className="text-xs text-orange-700 dark:text-orange-300 font-bold flex items-center space-x-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Name updated!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Display Name / Student Nickname
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating || !displayName.trim()}
                className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-xs flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Sanctuary Theme Preferences */}
          <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-amber-200/40 dark:border-stone-800">
              <Palette className="w-4 h-4 text-orange-600" />
              <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100">
                Sanctuary Theme Preferences
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                  Choose Color Theme:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {themeOptionsList.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                        theme === opt.id
                          ? 'ring-2 ring-orange-500 font-bold bg-amber-50/70 dark:bg-stone-800 border-transparent text-orange-700 dark:text-orange-400'
                          : 'bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800 text-stone-750 dark:text-stone-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-stone-200 dark:border-stone-700 shrink-0" 
                          style={{ backgroundColor: opt.color }}
                        />
                        <span className="truncate">{opt.name}</span>
                      </div>
                      {theme === opt.id && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Theme Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1">
                    {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse-soft" /> : <Moon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />}
                    <span>Dark Theme Mode</span>
                  </span>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 block">
                    Toggle between standard light and soothing dark modes.
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none flex items-center cursor-pointer ${
                    isDarkMode 
                      ? 'bg-orange-600' 
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span 
                    className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs absolute transition-all ${
                      isDarkMode 
                        ? 'translate-x-5.5' 
                        : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Emotional Wellbeing Statistics */}
          <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span>Wellbeing Metrics & Statistics</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50">
                <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Journal Entries</span>
                <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1 block font-mono">{totalEntries}</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">Total logged</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50">
                <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Avg Happiness</span>
                <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-1 block font-mono">{avgIntensity} / 10</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">Overall level</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50">
                <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Gratitude Jar</span>
                <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1 block font-mono">{gratitudeLogs.length}</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">Moments saved</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50 text-xs text-stone-700 dark:text-stone-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>
                Streak Status:{' '}
                <strong className="text-orange-700 dark:text-orange-300">
                  {currentStreak} Day{currentStreak === 1 ? '' : 's'} ({getStreakLevelBadge(currentStreak)})
                </strong>
              </span>
            </div>
          </div>

          {/* Hackathon Demo & Debug Controls (Only rendered for accounts with debug=true in Firestore database) */}
          {isDebugMode && (
            <div className="bg-gradient-to-br from-[#FFFDF9] to-amber-50/70 dark:from-[#262220] dark:to-stone-900 rounded-3xl p-6 border-2 border-orange-400/80 dark:border-orange-600/80 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Wrench className="w-4.5 h-4.5" />
                  </div>
                  <div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-1 border-t border-amber-200/60 dark:border-stone-800">

                <div className="flex items-center justify-start pt-1">
                  <button
                    onClick={() => setIsDemoModalOpen(true)}
                    className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Data for Demo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Demo Reset Modal */}
      <DemoResetModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        user={user}
      />

    </div>
  );
}
