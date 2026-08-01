import React from 'react';

const HACKATHON_NAV_SECTIONS = [
  {
    title: 'Hackathon Power Modules',
    items: [
      { id: 'dashboard', label: 'Student Dashboard', sublabel: 'Stats & Game Summary', icon: '🏠' },
      { id: 'simulator', label: 'Playable Simulator', sublabel: 'Campus Survival Game 🎮', icon: '🎮' },
      { id: 'ai-mentor', label: 'MindPal AI Assistant', sublabel: 'Student Mental Health & Advice', icon: '🤖' },
      { id: 'leaderboard', label: 'Eco Leaderboard', sublabel: 'Campus Ranks & Badges 🏆', icon: '🏆' },
      { id: 'textbook-swap', label: 'Textbook Swap Hub', sublabel: 'Reuse Books & Gear', icon: '📖' },
      { id: 'eco-commute', label: 'Eco-Commute Planner', sublabel: 'MRT & Shuttle vs Grab', icon: '🚴' },
      { id: 'recycling-finder', label: 'Campus E-Waste Map', sublabel: 'Singapore E-Waste Bins', icon: '🔋' },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/90 flex flex-col min-h-screen font-sans">
      {/* Drawer Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200/80">
        <div className="w-9 h-9 rounded-2xl bg-emerald-700 flex items-center justify-center shrink-0 text-white font-bold text-base shadow-xs">
          🏆
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none tracking-tight">EcoQuest SG</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Campus Survival & Eco Game</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {HACKATHON_NAV_SECTIONS.map((sec) => (
          <div key={sec.title}>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">{sec.title}</p>
            <div className="space-y-1">
              {sec.items.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-left transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-950 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-xs leading-none ${isActive ? 'text-emerald-950 font-bold' : 'font-semibold text-slate-800'}`}>
                        {item.label}
                      </p>
                      {item.sublabel && (
                        <p className={`text-[10px] mt-1 leading-none ${isActive ? 'text-emerald-800 font-medium' : 'text-slate-400'}`}>
                          {item.sublabel}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Banner */}
      <div className="mx-3 mb-4 p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-3xl shrink-0">
        <p className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider mb-1">🎮 Playable Demo</p>
        <p className="text-[11px] text-emerald-900 leading-relaxed">
          Try the <strong>Playable Campus Simulator</strong> to test daily decisions for money, grades, stress & carbon!
        </p>
      </div>
    </aside>
  );
}
