import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const themeVariables = {
  emerald: {
    light: {
      '--theme-bg': '#FAF6EE',
      '--theme-panel': '#FFFDF9',
      '--theme-primary': '#006d44',
      '--theme-primary-hover': '#059669',
      '--theme-border': 'rgba(217, 230, 218, 0.8)',
      '--theme-text': '#191c1a',
      '--theme-text-muted': '#404943',
      '--theme-accent': '#10B981',
    },
    dark: {
      '--theme-bg-dark': '#1C1917',
      '--theme-panel-dark': '#262220',
      '--theme-primary': '#38a06c',
      '--theme-primary-hover': '#34d399',
      '--theme-border-dark': 'rgba(64, 57, 54, 0.8)',
      '--theme-text-dark': '#FAF6EE',
      '--theme-text-muted-dark': '#A8A29E',
      '--theme-accent': '#34D399',
    }
  },
  ocean: {
    light: {
      '--theme-bg': '#F0F7F9',
      '--theme-panel': '#F8FCFD',
      '--theme-primary': '#0E7490',
      '--theme-primary-hover': '#0891B2',
      '--theme-border': 'rgba(207, 250, 254, 0.8)',
      '--theme-text': '#0F172A',
      '--theme-text-muted': '#475569',
      '--theme-accent': '#06B6D4',
    },
    dark: {
      '--theme-bg-dark': '#0F172A',
      '--theme-panel-dark': '#1E293B',
      '--theme-primary': '#38BDF8',
      '--theme-primary-hover': '#7DD3FC',
      '--theme-border-dark': 'rgba(51, 65, 85, 0.8)',
      '--theme-text-dark': '#F8FAFC',
      '--theme-text-muted-dark': '#94A3B8',
      '--theme-accent': '#38BDF8',
    }
  },
  sunset: {
    light: {
      '--theme-bg': '#FFF9F5',
      '--theme-panel': '#FFFAF7',
      '--theme-primary': '#C2410C',
      '--theme-primary-hover': '#EA580C',
      '--theme-border': 'rgba(254, 215, 170, 0.8)',
      '--theme-text': '#2D150B',
      '--theme-text-muted': '#78350F',
      '--theme-accent': '#F97316',
    },
    dark: {
      '--theme-bg-dark': '#271C19',
      '--theme-panel-dark': '#362722',
      '--theme-primary': '#FB923C',
      '--theme-primary-hover': '#FDBA74',
      '--theme-border-dark': 'rgba(87, 63, 56, 0.8)',
      '--theme-text-dark': '#FFF9F5',
      '--theme-text-muted-dark': '#FDBA74',
      '--theme-accent': '#FB923C',
    }
  },
  lavender: {
    light: {
      '--theme-bg': '#F8F5FF',
      '--theme-panel': '#FCFAFF',
      '--theme-primary': '#6D28D9',
      '--theme-primary-hover': '#7C3AED',
      '--theme-border': 'rgba(233, 213, 255, 0.8)',
      '--theme-text': '#1E1B4B',
      '--theme-text-muted': '#4C1D95',
      '--theme-accent': '#8B5CF6',
    },
    dark: {
      '--theme-bg-dark': '#1E1B4B',
      '--theme-panel-dark': '#2E1065',
      '--theme-primary': '#A78BFA',
      '--theme-primary-hover': '#C084FC',
      '--theme-border-dark': 'rgba(76, 29, 149, 0.8)',
      '--theme-text-dark': '#F5F3FF',
      '--theme-text-muted-dark': '#C084FC',
      '--theme-accent': '#A78BFA',
    }
  },
  midnight: {
    light: {
      '--theme-bg': '#F4F4F5',
      '--theme-panel': '#FAFAFA',
      '--theme-primary': '#27272A',
      '--theme-primary-hover': '#3F3F46',
      '--theme-border': 'rgba(228, 228, 231, 0.8)',
      '--theme-text': '#09090B',
      '--theme-text-muted': '#52525B',
      '--theme-accent': '#71717A',
    },
    dark: {
      '--theme-bg-dark': '#09090B',
      '--theme-panel-dark': '#18181B',
      '--theme-primary': '#E4E4E7',
      '--theme-primary-hover': '#F4F4F5',
      '--theme-border-dark': 'rgba(39, 39, 42, 0.8)',
      '--theme-text-dark': '#FAFAFA',
      '--theme-text-muted-dark': '#A1A1AA',
      '--theme-accent': '#E4E4E7',
    }
  }
};

export const themeOptionsList = [
  { id: 'emerald', name: 'Emerald Haven', color: '#006d44' },
  { id: 'ocean', name: 'Ocean Breeze', color: '#0E7490' },
  { id: 'sunset', name: 'Sunset Glow', color: '#C2410C' },
  { id: 'lavender', name: 'Lavender Dream', color: '#6D28D9' },
  { id: 'midnight', name: 'Midnight Sanctuary', color: '#27272A' },
];

export function ThemeContextProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('mindhaven-theme') || 'emerald';
  });

  const [enableAnimation, setEnableAnimationState] = useState(() => {
    const saved = localStorage.getItem('mindhaven-bg-animation');
    return saved !== null ? saved === 'true' : true;
  });

  const setTheme = (newTheme) => {
    if (themeVariables[newTheme]) {
      setThemeState(newTheme);
      localStorage.setItem('mindhaven-theme', newTheme);
    }
  };

  const setEnableAnimation = (val) => {
    setEnableAnimationState(val);
    localStorage.setItem('mindhaven-bg-animation', val ? 'true' : 'false');
  };

  // Apply variables to root element on theme change
  useEffect(() => {
    const vars = themeVariables[theme];
    if (!vars) return;

    const root = document.documentElement;

    // Apply light mode variables
    Object.entries(vars.light).forEach(([name, val]) => {
      root.style.setProperty(name, val);
    });

    // Apply dark mode variables
    Object.entries(vars.dark).forEach(([name, val]) => {
      root.style.setProperty(name, val);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, enableAnimation, setEnableAnimation }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
}
