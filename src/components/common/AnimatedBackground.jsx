import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext.jsx';

function hexToRgba(color, alpha) {
  if (!color) return `rgba(0, 0, 0, ${alpha})`;
  
  // Clean string
  const cleanColor = color.trim();
  
  // If it's rgb/rgba
  if (cleanColor.startsWith('rgb')) {
    return cleanColor
      .replace(/rgb\(/, 'rgba(')
      .replace(/\)/, `, ${alpha})`)
      .replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d\.]+\)/, `rgba($1, $2, $3, ${alpha})`);
  }

  // Parse hex
  let hex = cleanColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const { enableAnimation, theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Coordinate resolution is fixed to 512x512 for high performance
    const width = 512;
    const height = 512;
    canvas.width = width;
    canvas.height = height;

    // Retrieve active theme colors from document computed style
    const getThemeColors = () => {
      const style = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');

      const primary = style.getPropertyValue('--theme-primary').trim() || '#006d44';
      const accent = style.getPropertyValue('--theme-accent').trim() || '#10B981';
      
      const secondary = isDark
        ? style.getPropertyValue('--theme-panel-dark').trim() || '#262220'
        : style.getPropertyValue('--theme-panel').trim() || '#FFFDF9';

      return { primary, accent, secondary };
    };

    let colors = getThemeColors();

    // Define 4 slowly moving soft blobs
    const blobs = [
      { x: 120, y: 120, r: 180, vx: 0.15, vy: 0.1, colorKey: 'primary' },
      { x: 380, y: 150, r: 210, vx: -0.1, vy: 0.12, colorKey: 'accent' },
      { x: 160, y: 380, r: 190, vx: 0.12, vy: -0.08, colorKey: 'secondary' },
      { x: 360, y: 390, r: 170, vx: -0.08, vy: -0.15, colorKey: 'primary' }
    ];

    let animationId = null;
    let isActive = true;

    const updateAndDraw = () => {
      if (!isActive) return;

      // Smooth blending clearing
      ctx.clearRect(0, 0, width, height);

      // Draw each blob with radial gradients
      blobs.forEach((blob) => {
        // Move
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce borders (accounting for radius padding to avoid abrupt changes)
        if (blob.x < -50 || blob.x > width + 50) blob.vx *= -1;
        if (blob.y < -50 || blob.y > height + 50) blob.vy *= -1;

        // Create gradient
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        const colorVal = colors[blob.colorKey];
        
        grad.addColorStop(0, hexToRgba(colorVal, 0.18));
        grad.addColorStop(0.5, hexToRgba(colorVal, 0.06));
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (enableAnimation) {
        animationId = requestAnimationFrame(updateAndDraw);
      }
    };

    // Listen to theme changes or dark mode changes to update colors immediately
    const observer = new MutationObserver(() => {
      colors = getThemeColors();
      if (!enableAnimation) {
        // Single frame redraw on color updates if animation is disabled
        updateAndDraw();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Start/Stop animation loops based on visibility or focus
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

    // Initial draw
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
        className="w-full h-full opacity-60 dark:opacity-40"
        style={{
          filter: 'blur(75px)',
          transform: 'scale(1.15)', // prevents white edges from blur
        }}
      />
    </div>
  );
}
