import React, { useState, useEffect, useRef } from 'react';

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
  className?: string;
}

export default function TextToSpeech({ text, autoPlay = false, className = "" }: TextToSpeechProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speaking]);

  useEffect(() => {
    if (autoPlay && text && supported) {
      handleSpeak();
    }
  }, [text, autoPlay, supported]);

  const handleSpeak = () => {
    if (!supported || !text) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    // Clean text for better speech synthesis
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/🔬|📚|👨‍⚕️|🚨|🎯|📊|📖|⚕️|💊|📋|📈|⚠️|✅|🔺|📢|📅/g, '') // Remove emojis
      .replace(/\n/g, '. ') // Replace line breaks with periods
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/\.\.\./g, '') // Remove ellipsis
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // FORÇA VOZ FEMININA - Dra. Cannabis IA sempre feminina
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('pt') && 
      (voice.name.includes('female') || voice.name.includes('Feminina') || voice.name.includes('Maria') || voice.name.includes('Luciana'))
    ) || voices.find(voice => voice.lang.includes('pt'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log('🗣️ Usando voz feminina:', femaleVoice.name);
    }
    
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85; // Slightly slower for medical content  
    utterance.pitch = 1.1; // Pitch mais alto para voz mais feminina
    utterance.volume = 0.9;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  if (!supported) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={handleSpeak}
        className={`px-2 py-1 rounded text-xs transition-all ${
          speaking 
            ? 'bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30' 
            : 'bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30'
        }`}
        title={speaking ? 'Pausar leitura' : 'Ler texto em voz alta'}
      >
        {speaking ? '⏸️ Pausar' : '🔊 Ler'}
      </button>
      
      {speaking && (
        <button
          onClick={handleStop}
          className="px-2 py-1 bg-gray-600/20 text-gray-300 border border-gray-500/30 rounded text-xs hover:bg-gray-600/30 transition-all"
          title="Parar leitura"
        >
          ⏹️ Parar
        </button>
      )}
      
      {speaking && (
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-400">Lendo...</span>
        </div>
      )}
    </div>
  );
}