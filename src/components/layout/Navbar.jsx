import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  MessageSquareHeart,
  Sparkles,
  Wind,
  PhoneCall,
  Volume2,
  VolumeX,
  LogIn,
  Compass,
  ChevronDown,
  Activity,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';
import { logOut } from '../../services/auth.js';

export default function Navbar({
  isAudioPlaying,
  onToggleAudio,
  isDarkMode,
  onToggleDarkMode,
  user
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Categorized Navigation Items with exact URLs
  const categories = [
    {
      id: 'myspace',
      name: "My Space",
      items: [
        { id: 'homehub', path: '/dashboard/myspace/homehub', label: 'Home Hub', desc: 'Emotion summary & happiness jar', icon: Heart },
        { id: 'emotionlog', path: '/dashboard/myspace/emotionlog', label: 'Emotion Log', desc: 'Private mental health journal', icon: Sparkles },
        { id: 'physical', path: '/dashboard/myspace/physical', label: 'Physical Vitality', desc: 'Sleep, hydration & study stretches', icon: Activity }
      ]
    },
    {
      id: 'calm',
      name: "Calm & AI",
      items: [
        { id: 'serenity', path: '/dashboard/calmandai/serenity', label: 'Breathing & Calm', desc: 'Breathing cycles & soundscapes', icon: Wind },
        { id: 'mindpal', path: '/dashboard/calmandai/mindpal', label: 'MindPal AI', desc: 'Empathetic listener & CBT reframe', icon: Compass }
      ]
    },
    {
      id: 'connect',
      name: "Support & Community",
      items: [
        { id: 'peerhaven', path: '/dashboard/connect/peerhaven', label: 'Peer Haven', desc: 'Anonymous advice & support wall', icon: MessageSquareHeart }
      ]
    }
  ];

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleMobileNavigate = (path) => {
    navigate(path);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-45 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Hamburger Button & Brand Logo */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
                title="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div
                onClick={() => navigate('/dashboard/myspace/homehub')}
                className="flex items-center space-x-3 cursor-pointer group shrink-0"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Heart className="w-6 h-6 fill-white/20" />
                </div>
                <div>
                  <span className="font-heading text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                    HealthHaven
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden sm:block">
                    Student Wellness Space
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links with dropdowns */}
            <nav className="hidden md:flex items-center space-x-5">
              {categories.map((cat) => {
                const isAnyActive = cat.items.some(item => location.pathname === item.path);
                return (
                  <div
                    key={cat.id}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(cat.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => handleDropdownToggle(cat.id)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                        isAnyActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                    </button>

                    {/* Dropdown Menu Wrapper with pt-2 spacing to bridge the hover gap */}
                    <div className={`absolute top-full left-0 w-64 pt-2 transition-all duration-200 origin-top-left ${
                      openDropdown === cat.id ? 'block scale-100 opacity-100' : 'hidden scale-95 opacity-0'
                    }`}>
                      {/* Actual Dropdown Card */}
                      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/85 rounded-2xl shadow-lg p-2.5">
                        <div className="space-y-1">
                          {cat.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigate(item.path);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full flex items-start space-x-3 p-2.5 rounded-xl text-left transition-all ${
                                  isActive
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-slate-905 text-slate-500'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{item.label}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{item.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Action Utilities & Dedicated Crisis Button */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              
              {/* Dedicated Red Crisis Tab Button */}
              <button
                onClick={() => navigate('/dashboard/connect/resources')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
                  location.pathname === '/dashboard/connect/resources'
                    ? 'bg-rose-700 text-white ring-2 ring-rose-400 shadow-rose-600/30'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                }`}
                title="Open 24/7 Emergency Crisis Helplines"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">24/7 Crisis Support</span>
                <span className="sm:hidden">Crisis</span>
              </button>

              {/* Ambient Soundscape Toggle */}
              <button
                onClick={onToggleAudio}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isAudioPlaying
                    ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title={isAudioPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Calm Soundscape'}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4 text-indigo-500 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* User Profile display */}
              {user ? (
                <button
                  onClick={() => navigate('/dashboard/profile/me')}
                  className={`flex items-center space-x-2 pl-1 cursor-pointer hover:opacity-90 focus:outline-none transition-all rounded-xl ${
                    location.pathname === '/dashboard/profile/me' ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  title="View Profile & Statistics"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Profile"
                      className="w-9 h-9 rounded-xl object-cover border border-emerald-300 dark:border-emerald-750 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Left Side Navigation Drawer via Portal (Layered above everything with z-[9999]) */}
      {isMobileDrawerOpen && createPortal(
        <div className="md:hidden fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl h-full p-6 flex flex-col justify-between overflow-y-auto z-[99999] animate-slideRight border-r border-slate-200 dark:border-slate-800">
            
            {/* Top Brand Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-400 flex items-center justify-center text-white shadow-md">
                    <Heart className="w-5 h-5 fill-white/20" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-extrabold text-slate-800 dark:text-slate-100">
                      HealthHaven
                    </h2>
                    <p className="text-[10px] text-slate-400 font-medium">Student Safe Space</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Red Crisis Priority Button inside Drawer */}
              <button
                onClick={() => handleMobileNavigate('/dashboard/connect/resources')}
                className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                <span>24/7 Crisis Support Lines</span>
              </button>

              {/* Categorized Navigation Links */}
              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                      {cat.name}
                    </span>
                    <div className="space-y-1">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleMobileNavigate(item.path)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-2xl text-left transition-all ${
                              isActive
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs">{item.label}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Account Footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div
                    onClick={() => handleMobileNavigate('/dashboard/profile/me')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center space-x-3 cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-9 h-9 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {user.displayName || 'Student Friend'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await logOut();
                      window.location.reload();
                    }}
                    className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleMobileNavigate('/login')}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to HealthHaven</span>
                </button>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
