import React from 'react';
import { logOut } from '../../services/auth.js';

export default function TopBar({ user, activePage, onOpenHelp }) {
  const PAGE_TITLES = {
    'dashboard': 'EcoQuest SG Dashboard',
    'simulator': '🎮 Campus Survival Simulator',
    'ai-mentor': '🤖 Gemini AI Campus Mentor',
    'leaderboard': '🏆 Campus Eco Leaderboard',
    'textbook-swap': 'Campus Textbook Swap Hub',
    'eco-commute': 'Campus Eco-Commute Planner',
    'recycling-finder': 'Singapore E-Waste Locator',
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student Player';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const title = PAGE_TITLES[activePage] || 'EcoQuest SG Dashboard';

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-6 shrink-0 font-sans">
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-400 font-medium">EcoQuest SG • Gamified Student Survival & Climate Platform</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenHelp}
          className="flex items-center gap-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 px-4 py-2 rounded-full transition shadow-xs"
        >
          <span>🎓</span>
          <span className="hidden sm:inline">Student Guide</span>
        </button>

        <div className="flex items-center gap-2.5 bg-slate-100/80 border border-slate-200 rounded-full py-1.5 px-3.5">
          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {avatarLetter}
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden sm:block max-w-[120px] truncate">
            {displayName}
          </span>
        </div>

        <button
          id="btn-signout"
          onClick={handleLogout}
          className="text-xs font-semibold text-rose-700 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
