import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Stethoscope } from 'lucide-react';

interface VoiceEnabledAvatarProps {
  onVoiceMessage?: (message: string) => void;
  onStartConsultation?: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceEnabledAvatar({ onVoiceMessage, onStartConsultation }: VoiceEnabledAvatarProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const mouthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inicializar Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'pt-BR';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLastMessage(transcript);
        console.log('Comando de voz recebido:', transcript);
        processMedicalCommand(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, []);

  // Animação labial em tempo real
  useEffect(() => {
    if (!mouthRef.current) return;

    const interval = setInterval(() => {
      if (isSpeaking && mouthRef.current) {
        const scale = 1 + Math.random() * 0.4;
        const openness = Math.random() * 30 + 10;
        
        mouthRef.current.style.transform = `scaleX(${scale}) scaleY(${1 + Math.random() * 0.3})`;
        mouthRef.current.style.height = `${openness}px`;
      } else if (mouthRef.current) {
        mouthRef.current.style.transform = 'scaleX(1) scaleY(1)';
        mouthRef.current.style.height = '8px';
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  const processMedicalCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';

    if (lowerCommand.includes('consulta') || lowerCommand.includes('sintomas')) {
      response = 'Olá! Sou o Dr. Cannabis IA. Vou analisar seus sintomas. Por favor, descreva o que está sentindo.';
    } else if (lowerCommand.includes('cannabis') || lowerCommand.includes('cbd')) {
      response = 'Baseado na literatura científica, posso orientar sobre cannabis medicinal. Qual sua condição específica?';
    } else if (lowerCommand.includes('dosagem') || lowerCommand.includes('protocolo')) {
      response = 'Para protocolos de dosagem, preciso avaliar seu histórico médico. Vamos iniciar uma consulta completa?';
    } else if (lowerCommand.includes('dor') || lowerCommand.includes('ansiedade')) {
      response = 'Entendo que está lidando com esses sintomas. Baseado em estudos recentes, cannabis pode ser uma opção terapêutica. Vamos analisar seu caso?';
    } else {
      response = 'Entendi sua solicitação. Como médico especialista em cannabis, posso ajudar com orientações baseadas em evidências científicas.';
    }

    await speakResponse(response);
    onVoiceMessage?.(command);
  };

  const speakResponse = async (text: string) => {
    if (!synthesis) {
      console.warn('Speech synthesis não suportado');
      return;
    }

    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Encontrar voz portuguesa
    const voices = synthesis.getVoices();
    const ptVoice = voices.find(voice => voice.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    synthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognition) {
      console.warn('Speech recognition não suportado');
      return;
    }

    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const startMedicalConsultation = () => {
    setIsActive(true);
    const greeting = 'Olá! Sou o Dr. Cannabis IA, especialista em cannabis medicinal. Como posso ajudá-lo hoje?';
    speakResponse(greeting);
    onStartConsultation?.();
  };

  const getAvatarGlow = () => {
    if (isListening) return 'shadow-yellow-400/70 border-yellow-400/50';
    if (isSpeaking) return 'shadow-blue-400/60 border-blue-400/40';
    if (isActive) return 'shadow-green-400/60 border-green-400/40';
    return 'shadow-purple-400/40 border-purple-400/30';
  };

  return (
    <div className="relative w-80 h-80 mx-auto mt-20">
      {/* Background holográfico principal */}
      <div className={`
        absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900
        ${getAvatarGlow()} border-2 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isSpeaking ? 'animate-pulse scale-105' : isListening ? 'animate-bounce scale-102' : 'scale-100'}
      `} />

      {/* Rosto médico ultra-realista */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 shadow-inner overflow-hidden">
        
        {/* Cabelo médico profissional */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-full opacity-90" />
        
        {/* Testa */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-b from-amber-100 to-yellow-50 rounded-full" />

        {/* Olhos azuis realistas com movimento */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex space-x-8">
          {/* Olho esquerdo */}
          <div className="relative">
            <div className="w-6 h-6 bg-white rounded-full shadow-inner">
              <div className={`
                w-4 h-4 bg-blue-600 rounded-full absolute top-1 left-1 transition-all duration-300
                ${isListening ? 'animate-ping' : isSpeaking ? 'scale-110' : ''}
              `}>
                <div className="w-2 h-2 bg-black rounded-full absolute top-1 left-1" />
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-1.5 opacity-80" />
              </div>
            </div>
            <div className="absolute -top-2 left-0 w-6 h-1 bg-gray-600 rounded-full opacity-70" />
          </div>
          
          {/* Olho direito */}
          <div className="relative">
            <div className="w-6 h-6 bg-white rounded-full shadow-inner">
              <div className={`
                w-4 h-4 bg-blue-600 rounded-full absolute top-1 left-1 transition-all duration-300
                ${isListening ? 'animate-ping' : isSpeaking ? 'scale-110' : ''}
              `}>
                <div className="w-2 h-2 bg-black rounded-full absolute top-1 left-1" />
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-1.5 opacity-80" />
              </div>
            </div>
            <div className="absolute -top-2 left-0 w-6 h-1 bg-gray-600 rounded-full opacity-70" />
          </div>
        </div>

        {/* Nariz */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="w-3 h-4 bg-gradient-to-b from-amber-200 to-amber-300 rounded-lg shadow-sm" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-1 h-1 bg-gray-600 rounded-full opacity-40" />
            <div className="w-1 h-1 bg-gray-600 rounded-full opacity-40" />
          </div>
        </div>

        {/* Boca com animação labial em tempo real */}
        <div className="absolute top-26 left-1/2 transform -translate-x-1/2">
          <div 
            ref={mouthRef}
            className={`
              w-8 h-2 bg-red-400 rounded-full transition-all duration-100 ease-out
              ${isSpeaking ? 'shadow-lg' : ''}
            `}
            style={{
              background: isSpeaking 
                ? 'linear-gradient(to bottom, #ef4444, #dc2626)' 
                : 'linear-gradient(to bottom, #f87171, #ef4444)'
            }}
          />
          {/* Dentes visíveis quando falando */}
          {isSpeaking && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-sm opacity-80" />
          )}
        </div>
      </div>

      {/* Jaleco médico */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-44 h-32 bg-white rounded-t-3xl shadow-lg border-2 border-gray-200">
        {/* Botões do jaleco */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-4 space-y-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full shadow" />
          <div className="w-2 h-2 bg-gray-300 rounded-full shadow" />
          <div className="w-2 h-2 bg-gray-300 rounded-full shadow" />
        </div>
        
        {/* Bolso com estetoscópio */}
        <div className="absolute left-4 top-4 w-8 h-6 bg-gray-100 rounded border border-gray-200">
          <div className="absolute -top-1 left-1 w-1 h-4 bg-gray-600 rounded" />
          <div className="absolute -top-2 left-0 w-3 h-3 bg-gray-700 rounded-full" />
        </div>

        {/* Certificações virtuais */}
        <div className="absolute right-2 top-2 text-xs">
          <div className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-[6px] mb-1">CRM Virtual</div>
          <div className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-[6px]">Especialista Canabinóide</div>
        </div>
      </div>

      {/* Controles de Voz */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {/* Botão Iniciar Consulta */}
        <button
          onClick={startMedicalConsultation}
          disabled={isActive}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${isActive 
              ? 'bg-green-600 text-white cursor-default' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }
          `}
          data-testid="button-start-consultation"
        >
          <Stethoscope className="w-4 h-4 inline mr-2" />
          {isActive ? 'Dr. Ativo' : 'Iniciar Consulta'}
        </button>

        {/* Botão Microfone */}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={!isActive || isSpeaking}
          className={`
            p-3 rounded-full transition-all duration-300 hover:scale-105
            ${isListening 
              ? 'bg-red-600 text-white animate-pulse' 
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }
            ${(!isActive || isSpeaking) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          data-testid="button-voice-toggle"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Botão Silenciar */}
        <button
          onClick={() => synthesis?.cancel()}
          disabled={!isSpeaking}
          className={`
            p-3 rounded-full transition-all duration-300 hover:scale-105
            ${isSpeaking 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-600 text-white opacity-50 cursor-not-allowed'
            }
          `}
          data-testid="button-stop-speech"
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Indicador de Status */}
      {lastMessage && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm max-w-xs text-center">
          ":{lastMessage}"
        </div>
      )}

      {/* Partículas médicas flutuantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-2 h-2 bg-green-400 rounded-full opacity-30
              animate-bounce transition-all duration-1000
              ${isActive ? 'animate-pulse' : ''}
            `}
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i * 0.2)}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}