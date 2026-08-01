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
import AnimatedThemeBackground from './components/common/AnimatedThemeBackground.jsx';
import logo from './assets/logo.png';

// MindHaven Pages
import Dashboard from './pages/Dashboard.jsx';
import MoodTracker from './pages/MoodTracker.jsx';
import PhysicalWellbeing from './pages/PhysicalWellbeing.jsx';
import AnonymousHelpWall from './pages/AnonymousHelpWall.jsx';
import AIMentor from './pages/AIMentor.jsx';
import SerenityCorner from './pages/SerenityCorner.jsx';
import CrisisResources from './pages/CrisisResources.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import WellnessGuide from './pages/WellnessGuide.jsx';

import { useTheme } from './theme/ThemeContext.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authTab, setAuthTab] = useState('signin');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const { isDarkMode, setIsDarkMode } = useTheme();
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-theme-bg dark:bg-theme-bg-dark flex items-center justify-center font-serif text-theme-text dark:text-theme-text-dark">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md animate-pulse overflow-hidden bg-white/5">
            <img src={logo} alt="HealthHaven Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-sm font-semibold tracking-wide font-heading">HealthHaven ..</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] w-full bg-theme-bg dark:bg-theme-bg-dark flex flex-col font-serif text-theme-text dark:text-theme-text-dark transition-colors duration-500 overflow-x-hidden relative">
      
      {/* Animated Subtle Ambient Theme Blur Background */}
      <AnimatedThemeBackground />

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
              <LoginPage 
                initialTab={authTab}
                authTab={authTab}
                setAuthTab={setAuthTab}
                onLoginSuccess={() => navigate('/dashboard/myspace/homehub')}
              />
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
                    <Route path="calmandai/mindpal" element={<AIMentor user={user} onOpenResources={() => navigate('/dashboard/connect/resources')} />} />
                    <Route path="calmandai/serenity" element={<SerenityCorner isAudioPlaying={isAudioPlaying} onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)} />} />
                    <Route path="calmandai/wellness-guide" element={<WellnessGuide user={user} />} />
                    <Route path="connect/peerhaven" element={<AnonymousHelpWall />} />
                    <Route path="connect/resources" element={<CrisisResources />} />
                    <Route path="*" element={<Navigate to="myspace/homehub" replace />} />
                  </Routes>
                </main>

                {/* Warm Serene Footer */}
                <footer className="relative z-10 bg-[#FFFDF9]/60 dark:bg-[#262220]/60 backdrop-blur-md border-t border-amber-200/60 dark:border-stone-800 py-6 px-4 text-center text-xs text-stone-500 dark:text-stone-400">
                  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="font-heading font-bold text-stone-700 dark:text-stone-300">HealthHaven Sanctuary</span>
                    <div className="flex items-center space-x-4">
                      <button onClick={() => navigate('/dashboard/calmandai/wellness-guide')} className="hover:text-stone-800 dark:hover:text-stone-200 hover:underline font-semibold">Handbook & Guide</button>
                      <button onClick={() => setIsHelpOpen(true)} className="hover:text-stone-800 dark:hover:text-stone-200 hover:underline">About</button>
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
