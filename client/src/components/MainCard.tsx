import React from "react";
import { Microscope, Pill, AlertTriangle, MessageSquare, X } from "lucide-react";
import TextToSpeech from "./TextToSpeech";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface MainCardProps {
  result: {
    query: string;
    response: string;
    meta: {
      counts: {
        studies: number;
        trials: number;
      };
    };
    categories: {
      scientific: Array<{
        id: string;
        title: string;
        description: string;
        compound: string;
        indication: string;
        status: string;
      }>;
      clinical: Array<{
        id: string;
        caseNumber: string;
        description: string;
        indication: string;
        outcome: string;
      }>;
      alerts: Array<{
        id: string;
        type: string;
        message: string;
        priority: string;
      }>;
    };
  } | null;
  showConversationHistory?: boolean;
  messages?: Message[];
  onToggleHistory?: () => void;
}

export default function MainCard({ 
  result, 
  showConversationHistory = false, 
  messages = [], 
  onToggleHistory 
}: MainCardProps) {
  if (!result) {
    return (
      <div style={{ height: "400px", borderRadius: 8, padding: "12px 16px", background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }} className="sm:h-[480px] sm:p-4">
        <div className="text-center text-gray-400">
          <div className="text-xl mb-2 sm:text-2xl">🧠</div>
          <div className="text-sm sm:text-base">Nenhuma pesquisa realizada</div>
          <div className="text-xs mt-2 sm:text-sm">Digite uma consulta para começar</div>
        </div>
      </div>
    );
  }

  const cleanTextForTTS = (text: string) => {
    // Remove emojis mas mantém todo o conteúdo para leitura completa
    return text
      .replace(/[🔬📊🏥⚠️🧠💊🎯]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n/g, ' ')
      .trim();
  };

  return (
    <div style={{ 
      borderRadius: 8, 
      padding: "12px 16px", 
      height: "400px", 
      background: "#0f172a", 
      color: "#fff",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      overflow: "auto"
    }} className="sm:h-[480px] sm:p-4">
      
      {/* Chat History or Search Results */}
      {showConversationHistory ? (
        <div className="h-full flex flex-col">
          {/* History Header */}
          <div className="flex items-center justify-between mb-3 p-2 bg-blue-900/20 rounded border border-blue-500/30">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                📜 Histórico da Conversa
              </span>
            </div>
            {onToggleHistory && (
              <button
                onClick={onToggleHistory}
                className="text-gray-400 hover:text-gray-300 p-1 rounded hover:bg-gray-800/50"
                title="Voltar aos resultados"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  message.role === 'user' 
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-green-600/20 text-green-400'
                }`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-[85%] text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30'
                      : 'bg-gray-800/50 text-gray-100 border border-gray-600/30'
                  }`}>
                    <div 
                      className="leading-relaxed"
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
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Nenhuma mensagem ainda nesta conversa</p>
                <p className="text-xs mt-1">As mensagens aparecerão aqui conforme você interage</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-3 p-2 sm:mb-4 sm:p-3 bg-blue-900/20 rounded border border-blue-500/30">
        <h3 className="text-base sm:text-lg font-semibold text-blue-300">📊 Consulta: {result.query}</h3>
        <p className="text-xs sm:text-sm text-blue-200 mt-1">
          Bases consultadas: {result.categories.scientific?.length || 0} estudos • {result.categories.clinical?.length || 0} casos clínicos • {result.categories.alerts?.length || 0} alertas
        </p>
      </div>

      {/* AI Response */}
      <div className="mb-3 p-2 sm:mb-4 sm:p-3 bg-gray-800/30 rounded">
        <div 
          className="text-xs sm:text-sm text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: result.response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300">$1</strong>') 
          }} 
        />
      </div>

      {/* Data Categories Grid */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        
        {/* Scientific Studies */}
        <div style={{ flex: 1, background: "#071033", padding: 8, borderRadius: 6, border: "1px solid rgba(59, 130, 246, 0.3)" }}>
          <h4 style={{ color: "#60a5fa", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center" }}>
            <Microscope className="w-4 h-4 mr-2" />
            Estudos Científicos ({result.categories.scientific?.length || 0})
          </h4>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {result.categories.scientific?.slice(0, 4).map((study, idx) => (
              <div key={study.id} style={{ padding: 6, borderBottom: "1px solid #1e293b", marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: "12px", color: "#bfdbfe" }}>{study.title}</div>
                <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>{study.description.substring(0, 80)}...</div>
                <div style={{ fontSize: 10, color: "#60a5fa", marginTop: 2 }}>📍 {study.compound} • {study.indication}</div>
                <div style={{ marginTop: 4, display: "flex", gap: 4 }}>
                  <button 
                    onClick={() => {
                      // Extrair PMID se disponível, senão buscar por título
                      const pmidMatch = study.description.match(/PMID:?\s*(\d+)/i);
                      if (pmidMatch) {
                        window.open(`https://pubmed.ncbi.nlm.nih.gov/${pmidMatch[1]}/`, '_blank');
                      } else {
                        window.open(`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(study.title)}`, '_blank');
                      }
                    }}
                    style={{ fontSize: "10px", padding: "2px 6px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    📖 PubMed
                  </button>
                </div>
              </div>
            )) || <div style={{ fontSize: "10px", color: "#64748b", textAlign: "center", padding: "8px" }}>Nenhum estudo encontrado</div>}
          </div>
        </div>

        {/* Clinical Cases */}
        <div style={{ width: 180, background: "#071a0b", padding: 8, borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.3)" }}>
          <h4 style={{ color: "#34d399", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center" }}>
            <Pill className="w-4 h-4 mr-2" />
            Casos Clínicos ({result.categories.clinical?.length || 0})
          </h4>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {result.categories.clinical?.slice(0, 4).map((case_, idx) => (
              <div key={case_.id} style={{ padding: 4, marginBottom: 4, background: "rgba(6, 78, 59, 0.3)", borderRadius: 4 }}>
                <div style={{ fontWeight: 600, fontSize: "12px", color: "#a7f3d0" }}>{case_.caseNumber}</div>
                <div style={{ fontSize: 10, color: "#d1fae5", marginTop: 2 }}>{case_.indication}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Alerts */}
        <div style={{ width: 180, background: "#1a0b07", padding: 8, borderRadius: 6, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <h4 style={{ color: "#f87171", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center" }}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertas ({result.categories.alerts?.length || 0})
          </h4>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {result.categories.alerts?.slice(0, 4).map((alert, idx) => (
              <div key={alert.id} style={{ padding: 4, marginBottom: 4, background: "rgba(127, 29, 29, 0.3)", borderRadius: 4 }}>
                <div style={{ fontWeight: 600, fontSize: "12px", color: "#fca5a5" }}>{alert.type}</div>
                <div style={{ fontSize: 10, color: "#fecaca", marginTop: 2 }}>Prioridade: {alert.priority}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TTS Control - Clean text only */}
      <div style={{ marginTop: 12, padding: 8, background: "rgba(55, 65, 81, 0.3)", borderRadius: 6 }}>
        <TextToSpeech 
          text={`Resultados encontrados para ${result.query}. ${cleanTextForTTS(result.response)}`}
          className="text-xs"
        />
      </div>
        </>
      )}
    </div>
  );
}