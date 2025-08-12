import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Brain, Stethoscope, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceEnabledAvatar from './VoiceEnabledAvatar';

interface AvatarStreamingProps {
  audioPlaying: boolean;
  isListening: boolean;
  mood: 'neutral' | 'happy' | 'thinking' | 'explaining';
}

function MedicalAvatarStreaming({ audioPlaying, isListening, mood }: AvatarStreamingProps) {
  const mouthRef = useRef<HTMLDivElement>(null);

  // Animação labial em tempo real
  useEffect(() => {
    if (!mouthRef.current) return;

    const interval = setInterval(() => {
      if (audioPlaying && mouthRef.current) {
        // Animação de movimento labial realista
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
  }, [audioPlaying]);

  const getAvatarGlow = () => {
    if (isListening) return 'shadow-green-400/60 border-green-400/40';
    if (audioPlaying) return 'shadow-blue-400/60 border-blue-400/40';
    return 'shadow-purple-400/40 border-purple-400/30';
  };

  return (
    <div className="relative w-80 h-80 mx-auto mt-32">
      {/* Background holográfico principal */}
      <div className={`
        absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900
        ${getAvatarGlow()} border-2 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${audioPlaying ? 'animate-pulse scale-105' : isListening ? 'animate-bounce scale-102' : 'scale-100'}
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
                ${isListening ? 'animate-ping' : audioPlaying ? 'scale-110' : ''}
              `}>
                <div className="w-2 h-2 bg-black rounded-full absolute top-1 left-1" />
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-1.5 opacity-80" />
              </div>
            </div>
            {/* Sobrancelha */}
            <div className="absolute -top-2 left-0 w-6 h-1 bg-gray-600 rounded-full opacity-70" />
          </div>

          {/* Olho direito */}
          <div className="relative">
            <div className="w-6 h-6 bg-white rounded-full shadow-inner">
              <div className={`
                w-4 h-4 bg-blue-600 rounded-full absolute top-1 left-1 transition-all duration-300
                ${isListening ? 'animate-ping' : audioPlaying ? 'scale-110' : ''}
              `}>
                <div className="w-2 h-2 bg-black rounded-full absolute top-1 left-1" />
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-1.5 opacity-80" />
              </div>
            </div>
            {/* Sobrancelha */}
            <div className="absolute -top-2 left-0 w-6 h-1 bg-gray-600 rounded-full opacity-70" />
          </div>
        </div>

        {/* Nariz realista */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="w-3 h-6 bg-gradient-to-b from-amber-100 to-yellow-100 rounded-b-lg shadow-sm" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-amber-200 rounded-full" />
        </div>

        {/* Boca com animação labial ultra-realista */}
        <div className="absolute top-28 left-1/2 transform -translate-x-1/2">
          <div 
            ref={mouthRef}
            className={`
              w-12 bg-gradient-to-b transition-all duration-75 ease-out rounded-full
              ${audioPlaying ? 'from-red-500 to-red-600' : 'from-pink-400 to-pink-500'}
            `}
            style={{ height: '8px' }}
          />
          {/* Dentes quando falando */}
          {audioPlaying && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-white rounded-sm opacity-80" />
          )}
        </div>

        {/* Queixo */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-yellow-50 to-amber-100 rounded-b-full" />
      </div>

      {/* Jaleco médico detalhado */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-white rounded-t-3xl shadow-lg border border-gray-200">
        {/* Gola do jaleco */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-white rounded-t-xl border-l border-r border-gray-200" />
        
        {/* Botões do jaleco */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col space-y-3">
          <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm" />
          <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm" />
          <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm" />
        </div>

        {/* Bolso do jaleco */}
        <div className="absolute top-4 left-4 w-12 h-8 bg-gray-50 rounded border border-gray-200" />
        
        {/* Caneta médica */}
        <div className="absolute top-2 left-5 w-1 h-6 bg-blue-800 rounded-full" />
      </div>

      {/* Estetoscópio flutuante */}
      <div className="absolute top-32 -right-8">
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full opacity-80 animate-spin-slow" />
        <div className="absolute top-12 left-6 w-1 h-12 bg-gray-700 rounded-full" />
        <div className="absolute bottom-0 left-5 w-3 h-3 bg-gray-800 rounded-full" />
      </div>

      {/* Certificações virtuais */}
      <div className="absolute top-16 -left-4 bg-green-500/20 backdrop-blur-sm rounded-lg p-2 border border-green-500/30">
        <div className="text-xs text-green-400 font-bold">CRM Virtual</div>
        <div className="text-xs text-green-300">Cannabis IA</div>
      </div>

      <div className="absolute top-16 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30">
        <div className="text-xs text-blue-400 font-bold">Especialista</div>
        <div className="text-xs text-blue-300">Canabinóide</div>
      </div>

      {/* Identificação principal */}
      <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-xl font-bold text-green-400">Dr. Cannabis IA</div>
          <div className="text-sm text-gray-300">Médico Virtual Especialista</div>
          <div className="text-xs text-gray-400 mt-2 flex items-center justify-center space-x-2">
            {audioPlaying && <Volume2 className="h-4 w-4 text-blue-400 animate-pulse" />}
            {isListening && <Mic className="h-4 w-4 text-green-400 animate-ping" />}
            <span>
              {audioPlaying ? 'Consulta Médica Ativa' : 
               isListening ? 'Analisando Sintomas' : 
               'Aguardando Paciente'}
            </span>
          </div>
        </div>
      </div>

      {/* Partículas médicas flutuantes */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`
            absolute w-2 h-2 rounded-full animate-pulse
            ${isListening ? 'bg-green-400' : audioPlaying ? 'bg-blue-400' : 'bg-purple-400'}
          `}
          style={{
            top: `${30 + Math.sin(i * Math.PI / 4) * 40}%`,
            left: `${50 + Math.cos(i * Math.PI / 4) * 45}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
}

export function StreamingMedicalAvatar3D() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mood, setMood] = useState<'neutral' | 'happy' | 'thinking' | 'explaining'>('neutral');
  const [volume, setVolume] = useState(0);
  const { toast } = useToast();

  // Simulação de fala
  const toggleSpeech = () => {
    if (audioPlaying) {
      setAudioPlaying(false);
      toast({
        title: "Dr. Cannabis IA",
        description: "Parando a consulta médica.",
        duration: 2000,
      });
    } else {
      setAudioPlaying(true);
      setMood('explaining');
      toast({
        title: "Dr. Cannabis IA",
        description: "Iniciando consulta médica sobre cannabis medicinal...",
        duration: 3000,
      });
      
      // Simular duração da fala
      setTimeout(() => {
        setAudioPlaying(false);
        setMood('neutral');
      }, 5000);
    }
  };

  // Simulação de escuta
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setMood('neutral');
      toast({
        title: "Dr. Cannabis IA",
        description: "Parando análise de sintomas.",
        duration: 2000,
      });
    } else {
      setIsListening(true);
      setMood('thinking');
      toast({
        title: "Dr. Cannabis IA",
        description: "Analisando sintomas e histórico médico...",
        duration: 3000,
      });

      // Simular duração da escuta
      setTimeout(() => {
        setIsListening(false);
        setMood('neutral');
      }, 4000);
    }
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      {/* Controles do Avatar */}
      <div className="absolute top-32 left-4 z-10 flex flex-col space-y-2">
        <Button
          onClick={toggleSpeech}
          variant={audioPlaying ? "destructive" : "default"}
          size="lg"
          className="flex items-center space-x-2"
          data-testid="button-toggle-speech"
        >
          {audioPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <span>{audioPlaying ? 'Parar Consulta' : 'Iniciar Consulta'}</span>
        </Button>

        <Button
          onClick={toggleListening}
          variant={isListening ? "secondary" : "outline"}
          size="lg"
          className="flex items-center space-x-2"
          data-testid="button-toggle-listening"
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span>{isListening ? 'Parar Análise' : 'Analisar Sintomas'}</span>
        </Button>
      </div>

      {/* Indicadores de Status */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {audioPlaying && (
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
            <div className="flex items-center space-x-2 text-blue-300">
              <Volume2 className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-semibold">CONSULTA ATIVA</span>
            </div>
          </div>
        )}
        {isListening && (
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
            <div className="flex items-center space-x-2 text-green-300">
              <Mic className="h-5 w-5 animate-ping" />
              <span className="text-sm font-semibold">ANALISANDO</span>
            </div>
          </div>
        )}
      </div>

      {/* Avatar Médico com Funcionalidades de Voz */}
      <div className="h-full w-full flex items-center justify-center">
        <VoiceEnabledAvatar 
          onVoiceMessage={(message) => console.log('Mensagem recebida:', message)}
          onStartConsultation={() => console.log('Consulta iniciada')}
        />
      </div>

      {/* Ondas Sonoras quando falando */}
      {audioPlaying && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full animate-pulse"
              style={{
                width: '4px',
                height: `${Math.random() * 40 + 20}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      )}

      {/* Informações do Sistema */}
      <div className="absolute bottom-4 right-4 text-right">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="text-green-400 font-semibold text-sm">NEUROCANН LAB v3.0</div>
          <div className="text-gray-300 text-xs">Avatar Médico 3D Streaming</div>
          <div className="text-gray-400 text-xs mt-1">
            Sistema: {audioPlaying ? 'Consulta Ativa' : isListening ? 'Análise Ativa' : 'Standby'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamingMedicalAvatar3D;