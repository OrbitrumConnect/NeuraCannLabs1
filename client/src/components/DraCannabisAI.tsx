import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mic, MicOff, MessageCircle, Video, Upload, CheckCircle, Play, FileText, UserPlus, AlertTriangle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import draCannabisImage from '@assets/20250812_1435_Flor de Cannabis Realista_remix_01k2fnf8n7ez0tf90qz4rrj3nc_1755020566579.png';

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
  const [currentTalkId, setCurrentTalkId] = useState<string | null>(null);
  const [doctorImageUrl, setDoctorImageUrl] = useState<string | null>(null);
  const [consultationSummary, setConsultationSummary] = useState<ConsultationSummary | null>(null);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Upload da imagem da médica para D-ID
  const uploadImageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/doctor/upload-image', 'POST');
      return response;
    },
    onSuccess: (data: any) => {
      setDoctorImageUrl(data.imageUrl);
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

  // Consulta médica por texto
  const consultMutation = useMutation<ConsultResponse, Error, { question: string }>({
    mutationFn: async (data: { question: string }) => {
      const response = await apiRequest('/api/doctor/consult', 'POST', data);
      return response as ConsultResponse;
    },
    onSuccess: (data: ConsultResponse) => {
      setChatHistory(prev => [
        ...prev,
        { type: 'user', message: question, timestamp: new Date().toISOString() },
        { type: 'doctor', message: data.response, timestamp: data.timestamp }
      ]);
      setQuestion('');
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Consulta",
        description: error.message || "Erro ao processar consulta médica",
        variant: "destructive",
      });
    },
  });

  // Criar vídeo falado da Dra. Cannabis
  const speakMutation = useMutation<TalkResponse, Error, { text: string; imageUrl?: string }>({
    mutationFn: async (data: { text: string; imageUrl?: string }) => {
      const response = await apiRequest('/api/doctor/speak', 'POST', data);
      return response as TalkResponse;
    },
    onSuccess: (data: TalkResponse) => {
      setCurrentTalkId(data.talkId);
      toast({
        title: "Dra. Cannabis Falando",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Fala",
        description: error.message || "Erro ao criar resposta falada",
        variant: "destructive",
      });
    },
  });

  // Verificar status do vídeo
  const { data: talkStatus } = useQuery({
    queryKey: ['/api/doctor/talk', currentTalkId],
    enabled: !!currentTalkId,
    refetchInterval: (data) => {
      const status = data as TalkStatus;
      return status?.status === 'done' ? false : 2000;
    },
  });

  // Gerar resumo da consulta
  const generateSummaryMutation = useMutation<ConsultationSummary, Error>({
    mutationFn: async () => {
      const response = await apiRequest('/api/doctor/generate-summary', 'POST', { chatHistory });
      return response as ConsultationSummary;
    },
    onSuccess: (data: ConsultationSummary) => {
      setConsultationSummary(data);
      toast({
        title: "Resumo da Consulta Gerado",
        description: "O resumo foi gerado com sucesso",
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
      return response as MedicalReferral;
    },
    onSuccess: (data: MedicalReferral) => {
      setShowReferralDialog(true);
      toast({
        title: "Encaminhamento Solicitado",
        description: data.message,
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

  // Quando vídeo estiver pronto, reproduzir
  if (talkStatus?.status === 'done' && talkStatus.resultUrl && videoRef.current) {
    videoRef.current.src = talkStatus.resultUrl;
    videoRef.current.play();
  }

  const handleSubmitQuestion = () => {
    if (!question.trim()) return;
    consultMutation.mutate({ question });
  };

  const handleSpeakResponse = (text: string) => {
    speakMutation.mutate({ text, imageUrl: doctorImageUrl || undefined });
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

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
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
    <div className="space-y-6">
      {/* Header da Dra. Cannabis - Card Aumentado */}
      <Card className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-600/30 min-h-[400px]">
        <CardHeader className="text-center py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <img 
                src={draCannabisImage} 
                alt="Dra. Cannabis IA" 
                className="w-48 h-48 rounded-lg object-contain shadow-2xl bg-gradient-to-br from-green-900/10 to-green-800/20"
              />
              <Badge className="absolute -bottom-3 -right-3 bg-green-500 text-white text-sm px-3 py-1">
                IA
              </Badge>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-xl text-green-400 font-bold">
                Dra. Cannabis IA
              </CardTitle>
              <p className="text-green-200 text-xs max-w-lg">
                Assistente Médico Especializado em Cannabis Medicinal
              </p>
              <div className="flex items-center justify-center space-x-2 mt-3">
                <Badge variant="outline" className="text-green-300 border-green-500 text-xs px-2 py-1">
                  Cannabis Medicinal
                </Badge>
                <Badge variant="outline" className="text-green-300 border-green-500 text-xs px-2 py-1">
                  Inteligência Artificial
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {!uploadImageMutation.data && (
            <Button 
              onClick={() => uploadImageMutation.mutate()}
              disabled={uploadImageMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-activate-doctor"
            >
              {uploadImageMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ativando Dra. Cannabis...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Ativar Dra. Cannabis IA
                </>
              )}
            </Button>
          )}
          
          {uploadImageMutation.data && (
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Dra. Cannabis IA Ativada e Pronta!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interface de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <span>Consulta com Dra. Cannabis</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Faça sua pergunta sobre cannabis medicinal..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 min-h-20"
              data-testid="textarea-medical-question"
            />
            
            <div className="flex flex-col space-y-2">
              <Button
                onClick={startVoiceRecognition}
                disabled={isListening}
                variant="outline"
                size="sm"
                data-testid="button-voice-input"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4 text-green-500" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              onClick={handleSubmitQuestion}
              disabled={consultMutation.isPending || !question.trim()}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-submit-question"
            >
              {consultMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                'Consultar Dra. Cannabis'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vídeo da Dra. Cannabis Falando */}
      {currentTalkId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-green-500" />
              <span>Dra. Cannabis Respondendo</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                controls
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                data-testid="video-doctor-response"
              >
                <source type="video/mp4" />
                Seu navegador não suporta reprodução de vídeo.
              </video>
              
              {currentTalkId && talkStatus?.status !== 'done' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2" />
                    <p>Dra. Cannabis preparando resposta...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico do Chat */}
      {chatHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Histórico da Consulta</CardTitle>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => generateSummaryMutation.mutate()}
                  disabled={generateSummaryMutation.isPending || chatHistory.length === 0}
                  size="sm"
                  variant="outline"
                  data-testid="button-generate-summary"
                >
                  {generateSummaryMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Resumo da Consulta
                </Button>
                
                <Button
                  onClick={() => referToMedicalMutation.mutate()}
                  disabled={referToMedicalMutation.isPending || chatHistory.length === 0}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  data-testid="button-refer-medical"
                >
                  {referToMedicalMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  Solicitar Médico
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    entry.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                  data-testid={`chat-${entry.type}-${index}`}
                >
                  <p className="text-sm">{entry.message}</p>
                  <small className="text-xs opacity-70 mt-1 block">
                    {entry.type === 'doctor' ? 'Dra. Cannabis' : 'Você'} - {
                      new Date(entry.timestamp).toLocaleTimeString('pt-BR')
                    }
                  </small>
                  
                  {entry.type === 'doctor' && (
                    <Button
                      onClick={() => handleSpeakResponse(entry.message)}
                      disabled={speakMutation.isPending}
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      data-testid={`button-speak-${index}`}
                    >
                      {speakMutation.isPending ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Video className="w-3 h-3 mr-1" />
                      )}
                      Ouvir Resposta
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Resumo da Consulta */}
      {consultationSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Resumo da Consulta</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Sintomas do Paciente:</h4>
              <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {consultationSummary.patientSymptoms}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Recomendações Médicas:</h4>
              <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {consultationSummary.doctorRecommendations}
              </p>
            </div>
            
            {consultationSummary.medications.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Medicações:</h4>
                <ul className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg list-disc list-inside">
                  {consultationSummary.medications.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-sm mb-2">Acompanhamento:</h4>
              <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {consultationSummary.followUp}
              </p>
            </div>
            
            <small className="text-xs text-gray-500">
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