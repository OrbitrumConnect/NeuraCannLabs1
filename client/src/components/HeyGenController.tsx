import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Play, Square, Mic, MicOff, Volume2, VolumeX, Activity, Zap, Video } from 'lucide-react';

interface HeyGenStatus {
  isConnected: boolean;
  sessionId: string | null;
  message: string;
}

export function HeyGenController() {
  const [textToSpeak, setTextToSpeak] = useState('');
  const queryClient = useQueryClient();

  // Get status
  const { data: status, isLoading: statusLoading } = useQuery<HeyGenStatus>({
    queryKey: ['/api/heygen/status'],
    refetchInterval: 5000, // Check status every 5 seconds
  });

  // Start session mutation
  const startSession = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/heygen/start');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/heygen/status'] });
    },
    onError: (error) => {
      console.error('Erro ao iniciar sessão:', error);
    }
  });

  // Stop session mutation
  const stopSession = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/heygen/stop');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/heygen/status'] });
    }
  });

  // Speak mutation
  const speak = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest('POST', '/api/heygen/speak', { text });
    },
    onError: (error) => {
      console.error('Erro ao fazer avatar falar:', error);
    }
  });

  // Voice chat mutations
  const startVoiceChat = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/heygen/voice-chat/start', {
        method: 'POST'
      });
    }
  });

  const stopVoiceChat = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/heygen/voice-chat/stop', {
        method: 'POST'
      });
    }
  });

  // Interrupt mutation
  const interrupt = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/heygen/interrupt', {
        method: 'POST'
      });
    }
  });

  // Keep alive mutation
  const keepAlive = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/heygen/keep-alive', {
        method: 'POST'
      });
    }
  });

  const handleSpeak = () => {
    if (textToSpeak.trim()) {
      speak.mutate(textToSpeak);
      setTextToSpeak('');
    }
  };

  const getStatusColor = () => {
    if (statusLoading) return 'bg-gray-500';
    if (status?.isConnected) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (statusLoading) return 'Verificando...';
    if (status?.isConnected) return 'Conectado';
    return 'Desconectado';
  };

  // Componente Avatar CSS Avançado estilo Ready Player Me
  function ProfessionalAvatar() {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Avatar principal - estilo profissional médico */}
        <div className="relative w-48 h-48">
          {/* Base avatar com gradiente médico */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 shadow-2xl border-4 border-cyan-300/30 overflow-hidden">
            
            {/* Cabelo médico profissional */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-b from-gray-700 to-gray-600 rounded-t-full opacity-90"></div>
            
            {/* Rosto realista */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-28 h-32 bg-gradient-to-b from-amber-100 to-amber-50 rounded-full shadow-inner">
              
              {/* Olhos profissionais */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm">
                  <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm">
                  <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
              
              {/* Nariz */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-amber-200 rounded-sm"></div>
              
              {/* Boca profissional */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-300 rounded-full"></div>
            </div>
            
            {/* Jaleco médico */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-white rounded-t-2xl border-t-2 border-gray-200">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-300"></div>
              
              {/* Estetoscópio */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full"></div>
            </div>
          </div>
          
          {/* Indicador de status online */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          
          {/* Halo médico */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse"></div>
        </div>
        
        {/* Efeito de brilho quando conectado */}
        {status?.isConnected && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full animate-pulse"></div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar Display Area */}
      <div className="relative w-full max-w-lg mx-auto">
        <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-2xl border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 flex items-center justify-center relative overflow-hidden">
          <div id="heygen-avatar-container" className="w-full h-full rounded-2xl overflow-hidden">
            {/* Avatar Profissional Dr. Cannabis IA */}
            <ProfessionalAvatar />
          </div>
          
          {/* Status indicator */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-cyan-300">
            {status?.isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </div>
          
          {/* Avatar Info */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-green-300">
            Dr. Cannabis IA
          </div>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              HeyGen Streaming Avatar
            </CardTitle>
            <CardDescription className="text-cyan-300/70">
              Controle avatar de IA em tempo real
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} text-white border-none`}
          >
            <div className="w-2 h-2 rounded-full bg-current mr-2" />
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Session Controls */}
        <div className="flex gap-3">
          <Button
            onClick={() => startSession.mutate()}
            disabled={startSession.isPending || status?.isConnected}
            className="bg-green-600 hover:bg-green-700 text-white flex-1"
            data-testid="button-start-session"
          >
            <Play className="w-4 h-4 mr-2" />
            {startSession.isPending ? 'Iniciando...' : 'Iniciar Sessão'}
          </Button>

          <Button
            onClick={() => stopSession.mutate()}
            disabled={stopSession.isPending || !status?.isConnected}
            variant="destructive"
            className="flex-1"
            data-testid="button-stop-session"
          >
            <Square className="w-4 h-4 mr-2" />
            {stopSession.isPending ? 'Parando...' : 'Parar Sessão'}
          </Button>
        </div>

        {/* Text to Speech */}
        {status?.isConnected && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Input
                value={textToSpeak}
                onChange={(e) => setTextToSpeak(e.target.value)}
                placeholder="Digite o texto para o avatar falar..."
                className="flex-1 bg-black/40 border-cyan-500/30 text-white placeholder:text-cyan-300/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSpeak()}
                data-testid="input-text-to-speak"
              />
              <Button
                onClick={handleSpeak}
                disabled={speak.isPending || !textToSpeak.trim()}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                data-testid="button-speak"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {speak.isPending ? 'Falando...' : 'Falar'}
              </Button>
            </div>
          </div>
        )}

        {/* Voice Chat Controls */}
        {status?.isConnected && (
          <div className="flex gap-3">
            <Button
              onClick={() => startVoiceChat.mutate()}
              disabled={startVoiceChat.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              data-testid="button-start-voice-chat"
            >
              <Mic className="w-4 h-4 mr-2" />
              {startVoiceChat.isPending ? 'Iniciando...' : 'Iniciar Chat Voz'}
            </Button>

            <Button
              onClick={() => stopVoiceChat.mutate()}
              disabled={stopVoiceChat.isPending}
              variant="outline"
              className="flex-1 border-blue-500/30 text-blue-400"
              data-testid="button-stop-voice-chat"
            >
              <MicOff className="w-4 h-4 mr-2" />
              {stopVoiceChat.isPending ? 'Parando...' : 'Parar Chat Voz'}
            </Button>
          </div>
        )}

        {/* Utility Controls */}
        {status?.isConnected && (
          <div className="flex gap-3">
            <Button
              onClick={() => interrupt.mutate()}
              disabled={interrupt.isPending}
              variant="outline"
              className="flex-1 border-orange-500/30 text-orange-400"
              data-testid="button-interrupt"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              {interrupt.isPending ? 'Interrompendo...' : 'Interromper'}
            </Button>

            <Button
              onClick={() => keepAlive.mutate()}
              disabled={keepAlive.isPending}
              variant="outline"
              className="flex-1 border-green-500/30 text-green-400"
              data-testid="button-keep-alive"
            >
              <Activity className="w-4 h-4 mr-2" />
              {keepAlive.isPending ? 'Enviando...' : 'Manter Ativo'}
            </Button>
          </div>
        )}

        {/* Session Info */}
        {status?.sessionId && (
          <div className="text-xs text-cyan-300/70 p-3 bg-black/40 rounded-lg border border-cyan-500/20">
            <div>Sessão: {status.sessionId}</div>
            <div>Status: {status.message}</div>
          </div>
        )}

        {/* Triggers Médicos Inteligentes - Layout Otimizado */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-green-400 text-center">Triggers Médicos Inteligentes</h4>
          
          {/* Grid responsivo com melhor visibilidade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Button
              onClick={() => speak.mutate("Olá! Sou o Dr. Cannabis IA, especialista em cannabis medicinal. Como posso ajudá-lo hoje?")}
              disabled={speak.isPending}
              variant="outline"
              className="text-left p-4 h-auto border-green-500/40 bg-green-500/10 text-green-200 hover:bg-green-500/20 hover:border-green-400/60 flex flex-col items-start transition-all duration-300 shadow-lg"
              data-testid="trigger-saudacao"
            >
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <span className="text-lg">🤝</span> Saudação Médica
              </div>
              <div className="text-xs opacity-80">Apresentação profissional do Dr. Cannabis IA</div>
            </Button>

            <Button
              onClick={() => speak.mutate("Vou analisar seus sintomas. Por favor, descreva detalhadamente o que está sentindo.")}
              disabled={speak.isPending}
              variant="outline"
              className="text-left p-4 h-auto border-blue-500/40 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400/60 flex flex-col items-start transition-all duration-300 shadow-lg"
              data-testid="trigger-analisar-sintomas"
            >
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <span className="text-lg">🔍</span> Analisar Sintomas
              </div>
              <div className="text-xs opacity-80">Análise detalhada de sintomas médicos</div>
            </Button>

            <Button
              onClick={() => speak.mutate("Posso explicar protocolos médicos, dosagens e formas de administração de cannabis medicinal.")}
              disabled={speak.isPending}
              variant="outline"
              className="text-left p-4 h-auto border-purple-500/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/60 flex flex-col items-start transition-all duration-300 shadow-lg"
              data-testid="trigger-protocolos"
            >
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <span className="text-lg">💊</span> Protocolos & Dosagens
              </div>
              <div className="text-xs opacity-80">Orientações sobre dosagens e protocolos</div>
            </Button>

            <Button
              onClick={() => speak.mutate("Vamos explorar os estudos científicos mais recentes sobre cannabis medicinal e suas aplicações.")}
              disabled={speak.isPending}
              variant="outline"
              className="text-left p-4 h-auto border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 hover:border-cyan-400/60 flex flex-col items-start transition-all duration-300 shadow-lg"
              data-testid="trigger-estudos"
            >
              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                <span className="text-lg">📚</span> Estudos Científicos
              </div>
              <div className="text-xs opacity-80">Pesquisas e evidências científicas</div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}