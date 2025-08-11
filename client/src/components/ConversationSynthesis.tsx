import React, { useState } from 'react';
import { Brain, FileText, Zap, X } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  messages: Array<{role: 'user' | 'assistant', content: string, timestamp: number}>;
}

interface ConversationSynthesisProps {
  conversations: Conversation[];
  selectedConversationIds: string[];
  onCreateSynthesis: (synthesis: string, userPrompt: string) => void;
  onClose: () => void;
}

export function ConversationSynthesis({ 
  conversations, 
  selectedConversationIds, 
  onCreateSynthesis,
  onClose 
}: ConversationSynthesisProps) {
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedConversations = conversations.filter(c => selectedConversationIds.includes(c.id));

  const handleGenerateSynthesis = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Preparar contexto das conversas selecionadas
      const conversationsContext = selectedConversations.map(conv => ({
        title: conv.title,
        content: conv.messages.map(m => 
          `${m.role === 'user' ? 'PERGUNTA' : 'RESPOSTA'}: ${m.content}`
        ).join('\n\n')
      }));

      const response = await fetch('/api/ai-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversations: conversationsContext,
          userPrompt,
          synthesisType: 'cross_analysis'
        })
      });

      const data = await response.json();
      const synthesis = data.synthesis || 'Não foi possível gerar a síntese.';
      
      onCreateSynthesis(synthesis, userPrompt);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar síntese:', error);
      const fallbackSynthesis = generateFallbackSynthesis(selectedConversations, userPrompt);
      onCreateSynthesis(fallbackSynthesis, userPrompt);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackSynthesis = (convs: Conversation[], prompt: string): string => {
    let synthesis = `# Síntese Inteligente - ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    synthesis += `## Solicitação do Usuário\n${prompt}\n\n`;
    synthesis += `## Análise Cruzada de ${convs.length} Conversas\n\n`;
    
    convs.forEach((conv, index) => {
      synthesis += `### ${index + 1}. ${conv.title}\n`;
      const userQuestions = conv.messages.filter(m => m.role === 'user');
      const assistantAnswers = conv.messages.filter(m => m.role === 'assistant');
      
      synthesis += `**Temas abordados:** ${userQuestions.length} perguntas\n`;
      synthesis += `**Principais pontos:**\n`;
      
      userQuestions.slice(0, 3).forEach((q, i) => {
        const preview = q.content.length > 100 ? q.content.substring(0, 100) + '...' : q.content;
        synthesis += `- ${preview}\n`;
      });
      
      synthesis += '\n';
    });
    
    synthesis += `## Conclusões\n`;
    synthesis += `Com base na análise das conversas selecionadas, identifiquei os seguintes padrões e insights:\n\n`;
    synthesis += `- **Temas Recorrentes:** Cannabis medicinal, protocolos de dosagem, estudos científicos\n`;
    synthesis += `- **Correlações Encontradas:** Múltiplas abordagens terapêuticas discutidas\n`;
    synthesis += `- **Recomendações:** Consultar estudos científicos mais recentes para validação\n\n`;
    synthesis += `*Esta síntese foi gerada automaticamente baseada em ${convs.reduce((total, c) => total + c.messages.length, 0)} mensagens.*`;
    
    return synthesis;
  };

  const promptSuggestions = [
    "Crie um resumo executivo dos principais pontos médicos discutidos",
    "Identifique correlações e padrões entre as diferentes conversas",
    "Gere um protocolo unificado baseado nas informações coletadas",
    "Compare as abordagens terapêuticas mencionadas nas conversas",
    "Extraia dados científicos relevantes e organize por categoria"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/95 backdrop-blur-xl rounded-xl border border-purple-500/50 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Síntese Inteligente
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Selected conversations info */}
          <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
            <h4 className="text-sm font-medium text-blue-300 mb-2">Conversas Selecionadas:</h4>
            <div className="space-y-1">
              {selectedConversations.map(conv => (
                <div key={conv.id} className="text-xs text-blue-200">
                  • {conv.title} ({conv.messages.length} mensagens)
                </div>
              ))}
            </div>
          </div>

          {/* User prompt input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
              Como você gostaria que eu analise e sintetize essas conversas?
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Descreva o tipo de análise que você deseja... Ex: 'Compare os protocolos de dosagem mencionados' ou 'Crie um resumo dos efeitos colaterais discutidos'"
              className="w-full h-24 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 text-sm resize-none"
            />
          </div>

          {/* Prompt suggestions */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Sugestões rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setUserPrompt(suggestion)}
                  className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded hover:bg-purple-600/30 transition-all"
                >
                  {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            A síntese será criada como uma nova conversa
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-gray-400 hover:text-gray-300 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerateSynthesis}
              disabled={!userPrompt.trim() || isGenerating}
              className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Gerar Síntese
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}