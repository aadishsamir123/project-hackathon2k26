import React from 'react';

/**
 * AnimatedThemeBackground
 * Renders subtle floating gradient orbs in the background.
 * Colors are synchronized with active user theme via CSS variables (--theme-glow-1, 2, 3).
 * Stretches across the full viewport, behind the header, page content, and footer.
 */
export default function AnimatedThemeBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none transition-colors duration-700">
      {/* Top-Left Ambient Orb */}
      <div 
        className="absolute -top-24 -left-20 w-[480px] h-[480px] sm:w-[650px] sm:h-[650px] rounded-full filter blur-[95px] opacity-75 animate-orb-top transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: 'var(--theme-glow-1, rgba(16, 185, 129, 0.18))',
        }}
      />

      {/* Bottom-Right Ambient Orb */}
      <div 
        className="absolute -bottom-28 -right-20 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full filter blur-[100px] opacity-70 animate-orb-bottom transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: 'var(--theme-glow-2, rgba(5, 150, 105, 0.15))',
        }}
      />

      {/* Mid-Screen Ambient Accent Orb */}
      <div 
        className="absolute top-[35%] left-[20%] sm:left-[30%] w-[380px] h-[380px] sm:w-[550px] sm:h-[550px] rounded-full filter blur-[90px] opacity-60 animate-orb-center transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: 'var(--theme-glow-3, rgba(52, 211, 153, 0.16))',
        }}
      />

      {/* Soft Noise / Subtle Vignette Layer for Depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/5 dark:to-black/20 pointer-events-none" />
    </div>
  );
}
