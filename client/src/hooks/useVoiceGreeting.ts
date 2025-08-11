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

  // Gerar mensagem personalizada (funciona no modo free)
  const generateGreetingMessage = useCallback(() => {
    const timeGreeting = getGreetingByTime();
    const firstName = user?.name?.split(' ')[0] || 'Visitante';
    
    // Mensagens para usuários logados
    if (user) {
      const messages = [
        `${timeGreeting}, Dr. ${firstName}! Bem-vindo ao NeuroCann Lab. Estou aqui para auxiliá-lo na análise científica de cannabis medicinal.`,
        `${timeGreeting}, ${firstName}! Sou o Dr. Cannabis IA, seu assistente virtual. Como posso ajudá-lo hoje com suas pesquisas?`,
        `${timeGreeting}! É um prazer tê-lo de volta, Dr. ${firstName}. Vamos explorar juntos o universo da cannabis medicinal?`,
        `${timeGreeting}, ${firstName}! Sistema NeuroCann Lab ativo. Pronto para análises científicas avançadas.`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Mensagens para modo free
    const freeMessages = [
      `${timeGreeting}! Bem-vindo ao NeuroCann Lab. Sou o Dr. Cannabis IA, explore nosso sistema gratuitamente!`,
      `${timeGreeting}! Descubra o poder da análise científica de cannabis medicinal no NeuroCann Lab.`,
      `${timeGreeting}! Sistema NeuroCann Lab ativo. Experimente nossa plataforma de pesquisa médica.`
    ];
    
    return freeMessages[Math.floor(Math.random() * freeMessages.length)];
  }, [user, getGreetingByTime]);

  // Função para reproduzir a saudação
  const playGreeting = useCallback(async () => {
    if (!window.speechSynthesis || isPlaying) {
      console.log('🎤 Bloqueado: speechSynthesis ou já reproduzindo');
      return;
    }

    // Funciona no modo free também
    const userId = user?.id || 'free-user';
    
    try {
      setIsPlaying(true);
      console.log('🎤 Iniciando reprodução para:', userId);
      
      // Cancelar qualquer fala anterior
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const message = generateGreetingMessage();
      console.log('🎤 Mensagem:', message);
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
        localStorage.setItem(`greeting_played_${userId}`, new Date().toDateString());
        console.log('🎤 Reprodução concluída');
      };
      
      utterance.onerror = (error) => {
        setIsPlaying(false);
        console.warn('🎤 Erro na reprodução:', error);
      };
      
      // Reproduzir
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.warn('🎤 Text-to-Speech não suportado:', error);
      setIsPlaying(false);
    }
  }, [user, config, generateGreetingMessage, isPlaying]);

  // Verificar se já foi reproduzido hoje (funciona no modo free também)
  useEffect(() => {
    const userId = user?.id || 'free-user';
    const lastPlayed = localStorage.getItem(`greeting_played_${userId}`);
    const today = new Date().toDateString();
    setHasPlayedToday(lastPlayed === today);
    console.log('🎤 Status reprodução:', { userId, lastPlayed, today, hasPlayedToday: lastPlayed === today });
  }, [user]);

  // Auto-reproduzir APENAS na primeira entrada do dia  
  useEffect(() => {
    // Funciona tanto para usuários autenticados quanto no modo free
    const userId = user?.id || 'free-user';
    
    if (config.enabled && !hasPlayedToday && !isPlaying) {
      // Verificar se é realmente o primeiro acesso do dia
      const lastLoginDate = localStorage.getItem(`last_login_${userId}`);
      const today = new Date().toDateString();
      
      console.log('🎤 Verificando saudação:', { lastLoginDate, today, hasPlayedToday });
      
      if (lastLoginDate !== today) {
        // Aguardar um pouco após o carregamento para melhor experiência
        const timer = setTimeout(() => {
          console.log('🎤 Reproduzindo saudação automática');
          playGreeting();
          localStorage.setItem(`last_login_${userId}`, today);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, config.enabled, hasPlayedToday, isPlaying, playGreeting]);

  // Função para reproduzir manualmente (sempre funciona)
  const playManualGreeting = useCallback(async () => {
    if (!window.speechSynthesis || isPlaying) {
      console.log('🎤 Manual bloqueado: speechSynthesis ou já reproduzindo');
      return;
    }

    const userId = user?.id || 'free-user';
    
    try {
      setIsPlaying(true);
      console.log('🎤 Reprodução manual para:', userId);
      
      // Cancelar qualquer fala anterior
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const message = generateGreetingMessage();
      console.log('🎤 Mensagem manual:', message);
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
        console.log('🎤 Reprodução manual concluída');
      };
      
      utterance.onerror = (error) => {
        setIsPlaying(false);
        console.warn('🎤 Erro na reprodução manual:', error);
      };
      
      // Reproduzir
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.warn('🎤 Erro manual:', error);
      setIsPlaying(false);
    }
  }, [user, config, generateGreetingMessage, isPlaying]);

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