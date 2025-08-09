import React from "react";
import { Microscope, Pill, AlertTriangle } from "lucide-react";
import TextToSpeech from "./TextToSpeech";

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
}

export default function MainCard({ result }: MainCardProps) {
  if (!result) {
    return (
      <div style={{ height: 480, borderRadius: 8, padding: 16, background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">🧠</div>
          <div>Nenhuma pesquisa realizada</div>
          <div className="text-sm mt-2">Digite uma consulta para começar</div>
        </div>
      </div>
    );
  }

  const cleanTextForTTS = (text: string) => {
    return text
      .replace(/[🔬📊🏥⚠️🧠💊🎯]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n/g, ' ')
      .substring(0, 200);
  };

  return (
    <div style={{ 
      borderRadius: 8, 
      padding: 16, 
      height: 480, 
      background: "rgba(255, 255, 255, 0.95)", 
      color: "#1f2937",
      border: "1px solid rgba(156, 163, 175, 0.3)",
      overflow: "auto",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    }}>
      
      {/* Header */}
      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800">📊 Consulta: {result.query}</h3>
        <p className="text-sm text-blue-700 mt-1">
          Bases consultadas: {result.categories.scientific?.length || 0} estudos • {result.categories.clinical?.length || 0} casos clínicos • {result.categories.alerts?.length || 0} alertas
        </p>
      </div>

      {/* AI Response */}
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <div 
          className="text-sm text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: result.response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-700">$1</strong>') 
          }} 
        />
      </div>

      {/* Data Categories Grid */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        
        {/* Scientific Studies */}
        <div style={{ flex: 1, background: "#f8fafc", padding: 8, borderRadius: 6, border: "1px solid rgba(156, 163, 175, 0.3)" }}>
          <h4 style={{ color: "#1e40af", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center" }}>
            <Microscope className="w-4 h-4 mr-2" />
            Estudos Científicos ({result.categories.scientific?.length || 0})
          </h4>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {result.categories.scientific?.slice(0, 4).map((study, idx) => (
              <div key={study.id} style={{ padding: 6, borderBottom: "1px solid #e5e7eb", marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: "12px", color: "#1f2937" }}>{study.title}</div>
                <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{study.description.substring(0, 80)}...</div>
                <div style={{ fontSize: 10, color: "#1e40af", marginTop: 2 }}>📍 {study.compound} • {study.indication}</div>
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
                    style={{ 
                      padding: "2px 6px", 
                      fontSize: "9px", 
                      background: "#3b82f6", 
                      color: "#ffffff", 
                      border: "none", 
                      borderRadius: 3,
                      cursor: "pointer"
                    }}
                  >
                    📄 PubMed
                  </button>
                  {study.description.includes('NCT') && (
                    <button 
                      onClick={() => {
                        const nctMatch = study.description.match(/NCT\d+/);
                        if (nctMatch) {
                          window.open(`https://clinicaltrials.gov/study/${nctMatch[0]}`, '_blank');
                        }
                      }}
                      style={{ 
                        padding: "2px 6px", 
                        fontSize: "9px", 
                        background: "#10b981", 
                        color: "#ffffff", 
                        border: "none", 
                        borderRadius: 3,
                        cursor: "pointer"
                      }}
                    >
                      🏥 NCT
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Cases */}
        <div style={{ width: 180, background: "#f0fdf4", padding: 8, borderRadius: 6, border: "1px solid rgba(156, 163, 175, 0.3)" }}>
          <h4 style={{ color: "#15803d", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center" }}>
            <Pill className="w-4 h-4 mr-2" />
            Casos Clínicos ({result.categories.clinical?.length || 0})
          </h4>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {result.categories.clinical?.slice(0, 4).map((case_, idx) => (
              <div key={case_.id} style={{ padding: 4, marginBottom: 4, background: "rgba(34, 197, 94, 0.1)", borderRadius: 4 }}>
                <div style={{ fontWeight: 600, fontSize: "12px", color: "#15803d" }}>{case_.caseNumber}</div>
                <div style={{ fontSize: 10, color: "#166534", marginTop: 2 }}>{case_.indication}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Alerts */}
        <div style={{ width: 180, background: "#fef2f2", padding: 8, borderRadius: 6, border: "1px solid rgba(156, 163, 175, 0.3)" }}>
          <h4 style={{ color: "#dc2626", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center" }}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertas ({result.categories.alerts?.length || 0})
          </h4>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {result.categories.alerts?.slice(0, 4).map((alert, idx) => (
              <div key={alert.id} style={{ padding: 4, marginBottom: 4, background: "rgba(239, 68, 68, 0.1)", borderRadius: 4 }}>
                <div style={{ fontWeight: 600, fontSize: "12px", color: "#dc2626" }}>{alert.type}</div>
                <div style={{ fontSize: 10, color: "#b91c1c", marginTop: 2 }}>Prioridade: {alert.priority}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TTS Control - Clean text only */}
      <div style={{ marginTop: 12, padding: 8, background: "rgba(243, 244, 246, 0.8)", borderRadius: 6, border: "1px solid rgba(156, 163, 175, 0.3)" }}>
        <TextToSpeech 
          text={`Resultados encontrados para ${result.query}. ${cleanTextForTTS(result.response)}`}
          className="text-xs"
        />
      </div>
    </div>
  );
}