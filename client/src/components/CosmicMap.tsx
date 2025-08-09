import { useState } from "react";
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle, MessageCircle, Send, Bot } from "lucide-react";
import MedicalAvatar3D from "./MedicalAvatar3D";

interface CosmicPlanet {
  id: string;
  name: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  size: string;
  color: string;
  icon: string;
  delay: string;
}

interface SearchTab {
  id: string;
  query: string;
  response: string;
  suggestions: string[];
  results: any[];
  timestamp: number;
  type: 'main' | 'sub';
  parentId?: string;
}

interface CosmicMapProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
  onSearch?: (term: string, filter: string) => void;
  onAIResponse?: (response: string, suggestions: string[], results: any[], query?: string) => void;
}

const planets: CosmicPlanet[] = [
  {
    id: "scientific",
    name: "Dados Científicos",
    position: { top: "20%", right: "5%" },
    size: "w-14 h-14",
    color: "from-emerald-400 to-green-600",
    icon: "fas fa-microscope",
    delay: "0s",
  },
  {
    id: "clinical",
    name: "Casos Clínicos",
    position: { top: "35%", right: "5%" },
    size: "w-14 h-14",
    color: "from-blue-400 to-indigo-600",
    icon: "fas fa-user-md",
    delay: "0s",
  },
  {
    id: "alerts",
    name: "Alertas",
    position: { top: "50%", right: "5%" },
    size: "w-11 h-11",
    color: "from-amber-400 to-orange-600",
    icon: "fas fa-bell",
    delay: "0s",
  },
  {
    id: "profile",
    name: "Perfil",
    position: { top: "65%", right: "5%" },
    size: "w-11 h-11",
    color: "from-purple-400 to-pink-600",
    icon: "fas fa-user-circle",
    delay: "0s",
  },
];

export default function CosmicMap({ onPlanetClick, activeDashboard, onSearch, onAIResponse }: CosmicMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTabs, setSearchTabs] = useState<SearchTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [subSearchActive, setSubSearchActive] = useState(false);
  const [subSearchTerm, setSubSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [correlatedSuggestions, setCorrelatedSuggestions] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cardPositions, setCardPositions] = useState<Record<string, {x: number, y: number}>>({});
  const [draggingCard, setDraggingCard] = useState<string | null>(null);

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

    // Adicionar à memória de pesquisa
    setSearchHistory(prev => [userMessage, ...prev.slice(0, 9)]);

    try {
      // Busca cruzada nos 3 sistemas: científicos, clínicos e alertas
      const [scientificResponse, clinicalResponse, alertsResponse] = await Promise.all([
        fetch('/api/scientific'),
        fetch('/api/clinical'),
        fetch('/api/alerts')
      ]);

      const [scientificData, clinicalData, alertsData] = await Promise.all([
        scientificResponse.json(),
        clinicalResponse.json(),
        alertsResponse.json()
      ]);

      // IA processa consulta cruzando todos os dados
      const aiResponse = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: userMessage,
          scientificData,
          clinicalData,
          alertsData
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('Erro na análise cruzada');
      }

      const result = await aiResponse.json();

      // Gerar correlações inteligentes baseadas no histórico
      const correlations = generateIntelligentCorrelations(userMessage, searchHistory);
      
      // Criar nova aba de pesquisa com IA avançada
      const newTab: SearchTab = {
        id: `tab-${Date.now()}`,
        query: userMessage,
        response: result.answer,
        suggestions: [...(result.suggestions || []), ...correlations],
        results: result.relatedResults || [],
        timestamp: Date.now(),
        type: 'main'
      };

      setSearchTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      onAIResponse?.(result.answer, result.suggestions, result.relatedResults, userMessage);

    } catch (error) {
      console.error('Erro na análise cruzada:', error);
      const fallbackTab: SearchTab = {
        id: `tab-${Date.now()}`,
        query: userMessage,
        response: `🔍 **ANÁLISE CRUZADA DE DADOS**\n\nBuscando por: "${userMessage}"\n\n📊 **Cruzamento realizado em:**\n- 6 estudos científicos\n- 5 casos clínicos\n- 3 alertas ativos\n\nDesculpe, erro temporário no sistema. Tente novamente.`,
        suggestions: [],
        results: [],
        timestamp: Date.now(),
        type: 'main'
      };
      setSearchTabs(prev => [...prev, fallbackTab]);
      setActiveTabId(fallbackTab.id);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubSearch = async (suggestion: string, parentTabId: string) => {
    setSubSearchActive(true);
    setSubSearchTerm(suggestion);
    
    try {
      const [scientificResponse, clinicalResponse, alertsResponse] = await Promise.all([
        fetch('/api/scientific'),
        fetch('/api/clinical'),
        fetch('/api/alerts')
      ]);

      const [scientificData, clinicalData, alertsData] = await Promise.all([
        scientificResponse.json(),
        clinicalResponse.json(),
        alertsResponse.json()
      ]);

      const aiResponse = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: suggestion,
          scientificData,
          clinicalData,
          alertsData
        }),
      });

      const result = await aiResponse.json();
      
      const subTab: SearchTab = {
        id: `subtab-${Date.now()}`,
        query: suggestion,
        response: result.answer,
        suggestions: result.suggestions || [],
        results: result.relatedResults || [],
        timestamp: Date.now(),
        type: 'sub',
        parentId: parentTabId
      };

      setSearchTabs(prev => [...prev, subTab]);
      setActiveTabId(subTab.id);
      
    } catch (error) {
      console.error('Erro na sub-pesquisa:', error);
    } finally {
      setSubSearchActive(false);
      setSubSearchTerm("");
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable drag on background, not on research nodes
    if ((e.target as HTMLElement).closest('.research-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
  };

  const handleCardMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    setDraggingCard(cardId);
    const currentPos = cardPositions[cardId] || { x: 0, y: 0 };
    setDragStart({ x: e.clientX - currentPos.x, y: e.clientY - currentPos.y });
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!draggingCard) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setCardPositions(prev => ({
      ...prev,
      [draggingCard]: { x: newX, y: newY }
    }));
  };

  const handleCardMouseUp = () => {
    setDraggingCard(null);
  };

  // Sistema de correlações inteligentes baseado no histórico
  const generateIntelligentCorrelations = (currentQuery: string, history: string[]): string[] => {
    const correlations: string[] = [];
    const queryLower = currentQuery.toLowerCase();
    
    // Correlações baseadas em padrões médicos
    if (queryLower.includes('dosagem') || queryLower.includes('dose')) {
      correlations.push('Efeitos adversos relacionados', 'Interações medicamentosas');
    }
    if (queryLower.includes('cbd')) {
      correlations.push('Estudos comparativos CBD vs THC', 'Biodisponibilidade do CBD');
    }
    if (queryLower.includes('epilepsia')) {
      correlations.push('Protocolos pediátricos', 'Síndrome de Dravet estudos recentes');
    }
    if (queryLower.includes('dor')) {
      correlations.push('Cannabis vs opioides', 'Dor neuropática tratamentos');
    }
    
    // Correlações baseadas no histórico de pesquisas
    history.forEach(pastQuery => {
      if (pastQuery.toLowerCase().includes('thc') && queryLower.includes('cbd')) {
        correlations.push('Efeito entourage CBD+THC');
      }
      if (pastQuery.toLowerCase().includes('criança') && queryLower.includes('epilepsia')) {
        correlations.push('Epidiolex em pediatria');
      }
    });
    
    return Array.from(new Set(correlations)).slice(0, 3);
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
      {/* Medical Avatar - Large, Left Side */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={() => setChatMode(!chatMode)}
          className="group transition-all duration-500 hover:scale-105"
        >
          <MedicalAvatar3D 
            isActive={chatMode}
            isListening={isTyping}
            message={isTyping ? "Processando..." : chatMode ? "Modo Ativo" : ""}
            className="w-40 h-40"
          />
          {/* Doctor Info */}
          <div className={`mt-3 text-center transition-all duration-300 ${
            chatMode 
              ? "text-neon-cyan" 
              : "text-gray-300 group-hover:text-white"
          }`}>
            <div className="text-lg font-bold">Dr. Cannabis IA</div>
            <div className="text-sm opacity-70">
              {chatMode ? "Mente Ativa" : "Clique para ativar"}
            </div>
          </div>
        </button>
      </div>

      {/* Neural Connection Line - When chat is active */}
      {chatMode && (
        <div className="absolute left-44 top-1/2 transform -translate-y-1/2 z-10">
          <div 
            className="h-0.5 bg-gradient-to-r from-neon-cyan via-blue-400 to-transparent animate-pulse"
            style={{
              width: 'calc(50vw - 450px)',
              boxShadow: '0 0 10px rgba(0,255,255,0.5)'
            }}
          />
        </div>
      )}

      {/* Central Search Bar with AI Chat - Always visible when chat active */}
      {chatMode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl p-6 border border-neon-cyan/60 w-[700px] max-w-4xl shadow-2xl shadow-neon-cyan/40 animate-fade-in">
          {/* Chat Mode Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {chatMode && (
                <div className="flex items-center space-x-2 text-neon-cyan">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Conexão Neural Ativa</span>
                </div>
              )}
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

          {/* Chat Messages - Only show user messages */}
          {chatMode && chatMessages.length > 0 && (
            <div className="mb-4 max-h-32 overflow-y-auto space-y-2 bg-black/20 rounded-lg p-3">
              {chatMessages.filter(msg => msg.type === 'user').map((msg, index) => (
                <div key={index} className="flex justify-end">
                  <div className="max-w-[85%] px-3 py-2 rounded-lg text-sm bg-neon-cyan/20 text-white">
                    {msg.message}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700/60 px-3 py-2 rounded-lg text-xs text-gray-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-3 h-3 text-neon-cyan" />
                      <span>IA está analisando...</span>
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
      )}

      {/* Neural Research Web - Long connection to bottom area */}
      {searchTabs.length > 0 && (
        <>
          {/* Long Neural Connection from Avatar to Research Area */}
          <div className="absolute left-44 top-32 z-10">
            <div className="w-0.5 bg-gradient-to-b from-neon-cyan via-blue-400 to-transparent animate-pulse"
                 style={{
                   height: 'calc(40vh - 120px)',
                   boxShadow: '0 0 8px rgba(0,255,255,0.4)'
                 }} />
          </div>

          {/* Neural Web Viewport - Expanded and Zoomable */}
          <div className="fixed bottom-0 left-0 right-0 z-20" style={{top: '40vh'}}>
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="research-node w-12 h-12 bg-black/90 border border-neon-cyan/60 rounded-lg flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/20 transition-all font-bold text-lg"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="research-node w-12 h-12 bg-black/90 border border-neon-cyan/60 rounded-lg flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/20 transition-all font-bold text-lg"
              >
                −
              </button>
              <button
                onClick={resetView}
                className="research-node w-12 h-12 bg-black/90 border border-neon-cyan/60 rounded-lg flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/20 transition-all text-sm"
              >
                ⌂
              </button>
              <div className="text-xs text-center text-gray-400 mt-1 bg-black/60 px-2 py-1 rounded">
                {Math.round(zoomLevel * 100)}%
              </div>
              <div className="text-xs text-center text-gray-500 mt-2 bg-black/60 px-2 py-1 rounded">
                🖱️ Arrastar fundo
              </div>
            </div>

            {/* Zoomable Research Web */}
            <div 
              className="w-full h-full overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={(e) => {
                handleMouseMove(e);
                handleCardMouseMove(e);
              }}
              onMouseUp={() => {
                handleMouseUp();
                handleCardMouseUp();
              }}
              onMouseLeave={() => {
                handleMouseUp();
                handleCardMouseUp();
              }}
            >
              <div 
                className={`w-full h-full relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease'
                }}
              >
                {/* Header spacing */}
                <div className="pt-8 mb-8"></div>
                
                {/* Neural Network Flow - Dr. Cannabis → Pesquisas → Sub-pesquisas */}
                <div className="px-6 pb-6">
                  <div className="max-w-7xl mx-auto">
                    
                    {/* Study Input Area - Root Node Creation */}
                    <div className="text-center mb-8">
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-black/80 border border-neon-cyan/40 rounded-xl backdrop-blur-md p-6">
                          <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse"></div>
                            <span className="text-lg font-medium text-neon-cyan">Inserir Novo Estudo</span>
                          </div>
                          
                          <textarea 
                            placeholder="Digite ou fale seu estudo, hipótese ou resumo aqui..."
                            className="w-full h-24 bg-black/60 border border-gray-600/50 rounded-lg p-3 text-gray-300 placeholder-gray-500 resize-none focus:border-neon-cyan/60 focus:outline-none"
                          />
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex space-x-2">
                              <button className="px-3 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg text-sm hover:bg-neon-cyan/30 transition-all">
                                🧠 Processar com IA
                              </button>
                              <button className="px-3 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-600/30 transition-all">
                                🎤 Falar
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">
                              {searchTabs.filter(tab => tab.type === 'main').length} estudos na árvore
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Level 2: Main Research Network */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 mb-8">
                      {searchTabs.filter(tab => tab.type === 'main').map((mainTab, mainIndex) => (
                        <div key={mainTab.id} className="relative">
                          {/* Simple connection indicator */}
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-4 bg-neon-cyan/60 rounded-full" />
                          </div>
                    
                    {/* Main Research Node - Fixed position, no drag */}
                    <div 
                      className={`research-node relative bg-black/90 backdrop-blur-md rounded-xl border p-6 cursor-pointer transition-all min-h-[220px] ${
                        activeTabId === mainTab.id 
                          ? 'border-neon-cyan shadow-xl shadow-neon-cyan/30' 
                          : 'border-gray-600/50 hover:border-neon-cyan/60'
                      }`}
                      onClick={() => setActiveTabId(activeTabId === mainTab.id ? null : mainTab.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                          <h3 className="text-lg font-semibold text-neon-cyan">
                            📄 {mainTab.query}
                          </h3>
                          <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded text-xs">
                            Nó Raiz
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 bg-gray-800/60 px-2 py-1 rounded">
                            {new Date(mainTab.timestamp).toLocaleTimeString()}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchTabs(prev => prev.filter(t => t.id !== mainTab.id && t.parentId !== mainTab.id));
                              if (activeTabId === mainTab.id) setActiveTabId(null);
                            }}
                            className="text-red-400 hover:text-red-300 w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/20"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                  
                      {/* Collapsed preview */}
                      {activeTabId !== mainTab.id && (
                        <div className="text-sm text-gray-400 leading-relaxed">
                          {mainTab.response.substring(0, 200)}...
                        </div>
                      )}
                      
                      {/* Expanded content */}
                      {activeTabId === mainTab.id && (
                        <div className="space-y-4">
                          <div className="text-sm text-gray-300 max-h-48 overflow-y-auto border-l-2 border-neon-cyan/30 pl-3 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ 
                              __html: mainTab.response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                            }} />
                          </div>
                          
                          {/* Action Flow - Hierarchical Tree System */}
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <button 
                              className="px-3 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs hover:bg-blue-600/30 transition-all"
                              title="Gerar resumo expandido do estudo"
                            >
                              📄 Resumo
                            </button>
                            <button 
                              className="px-3 py-2 bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg text-xs hover:bg-green-600/30 transition-all"
                              title="Criar versão aprimorada com IA"
                            >
                              ✨ Aprimorar
                            </button>
                            <button 
                              className="px-3 py-2 bg-orange-600/20 text-orange-300 border border-orange-500/30 rounded-lg text-xs hover:bg-orange-600/30 transition-all"
                              title="Publicar no banco de estudos"
                            >
                              🚀 Publicar
                            </button>
                          </div>
                          
                          {/* Hierarchical Navigation */}
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700/50">
                            <button 
                              className="px-2 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded text-xs hover:bg-purple-600/30 transition-all"
                              title="Buscar estudos relacionados automaticamente"
                            >
                              🔍 Busca Cruzada
                            </button>
                            <button 
                              className="px-2 py-1 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded text-xs hover:bg-cyan-600/30 transition-all"
                              title="Comparar com outros estudos"
                            >
                              ⚖️ Comparar
                            </button>
                          </div>
                          
                          {/* Tree Expansion - Child Nodes */}
                          {mainTab.suggestions.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                                <span className="w-4 h-0.5 bg-purple-400/60 mr-2"></span>
                                Nós Filhos Disponíveis:
                              </h4>
                              <div className="space-y-1">
                                {mainTab.suggestions.slice(0, 3).map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSubSearch(suggestion, mainTab.id);
                                    }}
                                    className="w-full text-left px-3 py-2 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded text-xs hover:bg-purple-600/20 transition-all cursor-pointer flex items-center space-x-2"
                                  >
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    <span>{suggestion.substring(0, 35)}...</span>
                                    <span className="ml-auto text-xs opacity-60">→</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>


                  </div>
                ))}
                    </div>
                    
                    {/* Level 3: Sub-research indicators */}
                    {searchTabs.filter(tab => tab.type === 'sub').length > 0 && (
                      <div className="text-center mt-8">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300">
                          <span className="text-sm">Sub-pesquisas ativas:</span>
                          <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                            {searchTabs.filter(tab => tab.type === 'sub').length}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sub-research Cards - Positioned next to main cards */}
      {searchTabs.filter(tab => tab.type === 'sub').map((subTab, index) => {
        const parentTab = searchTabs.find(tab => tab.id === subTab.parentId);
        const parentIndex = searchTabs.filter(tab => tab.type === 'main').findIndex(tab => tab.id === subTab.parentId);
        
        // Position harmoniously next to parent card (n8n style)
        const basePosition = {
          x: 600 + (parentIndex % 3) * 450 + 40, // Closer to parent, more organized
          y: 150 + Math.floor(parentIndex / 3) * 320 + index * 90 // Better grid alignment
        };
        
        const position = cardPositions[subTab.id] || basePosition;
        
        return (
          <div
            key={`sub-card-${subTab.id}`}
            className="absolute z-50"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: draggingCard === subTab.id ? 'scale(1.05)' : 'scale(1)',
              transition: draggingCard === subTab.id ? 'none' : 'transform 0.2s ease'
            }}
          >
            {/* Neural connection line to parent - Shorter and more elegant */}
            <div 
              className="absolute -left-8 top-20 w-8 h-0.5 bg-purple-400/60 animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0.2) 100%)'
              }}
            />
            <div className="absolute -left-8 top-20 w-0.5 h-2 bg-purple-400/60" />
            
            {/* Sub Research Card - Smaller and more harmonic */}
            <div 
              className={`draggable-card bg-black/95 backdrop-blur-md rounded-lg border transition-all w-72 shadow-lg ${
                activeTabId === subTab.id 
                  ? 'border-purple-400 shadow-purple-400/30 h-48' 
                  : 'border-purple-600/40 hover:border-purple-400/60 h-40'
              } ${draggingCard === subTab.id ? 'ring-2 ring-purple-400/50' : ''}`}
            >
              {/* Header */}
              <div className="flex justify-between items-start p-3 pb-2">
                <div className="flex items-center flex-1">
                  <div 
                    className="w-6 h-6 mr-2 flex items-center justify-center text-purple-400 cursor-grab bg-purple-900/30 rounded text-xs border border-purple-600/40 hover:bg-purple-800/40"
                    onMouseDown={(e) => handleCardMouseDown(e, subTab.id)}
                    title="Arrastar card"
                  >
                    ⋮⋮
                  </div>
                  <h4 
                    className="text-sm font-medium text-purple-300 cursor-pointer truncate"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTabId(activeTabId === subTab.id ? null : subTab.id);
                    }}
                    title={subTab.query}
                  >
                    🔎 {subTab.query.substring(0, 22)}{subTab.query.length > 22 ? '...' : ''}
                  </h4>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTabs(prev => prev.filter(t => t.id !== subTab.id));
                    setCardPositions(prev => {
                      const newPos = { ...prev };
                      delete newPos[subTab.id];
                      return newPos;
                    });
                    if (activeTabId === subTab.id) setActiveTabId(null);
                  }}
                  className="text-red-400 hover:text-red-300 w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/20"
                >
                  ×
                </button>
              </div>
              
              {/* Content */}
              <div 
                className="px-3 pb-3 cursor-pointer flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTabId(activeTabId === subTab.id ? null : subTab.id);
                }}
              >
                <div className="text-xs text-gray-300 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ 
                    __html: subTab.response.substring(0, activeTabId === subTab.id ? 400 : 150).replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                  }} />
                  {subTab.response.length > (activeTabId === subTab.id ? 400 : 150) && (
                    <span className="text-purple-400 cursor-pointer">... {activeTabId === subTab.id ? '' : '[clique para expandir]'}</span>
                  )}
                </div>
                
                {/* Parent indicator */}
                {parentTab && (
                  <div className="text-xs text-purple-500 mt-2 pt-1 border-t border-purple-800/30 opacity-70 truncate">
                    ↖ De: {parentTab.query.substring(0, 35)}...
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

    </div>
  );
}
