import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthChange } from './services/auth.js';
import { syncUserProfile, checkTutorialStatus, completeTutorialFlag } from './services/firestore.js';

// Layout & Common Components
import Navbar from './components/layout/Navbar.jsx';
import CrisisBanner from './components/common/CrisisBanner.jsx';
import HelpModal from './components/common/HelpModal.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import AmbientSoundPlayer from './components/common/AmbientSoundPlayer.jsx';
import GuidedTourOverlay from './components/common/GuidedTourOverlay.jsx';

// MindHaven Pages
import Dashboard from './pages/Dashboard.jsx';
import MoodTracker from './pages/MoodTracker.jsx';
import PhysicalWellbeing from './pages/PhysicalWellbeing.jsx';
import AnonymousHelpWall from './pages/AnonymousHelpWall.jsx';
import AIMentor from './pages/AIMentor.jsx';
import SerenityCorner from './pages/SerenityCorner.jsx';
import CrisisResources from './pages/CrisisResources.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authTab, setAuthTab] = useState('signin');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await syncUserProfile(firebaseUser);
          const hasCompleted = await checkTutorialStatus(firebaseUser.uid);
          if (!hasCompleted) {
            setIsTutorialOpen(true);
          }
        } catch (err) {
          console.warn('Profile sync warning:', err);
        }
      } else {
        setUser(null);
        setIsTutorialOpen(false);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCompleteTutorial = async () => {
    setIsTutorialOpen(false);
    if (user?.uid) {
      await completeTutorialFlag(user.uid);
    }
  };

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
      <div className="min-h-screen bg-[#FAF6EE] dark:bg-[#1C1917] flex items-center justify-center font-serif">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center mx-auto text-white text-xl shadow-md animate-pulse">
            🌿
          </div>
          <p className="text-sm font-bold text-stone-800 dark:text-stone-200 font-serif">HealthHaven Sanctuary</p>
          <p className="text-xs text-amber-800/60 dark:text-amber-200/60 italic font-serif">Opening your peaceful path…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] w-full bg-[#FAF6EE] dark:bg-[#1C1917] flex flex-col font-serif text-stone-800 dark:text-stone-100 transition-colors duration-500 overflow-x-hidden">
      
      {/* Global Background Ambient Sound Generator */}
      <div className="hidden">
        <AmbientSoundPlayer
          isPlaying={isAudioPlaying}
          onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)}
        />
      </div>

      <Routes>
        {/* Unauthenticated Login Route */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard/myspace/homehub" replace />
            ) : (
              <LoginPage initialTab={authTab} />
            )
          }
        />

        {/* Authenticated Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <div className="flex-1 flex flex-col min-h-screen">
                {/* Safety & Crisis Banner */}
                {showCrisisBanner && (
                  <CrisisBanner
                    onOpenResources={() => navigate('/dashboard/connect/resources')}
                    onClose={() => setShowCrisisBanner(false)}
                  />
                )}

                {/* Main Top Navigation */}
                <Navbar
                  isAudioPlaying={isAudioPlaying}
                  onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                  user={user}
                />

                {/* Main Content Area with React Router */}
                <main className="flex-1 pb-12">
                  <Routes>
                    <Route path="myspace/homehub" element={<Dashboard user={user} onOpenHelp={() => setIsHelpOpen(true)} />} />
                    <Route path="myspace/emotionlog" element={<MoodTracker user={user} />} />
                    <Route path="myspace/physical" element={<PhysicalWellbeing user={user} />} />
                    <Route path="profile/me" element={<ProfilePage user={user} />} />
                    <Route path="calmandai/mindpal" element={<AIMentor onOpenResources={() => navigate('/dashboard/connect/resources')} />} />
                    <Route path="calmandai/serenity" element={<SerenityCorner isAudioPlaying={isAudioPlaying} onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)} />} />
                    <Route path="connect/peerhaven" element={<AnonymousHelpWall />} />
                    <Route path="connect/resources" element={<CrisisResources />} />
                    <Route path="*" element={<Navigate to="myspace/homehub" replace />} />
                  </Routes>
                </main>

                {/* Warm Serene Footer */}
                <footer className="bg-[#FFFDF9]/60 dark:bg-[#262220]/60 border-t border-amber-200/60 dark:border-stone-800 py-6 px-4 text-center text-xs text-stone-500 dark:text-stone-400">
                  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="font-heading font-bold text-stone-700 dark:text-stone-300">HealthHaven Sanctuary</span>
                    <div className="flex items-center space-x-4">
                      <button onClick={() => setIsHelpOpen(true)} className="hover:text-stone-800 dark:hover:text-stone-200 hover:underline">About & Guide</button>
                      <button onClick={() => navigate('/dashboard/connect/resources')} className="hover:underline text-rose-600 dark:text-rose-400 font-bold">24/7 Crisis Care</button>
                    </div>
                  </div>
                </footer>
              </div>
            )
          }
        />

        {/* Root Redirect */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard/myspace/homehub" : "/login"} replace />}
        />
      </Routes>

      {/* Interactive Guided Onscreen Tour Overlay */}
      <GuidedTourOverlay
        isOpen={isTutorialOpen}
        onClose={handleCompleteTutorial}
        onComplete={handleCompleteTutorial}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onOpenResources={() => navigate('/dashboard/connect/resources')}
      />
    </div>
  );
}
