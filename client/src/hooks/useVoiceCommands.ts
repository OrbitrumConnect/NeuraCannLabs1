import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface VoiceCommandsConfig {
  enabled: boolean;
  language: string;
}

// Comandos disponíveis
const VOICE_COMMANDS = {
  search: ['pesquisar', 'procurar', 'buscar', 'encontrar'],
  navigate: {
    scientific: ['estudos científicos', 'científicos', 'estudos', 'pesquisas'],
    clinical: ['casos clínicos', 'clínicos', 'casos'],
    alerts: ['alertas', 'avisos', 'notificações'],
    forum: ['fórum', 'discussão', 'comunidade'],
    profile: ['perfil', 'configurações', 'conta'],
    plans: ['planos', 'assinatura', 'upgrade']
  },
  actions: {
    login: ['fazer login', 'entrar', 'conectar'],
    logout: ['sair', 'desconectar', 'logout'],
    help: ['ajuda', 'socorro', 'como usar']
  }
};

export function useVoiceCommands() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Configuração padrão
  const [config] = useState<VoiceCommandsConfig>({
    enabled: true,
    language: 'pt-BR'
  });

  // Verificar suporte
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = config.language;
      
      setRecognition(recognitionInstance);
    }
  }, [config.language]);

  // Processar comando de voz
  const processVoiceCommand = useCallback((transcript: string) => {
    const command = transcript.toLowerCase().trim();
    console.log('🎙️ Comando recebido:', command);
    setLastCommand(command);

    // Comandos de pesquisa
    if (VOICE_COMMANDS.search.some(cmd => command.includes(cmd))) {
      // Extrair termo de pesquisa após palavra-chave
      let searchTerm = '';
      for (const searchCmd of VOICE_COMMANDS.search) {
        if (command.includes(searchCmd)) {
          searchTerm = command.split(searchCmd)[1]?.trim() || '';
          break;
        }
      }
      
      if (searchTerm) {
        // Simular busca no sistema
        const searchInput = document.querySelector('input[placeholder*="pesquisa"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.value = searchTerm;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          
          // Simular Enter para buscar
          setTimeout(() => {
            searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          }, 500);
        }
        
        speak(`Pesquisando por ${searchTerm}`);
        return true;
      }
    }

    // Comandos de navegação
    for (const [section, keywords] of Object.entries(VOICE_COMMANDS.navigate)) {
      if (keywords.some(keyword => command.includes(keyword))) {
        navigateToSection(section);
        speak(`Navegando para ${section}`);
        return true;
      }
    }

    // Comandos de ação
    if (VOICE_COMMANDS.actions.help.some(cmd => command.includes(cmd))) {
      speak('Você pode me pedir para pesquisar, navegar entre seções, ou fazer login. Por exemplo: "pesquisar CBD ansiedade" ou "ir para estudos científicos"');
      return true;
    }

    if (VOICE_COMMANDS.actions.login.some(cmd => command.includes(cmd)) && !user) {
      window.location.href = '/api/login';
      speak('Redirecionando para login');
      return true;
    }

    if (VOICE_COMMANDS.actions.logout.some(cmd => command.includes(cmd)) && user) {
      window.location.href = '/api/logout';
      speak('Fazendo logout');
      return true;
    }

    // Comando não reconhecido
    speak('Desculpe, não entendi esse comando. Diga "ajuda" para ver o que posso fazer.');
    return false;
  }, [user]);

  // Função para navegar
  const navigateToSection = (section: string) => {
    const routes = {
      scientific: '/dashboard',
      clinical: '/dashboard', 
      alerts: '/dashboard',
      forum: '/forum',
      profile: '/profile',
      plans: '/plans'
    };

    const route = routes[section as keyof typeof routes];
    if (route) {
      window.location.href = route;
    }
  };

  // Função para falar (resposta do Dr. Cannabis IA)
  const speak = (text: string) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(`Dr. Cannabis IA: ${text}`);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt') || voice.lang.includes('BR')
      );
      
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Iniciar escuta
  const startListening = useCallback(() => {
    if (!recognition || !config.enabled || isListening) return;

    setIsListening(true);
    console.log('🎙️ Iniciando escuta de comandos...');

    recognition.onstart = () => {
      console.log('🎙️ Escuta iniciada');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎙️ Transcript:', transcript);
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.warn('🎙️ Erro no reconhecimento:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🎙️ Escuta finalizada');
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.warn('🎙️ Erro ao iniciar:', error);
      setIsListening(false);
    }
  }, [recognition, config.enabled, isListening, processVoiceCommand]);

  // Parar escuta
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return {
    isSupported,
    isListening,
    lastCommand,
    startListening,
    stopListening,
    speak
  };
}