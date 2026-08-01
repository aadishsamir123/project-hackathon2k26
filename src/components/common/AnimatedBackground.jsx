import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext.jsx';

function parseColorToRgba(colorStr, alpha) {
  const safeAlpha = (typeof alpha === 'number' && !isNaN(alpha))
    ? Math.max(0, Math.min(1, alpha))
    : 0.2;

  if (!colorStr || typeof colorStr !== 'string') {
    return `rgba(120, 120, 120, ${safeAlpha})`;
  }
  
  const clean = colorStr.trim();

  // Match rgb(...) or rgba(...)
  const rgbMatch = clean.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i);
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10)));
    const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10)));
    const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10)));
    return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
  }

  // Match #hex or hex
  let hex = clean.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
  }

  return `rgba(120, 120, 120, ${safeAlpha})`;
}

// Alias for backwards-compatibility with HMR or cached module references
const hexToRgba = parseColorToRgba;
export { hexToRgba, parseColorToRgba };

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const { enableAnimation, theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Coordinate resolution fixed at 600x600 for optimal rendering performance
    const width = 600;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Retrieve active theme color tokens from computed styles
    const getThemeColors = () => {
      const style = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');

      const primary = style.getPropertyValue('--theme-primary').trim() || '#006d44';
      const accent = style.getPropertyValue('--theme-accent').trim() || '#10B981';
      const textMuted = style.getPropertyValue('--theme-text-muted').trim() || '#404943';
      const border = style.getPropertyValue('--theme-border').trim() || 'rgba(217,230,218,0.8)';
      
      const panel = isDark
        ? style.getPropertyValue('--theme-panel').trim() || '#262220'
        : style.getPropertyValue('--theme-panel').trim() || '#FFFDF9';

      return { primary, accent, textMuted, border, panel, isDark };
    };

    let colors = getThemeColors();

    // Floating aura orb definitions
    const blobs = [
      { x: 140, y: 150, r: 190, vx: 0.12, vy: 0.08, colorKey: 'primary' },
      { x: 440, y: 180, r: 220, vx: -0.09, vy: 0.11, colorKey: 'accent' },
      { x: 200, y: 440, r: 200, vx: 0.1, vy: -0.07, colorKey: 'panel' },
      { x: 420, y: 450, r: 180, vx: -0.07, vy: -0.12, colorKey: 'primary' }
    ];

    let animationId = null;
    let isActive = true;
    let timeStep = 0;

    const drawWaves = (time) => {
      const { primary, accent, border, isDark } = colors;
      const alphaBase = isDark ? 0.22 : 0.18;

      // --- Wave 1: Primary Theme Flow ---
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.35 +
          Math.sin(x * 0.007 + time * 0.0008) * 45 +
          Math.cos(x * 0.004 + time * 0.0005) * 35;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      let grad1 = ctx.createLinearGradient(0, 0, width, height);
      grad1.addColorStop(0, parseColorToRgba(primary, alphaBase));
      grad1.addColorStop(0.6, parseColorToRgba(accent, alphaBase * 0.5));
      grad1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad1;
      ctx.fill();

      // --- Wave 2: Accent & Secondary Harmonious Wave ---
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.55 +
          Math.sin(x * 0.005 - time * 0.001) * 55 +
          Math.cos(x * 0.009 + time * 0.0012) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      let grad2 = ctx.createLinearGradient(width, 0, 0, height);
      grad2.addColorStop(0, parseColorToRgba(accent, alphaBase * 0.8));
      grad2.addColorStop(0.5, parseColorToRgba(primary, alphaBase * 0.4));
      grad2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad2;
      ctx.fill();

      // --- Wave 3: Bottom Crest Wave ---
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.72 +
          Math.sin(x * 0.008 + time * 0.0007) * 40 +
          Math.sin(x * 0.003 - time * 0.0009) * 45;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      let grad3 = ctx.createLinearGradient(0, height * 0.4, width, height);
      grad3.addColorStop(0, parseColorToRgba(border, alphaBase * 0.9));
      grad3.addColorStop(0.7, parseColorToRgba(accent, alphaBase * 0.3));
      grad3.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad3;
      ctx.fill();
    };

    const updateAndDraw = () => {
      if (!isActive) return;

      timeStep += 16; // Simulate 60fps frame increments

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw floating soft orbs
      const isDark = colors.isDark;
      const orbAlpha = isDark ? 0.25 : 0.16;

      blobs.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x < -60 || blob.x > width + 60) blob.vx *= -1;
        if (blob.y < -60 || blob.y > height + 60) blob.vy *= -1;

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        const colorVal = colors[blob.colorKey] || colors.primary;
        
        grad.addColorStop(0, parseColorToRgba(colorVal, orbAlpha));
        grad.addColorStop(0.5, parseColorToRgba(colorVal, orbAlpha * 0.3));
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw organic wavy gradient ribbons
      drawWaves(timeStep);

      if (enableAnimation) {
        animationId = requestAnimationFrame(updateAndDraw);
      }
    };

    // MutationObserver to update colors whenever theme class or inline styles update
    const observer = new MutationObserver(() => {
      colors = getThemeColors();
      if (!enableAnimation) {
        updateAndDraw();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Handle window visibility & focus to conserve energy
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        if (animationId) cancelAnimationFrame(animationId);
      } else {
        isActive = true;
        if (enableAnimation) {
          animationId = requestAnimationFrame(updateAndDraw);
        } else {
          updateAndDraw();
        }
      }
    };

    const handleWindowBlur = () => {
      isActive = false;
      if (animationId) cancelAnimationFrame(animationId);
    };

    const handleWindowFocus = () => {
      isActive = true;
      if (enableAnimation) {
        animationId = requestAnimationFrame(updateAndDraw);
      } else {
        updateAndDraw();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Initial render
    colors = getThemeColors();
    updateAndDraw();

    return () => {
      isActive = false;
      if (animationId) cancelAnimationFrame(animationId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [enableAnimation, theme]);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none transition-opacity duration-1000">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-70 dark:opacity-50 transition-opacity duration-700"
        style={{
          filter: 'blur(65px)',
          transform: 'scale(1.2)', // Prevents edge clipping artifacts from the blur
        }}
      />
    </div>
  );
}
