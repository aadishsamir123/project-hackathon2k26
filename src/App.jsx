import React, { useState, useEffect } from 'react';
import { onAuthChange } from './services/auth.js';
import { syncUserProfile } from './services/firestore.js';

// Layout & Common Components
import Navbar from './components/layout/Navbar.jsx';
import CrisisBanner from './components/common/CrisisBanner.jsx';
import HelpModal from './components/common/HelpModal.jsx';
import LoginPage from './components/auth/LoginPage.jsx';

// MindHaven Pages
import Dashboard from './pages/Dashboard.jsx';
import MoodTracker from './pages/MoodTracker.jsx';
import AnonymousHelpWall from './pages/AnonymousHelpWall.jsx';
import AIMentor from './pages/AIMentor.jsx';
import SerenityCorner from './pages/SerenityCorner.jsx';
import CrisisResources from './pages/CrisisResources.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await syncUserProfile(firebaseUser);
        } catch (err) {
          console.warn('Profile sync warning:', err);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Handle Dark mode toggle class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] dark:bg-slate-900 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center mx-auto text-white text-xl shadow-md animate-pulse">
            🌿
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">MindHaven Student Safe Space</p>
          <p className="text-xs text-slate-400">Loading your peaceful sanctuary…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        initialTab={authTab}
      />
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setActivePage} onOpenHelp={() => setIsHelpOpen(true)} />;
      case 'mood-tracker':
        return <MoodTracker user={user} />;
      case 'anon-wall':
        return <AnonymousHelpWall />;
      case 'ai-mentor':
        return <AIMentor onOpenResources={() => setActivePage('resources')} />;
      case 'serenity-corner':
        return <SerenityCorner isAudioPlaying={isAudioPlaying} onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)} />;
      case 'resources':
        return <CrisisResources />;
      case 'profile':
        return <ProfilePage user={user} />;
      default:
        return <Dashboard user={user} onNavigate={setActivePage} onOpenHelp={() => setIsHelpOpen(true)} />;
    }
  };

  return (
    <div className="min-h-[100vh] w-full bg-[#FAFBF9] dark:bg-[#0F172A] flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      
      {/* Safety & Crisis Banner */}
      {showCrisisBanner && (
        <CrisisBanner
          onOpenResources={() => setActivePage('resources')}
          onClose={() => setShowCrisisBanner(false)}
        />
      )}

      {/* Main Top Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        user={user}
        onOpenAuth={(tab) => {
          setAuthTab(tab);
          setIsAuthOpen(true);
        }}
        onOpenCrisis={() => setActivePage('resources')}
      />

      {/* Page Content */}
      <main className="flex-1 pb-12">
        {renderPage()}
      </main>

      {/* Subtle Footer */}
      <footer className="bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MindHaven</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsHelpOpen(true)} className="hover:underline">About & FAQ</button>
            <button onClick={() => setActivePage('resources')} className="hover:underline text-rose-500 font-semibold">Crisis Hotlines (988)</button>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onOpenResources={() => setActivePage('resources')}
      />
    </div>
  );
}
