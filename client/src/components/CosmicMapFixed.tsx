import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Brain, Microscope, Stethoscope, AlertTriangle, Search, Filter, Send, Volume2, VolumeX } from 'lucide-react';
import MedicalAvatar3D from './MedicalAvatar3D';
import TextToSpeech from './TextToSpeech';

interface CosmicMapProps {
  scientificData?: any[];
  clinicalData?: any[];  
  alertsData?: any[];
  onSearch?: (query: string, filter?: string) => void;
}

interface SearchTab {
  id: string;
  query: string;
  response: string;
  type: 'main' | 'sub';
  parentId?: string;
  results?: any[];
}

const CosmicMap: React.FC<CosmicMapProps> = ({
  scientificData = [],
  clinicalData = [],
  alertsData = [],
  onSearch
}) => {
  // Estados principais
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [chatMode, setChatMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{type: 'user' | 'ai', message: string}[]>([]);
  const [searchTabs, setSearchTabs] = useState<SearchTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  
  // Estados de navegação
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cardPositions, setCardPositions] = useState<{[key: string]: {x: number, y: number}}>({});
  const [draggingCard, setDraggingCard] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'Todos', icon: Brain },
    { id: 'scientific', label: 'Científicos', icon: Microscope },
    { id: 'clinical', label: 'Clínicos', icon: Stethoscope },
    { id: 'regulatory', label: 'Regulatórios', icon: AlertTriangle }
  ];

  // Funções de controle de zoom e pan
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const resetView = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
  };

  // Funções de navegação
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('cursor-grab')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = () => setIsDragging(false);

  // Funções de arrasto de cards
  const handleCardMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    setDraggingCard(cardId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCardMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingCard) {
      const newX = e.clientX - dragStart.x;
      const newY = Math.max(64, e.clientY - dragStart.y);
      
      setCardPositions(prev => ({
        ...prev,
        [draggingCard]: { x: newX, y: newY }
      }));
    }
  }, [draggingCard, dragStart]);

  const handleCardMouseUp = () => setDraggingCard(null);

  // Função de busca principal
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (chatMode) {
      setIsTyping(true);
      setChatMessages(prev => [...prev, { type: 'user', message: searchTerm }]);
      
      setTimeout(() => {
        const aiResponse = generateAIResponse(searchTerm);
        const newTabId = `tab-${Date.now()}`;
        const suggestions = generateSubSearchSuggestions(searchTerm);
        
        setSearchTabs(prev => [{
          id: newTabId,
          query: searchTerm,
          response: aiResponse,
          type: 'main',
          results: suggestions
        }, ...prev.filter(tab => tab.type === 'sub')]);
        
        setIsTyping(false);
        setSearchTerm('');
      }, 1500);
    } else {
      onSearch?.(searchTerm, selectedFilter);
    }
  };

  // Função para criar sub-pesquisa
  const createSubSearch = (suggestion: string, parentId: string) => {
    const subTabId = `sub-${Date.now()}`;
    const subResponse = generateSubResponse(suggestion);
    
    setSearchTabs(prev => [...prev, {
      id: subTabId,
      query: suggestion,
      response: subResponse,
      type: 'sub',
      parentId: parentId,
      results: []
    }]);
  };

  // Função para gerar resposta da IA
  const generateAIResponse = (question: string) => {
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
    
    return `Baseado nos 6 estudos científicos e 5 casos clínicos da plataforma, posso ajudar com informações sobre eficácia, dosagens, efeitos adversos e regulamentação. Você gostaria de saber mais sobre algum composto específico (CBD, THC, CBG) ou condição médica?`;
  };

  // Função para gerar sugestões de sub-pesquisa
  const generateSubSearchSuggestions = (query: string) => {
    return [
      { title: "Dosagens recomendadas", suggestion: "Quais são as dosagens recomendadas para " + query },
      { title: "Efeitos adversos", suggestion: "Efeitos adversos de " + query },
      { title: "Estudos recentes", suggestion: "Estudos mais recentes sobre " + query },
      { title: "Casos clínicos", suggestion: "Casos clínicos de sucesso com " + query }
    ];
  };

  const generateSubResponse = (query: string) => {
    return `Análise específica: ${query}. Dados cruzados da plataforma mostram evidências consistentes com protocolos estabelecidos.`;
  };

  return (
    <div className="relative min-h-screen overflow-auto w-full"
         style={{ 
           background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
           minHeight: '100vh'
         }}>
      
      {/* Medical Avatar - Responsive */}
      <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={() => setChatMode(!chatMode)}
          className="group transition-all duration-500 hover:scale-105"
        >
          <MedicalAvatar3D 
            isActive={chatMode}
            isListening={isTyping}
            message={isTyping ? "Processando..." : chatMode ? "Modo Ativo" : ""}
            className="w-32 h-32 md:w-40 md:h-40"
          />
          <div className={`mt-3 text-center transition-all duration-300 ${
            chatMode ? "text-cyan-400" : "text-gray-300 group-hover:text-white"
          }`}>
            <div className="text-lg font-bold">Dr. Cannabis IA</div>
            <div className="text-sm opacity-70">
              {chatMode ? "Mente Ativa" : "Clique para ativar"}
            </div>
          </div>
        </button>
      </div>

      {/* Chat Interface - When Active */}
      {chatMode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-4xl px-4">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-cyan-400/60 shadow-2xl shadow-cyan-400/40">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Conexão Neural Ativa</span>
              </div>
              <div className="text-xs text-green-400 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pergunte sobre estudos, dosagens, casos clínicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border border-cyan-400/30 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/60"
                />
                <button
                  type="submit"
                  disabled={!searchTerm.trim() || isTyping}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400/60 hover:text-cyan-400 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Research Results Area */}
      {searchTabs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20" style={{top: '40vh'}}>
          {/* Zoom Controls */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 z-30 flex flex-col gap-1 md:gap-2">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 md:w-12 md:h-12 bg-black/90 border border-cyan-400/60 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-all font-bold text-sm md:text-lg"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 md:w-12 md:h-12 bg-black/90 border border-cyan-400/60 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-all font-bold text-sm md:text-lg"
            >
              −
            </button>
            <button
              onClick={resetView}
              className="w-8 h-8 md:w-12 md:h-12 bg-black/90 border border-cyan-400/60 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-all text-xs md:text-sm"
            >
              ⌂
            </button>
          </div>

          {/* Main Research Display */}
          <div 
            className="w-full h-full overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div 
              className={`w-full h-full relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{
                transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
            >
              {/* Main Research Cards */}
              <div className="px-2 md:px-6 pb-6 pt-8">
                <div className="max-w-7xl mx-auto">
                  {searchTabs.filter(tab => tab.type === 'main').map((tab) => (
                    <div key={tab.id} className="mb-8">
                      <div className="bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-600/60 p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-4">{tab.query}</h3>
                        <div className="text-gray-300 mb-6"
                             dangerouslySetInnerHTML={{ 
                               __html: tab.response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                             }} 
                        />
                        
                        {/* Sub-search Suggestions */}
                        {tab.results && tab.results.length > 0 && (
                          <div className="border-t border-gray-700/50 pt-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Explore mais:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {tab.results.map((result, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => createSubSearch(result.suggestion, tab.id)}
                                  className="text-left p-3 bg-purple-900/20 rounded-lg border border-purple-600/30 hover:border-purple-400/60 transition-all"
                                >
                                  <div className="text-sm text-purple-300 font-medium">{result.title}</div>
                                  <div className="text-xs text-purple-400 mt-1">→ Expandir análise</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-research Cards Dock */}
      {searchTabs.filter(tab => tab.type === 'sub').length > 0 && (
        <div className="fixed bottom-4 md:bottom-8 left-0 right-0 z-40">
          <div className="flex gap-2 md:gap-4 px-2 md:px-8 overflow-x-auto">
            {searchTabs.filter(tab => tab.type === 'sub').map((subTab) => (
              <div key={subTab.id} className="flex-shrink-0">
                <div className={`bg-purple-950/90 backdrop-blur-md rounded-lg border transition-all w-64 md:w-80 shadow-lg ${
                  activeTabId === subTab.id 
                    ? 'border-purple-400 shadow-purple-400/30 h-56 md:h-64' 
                    : 'border-purple-600/40 hover:border-purple-400/60 h-40 md:h-48'
                }`}>
                  
                  {/* Header */}
                  <div 
                    className="px-4 py-3 border-b border-purple-600/30 flex justify-between items-center cursor-pointer hover:bg-purple-900/10"
                    onClick={() => setActiveTabId(activeTabId === subTab.id ? null : subTab.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <h3 className="text-sm font-semibold text-purple-300">
                        {subTab.query.substring(0, 25)}...
                      </h3>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchTabs(prev => prev.filter(t => t.id !== subTab.id));
                      }}
                      className="text-purple-400 hover:text-purple-300 text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="text-sm text-purple-200">
                      <div dangerouslySetInnerHTML={{ 
                        __html: subTab.response.substring(0, activeTabId === subTab.id ? 400 : 150)
                      }} />
                      {subTab.response.length > (activeTabId === subTab.id ? 400 : 150) && (
                        <span className="text-purple-400">... [clique para expandir]</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Cards - Responsive Layout */}
      {searchTabs.filter(tab => tab.type === 'main').length > 0 && (
        <div className="fixed bottom-4 md:bottom-16 left-0 right-0 z-30 px-2 md:px-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 max-w-7xl mx-auto">
            
            {/* Scientific Studies */}
            <div className="flex-1 bg-blue-950/95 backdrop-blur-md rounded-lg border border-blue-400/60 p-3 md:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <h3 className="text-sm md:text-base font-bold text-blue-300 flex items-center">
                  <Microscope className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  Estudos ({scientificData?.length || 0})
                </h3>
                <TextToSpeech 
                  text={`Temos ${scientificData?.length || 0} estudos científicos sobre cannabis medicinal`}
                  className="text-xs"
                />
              </div>
              <div className="space-y-2 max-h-32 md:max-h-48 overflow-y-auto">
                {scientificData?.slice(0, 3).map((study, idx) => (
                  <div key={idx} className="text-xs text-blue-200 p-2 bg-blue-900/50 rounded-lg border-l-2 border-blue-400/80">
                    <div className="font-semibold text-blue-100 mb-1">{study.title}</div>
                    <div className="text-blue-300 mb-1">{study.description.substring(0, 80)}...</div>
                    <div className="text-blue-400 flex items-center justify-between">
                      <span>📍 {study.compound}</span>
                      <span className="bg-blue-800/50 px-1 py-1 rounded text-xs">{study.status}</span>
                    </div>
                  </div>
                )) || <div className="text-blue-400 text-xs">Carregando...</div>}
              </div>
            </div>

            {/* Clinical Cases */}
            <div className="flex-1 bg-green-950/95 backdrop-blur-md rounded-lg border border-green-400/60 p-3 md:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <h3 className="text-sm md:text-base font-bold text-green-300 flex items-center">
                  <Stethoscope className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  Casos ({clinicalData?.length || 0})
                </h3>
                <TextToSpeech 
                  text={`Há ${clinicalData?.length || 0} casos clínicos documentados`}
                  className="text-xs"
                />
              </div>
              <div className="space-y-2 max-h-32 md:max-h-48 overflow-y-auto">
                {clinicalData?.slice(0, 3).map((case_, idx) => (
                  <div key={idx} className="text-xs text-green-200 p-2 bg-green-900/50 rounded-lg border-l-2 border-green-400/80">
                    <div className="font-semibold text-green-100 mb-1">{case_.patientProfile}</div>
                    <div className="text-green-300 mb-1">{case_.intervention.substring(0, 80)}...</div>
                    <div className="text-green-400 flex items-center justify-between">
                      <span>👨‍⚕️ Dr. {case_.doctorName}</span>
                      <span className="bg-green-800/50 px-1 py-1 rounded text-xs">{case_.outcome}</span>
                    </div>
                  </div>
                )) || <div className="text-green-400 text-xs">Carregando...</div>}
              </div>
            </div>

            {/* Regulatory Alerts */}
            <div className="flex-1 bg-red-950/95 backdrop-blur-md rounded-lg border border-red-400/60 p-3 md:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <h3 className="text-sm md:text-base font-bold text-red-300 flex items-center">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  Alertas ({alertsData?.length || 0})
                </h3>
                <TextToSpeech 
                  text={`Há ${alertsData?.length || 0} alertas regulatórios importantes`}
                  className="text-xs"
                />
              </div>
              <div className="space-y-2 max-h-32 md:max-h-48 overflow-y-auto">
                {alertsData?.slice(0, 3).map((alert, idx) => (
                  <div key={idx} className="text-xs text-red-200 p-2 bg-red-900/50 rounded-lg border-l-2 border-red-400/80">
                    <div className="font-semibold text-red-100 mb-1">{alert.type}</div>
                    <div className="text-red-300 mb-1">{alert.message.substring(0, 80)}...</div>
                    <div className="text-red-400 flex items-center justify-between">
                      <span>🚨 {alert.priority}</span>
                      <span className={`px-1 py-1 rounded text-xs ${alert.readStatus ? 'bg-green-800/50' : 'bg-red-800/50'}`}>
                        {alert.readStatus ? 'Lido' : 'Novo'}
                      </span>
                    </div>
                  </div>
                )) || <div className="text-red-400 text-xs">Carregando...</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmicMap;