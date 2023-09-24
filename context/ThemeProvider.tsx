'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ModeType = 'dark' | 'light';

interface ThemeContextType {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ModeType>('dark');

  const handleThemeChange = () => {
    setMode((prevState) => {
      if (prevState === 'dark') {
        document.documentElement.classList.add('light');
        return 'light';
      }
      document.documentElement.classList.add('dark');
      return 'dark';
    });
  };
  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
