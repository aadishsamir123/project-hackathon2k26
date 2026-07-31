import React from 'react';
import {
  Heart,
  MessageSquareHeart,
  Sparkles,
  Wind,
  PhoneCall,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  UserCheck,
  LogIn,
  ShieldAlert
} from 'lucide-react';

export default function Navbar({
  activePage,
  onNavigate,
  isAudioPlaying,
  onToggleAudio,
  isDarkMode,
  onToggleDarkMode,
  user,
  onOpenAuth,
  onOpenCrisis
}) {
  const navItems = [
    { id: 'dashboard', label: 'Home Hub', icon: Heart },
    { id: 'mood-tracker', label: 'Emotion Log', icon: Sparkles },
    { id: 'anon-wall', label: 'Peer Haven', icon: MessageSquareHeart },
    { id: 'ai-mentor', label: 'MindPal AI', icon: Sparkles },
    { id: 'serenity-corner', label: 'Breathing & Calm', icon: Wind },
    { id: 'resources', label: 'Help & Crisis', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  MindHaven
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Student Safe Space
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Emotional Wellness & Peer Support
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Utilities & Controls */}
          <div className="flex items-center space-x-2">
            {/* Quick SOS Crisis Hotline button */}
            <button
              onClick={onOpenCrisis}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold transition-all duration-200 shadow-xs"
              title="Immediate Crisis Resources & Hotline"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>SOS Helplines</span>
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                isAudioPlaying
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title={isAudioPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Calm Soundscape'}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-indigo-500 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all"
              title="Toggle Dark/Light Calming Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* User Account / Guest Status */}
            {user ? (
              <div className="flex items-center space-x-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center font-bold text-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('signin')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
