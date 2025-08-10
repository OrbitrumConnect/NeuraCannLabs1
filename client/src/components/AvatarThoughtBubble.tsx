import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarThoughtBubbleProps {
  isActive: boolean;
  context?: string;
  className?: string;
}

export function AvatarThoughtBubble({ isActive, context = 'overview', className }: AvatarThoughtBubbleProps) {
  const [currentMessage, setCurrentMessage] = useState("Click no avatar para começar");
  const [isVisible, setIsVisible] = useState(true);

  // Mensagens baseadas no contexto
  const contextMessages = {
    overview: "Explore o universo médico",
    scientific: "Dados científicos carregados",
    clinical: "Casos clínicos disponíveis",
    alerts: "Alertas regulatórios ativos",
    forum: "Fórum médico conectado",
    profile: "Configurações do perfil",
    admin: "Painel administrativo",
    searching: "Processando sua consulta...",
    idle: "Click no avatar para começar"
  };

  // Sugestões de estudos
  const studySuggestions = [
    "💡 Estude CBD para ansiedade",
    "🧠 THC na dor neuropática?",
    "📊 Dosagens pediátricas",
    "🔬 Efeito entourage?",
    "📈 Cannabis em oncologia"
  ];

  useEffect(() => {
    if (!isActive && context === 'overview') {
      setCurrentMessage("Click no avatar para começar");
    } else if (isActive) {
      // Se está pesquisando, mostra mensagem de contexto
      if (contextMessages[context as keyof typeof contextMessages]) {
        setCurrentMessage(contextMessages[context as keyof typeof contextMessages]);
      }

      // Após alguns segundos, oferece sugestões de estudos aleatórias
      const suggestionTimer = setTimeout(() => {
        const randomSuggestion = studySuggestions[Math.floor(Math.random() * studySuggestions.length)];
        setCurrentMessage(randomSuggestion);
      }, 3000);

      return () => clearTimeout(suggestionTimer);
    }
  }, [isActive, context]);

  if (!isVisible) return null;

  return (
    <div className={cn("absolute -top-16 left-1/2 transform -translate-x-1/2 z-20", className)}>
      {/* Thought Bubble */}
      <div className="relative">
        {/* Main bubble */}
        <div className="bg-gradient-to-br from-cyber-gray/90 to-cyber-light/90 backdrop-blur-md rounded-2xl px-3 py-2 border border-neon-cyan/30 shadow-lg max-w-48 animate-bounce-subtle">
          <p className="text-xs text-center text-neon-cyan font-medium leading-tight">
            {currentMessage}
          </p>
        </div>
        
        {/* Bubble tail */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="w-3 h-3 bg-cyber-gray/90 rotate-45 border-r border-b border-neon-cyan/30"></div>
        </div>
        
        {/* Small floating dots for thought effect */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-1 bg-neon-cyan/60 rounded-full animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-neon-cyan/40 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}