import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'night' | 'day';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('night');

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('neurocann-theme') as Theme;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('night', 'day');
    document.documentElement.classList.add(theme);
    localStorage.setItem('neurocann-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'night' ? 'day' : 'night');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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