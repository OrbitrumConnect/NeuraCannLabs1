import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Video, VolumeX, Volume2 } from 'lucide-react';

interface NOAAgentChatProps {
  isActive: boolean;
  onClose?: () => void;
}

interface ChatMessage {
  type: 'user' | 'noa';
  content: string;
  timestamp: Date;
  videoUrl?: string;
  audioUrl?: string;
}

export function NOAAgentChat({ isActive, onClose }: NOAAgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [videoMuted, setVideoMuted] = useState(false);

  // Verificar status do agente D-ID
  useEffect(() => {
    if (isActive) {
      checkAgentStatus();
      createNewSession();
    }
  }, [isActive]);

  const checkAgentStatus = async () => {
    try {
      const response = await fetch('/api/noa-agent/status');
      const data = await response.json();
      setAgentStatus(data.agent);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/noa-agent/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      
      // Mensagem de boas-vindas da NOA
      setMessages([{
        type: 'noa',
        content: 'Olá! Sou NOA ESPERANÇA, sua assistente médica especializada. Como posso ajudá-lo hoje?',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/noa-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const noaMessage: ChatMessage = {
          type: 'noa',
          content: data.response,
          timestamp: new Date(),
          videoUrl: data.videoUrl,
          audioUrl: data.audioUrl
        };
        
        setMessages(prev => [...prev, noaMessage]);
        
        // Reproduzir áudio se disponível
        if (data.audioUrl && !videoMuted) {
          const audio = new Audio(data.audioUrl);
          audio.play().catch(console.error);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [...prev, {
        type: 'noa',
        content: 'Desculpe, houve um erro. Tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isActive) return null;

  return (
    <Card className="fixed top-4 right-4 w-96 h-[600px] bg-black/90 border-emerald-500 z-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-emerald-400">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            NOA ESPERANÇA
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVideoMuted(!videoMuted)}
              className="text-emerald-400 hover:text-emerald-300"
            >
              {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-emerald-400 hover:text-emerald-300"
              >
                ×
              </Button>
            )}
          </div>
        </CardTitle>
        
        {agentStatus && (
          <div className="text-xs text-emerald-300">
            Status: {agentStatus.available ? '🟢 Ativo' : '🔴 Indisponível'}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col h-[480px]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-emerald-600 text-white ml-8'
                  : 'bg-gray-800 text-emerald-100 mr-8'
              }`}
            >
              <div className="text-sm">{message.content}</div>
              
              {/* Vídeo do agente D-ID */}
              {message.videoUrl && (
                <div className="mt-2">
                  <video
                    src={message.videoUrl}
                    autoPlay
                    muted={videoMuted}
                    className="w-full rounded-lg"
                    onError={(e) => console.error('Erro no vídeo:', e)}
                  />
                </div>
              )}
              
              <div className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="bg-gray-800 text-emerald-100 mr-8 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                <span className="text-sm">NOA está pensando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem para NOA..."
            className="flex-1 bg-gray-800 border-emerald-600 text-white placeholder-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}