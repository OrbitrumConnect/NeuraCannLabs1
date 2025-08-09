import { useState } from "react";
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle, MessageCircle, Send, Bot } from "lucide-react";

interface CosmicPlanet {
  id: string;
  name: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  size: string;
  color: string;
  icon: string;
  delay: string;
}

interface CosmicMapProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
  onSearch?: (term: string, filter: string) => void;
}

const planets: CosmicPlanet[] = [
  {
    id: "scientific",
    name: "Dados Científicos",
    position: { bottom: "33%", left: "18%" },
    size: "w-16 h-16",
    color: "from-emerald-400 to-green-600",
    icon: "fas fa-microscope",
    delay: "0.5s",
  },
  {
    id: "clinical",
    name: "Casos Clínicos",
    position: { bottom: "33%", right: "18%" },
    size: "w-16 h-16",
    color: "from-blue-400 to-indigo-600",
    icon: "fas fa-user-md",
    delay: "1s",
  },
  {
    id: "alerts",
    name: "Alertas",
    position: { bottom: "13%", left: "22%" },
    size: "w-12 h-12",
    color: "from-amber-400 to-orange-600",
    icon: "fas fa-bell",
    delay: "1.5s",
  },
  {
    id: "profile",
    name: "Perfil",
    position: { bottom: "13%", right: "22%" },
    size: "w-12 h-12",
    color: "from-purple-400 to-pink-600",
    icon: "fas fa-user-circle",
    delay: "2s",
  },
];

export default function CosmicMap({ onPlanetClick, activeDashboard, onSearch }: CosmicMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const filters = [
    { id: "todos", label: "Todos", icon: Brain },
    { id: "cbd", label: "CBD", icon: Pill },
    { id: "thc", label: "THC", icon: Pill },
    { id: "epilepsia", label: "Epilepsia", icon: Microscope },
    { id: "dor", label: "Dor", icon: AlertTriangle },
  ];

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isTyping) return;

    const userMessage = searchTerm;
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    setSearchTerm("");
    setIsTyping(true);

    // Simulated AI response based on platform data
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setChatMessages(prev => [...prev, { type: 'ai', message: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('cbd') && lowerQuestion.includes('epilepsia')) {
      return "Com base nos estudos da plataforma, o CBD mostrou-se eficaz para epilepsia refratária. O estudo randomizado com 214 crianças demonstrou redução de 36.5% nas crises com CBD 20mg/kg/dia. Um caso clínico na plataforma (HC-2024-089) mostrou redução de 85% das crises em síndrome de Dravet com CBD 15mg/kg/dia.";
    }
    
    if (lowerQuestion.includes('thc') && lowerQuestion.includes('dor')) {
      return "Para dor oncológica, nossa meta-análise de 12 ensaios clínicos (n=1847) mostra eficácia superior do spray THC:CBD vs placebo (p<0.001). O caso HC-2024-156 demonstrou redução da dor de EVA 9/10 para 4/10 com spray THC:CBD 2.7mg:2.5mg.";
    }
    
    if (lowerQuestion.includes('dosagem') || lowerQuestion.includes('dose')) {
      return "As dosagens variam por condição: Epilepsia (CBD 15-20mg/kg/dia), Dor oncológica (THC:CBD 2.7:2.5mg 4x/dia), Ansiedade (CBD 25-75mg/dia), Parkinson (CBD 100-300mg/dia). Sempre iniciar com doses baixas e titular gradualmente.";
    }
    
    if (lowerQuestion.includes('efeito') && lowerQuestion.includes('adverso')) {
      return "ALERTA IMPORTANTE: CBG mostrou interação com warfarina - monitoramento de INR obrigatório. Efeitos adversos comuns do CBD incluem sonolência e alterações de apetite. THC pode causar ansiedade e tontura em doses altas.";
    }
    
    if (lowerQuestion.includes('anvisa') || lowerQuestion.includes('regulat')) {
      return "ATUALIZAÇÃO REGULATÓRIA: ANVISA atualizou RDC 660/2022 simplificando importação de cannabis medicinal. Médicos podem prescrever sem autorização prévia para epilepsia refratária e dor oncológica. CFM esclarece necessidade de esgotamento de tratamentos convencionais.";
    }
    
    return `Baseado nos 6 estudos científicos e 5 casos clínicos da plataforma, posso ajudar com informações sobre eficácia, dosagens, efeitos adversos e regulamentação. Você gostaria de saber mais sobre algum composto específico (CBD, THC, CBG) ou condição médica?`;
  };

  return (
    <div className="relative h-96 overflow-hidden">
      {/* Central Search Bar with AI Chat */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-neon-cyan/20 w-96">
          {/* Mode Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChatMode(!chatMode)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                  chatMode
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                    : "bg-gray-800/60 text-gray-300 border border-gray-600/40 hover:bg-gray-700/60"
                }`}
              >
                <Bot className="w-3 h-3" />
                <span>IA Cannabis</span>
              </button>
              {chatMode && chatMessages.length > 0 && (
                <button
                  onClick={() => setChatMessages([])}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="text-xs text-green-400 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>

          {/* Chat Messages */}
          {chatMode && chatMessages.length > 0 && (
            <div className="mb-4 max-h-64 overflow-y-auto space-y-2 bg-black/20 rounded-lg p-3">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${
                      msg.type === 'user'
                        ? 'bg-neon-cyan/20 text-white'
                        : 'bg-gray-700/60 text-gray-200'
                    }`}
                  >
                    {msg.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Bot className="w-3 h-3 text-neon-cyan" />
                        <span className="text-neon-cyan font-semibold">VerdiData IA</span>
                      </div>
                    )}
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700/60 px-3 py-2 rounded-lg text-xs text-gray-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-3 h-3 text-neon-cyan" />
                      <span>IA está digitando...</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-neon-cyan rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-neon-cyan rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-neon-cyan rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Input */}
          <form onSubmit={chatMode ? handleChatSubmit : (e) => e.preventDefault()}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative flex-1">
                {chatMode ? (
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-cyan/60 w-4 h-4" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-cyan/60 w-4 h-4" />
                )}
                <input
                  type="text"
                  placeholder={chatMode ? "Pergunte sobre estudos, dosagens, efeitos..." : "Pesquisar estudos, casos, alertas..."}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!chatMode) {
                      onSearch?.(e.target.value, selectedFilter);
                    }
                  }}
                  className="w-full bg-transparent border border-neon-cyan/30 rounded-lg pl-10 pr-10 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-neon-cyan/60"
                />
                {chatMode && (
                  <button
                    type="submit"
                    disabled={!searchTerm.trim() || isTyping}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-cyan/60 hover:text-neon-cyan disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
              {!chatMode && <Filter className="text-neon-cyan/60 w-4 h-4" />}
            </div>
          </form>
          
          {/* Filter Options - Only show when not in chat mode */}
          {!chatMode && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    onSearch?.(searchTerm, filter.id);
                  }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${
                    selectedFilter === filter.id
                      ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                      : "bg-gray-800/60 text-gray-300 border border-gray-600/40 hover:bg-gray-700/60"
                  }`}
                >
                  <filter.icon className="w-3 h-3" />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Knowledge Planets - Reduced brightness */}
      {planets.map((planet) => (
        <div
          key={planet.id}
          className={`absolute ${planet.size} bg-gradient-to-br ${planet.color} rounded-full animate-float cursor-pointer hover:scale-110 transition-transform opacity-80 ${
            activeDashboard === planet.id ? "ring-2 ring-neon-cyan/30 ring-opacity-50" : ""
          }`}
          style={{
            ...planet.position,
            animationDelay: planet.delay,
            transform: hoveredPlanet === planet.id ? "scale(1.15)" : "scale(1)",
          }}
          onClick={() => onPlanetClick(planet.id)}
          onMouseEnter={() => setHoveredPlanet(planet.id)}
          onMouseLeave={() => setHoveredPlanet(null)}
          data-testid={`cosmic-planet-${planet.id}`}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <i className={`${planet.icon} text-white/80 ${planet.size.includes("16") ? "" : "text-sm"}`} />
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/70 whitespace-nowrap">
            {planet.name}
          </div>
        </div>
      ))}
      
      {/* Subtle connecting lines from search bar to planets */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgba(0,255,255,0.1)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "rgba(0,255,255,0.03)", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <line x1="50%" y1="25%" x2="18%" y2="67%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="82%" y2="67%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="22%" y2="87%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="78%" y2="87%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
      </svg>
    </div>
  );
}
