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
  CheckCircle2
} from 'lucide-react';
import { updateUserName, logOut } from '../services/auth.js';
import { subscribeToMoodLogs, getLocalGratitudeEntries } from '../services/firestore.js';

export default function ProfilePage({ user }) {
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
    window.location.reload(); // Reload cleanly to reset app state
  };

  // Calculations for stats
  const totalEntries = moodLogs.length;
  const avgIntensity = totalEntries
    ? (moodLogs.reduce((acc, curr) => acc + (curr.intensity || 5), 0) / totalEntries).toFixed(1)
    : 7.0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
          Account Settings
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
          Your Profile & Statistics 👤
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your account display name and check your overall emotional wellness metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info Card (1 col) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col items-center justify-between text-center min-h-[350px]">
          <div className="space-y-4 w-full flex flex-col items-center pt-4">
            {/* Google Photo or Initial Badge */}
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 dark:border-slate-700 shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white flex items-center justify-center font-extrabold text-4xl shadow-md">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}

            <div>
              <h2 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                {user?.displayName || 'Student Friend'}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-55 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Verified Student Account
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full mt-6 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right Columns: Edit Form & Stats Panels (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Edit Display Name Profile Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span>Profile Details</span>
              </h3>

              {updateSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Name updated!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Display Name / Student Nickname
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating || !displayName.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdating ? 'Saving Changes…' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Statistics Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Wellbeing Metrics & Statistics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Journal Entries</span>
                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">
                  {totalEntries}
                </span>
                <span className="text-[10px] text-slate-400 block">Total logged logs</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Happiness</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {avgIntensity} / 10
                </span>
                <span className="text-[10px] text-slate-400 block">Overall emotional level</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gratitude Collected</span>
                <span className="text-2xl font-extrabold text-amber-500 mt-1 block">
                  {gratitudeLogs.length}
                </span>
                <span className="text-[10px] text-slate-400 block">Moments in Happiness Jar</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-slate-800 text-xs text-indigo-850 dark:text-indigo-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Streak Status: <strong>{totalEntries > 0 ? 'Consistent Contributor 🔥' : 'Log a mood today to start a streak!'}</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
