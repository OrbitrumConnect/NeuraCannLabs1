import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm hover:scale-105"
      title={theme === 'night' ? 'Mudar para Modo Dia' : 'Mudar para Modo Noite'}
      data-testid="theme-toggle-button"
    >
      {theme === 'night' ? (
        <Sun className="w-4 h-4 text-primary" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      )}
    </button>
  );
}