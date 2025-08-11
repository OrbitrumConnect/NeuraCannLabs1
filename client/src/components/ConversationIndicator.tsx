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
    <div className="flex items-center gap-2 mb-2 p-2 bg-blue-900/20 rounded border border-blue-500/30">
      <MessageCircle className="w-4 h-4 text-blue-400" />
      <span className="text-xs text-blue-300">
        Conversação ativa ({Math.floor(messageCount / 2)} trocas)
      </span>
      <button
        onClick={onToggleHistory}
        className={`text-xs flex items-center gap-1 ${
          showingHistory 
            ? 'text-orange-400 hover:text-orange-300' 
            : 'text-blue-400 hover:text-blue-300'
        }`}
        title={showingHistory ? "Voltar à pesquisa" : "Ver histórico completo"}
      >
        <Eye className="w-3 h-3" />
        {showingHistory ? 'Pesquisar' : 'Ver'}
      </button>
      {/* Botão Nova - Escondido no mobile para não atrapalhar o avatar */}
      <button
        onClick={() => {
          onClear();
          onMinimizeMainCard?.(); // Minimiza o card principal automaticamente
        }}
        className="hidden sm:block text-xs text-red-400 hover:text-red-300"
        title="Nova conversa"
      >
        Nova
      </button>
    </div>
  );
}