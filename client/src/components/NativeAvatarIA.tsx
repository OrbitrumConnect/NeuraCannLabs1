import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Brain, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AvatarDisplayProps {
  isListening: boolean;
  isSpeaking: boolean;
  mood: 'neutral' | 'happy' | 'thinking' | 'explaining';
}

function AvatarDisplay({ isListening, isSpeaking, mood }: AvatarDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {/* Container Principal do Avatar Médico */}
      <div className="relative">
        
        {/* Background Holográfico */}
        <div className={`
          relative w-80 h-80 rounded-full 
          ${isListening ? 'bg-gradient-to-br from-green-400/20 via-emerald-500/30 to-green-600/20 shadow-green-400/50' :
            isSpeaking ? 'bg-gradient-to-br from-blue-400/20 via-cyan-500/30 to-blue-600/20 shadow-blue-400/50' :
            'bg-gradient-to-br from-purple-400/20 via-indigo-500/30 to-purple-600/20 shadow-purple-400/30'}
          shadow-2xl backdrop-blur-sm border border-white/10
          transition-all duration-500 ease-in-out
          ${isListening ? 'animate-pulse scale-105' : 
            isSpeaking ? 'animate-bounce scale-110' : 'scale-100'}
        `}>
          
          {/* Rosto Humano Realista */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100 shadow-inner">
            
            {/* Cabelo */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-full opacity-80" />
            
            {/* Sobrancelhas */}
            <div className="absolute top-16 left-16 w-8 h-2 bg-gray-700 rounded-full transform -rotate-12" />
            <div className="absolute top-16 right-16 w-8 h-2 bg-gray-700 rounded-full transform rotate-12" />
            
            {/* Olhos Realistas */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex space-x-6">
              <div className={`
                relative w-8 h-6 bg-white rounded-full shadow-inner overflow-hidden
                ${isListening ? 'scale-110' : 'scale-100'} transition-transform duration-200
              `}>
                <div className="absolute top-1 left-2 w-4 h-4 bg-blue-600 rounded-full">
                  <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full" />
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
              <div className={`
                relative w-8 h-6 bg-white rounded-full shadow-inner overflow-hidden
                ${isListening ? 'scale-110' : 'scale-100'} transition-transform duration-200
              `}>
                <div className="absolute top-1 left-2 w-4 h-4 bg-blue-600 rounded-full">
                  <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full" />
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* Nariz */}
            <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-amber-200 to-amber-300 rounded-b-lg shadow-sm" />

            {/* Boca Expressiva */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              {isSpeaking ? (
                <div className="w-12 h-8 border-2 border-red-500 bg-red-100 rounded-full animate-pulse shadow-inner">
                  <div className="absolute inset-1 bg-red-200 rounded-full" />
                </div>
              ) : mood === 'happy' ? (
                <div className="w-10 h-6 border-2 border-pink-400 bg-pink-100 rounded-full shadow-inner transform rotate-12" />
              ) : (
                <div className="w-8 h-4 border border-gray-400 bg-pink-100 rounded-full shadow-inner" />
              )}
            </div>

            {/* Jaleco Médico */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-12 bg-white rounded-t-3xl shadow-lg border border-gray-200">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                <div className="w-1 h-6 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Equipamentos Médicos Flutuantes */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className={`
              w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full 
              flex items-center justify-center shadow-lg
              ${isListening ? 'animate-ping' : 'animate-pulse'}
            `}>
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Indicadores de Status Médico */}
          <div className="absolute -top-4 -right-4">
            {isListening && (
              <div className="flex flex-col space-y-1">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-ping shadow-lg">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs text-green-400 font-semibold text-center">ESCUTANDO</div>
              </div>
            )}
            {isSpeaking && (
              <div className="flex flex-col space-y-1">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs text-blue-400 font-semibold text-center">FALANDO</div>
              </div>
            )}
            {!isListening && !isSpeaking && (
              <div className="flex flex-col space-y-1">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs text-purple-400 font-semibold text-center">PENSANDO</div>
              </div>
            )}
          </div>

          {/* Halo de Energia Médica */}
          <div className="absolute -inset-8 rounded-full border-2 border-dashed border-green-400/30 animate-spin-slow" />
          <div className="absolute -inset-12 rounded-full border border-blue-400/20 animate-pulse" />
        </div>
      </div>

      {/* Identificação Profissional */}
      <div className="text-center space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
            Dr. Cannabis IA
          </h2>
          <p className="text-lg text-gray-300 font-medium">Médico Especialista Virtual</p>
          <p className="text-sm text-gray-400">Cannabis Medicinal & Terapias Avançadas</p>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              isSpeaking ? 'bg-blue-400 animate-pulse' :
              isListening ? 'bg-green-400 animate-pulse' :
              'bg-purple-400'
            }`} />
            <span className="text-gray-400">
              {isSpeaking ? 'Respondendo consulta médica...' : 
               isListening ? 'Analisando sintomas...' : 
               'Aguardando paciente'}
            </span>
          </div>
        </div>

        {/* Certificações Virtuais */}
        <div className="flex justify-center space-x-3 pt-2">
          <div className="px-2 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
            <span className="text-xs text-green-400 font-semibold">CRM VIRTUAL</span>
          </div>
          <div className="px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <span className="text-xs text-blue-400 font-semibold">CANABINÓIDE IA</span>
          </div>
        </div>
      </div>

      {/* Ondas Sonoras Médicas */}
      {isSpeaking && (
        <div className="flex space-x-2 justify-center">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full animate-pulse"
              style={{
                width: '3px',
                height: `${Math.random() * 30 + 15}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface VoiceIndicatorProps {
  isListening: boolean;
  volume: number;
}

function VoiceIndicator({ isListening, volume }: VoiceIndicatorProps) {
  if (!isListening) return null;

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-lg p-3">
      <Mic className="h-4 w-4 text-green-400" />
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1 h-6 rounded-full transition-all duration-100 ${
              volume * 5 > i ? 'bg-green-400' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-green-400 text-sm">Escutando...</span>
    </div>
  );
}

export function NativeAvatarIA() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mood, setMood] = useState<'neutral' | 'happy' | 'thinking' | 'explaining'>('neutral');
  const [volume, setVolume] = useState(0);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      setMood('thinking');

      // Simular detecção de volume
      const volumeInterval = setInterval(() => {
        setVolume(Math.random() * 0.8 + 0.2);
      }, 100);

      setTimeout(() => {
        clearInterval(volumeInterval);
        stopListening();
      }, 5000); // Escuta por 5 segundos

    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      toast({
        title: "Erro de Microfone",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setVolume(0);
  };

  const processAudio = async (audioBlob: Blob) => {
    setMood('thinking');
    
    // Simular processamento de áudio para texto
    // Em produção, você usaria um serviço como Web Speech API ou API externa
    
    // Simular reconhecimento de voz
    const simulatedText = "Como posso ajudar com cannabis medicinal?";
    
    setConversation(prev => [...prev, { role: 'user', content: simulatedText }]);
    
    // Gerar resposta médica inteligente
    await generateMedicalResponse(simulatedText);
  };

  const generateMedicalResponse = async (userInput: string) => {
    setMood('thinking');

    // Respostas médicas especializadas baseadas em palavras-chave
    const medicalResponses = {
      'dor': 'Para tratamento da dor com cannabis medicinal, recomendo protocolos com CBD predominante. Estudos mostram eficácia em doses de 2.5 a 20mg, duas vezes ao dia. É importante monitorar a resposta e ajustar gradualmente.',
      
      'ansiedade': 'Cannabis com alto teor de CBD é eficaz para ansiedade. Recomendo iniciar com 5mg de CBD sublingual, podendo aumentar até 25mg conforme necessidade. Evite THC alto que pode aumentar ansiedade.',
      
      'epilepsia': 'Para epilepsia refratária, o protocolo padrão inicia com CBD 2-5mg/kg/dia, dividido em duas doses. O Epidiolex é aprovado pela ANVISA. Monitoramento médico rigoroso é essencial.',
      
      'câncer': 'Em oncologia, cannabis pode ajudar com náuseas, dor e perda de apetite. Protocolos variam: THC:CBD 1:1 para dor, CBD puro para náuseas. Sempre em conjunto com oncologista.',
      
      'insônia': 'Para distúrbios do sono, recomendo fórmulas com CBN e CBD. Protocolo: 5-10mg CBN + 10-20mg CBD, 30 minutos antes de dormir. Evite THC muito alto.',
      
      'default': 'Como especialista em cannabis medicinal, posso ajudar com protocolos terapêuticos, dosagens, interações medicamentosas e evidências científicas. Sobre o que gostaria de saber especificamente?'
    };

    const response = Object.keys(medicalResponses).find(key => 
      userInput.toLowerCase().includes(key)
    ) || 'default';

    const aiResponse = medicalResponses[response as keyof typeof medicalResponses];
    
    setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    
    // Falar a resposta
    await speakResponse(aiResponse);
  };

  const speakResponse = async (text: string) => {
    if (!synthRef.current) return;

    setIsSpeaking(true);
    setMood('explaining');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => {
      setIsSpeaking(false);
      setMood('neutral');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setMood('neutral');
      toast({
        title: "Erro de Síntese de Voz",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive"
      });
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setMood('neutral');
    }
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Avatar Display */}
      <AvatarDisplay
        isListening={isListening}
        isSpeaking={isSpeaking}
        mood={mood}
      />

      {/* Indicador de voz */}
      <VoiceIndicator isListening={isListening} volume={volume} />

      {/* Controles de voz */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full p-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`rounded-full w-16 h-16 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            data-testid={isListening ? 'button-stop-listening' : 'button-start-listening'}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : () => speakResponse("Olá! Sou o Dr. Cannabis IA, seu assistente médico especializado. Como posso ajudá-lo hoje?")}
            disabled={isListening}
            className={`rounded-full w-16 h-16 ${
              isSpeaking 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            data-testid={isSpeaking ? 'button-stop-speaking' : 'button-start-speaking'}
          >
            {isSpeaking ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Histórico da conversa */}
      {conversation.length > 0 && (
        <div className="absolute top-4 left-4 max-w-md bg-black/70 backdrop-blur-sm rounded-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="text-green-400 font-bold mb-2">Conversa Médica</h3>
          <div className="space-y-2">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  msg.role === 'user' 
                    ? 'bg-blue-500/20 text-blue-200' 
                    : 'bg-green-500/20 text-green-200'
                }`}
              >
                <div className="text-xs font-semibold mb-1">
                  {msg.role === 'user' ? 'Você' : 'Dr. Cannabis IA'}
                </div>
                <div className="text-sm">{msg.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status do avatar */}
      <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm rounded-lg p-3">
        <div className="text-center">
          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
            isSpeaking ? 'bg-blue-400 animate-pulse' :
            isListening ? 'bg-green-400 animate-pulse' :
            'bg-purple-400'
          }`} />
          <div className="text-xs text-gray-300">
            {isSpeaking ? 'Falando' : isListening ? 'Escutando' : 'Aguardando'}
          </div>
        </div>
      </div>
    </div>
  );
}