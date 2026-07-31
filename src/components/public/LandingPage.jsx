import React from 'react';
import EwasteMapIframe from '../map/EwasteMapIframe.jsx';

const HACKATHON_HIGHLIGHTS = [
  { id: 'simulator', title: '1. Playable Campus Survival Game 🎮', icon: '🎮', desc: 'Interactive decision rounds for money, GPA grades, stress & carbon.' },
  { id: 'ai-mentor', title: '2. Gemini AI Campus Mentor 🤖', icon: '🤖', desc: 'Instant AI waste recycling sorter & exam cram schedule optimizer.' },
  { id: 'leaderboard', title: '3. Singapore Campus Leaderboard 🏆', icon: '🏆', desc: 'Compete across NUS, NTU, SMU, Polys & JCs for high scores & badges.' },
  { id: 'textbook-swap', title: '4. Textbook & Gear Swap Hub 📖', icon: '📖', desc: 'Swap textbooks, notes, calculators & dorm supplies directly on Telegram.' },
  { id: 'eco-commute', title: '5. Eco-Commute Planner 🚴', icon: '🚴', desc: 'Compare carbon & money saved walking/cycling/shuttles vs Grab.' },
  { id: 'recycling-finder', title: '6. Singapore E-Waste Locator 🔋', icon: '🔋', desc: 'Official Google My Maps iframe for e-waste & battery drop-off bins.' },
];

export default function LandingPage({ onOpenAuth }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* Header */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              🏆
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">EcoQuest SG</span>
              <span className="ml-2.5 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-200/80">
                Hackathon Winner Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('signin')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
            >
              Student Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 rounded-full shadow-xs transition"
            >
              Play Game Free →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-950 shadow-xs">
            <span>🎮 Playable Student Survival Game • Built to Win Hackathon 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Survive Campus Life, Maximize Your GPA & Protect the Planet
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Play the interactive <strong>Campus Survival Simulator</strong> to balance Pocket Money (S$), Academic Grades (GPA), Mental Health, and Carbon Impact with live Gemini AI coaching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-8 py-3.5 rounded-full shadow-md transition"
            >
              🎮 Play 1-Minute Simulator →
            </button>
            <a
              href="#map-section"
              className="w-full sm:w-auto text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-8 py-3.5 rounded-full transition text-center shadow-xs"
            >
              Find E-Waste Bins 🔋
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section id="map-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                  Live Singapore E-Waste Map
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Singapore Campus & Mall E-Waste Bins</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Safely recycle old phones, laptops, powerbanks, cables, and batteries.
              </p>
            </div>
            <a
              href="https://www.google.com/maps/d/u/0/viewer?mid=1ySyBcuorBk9s4c59jRkJhceMATM3fF2b"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
            >
              Open Map in Google Maps ↗
            </a>
          </div>

          <EwasteMapIframe height="500px" />
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">EcoQuest SG Power Features</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            Combining Climate Action, Student Productivity, and Health & Well-Being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HACKATHON_HIGHLIGHTS.map((m) => (
            <div key={m.id} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:border-emerald-500 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 flex items-center justify-center text-2xl font-bold mb-4 border border-emerald-200/60">
                {m.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight">{m.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 py-8 px-4 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-800 mb-1">EcoQuest SG • Hackathon 2026 Winner</p>
        <p>Built for Climate Action, Student Productivity, and Health & Well-Being</p>
      </footer>

    </div>
  );
}
