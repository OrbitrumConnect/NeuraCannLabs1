import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mic, MicOff, MessageCircle, Video, Upload, CheckCircle, Play, FileText, UserPlus, AlertTriangle, Home, Search, BookOpen, Users } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useDraCannabisAutoStart } from '@/hooks/useDraCannabisAutoStart';
import draCannabisImage from '@assets/20250812_1435_Flor de Cannabis Realista_remix_01k2fnf8n7ez0tf90qz4rrj3nc_1755020566579.png';
import { nativeAvatarService } from '@/services/nativeAvatarService';


interface ConsultResponse {
  success: boolean;
  response: string;
  doctor: string;
  specialty: string;
  timestamp: string;
  recommendations: string[];
}

interface TalkResponse {
  success: boolean;
  talkId: string;
  status: string;
  message: string;
}

interface TalkStatus {
  success: boolean;
  status: string;
  resultUrl?: string;
  error?: string;
}

interface ConsultationSummary {
  patientSymptoms: string;
  doctorRecommendations: string;
  medications: string[];
  followUp: string;
  timestamp: string;
}

interface MedicalReferral {
  success: boolean;
  summary: string;
  patientInfo: string;
  recommendedSpecialty: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: string;
  message: string;
}

export function DraCannabisAI() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'doctor';
    message: string;
    timestamp: string;
  }>>([]);
  const [isListening, setIsListening] = useState(false);
  // Estados do D-ID removidos - sistema nativo não precisa deles
  const [consultationSummary, setConsultationSummary] = useState<ConsultationSummary | null>(null);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isAutoStarting, setIsAutoStarting] = useState(false);
  const [didVideoUrl, setDidVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [useDIDAnimation, setUseDIDAnimation] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { shouldAutoStart, markAutoStarted } = useDraCannabisAutoStart();

  // Auto-inicialização da Dra. Cannabis IA
  useEffect(() => {
    if (shouldAutoStart && !isAutoStarting) {
      setIsAutoStarting(true);
      
      // Configura sistema nativo primeiro
      setupNativeDraMutation.mutate();
      
      setTimeout(() => {
        // Saudação automática após 2 segundos
        const welcomeMessage = "Olá! Eu sou a Dra. Cannabis IA. Seja bem-vindo ao NeuroCann Lab! Como posso ajudá-lo hoje com suas questões sobre cannabis medicinal?";
        
        setChatHistory(prev => [
          ...prev,
          { type: 'doctor', message: welcomeMessage, timestamp: new Date().toISOString() }
        ]);
        
        // Fala automática da saudação (D-ID ou nativo)
        if (useDIDAnimation) {
          generateDIDVideo(welcomeMessage);
        } else {
          nativeAvatarService.makeAvatarSpeak(welcomeMessage, 'professional').catch(error => {
            console.error('Erro na saudação automática:', error);
          });
        }
        
        markAutoStarted();
        setIsAutoStarting(false);
      }, 2000);
    }
  }, [shouldAutoStart, isAutoStarting]);

  // Configuração nativa da Dra. Cannabis (sem D-ID)
  const setupNativeDraMutation = useMutation({
    mutationFn: async () => {
      // Configura callback de animação da boca
      nativeAvatarService.setAnimationCallback((isActive, intensity) => {
        setIsTalking(isActive);
        // Adiciona variação na intensidade da animação
        if (isActive) {
          const avatar = document.querySelector('.avatar-talking');
          if (avatar) {
            (avatar as HTMLElement).style.setProperty('--talk-intensity', intensity.toString());
          }
        }
      });
      
      return { success: true, message: "Sistema nativo configurado com sucesso!" };
    },
    onSuccess: (data: any) => {
      toast({
        title: "Dra. Cannabis IA Ativada!",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Configuração",
        description: error.message || "Erro ao configurar Dra. Cannabis IA",
        variant: "destructive",
      });
    },
  });

  // Gerar vídeo animado D-ID
  const generateDIDVideo = async (text: string) => {
    setIsGeneratingVideo(true);
    setDidVideoUrl(null);
    
    try {
      const response = await apiRequest("/api/dra-cannabis/animate", "POST", { text });
      const result = await response.json();
      
      if (result.success && result.videoUrl) {
        setDidVideoUrl(result.videoUrl);
        
        // Reproduzir vídeo automaticamente quando estiver pronto
        if (videoRef.current) {
          videoRef.current.src = result.videoUrl;
          videoRef.current.play().catch(console.error);
        }
        
        toast({
          title: "Dra. Cannabis Animada!",
          description: "Vídeo com animação facial gerado com sucesso",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Erro ao gerar vídeo D-ID:', error);
      toast({
        title: "Erro na Animação",
        description: "Não foi possível gerar o vídeo animado",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Consulta médica por texto
  const consultMutation = useMutation<ConsultResponse, Error, { question: string }>({
    mutationFn: async (data: { question: string }) => {
      const payload = {
        question: data.question,
        conversationHistory: chatHistory.map(msg => ({
          type: msg.type === 'user' ? 'user' : 'assistant',
          message: msg.message,
          timestamp: msg.timestamp
        }))
      };
      const response = await apiRequest('/api/doctor/consult', 'POST', payload);
      return await response.json() as ConsultResponse;
    },
    onSuccess: (data: ConsultResponse, variables) => {
      const now = new Date().toISOString();
      console.log('✅ Resposta completa da API:', data);
      console.log('✅ Texto da resposta:', data.response);
      const newChatHistory = [
        ...chatHistory,
        { type: 'user', message: variables.question, timestamp: now },
        { type: 'doctor', message: data.response || 'Erro: resposta não encontrada', timestamp: now }
      ];
      
      setChatHistory(newChatHistory);
      setQuestion('');

      // Gerar resumo automático após 6+ mensagens (3+ trocas completas)
      if (newChatHistory.length >= 6 && !consultationSummary) {
        setTimeout(() => {
          toast({
            title: "Consulta Prolongada Detectada",
            description: "A Dra. Cannabis sugere gerar um resumo da consulta. Clique em 'Gerar Resumo' abaixo.",
            variant: "default",
          });
        }, 2000);
      }
      
      // Automaticamente ativar resposta em voz da Dra. Cannabis (sistema híbrido + D-ID)
      if (data.response) {
        setIsTalking(true);
        
        // Sistema com três opções: D-ID, ElevenLabs, ou nativo
        if (useDIDAnimation) {
          // Usar animação D-ID com vídeo realista
          generateDIDVideo(data.response);
        } else {
          // Sistema híbrido: tenta ElevenLabs primeiro, fallback para nativo
          (async () => {
            try {
              console.log('🎭 Tentando ElevenLabs para resposta automática...');
              const response = await fetch('/api/avatar/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: data.response })
              });
              
              if (response.ok) {
                const audioBlob = await response.blob();
                if (audioBlob.size > 0) {
                  const audioUrl = URL.createObjectURL(audioBlob);
                  const audio = new Audio(audioUrl);
                  
                  audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    setIsTalking(false);
                  };
                  
                  await audio.play();
                  console.log('✅ ElevenLabs reproduzido automaticamente');
                  return;
                }
              }
              throw new Error('ElevenLabs não disponível');
            } catch (error) {
              console.log('⚠️ Fallback para sistema nativo:', (error as Error).message);
              try {
                // Usar sistema nativo com voz feminina forçada
                const utterance = new SpeechSynthesisUtterance(data.response);
                
                // FORÇA VOZ FEMININA para Dra. Cannabis
                const voices = window.speechSynthesis.getVoices();
                const femaleVoice = voices.find(voice => 
                  voice.lang.includes('pt') && 
                  (voice.name.includes('female') || voice.name.includes('Feminina') || voice.name.includes('Maria') || voice.name.includes('Luciana'))
                ) || voices.find(voice => voice.lang.includes('pt'));
                
                if (femaleVoice) {
                  utterance.voice = femaleVoice;
                  console.log('🗣️ Dra. Cannabis - Voz feminina nativa:', femaleVoice.name);
                }
                
                utterance.lang = 'pt-BR';
                utterance.rate = 0.85;
                utterance.pitch = 1.2; // Pitch feminino
                utterance.volume = 0.9;
                
                utterance.onstart = () => console.log('🗣️ Dra. Cannabis começou a falar');
                utterance.onend = () => {
                  console.log('✅ Dra. Cannabis terminou de falar');
                  setIsTalking(false);
                };
                
                window.speechSynthesis.speak(utterance);
                console.log('✅ Sistema nativo reproduzido');
              } catch (nativeError) {
                console.error('❌ Erro no sistema nativo:', nativeError);
                setIsTalking(false);
              }
              setIsTalking(false);
            }
          })();
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Consulta",
        description: error.message || "Erro ao processar consulta médica",
        variant: "destructive",
      });
    },
  });

  // Sistema de fala nativo - gerenciado automaticamente

  // Gerar resumo da consulta
  const generateSummaryMutation = useMutation<ConsultationSummary, Error>({
    mutationFn: async () => {
      const response = await apiRequest('/api/doctor/generate-summary', 'POST', { chatHistory });
      return await response.json() as ConsultationSummary;
    },
    onSuccess: (data: ConsultationSummary) => {
      setConsultationSummary(data);
      toast({
        title: "Resumo Médico Completo",
        description: "Prontuário digital criado com sintomas, recomendações e medicações para encaminhamento profissional",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao Gerar Resumo",
        description: error.message || "Erro ao gerar resumo da consulta",
        variant: "destructive",
      });
    },
  });

  // Encaminhar para médico
  const referToMedicalMutation = useMutation<MedicalReferral, Error>({
    mutationFn: async () => {
      const response = await apiRequest('/api/doctor/refer-to-medical', 'POST', { 
        chatHistory,
        consultationSummary
      });
      return await response.json() as MedicalReferral;
    },
    onSuccess: (data: MedicalReferral) => {
      setShowReferralDialog(true);
      toast({
        title: "Profissional Médico Solicitado",
        description: "Prontuário completo enviado para médico parceiro. Aguarde contato em até 24h",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no Encaminhamento",
        description: error.message || "Erro ao solicitar encaminhamento médico",
        variant: "destructive",
      });
    },
  });

  // Mutation para reprodução de áudio das respostas
  const speakMutation = useMutation({
    mutationFn: async (text: string) => {
      setIsTalking(true);
      await nativeAvatarService.makeAvatarSpeak(text, 'medical');
      return { success: true };
    },
    onSuccess: () => {
      setIsTalking(false);
    },
    onError: (error: any) => {
      setIsTalking(false);
      toast({
        title: "Erro na Reprodução",
        description: error.message || "Erro ao reproduzir áudio",
        variant: "destructive",
      });
    },
  });

  const handleSubmitQuestion = () => {
    if (!question.trim()) return;
    consultMutation.mutate({ question });
  };

  const handleSpeakResponse = (text: string) => {
    speakMutation.mutate(text);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        
        // AUTOMATICAMENTE processa a pergunta após captura
        console.log('🎤 Áudio capturado:', transcript);
        // Processar automaticamente a pergunta capturada
        consultMutation.mutate({ question: transcript });
      };

      recognition.onerror = () => {
        toast({
          title: "Erro no Reconhecimento de Voz",
          description: "Não foi possível capturar áudio",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Recurso Indisponível",
        description: "Reconhecimento de voz não suportado neste navegador",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0 relative">
      {/* Background com círculos sutis - igual ao dashboard principal */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 255, 0, 0.025) 0%, transparent 50%),
            radial-gradient(circle at 90% 70%, rgba(0, 255, 0, 0.015) 0%, transparent 50%),
            radial-gradient(circle at 10% 20%, rgba(0, 255, 0, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 60% 40%, rgba(0, 255, 0, 0.018) 0%, transparent 50%),
            linear-gradient(135deg, hsl(0, 0%, 4%) 0%, hsl(0, 0%, 6%) 50%, hsl(0, 0%, 4%) 100%)
          `
        }}
      />
      
      {/* Conteúdo da Dra. Cannabis IA com z-index relativo */}
      <div className="relative z-10">
      {/* Header da Dra. Cannabis - SEM CARD - Livre */}
      <div className="text-center py-3 md:py-6 min-h-[280px] md:min-h-[350px]">
        <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
          <div className="relative">
            <div className={`${isTalking ? 'avatar-talking' : ''} transition-all duration-300`}>
              <img 
                src={draCannabisImage} 
                alt="Dra. Cannabis IA" 
                className={`
                  w-48 h-48 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 
                  rounded-lg object-contain shadow-2xl 
                  bg-transparent
                  ${isTalking ? 'animate-pulse filter brightness-110' : ''}
                `}
              />
              {isTalking && (
                <div className="absolute inset-0 rounded-lg border-4 border-emerald-400/50 animate-ping" />
              )}
            </div>
            <Badge className={`absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 text-black text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.4)] ${
              isTalking ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400'
            }`}>
              {isTalking ? '🗣️ IA' : 'IA'}
            </Badge>
            {isAutoStarting && (
              <div className="absolute inset-0 bg-emerald-400/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-emerald-400">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin mb-2" />
                  <p className="text-xs md:text-sm">Inicializando...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center space-y-3 md:space-y-4 px-4 md:px-6 mt-4">
          {!setupNativeDraMutation.data && (
            <Button 
              onClick={() => setupNativeDraMutation.mutate()}
              disabled={setupNativeDraMutation.isPending}
              className="bg-emerald-400 hover:bg-emerald-400/90 w-full max-w-xs mx-auto text-sm md:text-base drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              data-testid="button-activate-doctor"
            >
              {setupNativeDraMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Ativando Dra. Cannabis...</span>
                  <span className="sm:hidden">Ativando...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Ativar Dra.
                </>
              )}
            </Button>
          )}
          
          {setupNativeDraMutation.data && (
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-center space-x-2 text-emerald-400">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Dra. Cannabis IA Ativada e Pronta!</span>
              </div>
              
              {/* Controle de Animação D-ID */}
              <div className="flex items-center justify-center space-x-3">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDIDAnimation}
                    onChange={(e) => setUseDIDAnimation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                  />
                  <Video className="w-4 h-4" />
                  <span>Animação Realista (D-ID)</span>
                </label>
              </div>

              {/* Vídeo D-ID quando disponível */}
              {didVideoUrl && useDIDAnimation && (
                <div className="flex justify-center">
                  <video
                    ref={videoRef}
                    width="240"
                    height="240"
                    controls
                    autoPlay
                    loop={false}
                    className="rounded-lg shadow-lg border-2 border-emerald-500"
                    onEnded={() => setIsTalking(false)}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  >
                    <source src={didVideoUrl} type="video/mp4" />
                    Seu navegador não suporta reprodução de vídeo.
                  </video>
                </div>
              )}

              {/* Status da geração de vídeo D-ID */}
              {isGeneratingVideo && (
                <div className="flex items-center justify-center space-x-2 text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Gerando animação facial...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interface de Consulta - Mobile Otimizada */}
      <Card className="mx-2 md:mx-0 border-emerald-400/30 bg-emerald-400/5">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center space-x-2 text-base md:text-lg text-emerald-400">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
            <span>Consulta com Dra. Cannabis</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-5 px-4 md:px-6 pb-6 md:pb-8">
          {/* Histórico da Conversa Mobile */}
          {chatHistory.length > 0 && (
            <div className="max-h-64 md:max-h-80 overflow-y-auto space-y-2 md:space-y-3 p-4 md:p-5 bg-emerald-400/10 border border-emerald-400/20 rounded-lg backdrop-blur-sm">
              <h4 className="font-medium text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">Conversa com Dra. Cannabis IA:</h4>
              {chatHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[85%] p-2 md:p-3 rounded-lg ${
                      entry.type === 'user'
                        ? 'bg-black text-white border border-emerald-400/30'
                        : 'bg-black text-white border border-emerald-400/50'
                    }`}
                    data-testid={`chat-${entry.type}-${index}`}
                  >
                    <p className="text-xs md:text-sm">{entry.message}</p>
                    <small className="text-xs text-gray-400 mt-1 block">
                      {entry.type === 'doctor' ? 'Dra. Cannabis' : 'Você'} - {
                        new Date(entry.timestamp).toLocaleTimeString('pt-BR')
                      }
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Mobile Responsivo */}
          <div className="space-y-3 md:space-y-0 md:flex md:space-x-2">
            <Textarea
              placeholder="Faça sua pergunta sobre cannabis medicinal..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !consultMutation.isPending && question.trim()) {
                  e.preventDefault();
                  handleSubmitQuestion();
                }
              }}
              className="w-full min-h-20 md:min-h-24 text-sm md:text-base resize-none"
              data-testid="textarea-medical-question"
            />
            
            {/* Botão de Voz Mobile */}
            <div className="flex justify-center md:flex-col md:space-y-2">
              <Button
                onClick={startVoiceRecognition}
                disabled={isListening}
                variant="outline"
                size="sm"
                className="w-12 h-12 md:w-10 md:h-10 rounded-full"
                data-testid="button-voice-input"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-alert-red" />
                ) : (
                  <Mic className="w-4 h-4 text-neon-green" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Botões de Ação Mobile */}
          <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:gap-3 md:items-center">
            <Button 
              onClick={handleSubmitQuestion}
              disabled={consultMutation.isPending || !question.trim()}
              className="w-full md:w-auto bg-neon-green hover:bg-neon-green/90 text-black text-sm md:text-base drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]"
              data-testid="button-submit-question"
            >
              {consultMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2 md:hidden" />
                  <span className="md:hidden">Consultar</span>
                  <span className="hidden md:inline">Consultar Dra. Cannabis</span>
                </>
              )}
            </Button>

            {/* Botões Secundários Mobile */}
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
              <Button
                onClick={() => generateSummaryMutation.mutate()}
                disabled={generateSummaryMutation.isPending || chatHistory.length === 0}
                size="sm"
                variant="outline"
                className="text-warning-yellow border-warning-yellow hover:bg-warning-yellow/10 dark:hover:bg-warning-yellow/20 text-xs md:text-sm"
                data-testid="button-generate-summary-quick"
              >
                {generateSummaryMutation.isPending ? (
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 animate-spin" />
                ) : (
                  <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                )}
                <span className="md:hidden">Resumo</span>
                <span className="hidden md:inline">Resumo da Conversa</span>
              </Button>
              
              <Button
                onClick={() => referToMedicalMutation.mutate()}
                disabled={referToMedicalMutation.isPending || chatHistory.length === 0}
                size="sm"
                variant="outline"
                className="text-alert-red border-alert-red hover:bg-alert-red/10 dark:hover:bg-alert-red/20 text-xs md:text-sm"
                data-testid="button-refer-medical-quick"
              >
                {referToMedicalMutation.isPending ? (
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                )}
                <span className="md:hidden">Médico</span>
                <span className="hidden md:inline">Solicitar Profissional</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Resumo da Consulta - Mobile Otimizado */}
      {consultationSummary && (
        <Card className="mx-2 md:mx-0 border-warning-yellow/30 bg-warning-yellow/5">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg text-warning-yellow">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-warning-yellow" />
              <span>Resumo da Consulta</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6">
            <div>
              <h4 className="font-medium text-xs md:text-sm mb-2">Sintomas do Paciente:</h4>
              <p className="text-xs md:text-sm bg-gray-50 dark:bg-gray-800 p-2 md:p-3 rounded-lg leading-relaxed">
                {consultationSummary.patientSymptoms}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xs md:text-sm mb-2">Recomendações Médicas:</h4>
              <p className="text-xs md:text-sm bg-gray-50 dark:bg-gray-800 p-2 md:p-3 rounded-lg leading-relaxed">
                {consultationSummary.doctorRecommendations}
              </p>
            </div>
            
            {consultationSummary.medications.length > 0 && (
              <div>
                <h4 className="font-medium text-xs md:text-sm mb-2">Medicações:</h4>
                <ul className="text-xs md:text-sm bg-gray-50 dark:bg-gray-800 p-2 md:p-3 rounded-lg list-disc list-inside space-y-1">
                  {consultationSummary.medications.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-xs md:text-sm mb-2">Acompanhamento:</h4>
              <p className="text-xs md:text-sm bg-gray-50 dark:bg-gray-800 p-2 md:p-3 rounded-lg leading-relaxed">
                {consultationSummary.followUp}
              </p>
            </div>
            
            <small className="text-xs text-gray-500 text-center block">
              Gerado em: {new Date(consultationSummary.timestamp).toLocaleString('pt-BR')}
            </small>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Encaminhamento Médico */}
      {showReferralDialog && (
        <Card className="border-alert-red/30 bg-alert-red/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-alert-red">
              <AlertTriangle className="w-5 h-5" />
              <span>Encaminhamento para Médico Especialista</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="p-4 bg-alert-red/10 rounded-lg">
              <p className="text-sm text-alert-red">
                <strong>📋 Resumo do prontuário será enviado ao médico especialista</strong>
              </p>
              <p className="text-sm text-alert-red/80 mt-2">
                Todas as informações da sua consulta com a Dra. Cannabis IA foram organizadas 
                em um resumo detalhado que será encaminhado para facilitar a leitura e 
                compreensão do médico especialista sobre seu caso.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowReferralDialog(false)}
                variant="outline"
                size="sm"
              >
                Entendi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}



      </div>
    </div>
  );
}