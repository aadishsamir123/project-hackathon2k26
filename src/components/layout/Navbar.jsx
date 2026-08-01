import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
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
  LogOut,
  MapPin,
  Sun,
  Moon,
  Bot,
  BookOpen
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
      name: "The Sanctuary",
      items: [
        { id: 'homehub', path: '/dashboard/myspace/homehub', label: 'Mindful Path', desc: 'Interactive step-by-step wellness roadmap', icon: MapPin },
        { id: 'emotionlog', path: '/dashboard/myspace/emotionlog', label: 'Heart Journal', desc: 'Private emotional reflection & logs', icon: Sparkles },
        { id: 'physical', path: '/dashboard/myspace/physical', label: 'Body & Vitality', desc: 'Rest, hydration & gentle stretches', icon: Activity }
      ]
    },
    {
      id: 'calm',
      name: "Stillness & AI",
      items: [
        { id: 'serenity', path: '/dashboard/calmandai/serenity', label: 'Serenity & Breathing', desc: 'Peaceful breathing & warm soundscapes', icon: Wind },
        { id: 'mindpal', path: '/dashboard/calmandai/mindpal', label: 'MindPal Companion', desc: 'Gentle listener & CBT thought reframing', icon: Bot },
        { id: 'wellness-guide', path: '/dashboard/calmandai/wellness-guide', label: 'Mind & Body Guide', desc: 'Complete handbook & visual practice toolkit', icon: BookOpen }
      ]
    },
    {
      id: 'connect',
      name: "Community",
      items: [
        { id: 'peerhaven', path: '/dashboard/connect/peerhaven', label: 'Peer Haven Wall', desc: 'Anonymous kindness & student support', icon: MessageSquareHeart }
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
      <header className="sticky top-0 z-45 w-full bg-[#FAF6EE]/80 dark:bg-[#1C1917]/80 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Mobile Menu Hamburger Button & Brand Logo */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="md:hidden p-1.5 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-all focus:outline-none shrink-0"
                title="Open Navigation Journey"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div
                onClick={() => navigate('/dashboard/myspace/homehub')}
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink-0"
              >
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  <img src={logo} alt="HealthHaven Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-heading text-base sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight font-serif">
                    HealthHaven
                  </span>
                  <p className="text-[11px] text-amber-800/70 dark:text-amber-200/60 font-serif italic hidden md:block">
                    A Serene Path for Mind & Body
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links with dropdowns */}
            <nav className="hidden md:flex items-center space-x-6">
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
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-serif transition-all duration-200 ${
                        isAnyActive
                          ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/50 dark:border-amber-800'
                          : 'text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                    </button>

                    {/* Dropdown Menu Wrapper */}
                    <div className={`absolute top-full left-0 w-64 pt-2 transition-all duration-200 origin-top-left ${
                      openDropdown === cat.id ? 'block scale-100 opacity-100' : 'hidden scale-95 opacity-0'
                    }`}>
                      <div className="bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/80 dark:border-stone-700 rounded-2xl shadow-xl p-2.5 space-y-1">
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
                                  ? 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-serif'
                                  : 'hover:bg-amber-50/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-amber-200/80 text-amber-900' : 'bg-amber-100/50 dark:bg-stone-800 text-amber-800 dark:text-amber-300'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold font-serif">{item.label}</p>
                                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-normal">{item.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Action Utilities & Dedicated Crisis Button */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              
              {/* Warm Red Crisis Button */}
              <button
                onClick={() => navigate('/dashboard/connect/resources')}
                className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold font-serif transition-all shadow-xs shrink-0 ${
                  location.pathname === '/dashboard/connect/resources'
                    ? 'bg-amber-800 text-amber-50 ring-2 ring-amber-500 shadow-amber-900/30'
                    : 'bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white shadow-amber-800/20'
                }`}
                title="Open Emergency Care & Crisis Lines"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">24/7 Care Path</span>
                <span className="sm:hidden font-bold">Care</span>
              </button>

              {/* Ambient Soundscape Toggle */}
              <button
                onClick={onToggleAudio}
                className={`p-2 sm:p-2.5 rounded-xl border text-xs font-medium transition-all shrink-0 ${
                  isAudioPlaying
                    ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/80 dark:border-stone-700 text-stone-600 hover:text-amber-900 dark:hover:text-amber-200'
                }`}
                title={isAudioPlaying ? 'Mute Warm Soundscape' : 'Play Peaceful Warm Soundscape'}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-2 sm:p-2.5 rounded-xl border text-xs font-medium transition-all shrink-0 bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/80 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 animate-pulse-soft" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Profile display */}
              {user ? (
                <button
                  onClick={() => navigate('/dashboard/profile/me')}
                  className="flex items-center justify-center cursor-pointer hover:opacity-90 focus:outline-none transition-all rounded-xl shrink-0"
                  title="View Sanctuary Profile"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Profile"
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-amber-300 dark:border-amber-700 shadow-xs transition-all ${
                        location.pathname === '/dashboard/profile/me' ? 'ring-2 ring-orange-500' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center justify-center font-bold text-xs font-serif transition-all ${
                        location.pathname === '/dashboard/profile/me' ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-serif font-semibold transition-all shadow-xs shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Enter</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Left Side Navigation Drawer via Portal */}
      {isMobileDrawerOpen && createPortal(
        <div className="md:hidden fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs animate-fadeIn"
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-[#FAF6EE] dark:bg-[#1C1917] shadow-2xl h-full p-6 flex flex-col justify-between overflow-y-auto z-[99999] animate-slideRight border-r border-amber-200/80 dark:border-stone-800">
            
            {/* Top Brand Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-amber-200/60 dark:border-stone-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                    <img src={logo} alt="HealthHaven Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                      HealthHaven
                    </h2>
                    <p className="text-[10px] text-amber-800/70 dark:text-amber-200/60 font-serif italic">Serene Student Sanctuary</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Red Crisis Priority Button inside Drawer */}
              <button
                onClick={() => handleMobileNavigate('/dashboard/connect/resources')}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-700 to-orange-700 text-white font-serif font-semibold text-xs shadow-md shadow-amber-800/20 flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                <span>24/7 Emergency Care Path</span>
              </button>

              {/* Quick Settings: Audio & Dark Mode */}
              <div className="flex items-center space-x-2">
                {/* Audio Toggle */}
                <button
                  onClick={onToggleAudio}
                  className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-serif font-bold transition-all flex items-center justify-center space-x-2 shrink-0 ${
                    isAudioPlaying
                      ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-xs'
                      : 'bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/80 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>SoundScape</span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={onToggleDarkMode}
                  className="flex-1 py-2 px-3 rounded-xl border text-[11px] font-serif font-bold transition-all flex items-center justify-center space-x-2 shrink-0 bg-[#FAF6EE] dark:bg-stone-800 border-amber-200/80 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse-soft" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              {/* Categorized Navigation Links */}
              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/60 dark:text-amber-300/50 block px-1 font-serif">
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
                                ? 'bg-amber-200/70 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 font-serif font-bold border border-amber-300/60 dark:border-amber-800'
                                : 'hover:bg-amber-100/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-serif'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-amber-300/70 text-amber-950' : 'bg-amber-100/60 dark:bg-stone-800 text-amber-800 dark:text-amber-300'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold font-serif">{item.label}</p>
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{item.desc}</p>
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
            <div className="pt-6 border-t border-amber-200/60 dark:border-stone-800 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div
                    onClick={() => handleMobileNavigate('/dashboard/profile/me')}
                    className="p-3 rounded-2xl bg-amber-100/40 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700 flex items-center space-x-3 cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-9 h-9 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs font-serif">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate font-serif">
                        {user.displayName || 'Student Friend'}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate font-mono">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await logOut();
                      window.location.reload();
                    }}
                    className="w-full py-2.5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleMobileNavigate('/login')}
                  className="w-full py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-serif font-bold transition-all shadow-xs flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Enter HealthHaven Sanctuary</span>
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
