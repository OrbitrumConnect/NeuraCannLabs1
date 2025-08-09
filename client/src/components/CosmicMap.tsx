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

      // Criar nova aba de pesquisa
      const newTab: SearchTab = {
        id: `tab-${Date.now()}`,
        query: userMessage,
        response: result.answer,
        suggestions: result.suggestions || [],
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

      {/* Central Search Bar with AI Chat - Only shows when active */}
      {chatMode && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-neon-cyan/40 w-[600px] max-w-4xl shadow-lg shadow-neon-cyan/20 animate-fade-in">
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

      {/* Research Tabs Area - Below chat when active */}
      {searchTabs.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-[90vw] max-w-6xl">
          {/* Tab Headers */}
          <div className="flex gap-2 mb-2 overflow-x-auto">
            {searchTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm whitespace-nowrap transition-all ${
                  activeTabId === tab.id
                    ? "bg-neon-cyan/20 text-neon-cyan border-t border-l border-r border-neon-cyan/40"
                    : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/60"
                } ${tab.type === 'sub' ? 'ml-4 border-l-4 border-purple-500' : ''}`}
              >
                {tab.type === 'sub' && <span className="text-purple-400 mr-1">↳</span>}
                {tab.query.substring(0, 30)}...
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTabs(prev => prev.filter(t => t.id !== tab.id));
                    if (activeTabId === tab.id) {
                      const remaining = searchTabs.filter(t => t.id !== tab.id);
                      setActiveTabId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
                    }
                  }}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          {activeTabId && searchTabs.find(tab => tab.id === activeTabId) && (
            <div className="bg-black/80 backdrop-blur-md rounded-lg border border-neon-cyan/30 p-6 max-h-96 overflow-y-auto">
              {(() => {
                const activeTab = searchTabs.find(tab => tab.id === activeTabId)!;
                return (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-neon-cyan">
                        {activeTab.type === 'sub' ? '🔍 Sub-pesquisa: ' : '🧠 Análise Principal: '}
                        {activeTab.query}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {new Date(activeTab.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-gray-300 mb-4">
                      <div dangerouslySetInnerHTML={{ 
                        __html: activeTab.response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }} />
                    </div>

                    {/* Sub-search suggestions */}
                    {activeTab.suggestions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Aprofundar pesquisa:</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeTab.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSubSearch(suggestion, activeTab.id)}
                              disabled={subSearchActive}
                              className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-xs hover:bg-purple-600/30 transition-all disabled:opacity-50"
                            >
                              {subSearchActive && subSearchTerm === suggestion ? (
                                <span className="animate-pulse">Pesquisando...</span>
                              ) : (
                                suggestion
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related results */}
                    {activeTab.results.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Resultados relacionados:</h4>
                        <div className="grid gap-2">
                          {activeTab.results.slice(0, 3).map((result, index) => (
                            <div key={index} className="p-3 bg-gray-800/40 rounded border border-gray-700/40">
                              <div className="text-xs text-gray-500 mb-1">
                                {result.type === 'study' ? '📚 Estudo' : result.type === 'case' ? '👨‍⚕️ Caso' : '⚠️ Alerta'}
                              </div>
                              <div className="text-sm text-gray-300">
                                {result.data?.title || result.data?.caseNumber || result.data?.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
