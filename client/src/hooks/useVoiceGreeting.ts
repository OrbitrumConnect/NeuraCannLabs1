import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface VoiceGreetingConfig {
  enabled: boolean;
  volume: number;
  rate: number;
  pitch: number;
}

export function useVoiceGreeting() {
  const { user, isAuthenticated } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  
  // Configuração da voz (carregada do localStorage)
  const [config, setConfig] = useState<VoiceGreetingConfig>({
    enabled: true,
    volume: 0.7,
    rate: 0.9,
    pitch: 1.0
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`voice_settings_${user.id}`);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setConfig({
          enabled: settings.enabled ?? true,
          volume: (settings.volume ?? 70) / 100,
          rate: (settings.rate ?? 90) / 100,
          pitch: (settings.pitch ?? 100) / 100
        });
      }
    }
  }, [user]);

  // Determinar saudação baseada no horário
  const getGreetingByTime = useCallback(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }, []);

  // Gerar mensagem personalizada
  const generateGreetingMessage = useCallback(() => {
    if (!user) return '';
    
    const timeGreeting = getGreetingByTime();
    const firstName = user.name?.split(' ')[0] || 'Doutor';
    
    const messages = [
      `${timeGreeting}, Dr. ${firstName}! Bem-vindo ao NeuroCann Lab. Estou aqui para auxiliá-lo na análise científica de cannabis medicinal.`,
      `${timeGreeting}, ${firstName}! Sou o Dr. Cannabis IA, seu assistente virtual. Como posso ajudá-lo hoje com suas pesquisas?`,
      `${timeGreeting}! É um prazer tê-lo de volta, Dr. ${firstName}. Vamos explorar juntos o universo da cannabis medicinal?`,
      `${timeGreeting}, ${firstName}! Sistema NeuroCann Lab ativo. Pronto para análises científicas avançadas.`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }, [user, getGreetingByTime]);

  // Função para reproduzir a saudação
  const playGreeting = useCallback(async () => {
    if (!window.speechSynthesis || !user || !config.enabled || isPlaying || hasPlayedToday) {
      return;
    }

    try {
      setIsPlaying(true);
      
      // Cancelar qualquer fala anterior
      window.speechSynthesis.cancel();
      
      const message = generateGreetingMessage();
      const utterance = new SpeechSynthesisUtterance(message);
      
      // Configurar voz
      utterance.volume = config.volume;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.lang = 'pt-BR';
      
      // Tentar usar uma voz em português
      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt') || voice.lang.includes('BR')
      );
      
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }
      
      // Eventos da fala
      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayedToday(true);
        // Marcar no localStorage para não repetir no mesmo dia
        localStorage.setItem(`greeting_played_${user.id}`, new Date().toDateString());
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        console.warn('Erro na reprodução da saudação por voz');
      };
      
      // Reproduzir
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.warn('Text-to-Speech não suportado:', error);
      setIsPlaying(false);
    }
  }, [user, config, generateGreetingMessage, isPlaying, hasPlayedToday]);

  // Verificar se já foi reproduzido hoje
  useEffect(() => {
    if (user) {
      const lastPlayed = localStorage.getItem(`greeting_played_${user.id}`);
      const today = new Date().toDateString();
      setHasPlayedToday(lastPlayed === today);
    }
  }, [user]);

  // Auto-reproduzir APENAS na primeira entrada do dia
  useEffect(() => {
    if (isAuthenticated && user && config.enabled && !hasPlayedToday && !isPlaying) {
      // Verificar se é realmente o primeiro login do dia
      const lastLoginDate = localStorage.getItem(`last_login_${user.id}`);
      const today = new Date().toDateString();
      
      if (lastLoginDate !== today) {
        // Aguardar um pouco após o login para melhor experiência
        const timer = setTimeout(() => {
          playGreeting();
          localStorage.setItem(`last_login_${user.id}`, today);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, config.enabled, hasPlayedToday, isPlaying, playGreeting]);

  // Função para reproduzir manualmente
  const playManualGreeting = useCallback(() => {
    setHasPlayedToday(false); // Permitir reprodução manual
    playGreeting();
  }, [playGreeting]);

  // Função para parar a fala
  const stopGreeting = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  return {
    isPlaying,
    hasPlayedToday,
    playGreeting: playManualGreeting,
    stopGreeting,
    isSupported: !!window.speechSynthesis,
    currentMessage: generateGreetingMessage()
  };
}