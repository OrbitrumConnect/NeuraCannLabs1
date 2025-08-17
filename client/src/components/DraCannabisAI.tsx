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
import { nativeAvatarService } from '@/services/nativeAvatarService';

interface ConsultResponse {
  success: boolean;
  response: string;
  message: string;
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

export default function DraCannabisAI() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'doctor';
    message: string;
    timestamp: string;
  }>>([]);
  const [isListening, setIsListening] = useState(false);
  const [consultationSummary, setConsultationSummary] = useState<ConsultationSummary | null>(null);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isAutoStarting, setIsAutoStarting] = useState(false);
  const [didVideoUrl, setDidVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [useDIDAnimation, setUseDIDAnimation] = useState(true);
  const [avatarBackground, setAvatarBackground] = useState<'gradient_cyber' | 'gradient_neon' | 'medical' | 'cannabis'>('gradient_cyber');

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const didContainerRef = useRef<HTMLDivElement>(null);
  const [isDIDWidgetLoaded, setIsDIDWidgetLoaded] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { shouldAutoStart, markAutoStarted } = useDraCannabisAutoStart();

  // Carregar widget D-ID oficial quando ativo
  useEffect(() => {
    if (useDIDAnimation && !isDIDWidgetLoaded) {
      loadDIDWidget();
    } else if (!useDIDAnimation && isDIDWidgetLoaded) {
      console.log('🎭 Desativando widget D-ID...');
      
      const existingScript = document.querySelector('script[data-name="did-agent"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      if (didContainerRef.current) {
        didContainerRef.current.innerHTML = '';
      }
      
      setIsDIDWidgetLoaded(false);
      console.log('✅ Widget D-ID desativado');
    }
  }, [useDIDAnimation]);

  // Auto-inicialização da Dra. Cannabis IA
  useEffect(() => {
    if (shouldAutoStart && !isAutoStarting) {
      setIsAutoStarting(true);
      
      setupNativeDraMutation.mutate();
      
      setTimeout(() => {
        const welcomeMessage = "Olá! Eu sou a Dra. Cannabis IA. Seja bem-vindo ao NeuroCann Lab! Como posso ajudá-lo hoje com suas questões sobre cannabis medicinal?";
        
        setChatHistory(prev => [
          ...prev,
          { type: 'doctor', message: welcomeMessage, timestamp: new Date().toISOString() }
        ]);
        
        if (useDIDAnimation && isDIDWidgetLoaded) {
          console.log('🎭 Widget D-ID carregado - usuário pode interagir diretamente');
        } else {
          nativeAvatarService.makeAvatarSpeak(welcomeMessage, 'professional').catch(error => {
            console.error('Erro na saudação automática:', error);
          });
        }
        
        markAutoStarted();
        setIsAutoStarting(false);
      }, 2000);
    }
  }, [shouldAutoStart, isAutoStarting, isDIDWidgetLoaded]);

  // Configuração nativa da Dra. Cannabis (sem D-ID)
  const setupNativeDraMutation = useMutation({
    mutationFn: async () => {
      nativeAvatarService.setAnimationCallback((isActive, intensity) => {
        setIsTalking(isActive);
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

  // Carregar widget oficial D-ID da Dra. Cannabis
  const loadDIDWidget = async () => {
    if (isDIDWidgetLoaded) return;

    console.log('🎭 Inicializando widget D-ID oficial da Dra. Cannabis...');
    console.log('🔗 Agente ID:', 'v2_agt_mzs8kQcn');
    
    try {
      const existingScript = document.querySelector('script[data-name="did-agent"]');
      if (existingScript) {
        existingScript.remove();
      }

      if (!didContainerRef.current) {
        console.error('❌ Container D-ID não encontrado');
        return;
      }

      didContainerRef.current.innerHTML = '';

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://agent.d-id.com/v2/index.js';
      script.setAttribute('data-mode', 'full');
      script.setAttribute('data-client-key', 'Z29vZ2xlLW9hdXRoMnwxMDEyMTgzNzYwODc3ODA2NDk3NzQ6ano4ZktGZ21fTnd5QjNMWHN1UVli');
      script.setAttribute('data-agent-id', 'v2_agt_mzs8kQcn');
      script.setAttribute('data-name', 'did-agent');
      script.setAttribute('data-monitor', 'true');
      script.setAttribute('data-target-id', 'did-agent-container');

      didContainerRef.current.id = 'did-agent-container';

      document.head.appendChild(script);

      script.onload = () => {
        console.log('✅ Widget D-ID oficial carregado com sucesso!');
        setIsDIDWidgetLoaded(true);
        
        toast({
          title: "Dra. Cannabis Ativa!",
          description: "Widget D-ID oficial funcionando perfeitamente",
          variant: "default",
        });
      };

      script.onerror = () => {
        throw new Error('Falha ao carregar widget D-ID');
      };
      
    } catch (error) {
      console.error('❌ Erro carregando widget D-ID:', error);
      setIsDIDWidgetLoaded(false);
      setUseDIDAnimation(false);
      toast({
        title: "Erro Widget D-ID", 
        description: "Não foi possível carregar o widget oficial",
        variant: "destructive",
      });
    }
  };

  // Consulta médica por texto - sistema local (quando D-ID desativado)
  const consultMutation = useMutation<ConsultResponse, Error, { question: string }>({
    mutationFn: async (data: { question: string }) => {
      if (useDIDAnimation && isDIDWidgetLoaded) {
        return {
          success: true,
          response: "Conversa ativa no widget D-ID NOA ESPERANÇA",
          message: "Conversa ativa no widget D-ID NOA ESPERANÇA",
          doctor: "NOA ESPERANÇA (Widget D-ID)",
          specialty: "Cannabis Medicinal - IA Avançada",
          timestamp: new Date().toISOString(),
          recommendations: ["Widget D-ID oficial ativo", "Conversação direta com agente"],
        } as ConsultResponse;
      }
      
      const payload = {
        question: data.question,
        conversationHistory: chatHistory.map(msg => ({
          type: msg.type === 'user' ? 'user' as const : 'assistant' as const,
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
      console.log('✅ Texto da resposta:', data.message);
      
      const newChatHistory: Array<{ type: 'user' | 'doctor'; message: string; timestamp: string }> = [
        ...chatHistory,
        { type: 'user' as const, message: variables.question, timestamp: now },
        { type: 'doctor' as const, message: data.message || 'Erro: resposta não encontrada', timestamp: now }
      ];
      
      setChatHistory(newChatHistory);
      setQuestion('');

      if (newChatHistory.length >= 6 && !consultationSummary) {
        setTimeout(() => {
          toast({
            title: "Consulta Prolongada Detectada",
            description: "A Dra. Cannabis sugere gerar um resumo da consulta. Clique em 'Gerar Resumo' abaixo.",
            variant: "default",
          });
        }, 2000);
      }
      
      if (data.message) {
        setIsTalking(true);
        
        if (useDIDAnimation && isDIDWidgetLoaded) {
          console.log('✅ Widget D-ID ativo - conversação direta com agente');
          setIsTalking(false);
          return;
        }
        
        speakResponse(data.message);
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

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;
    
    const userMessage: { type: 'user' | 'doctor'; message: string; timestamp: string } = { 
      type: 'user' as const, 
      message: question, 
      timestamp: new Date().toISOString() 
    };
    setChatHistory(prev => [...prev, userMessage]);
    
    consultMutation.mutate({ question });
    
    setQuestion('');
  };

  // Função para falar resposta (quando D-ID desativado)
  const speakResponse = async (text: string) => {
    try {
      console.log('🗣️ Reproduzindo resposta da Dra. Cannabis...');
      
      const utterance = new SpeechSynthesisUtterance(text);
      
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
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      
      utterance.onstart = () => console.log('🗣️ Dra. Cannabis começou a falar');
      utterance.onend = () => {
        console.log('✅ Dra. Cannabis terminou de falar');
        setIsTalking(false);
      };
      
      window.speechSynthesis.speak(utterance);
      console.log('✅ Sistema nativo reproduzido');
    } catch (error) {
      console.error('❌ Erro no sistema de voz:', error);
      setIsTalking(false);
    }
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
        
        console.log('🎤 Áudio capturado:', transcript);
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
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header da Dra. Cannabis - SEM CARD - Livre */}
      <div className="text-center py-3 md:py-6 min-h-[280px] md:min-h-[350px]">
        <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
          <div className="relative">
            {/* Widget D-ID Oficial (quando ativo) */}
            {useDIDAnimation && isDIDWidgetLoaded ? (
              <div 
                id="did-container" 
                ref={didContainerRef}
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-lg shadow-2xl overflow-hidden"
                style={{ minWidth: '320px', minHeight: '400px' }}
              />
            ) : useDIDAnimation && !isDIDWidgetLoaded ? (
              /* Loading do widget D-ID */
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-lg shadow-2xl bg-gray-900 flex items-center justify-center">
                <div className="text-center text-emerald-400">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2" />
                  <p className="text-sm">Carregando Widget D-ID NOA ESPERANÇA...</p>
                </div>
              </div>
            ) : (
              /* Sistema nativo de avatar animado (quando D-ID desativado) */
              <div className={`${isTalking ? 'avatar-talking' : ''} transition-all duration-300`}>
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-lg shadow-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">Dra. Cannabis IA</p>
                    <p className="text-xs opacity-80">Sistema Nativo</p>
                  </div>
                </div>
                {isTalking && (
                  <div className="absolute inset-0 rounded-lg border-4 border-neon-green/50 animate-ping" />
                )}
              </div>
            )}
            <Badge className={`absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 text-black text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 drop-shadow-[0_0_5px_rgba(57,255,20,0.4)] ${
              isTalking ? 'bg-neon-green animate-pulse' : 'bg-neon-green'
            }`}>
              {isTalking ? '🗣️ IA' : 'IA'}
            </Badge>
            {isAutoStarting && (
              <div className="absolute inset-0 bg-neon-green/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-neon-green">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin mb-2" />
                  <p className="text-xs md:text-sm">Inicializando...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center space-y-3 md:space-y-4 px-4 md:px-6 mt-4">
          {/* Dra. Cannabis IA sempre ativa com D-ID */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-center space-x-2 text-emerald-400">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Dra. Cannabis IA - NOA ESPERANÇA</span>
            </div>
            
            {/* Status do widget D-ID */}
            {isDIDWidgetLoaded && (
              <div className="flex items-center justify-center space-x-2 text-emerald-400">
                <Video className="w-4 h-4" />
                <span className="text-sm">Widget D-ID Ativo - v2_agt_mzs8kQcn</span>
              </div>
            )}
            
            {!isDIDWidgetLoaded && (
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Carregando Dra. Cannabis IA...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interface de Consulta - Mobile Otimizada */}
      <Card className="mx-2 md:mx-0">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-neon-green" />
            <span>Consulta com Dra. Cannabis</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-5 px-4 md:px-6 pb-6 md:pb-8">
          {/* Histórico da Conversa Mobile */}
          {chatHistory.length > 0 && (
            <div className="max-h-64 md:max-h-80 overflow-y-auto space-y-2 md:space-y-3 p-4 md:p-5 bg-neon-green/10 border border-neon-green/20 rounded-lg backdrop-blur-sm">
              <h4 className="font-medium text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">Conversa com Dra. Cannabis IA:</h4>
              {chatHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[85%] p-2 md:p-3 rounded-lg ${
                      entry.type === 'user'
                        ? 'bg-black text-white border border-neon-green/30'
                        : 'bg-black text-white border border-neon-green/50'
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
        <Card className="mx-2 md:mx-0">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
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
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              <span>Encaminhamento para Médico Especialista</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>📋 Resumo do prontuário será enviado ao médico especialista</strong>
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
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
  );
}
