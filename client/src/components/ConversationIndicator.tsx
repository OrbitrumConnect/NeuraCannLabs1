import { MessageCircle } from 'lucide-react';

interface ConversationIndicatorProps {
  messageCount: number;
  onClear: () => void;
}

export function ConversationIndicator({ messageCount, onClear }: ConversationIndicatorProps) {
  if (messageCount === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-2 p-2 bg-blue-900/20 rounded border border-blue-500/30">
      <MessageCircle className="w-4 h-4 text-blue-400" />
      <span className="text-xs text-blue-300">
        Conversação ativa ({Math.floor(messageCount / 2)} trocas)
      </span>
      <button
        onClick={onClear}
        className="text-xs text-red-400 hover:text-red-300 ml-auto"
        title="Limpar histórico"
      >
        Nova conversa
      </button>
    </div>
  );
}