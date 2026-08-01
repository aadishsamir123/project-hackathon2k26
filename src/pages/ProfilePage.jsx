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
  Check
} from 'lucide-react';
import { updateUserName, logOut } from '../services/auth.js';
import { subscribeToMoodLogs, getLocalGratitudeEntries } from '../services/firestore.js';
import { useTheme, themeOptionsList } from '../theme/ThemeContext.jsx';

export default function ProfilePage({ user }) {
  const { theme, setTheme, enableAnimation, setEnableAnimation } = useTheme();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [moodLogs, setMoodLogs] = useState([]);
  const [gratitudeLogs, setGratitudeLogs] = useState([]);

  useEffect(() => {
    const unsub = subscribeToMoodLogs(user?.uid, (logs) => {
      setMoodLogs(logs);
    });
    setGratitudeLogs(getLocalGratitudeEntries());
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
          Account Settings
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
          Profile & Statistics
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Manage your account display name and check your emotional wellness metrics.
        </p>
      </div>

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

              {/* Procedural Animation Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Background Animations</span>
                  </span>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 block">
                    Procedurally-generated slow floating calming aura background.
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setEnableAnimation(!enableAnimation)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none flex items-center cursor-pointer ${
                    enableAnimation 
                      ? 'bg-orange-600' 
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span 
                    className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs absolute transition-all ${
                      enableAnimation 
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
              <span>Streak Status: <strong className="text-orange-700 dark:text-orange-300">Consistent Contributor 🔥</strong></span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
