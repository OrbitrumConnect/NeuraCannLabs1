import { MessageCircle, Eye } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ConversationIndicatorProps {
  messageCount: number;
  messages: Message[];
  onClear: () => void;
  onToggleHistory: () => void;
  showingHistory: boolean;
  onMinimizeMainCard?: () => void;
}

export function ConversationIndicator({ 
  messageCount, 
  messages, 
  onClear, 
  onToggleHistory,
  showingHistory,
  onMinimizeMainCard
}: ConversationIndicatorProps) {
  if (messageCount === 0) return null;

  return (
    <div className="flex items-center gap-1 mb-1 p-1.5 sm:p-2 sm:gap-2 sm:mb-2 bg-blue-900/20 rounded border border-blue-500/30">
      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
      <span className="text-xs text-blue-300">
        <span className="hidden sm:inline">Conversação ativa </span>({Math.floor(messageCount / 2)} trocas)
      </span>
      <button
        onClick={() => {
          onToggleHistory(); // Abre o rascunho de estudo
          onMinimizeMainCard?.(); // Minimiza o card principal para mostrar botões
        }}
        className={`text-xs flex items-center gap-1 ${
          showingHistory 
            ? 'text-orange-400 hover:text-orange-300' 
            : 'text-blue-400 hover:text-blue-300'
        }`}
        title={showingHistory ? "Voltar à pesquisa" : "Abrir Explorar mais e Rascunho"}
      >
        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        {showingHistory ? 'Pesquisar' : 'Ver'}
      </button>
      {/* Botão Limpar - Versão mobile compacta */}
      <button
        onClick={() => {
          onClear();
          onMinimizeMainCard?.(); // Minimiza o card principal automaticamente
        }}
        className="text-xs text-red-400 hover:text-red-300 ml-auto"
        title="Nova conversa"
      >
        <span className="sm:hidden">🗑️</span>
        <span className="hidden sm:inline">Nova</span>
      </button>
    </div>
  );
}