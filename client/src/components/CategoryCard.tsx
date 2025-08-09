import React from "react";
import { LucideIcon } from "lucide-react";
import TextToSpeech from "./TextToSpeech";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  data: any[];
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
  position: {
    left: string;
    top: string;
  };
}

export default function CategoryCard({ title, icon: Icon, data, color, position }: CategoryCardProps) {
  if (!data || data.length === 0) return null;

  const cleanTextForTTS = () => {
    const items = data.slice(0, 3).map(item => {
      if (item.title) return item.title;
      if (item.caseNumber) return `Caso ${item.caseNumber}`;
      if (item.message) return item.message;
      return "Item";
    }).join(', ');
    
    return `${data.length} ${title.toLowerCase()}: ${items}`;
  };

  return (
    <div 
      className="absolute z-50" 
      style={{ 
        left: position.left, 
        top: position.top,
        width: '320px'
      }}
    >
      <div 
        className={`backdrop-blur-md rounded-lg border p-4 ${color.bg} ${color.border}`}
        style={{
          background: `${color.bg}`,
          borderColor: `${color.border}`
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold flex items-center ${color.text}`}>
            <Icon className="w-4 h-4 mr-2" />
            {title} ({data.length})
          </h3>
          <TextToSpeech 
            text={cleanTextForTTS()}
            className="text-xs"
          />
        </div>

        {/* Content */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {data.map((item, idx) => (
            <div 
              key={idx} 
              className={`text-xs p-2 rounded border-l-2 cursor-pointer hover:opacity-80 transition-opacity ${color.accent}`}
            >
              {/* Scientific Studies */}
              {item.title && item.description && (
                <>
                  <div className="font-medium">{item.title}</div>
                  <div className={`mt-1 ${color.text} opacity-80`}>{item.description}</div>
                  <div className={`mt-1 text-xs ${color.text} opacity-60`}>
                    📍 {item.compound} • {item.indication}
                  </div>
                </>
              )}
              
              {/* Clinical Cases */}
              {item.caseNumber && item.outcome && (
                <>
                  <div className="font-medium">{item.caseNumber}</div>
                  <div className={`mt-1 ${color.text} opacity-80`}>{item.description}</div>
                  <div className={`mt-1 text-xs ${color.text} opacity-60`}>
                    👨‍⚕️ {item.indication} • Resultado: {item.outcome}
                  </div>
                </>
              )}
              
              {/* Regulatory Alerts */}
              {item.type && item.message && (
                <>
                  <div className="font-medium">{item.type}</div>
                  <div className={`mt-1 ${color.text} opacity-80`}>{item.message}</div>
                  <div className={`mt-1 text-xs ${color.text} opacity-60`}>
                    🚨 Prioridade: {item.priority} • Status: {item.readStatus ? 'Lido' : 'Novo'}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}