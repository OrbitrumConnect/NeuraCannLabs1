import React from 'react';
import { Clock, User, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ConversationHistoryProps {
  messages: Message[];
  isVisible: boolean;
  onClose: () => void;
}

export function ConversationHistory({ messages, isVisible, onClose }: ConversationHistoryProps) {
  if (!isVisible || messages.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl rounded-xl border border-purple-500/30 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico da Conversa
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'bg-green-600/20 text-green-400'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              
              <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30'
                    : 'bg-gray-800/50 text-gray-100 border border-gray-600/30'
                }`}>
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .replace(/\n/g, '<br/>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} 
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20 text-center">
          <p className="text-xs text-gray-400">
            {messages.length} mensagens • {Math.floor(messages.length / 2)} trocas
          </p>
        </div>
      </div>
    </div>
  );
}