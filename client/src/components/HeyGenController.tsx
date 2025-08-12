import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Play, Square, Mic, MicOff, Volume2, VolumeX, Activity, Zap } from 'lucide-react';

interface HeyGenStatus {
  isConnected: boolean;
  sessionId: string | null;
  message: string;
}

export function HeyGenController() {
  const [textToSpeak, setTextToSpeak] = useState('');
  const [accessToken] = useState('MTJmMWE5YzQxZGY2NDAzNzk3MWNkMGFjNTVhOWIyYjMtMTc1NDk2OTU1MA==');
  const queryClient = useQueryClient();

  // Get status
  const { data: status, isLoading: statusLoading } = useQuery<HeyGenStatus>({
    queryKey: ['/api/heygen/status'],
    refetchInterval: 5000, // Check status every 5 seconds
  });

  // Start session mutation
  const startSession = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/heygen/start', 'POST', { accessToken });
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
      return await apiRequest('/api/heygen/stop', 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/heygen/status'] });
    }
  });

  // Speak mutation
  const speak = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest('/api/heygen/speak', 'POST', { text });
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

  return (
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

        {/* Quick Actions */}
        {status?.isConnected && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-cyan-400">Ações Rápidas</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Olá! Sou o Dr. Cannabis IA, como posso ajudá-lo hoje?",
                "Vamos explorar os estudos científicos mais recentes sobre cannabis medicinal.",
                "Posso explicar sobre dosagens e protocolos médicos de canabinoides.",
                "Que tipo de análise médica você gostaria de realizar?"
              ].map((text, index) => (
                <Button
                  key={index}
                  onClick={() => speak.mutate(text)}
                  disabled={speak.isPending}
                  variant="outline"
                  size="sm"
                  className="text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                  data-testid={`button-quick-action-${index}`}
                >
                  {text.substring(0, 30)}...
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}