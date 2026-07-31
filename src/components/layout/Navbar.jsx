import React, { useState } from 'react';
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
  ChevronDown
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
  const [openDropdown, setOpenDropdown] = useState(null);

  // Categorized Navigation Items
  const categories = [
    {
      id: 'myspace',
      name: "My Space",
      items: [
        { id: 'dashboard', label: 'Home Hub', desc: 'Emotion summary & happiness jar', icon: Heart },
        { id: 'mood-tracker', label: 'Emotion Log', desc: 'Private mental health journal', icon: Sparkles }
      ]
    },
    {
      id: 'calm',
      name: "Calm & AI",
      items: [
        { id: 'serenity-corner', label: 'Breathing & Calm', desc: 'Breathing cycles & soundscapes', icon: Wind },
        { id: 'ai-mentor', label: 'MindPal AI', desc: 'Empathetic listener & CBT reframe', icon: Compass }
      ]
    },
    {
      id: 'connect',
      name: "Support & Connect",
      items: [
        { id: 'anon-wall', label: 'Peer Haven', desc: 'Anonymous advice & support wall', icon: MessageSquareHeart },
        { id: 'resources', label: 'Help & Crisis', desc: '24/7 emergency support services', icon: PhoneCall }
      ]
    }
  ];

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <header className="sticky top-0 z-45 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <span className="font-heading text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                MindHaven
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Student Wellness Space
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links with dropdowns */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((cat) => {
              const isAnyActive = cat.items.some(item => activePage === item.id);
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
                          const isActive = activePage === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                onNavigate(item.id);
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

          {/* Action Utilities & Controls */}
          <div className="flex items-center space-x-3 shrink-0">
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
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 pl-1 cursor-pointer hover:opacity-90 focus:outline-none transition-all"
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
                onClick={() => onOpenAuth('signin')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-3 border-t border-slate-100 dark:border-slate-800 overflow-x-auto space-x-1">
          {categories.flatMap(c => c.items).map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
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
