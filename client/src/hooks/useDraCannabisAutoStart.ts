import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

export function useDraCannabisAutoStart() {
  const [location] = useLocation();
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  useEffect(() => {
    // Auto-iniciar a Dra. Cannabis IA quando usuário entra no dashboard
    if (location === '/dashboard' || location.startsWith('/dashboard/')) {
      const lastAutoStart = localStorage.getItem('draCannabis-lastAutoStart');
      const today = new Date().toDateString();
      
      // Verificar se já fez saudação hoje
      if (lastAutoStart !== today) {
        setShouldAutoStart(true);
        localStorage.setItem('draCannabis-lastAutoStart', today);
      }
    }
  }, [location]);

  const markAutoStarted = () => {
    setHasAutoStarted(true);
    setShouldAutoStart(false);
  };

  return {
    shouldAutoStart,
    hasAutoStarted,
    markAutoStarted
  };
}