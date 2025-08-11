import React, { useState } from 'react';
import { MessageCircle, Plus, Trash2, Merge, FileText, X } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  messages: Array<{role: 'user' | 'assistant', content: string, timestamp: number}>;
  createdAt: number;
  lastActivity: number;
}

interface ConversationManagerProps {
  currentConversation: Conversation | null;
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation | null) => void;
  onCreateNew: () => void;
  onDeleteConversation: (id: string) => void;
  onMergeConversations: (ids: string[]) => void;
  onCreateDocument: (conversations: string[]) => void;
}

export function ConversationManager({
  currentConversation,
  conversations,
  onSelectConversation,
  onCreateNew,
  onDeleteConversation,
  onMergeConversations,
  onCreateDocument
}: ConversationManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  const [mergeMode, setMergeMode] = useState(false);

  const handleMerge = () => {
    if (selectedForMerge.length >= 2) {
      onMergeConversations(selectedForMerge);
      setSelectedForMerge([]);
      setMergeMode(false);
    }
  };

  const handleCreateDocument = () => {
    if (selectedForMerge.length >= 1) {
      onCreateDocument(selectedForMerge);
      setSelectedForMerge([]);
      setMergeMode(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedForMerge(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-all"
          title="Gerenciar Conversas"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">
            {conversations.length} conversas
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-80 max-h-96 bg-black/90 backdrop-blur-xl rounded-xl border border-purple-500/30 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <h3 className="text-lg font-semibold text-purple-300">Conversas</h3>
        <div className="flex items-center gap-2">
          {!mergeMode ? (
            <>
              <button
                onClick={onCreateNew}
                className="p-1 text-green-400 hover:text-green-300"
                title="Nova Conversa"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMergeMode(true)}
                className="p-1 text-blue-400 hover:text-blue-300"
                title="Mesclar/Exportar"
              >
                <Merge className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleMerge}
                disabled={selectedForMerge.length < 2}
                className="p-1 text-blue-400 hover:text-blue-300 disabled:opacity-50"
                title="Mesclar Selecionadas"
              >
                <Merge className="w-4 h-4" />
              </button>
              <button
                onClick={handleCreateDocument}
                disabled={selectedForMerge.length === 0}
                className="p-1 text-orange-400 hover:text-orange-300 disabled:opacity-50"
                title="Criar Documento"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMergeMode(false);
                  setSelectedForMerge([]);
                }}
                className="p-1 text-gray-400 hover:text-gray-300"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="max-h-80 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-3 border-b border-purple-500/10 cursor-pointer transition-all ${
              currentConversation?.id === conv.id 
                ? 'bg-purple-600/20 border-l-4 border-l-purple-400' 
                : 'hover:bg-purple-600/10'
            } ${
              selectedForMerge.includes(conv.id) ? 'bg-blue-600/20' : ''
            }`}
            onClick={() => {
              if (mergeMode) {
                toggleSelection(conv.id);
              } else {
                onSelectConversation(conv);
                setIsOpen(false);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-purple-200 truncate">
                  {conv.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {conv.messages.length} mensagens • {
                    new Date(conv.lastActivity).toLocaleDateString('pt-BR')
                  }
                </p>
              </div>
              {!mergeMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100"
                  title="Excluir"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              {mergeMode && (
                <div className={`w-4 h-4 rounded border-2 ${
                  selectedForMerge.includes(conv.id)
                    ? 'bg-blue-400 border-blue-400'
                    : 'border-gray-400'
                }`} />
              )}
            </div>
          </div>
        ))}
        
        {conversations.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma conversa ainda</p>
          </div>
        )}
      </div>

      {/* Footer with merge info */}
      {mergeMode && selectedForMerge.length > 0 && (
        <div className="p-3 bg-purple-900/30 border-t border-purple-500/20">
          <p className="text-xs text-purple-300">
            {selectedForMerge.length} conversas selecionadas
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Mesclar: combina em uma nova conversa<br/>
            Documento: cria texto estruturado
          </p>
        </div>
      )}
    </div>
  );
}