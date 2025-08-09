import { useState, useEffect } from "react";
import { useParams } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import CosmicMap from "@/components/CosmicMap";
import Avatar3D from "@/components/Avatar3D";
import ScientificDashboard from "./ScientificDashboard";
import ClinicalDashboard from "./ClinicalDashboard";
import AlertsDashboard from "./AlertsDashboard";
import ProfileDashboard from "./ProfileDashboard";

export default function Dashboard() {
  const { section } = useParams();
  const [activeDashboard, setActiveDashboard] = useState(section || "overview");
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [globalFilter, setGlobalFilter] = useState("todos");
  const [aiResponse, setAiResponse] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiCardMinimized, setAiCardMinimized] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Sub-search states
  const [subSearchResponse, setSubSearchResponse] = useState<string>('');
  const [subSearchQuery, setSubSearchQuery] = useState<string>('');
  const [showSubSearch, setShowSubSearch] = useState(false);
  const [subCardMinimized, setSubCardMinimized] = useState(false);
  const [subCardPosition, setSubCardPosition] = useState({ x: window.innerWidth - 350, y: 400 });
  const [isDraggingSubCard, setIsDraggingSubCard] = useState(false);
  const [subDragStart, setSubDragStart] = useState({ x: 0, y: 0 });


  useEffect(() => {
    if (section) {
      setActiveDashboard(section);
    }
  }, [section]);

  // Global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && aiCardMinimized) {
        e.preventDefault();
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Limitar movimento dentro da área de conteúdo
        const maxX = window.innerWidth - 370;
        const maxY = window.innerHeight - 100;
        const minY = 350; // Abaixo da área de pesquisa IA Cannabis
        
        setCardPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY))
        });
      }
      
      if (isDraggingSubCard && subCardMinimized) {
        e.preventDefault();
        const newX = e.clientX - subDragStart.x;
        const newY = e.clientY - subDragStart.y;
        
        // Limitar movimento dentro da área de conteúdo
        const maxX = window.innerWidth - 350;
        const maxY = window.innerHeight - 100;
        const minY = 350;
        
        setSubCardPosition({
          x: Math.max(20, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY))
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsDraggingSubCard(false);
    };

    if (isDragging || isDraggingSubCard) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'move';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isDraggingSubCard, aiCardMinimized, subCardMinimized, dragStart, subDragStart]);

  const handleMenuClick = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleDashboardChange = (dashboard: string) => {
    setActiveDashboard(dashboard);
    window.history.pushState({}, '', `/dashboard/${dashboard}`);
  };

  const handleCosmicPlanetClick = (dashboardId: string) => {
    handleDashboardChange(dashboardId);
  };

  const handleGlobalSearch = (term: string, filter: string) => {
    setGlobalSearchTerm(term);
    setGlobalFilter(filter);
  };

  const handleAIResponse = (response: string, suggestions: string[], results: any[], query?: string) => {
    setAiResponse(response);
    setAiSuggestions(suggestions);
    setAiResults(results);
    if (query) setAiSearchQuery(query);
    
    // Se o card já existe e está minimizado, mantém a posição atual
    if (aiResponse && aiCardMinimized) {
      // Mantém minimizado e posição atual
      return;
    }
    
    // Se é nova pesquisa ou card não existe, mostra expandido
    setAiCardMinimized(false);
    // Reset position when new response comes - position for minimized state
    setCardPosition({ x: 50, y: 400 });
  };

  const toggleAiCard = () => {
    setAiCardMinimized(!aiCardMinimized);
  };

  const closeAiCard = () => {
    setAiResponse("");
    setAiSuggestions([]);
    setAiResults([]);
    setAiSearchQuery("");
    setAiCardMinimized(false);
    setCardPosition({ x: 50, y: 400 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (aiCardMinimized) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - (cardPosition.x || 50),
        y: e.clientY - (cardPosition.y || 250)
      });
    }
  };

  // Sub-search functions
  const handleSubSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSubSearchQuery(query);
    
    // Automaticamente minimizar o card principal quando sub-pesquisa é feita
    if (!aiCardMinimized) {
      setAiCardMinimized(true);
      // Posicionar o card principal no lado esquerdo para criar a "teia"
      setCardPosition({ x: 50, y: 400 });
    }
    
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubSearchResponse(data.answer);
        setShowSubSearch(true);
      }
    } catch (error) {
      console.error('Sub-search error:', error);
    }
  };

  const closeSubSearch = () => {
    setSubSearchResponse('');
    setSubSearchQuery('');
    setShowSubSearch(false);
    setSubCardMinimized(false);
    // Expandir o card principal novamente quando sub-pesquisa é fechada
    setAiCardMinimized(false);
  };

  const toggleSubCard = () => {
    setSubCardMinimized(!subCardMinimized);
  };

  const handleSubCardMouseDown = (e: React.MouseEvent) => {
    if (subCardMinimized) {
      setIsDraggingSubCard(true);
      const rect = (e.target as Element).closest('.fixed')?.getBoundingClientRect();
      if (rect) {
        setSubDragStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };



  // Close side nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const sideNav = document.querySelector('[data-testid="side-navigation"]');
      const menuToggle = document.querySelector('[data-testid="mobile-menu-toggle"]');
      
      if (sideNavOpen && sideNav && !sideNav.contains(target) && !menuToggle?.contains(target)) {
        setSideNavOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sideNavOpen]);

  const renderDashboardContent = () => {
    switch (activeDashboard) {
      case "scientific":
        return <ScientificDashboard />;
      case "clinical":
        return <ClinicalDashboard />;
      case "alerts":
        return <AlertsDashboard />;
      case "profile":
        return <ProfileDashboard />;
      default:
        return <OverviewDashboard 
          onPlanetClick={handleCosmicPlanetClick} 
          activeDashboard={activeDashboard}
          onSearch={handleGlobalSearch}
          searchTerm={globalSearchTerm}
          searchFilter={globalFilter}
          onAIResponse={handleAIResponse}
          aiResponse={aiResponse}
          aiResults={aiResults}
          onCloseAI={closeAiCard}
          aiCardMinimized={aiCardMinimized}
          onToggleAI={toggleAiCard}
          aiSearchQuery={aiSearchQuery}
          cardPosition={cardPosition}
          onMouseDown={handleMouseDown}
          isDragging={isDragging}
          // Sub-search props
          onSubSearch={handleSubSearch}
          subSearchResponse={subSearchResponse}
          subSearchQuery={subSearchQuery}
          showSubSearch={showSubSearch}
          onCloseSubSearch={closeSubSearch}
          subCardMinimized={subCardMinimized}
          onToggleSubCard={toggleSubCard}
          subCardPosition={subCardPosition}
          onSubCardMouseDown={handleSubCardMouseDown}
        />;
    }
  };

  return (
    <DashboardLayout
      onMenuClick={handleMenuClick}
      onDashboardChange={handleDashboardChange}
      activeDashboard={activeDashboard}
      sideNavOpen={sideNavOpen}
      setSideNavOpen={setSideNavOpen}
    >
      {renderDashboardContent()}
      

    </DashboardLayout>
  );
}

interface OverviewDashboardProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
  onSearch?: (term: string, filter: string) => void;
  searchTerm?: string;
  searchFilter?: string;
  onAIResponse?: (response: string, suggestions: string[], results: any[], query?: string) => void;
  aiResponse?: string;
  aiResults?: any[];
  onCloseAI?: () => void;
  aiCardMinimized?: boolean;
  onToggleAI?: () => void;
  aiSearchQuery?: string;
  cardPosition?: { x: number; y: number };
  onMouseDown?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  // Sub-search props
  onSubSearch?: (query: string) => void;
  subSearchResponse?: string;
  subSearchQuery?: string;
  showSubSearch?: boolean;
  onCloseSubSearch?: () => void;
  subCardMinimized?: boolean;
  onToggleSubCard?: () => void;
  subCardPosition?: { x: number; y: number };
  onSubCardMouseDown?: (e: React.MouseEvent) => void;
}

function OverviewDashboard({ onPlanetClick, activeDashboard, onSearch, onAIResponse, aiResponse, aiResults, onCloseAI, aiCardMinimized, onToggleAI, aiSearchQuery, cardPosition, onMouseDown, isDragging, onSubSearch, subSearchResponse, subSearchQuery, showSubSearch, onCloseSubSearch, subCardMinimized, onToggleSubCard, subCardPosition, onSubCardMouseDown }: OverviewDashboardProps) {
  return (
    <section className="relative container mx-auto px-4 py-8">
      {/* Hero Section with 3D Avatar - Reduced by 30% */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
        {/* Welcome Message - Moved to left */}
        <div className="text-center lg:text-left lg:mr-6 mb-6 lg:mb-0">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="text-white">Bem-vindo ao</span>
            <span className="neon-text block">Futuro da Medicina</span>
          </h1>
          <p className="text-base text-gray-300 mb-4 max-w-xl">
            Plataforma avançada para análise científica, casos clínicos e descobertas em cannabis medicinal
          </p>
          <button 
            className="px-6 py-2.5 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 animate-pulse-glow text-sm"
            data-testid="explore-platform-button"
          >
            <i className="fas fa-rocket mr-2" />
            Explorar Plataforma
          </button>
        </div>
        
        {/* 3D Avatar - Moved to right */}
        <div className="relative">
          <Avatar3D className="w-24 h-24" size={105} />
        </div>
      </div>

      {/* Cosmic Knowledge Map */}
      <div className="mb-8">
        <CosmicMap onPlanetClick={onPlanetClick} activeDashboard={activeDashboard} onSearch={onSearch} onAIResponse={onAIResponse} />
      </div>



      {/* AI Response Section - Integrated in content when expanded - Below search */}
      {aiResponse && !aiCardMinimized && (
        <div className={`mt-6 mb-12 transition-all duration-300 ${showSubSearch ? 'mr-[340px]' : ''}`}>
          <div className="bg-gradient-to-r from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-neon-cyan/40 shadow-2xl shadow-neon-cyan/10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-neon-cyan text-sm animate-pulse"></i>
                </div>
                <h3 className="text-neon-cyan font-semibold text-lg">VerdiData IA - Análise Científica</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onToggleAI}
                  className="text-gray-400 hover:text-neon-cyan transition-colors p-2 rounded-lg hover:bg-gray-700/30"
                  title="Minimizar"
                >
                  <i className="fas fa-chevron-down text-sm"></i>
                </button>
                <button 
                  onClick={onCloseAI}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-700/30"
                  title="Fechar"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="whitespace-pre-line leading-relaxed text-gray-100">
                {aiResponse.split('\n').map((line, i) => {
                  // Títulos de estudos clicáveis
                  if (line.startsWith('🔬 **') || line.startsWith('📊 **')) {
                    const title = line.replace(/\*\*/g, '').replace('🔬 ', '').replace('📊 ', '');
                    return (
                      <button 
                        key={i} 
                        onClick={() => onPlanetClick('scientific')}
                        className="font-semibold text-emerald-400 hover:text-emerald-300 mt-4 block cursor-pointer underline decoration-dotted hover:bg-emerald-500/10 px-3 py-2 rounded transition-all text-left w-full"
                      >
                        🔬 {title}
                      </button>
                    )
                  }
                  if (line.startsWith('📈 **') || line.startsWith('📚 **')) {
                    return <div key={i} className="font-semibold text-blue-400 mt-4 text-lg">{line.replace(/\*\*/g, '')}</div>
                  }
                  // Casos clínicos clicáveis
                  if (line.startsWith('👨‍⚕️ **') || line.startsWith('🏥 **')) {
                    return (
                      <button 
                        key={i}
                        onClick={() => onPlanetClick('clinical')} 
                        className="font-semibold text-purple-400 hover:text-purple-300 mt-4 block cursor-pointer underline decoration-dotted hover:bg-purple-500/10 px-3 py-2 rounded transition-all text-left w-full"
                      >
                        {line.replace(/\*\*/g, '')}
                      </button>
                    )
                  }
                  // Alertas clicáveis
                  if (line.startsWith('⚠️ **')) {
                    return (
                      <button 
                        key={i}
                        onClick={() => onPlanetClick('alerts')} 
                        className="font-semibold text-amber-400 hover:text-amber-300 mt-4 block cursor-pointer underline decoration-dotted hover:bg-amber-500/10 px-3 py-2 rounded transition-all text-left w-full"
                      >
                        {line.replace(/\*\*/g, '')}
                      </button>
                    )
                  }
                  if (line.startsWith('🎯 **')) {
                    return <div key={i} className="font-semibold text-neon-cyan mt-4 text-lg">{line.replace(/\*\*/g, '')}</div>
                  }
                  // Itens com bullet points
                  if (line.startsWith('•')) {
                    if (line.includes('HC-') || line.includes('caso')) {
                      return (
                        <button 
                          key={i} 
                          onClick={() => onPlanetClick('clinical')}
                          className="ml-6 text-gray-300 hover:text-white cursor-pointer hover:bg-gray-600/20 px-3 py-1 rounded transition-all text-left w-full"
                        >
                          {line}
                        </button>
                      )
                    }
                    return <div key={i} className="ml-6 text-gray-300 py-1">{line}</div>
                  }
                  if (line.startsWith('❌') || line.startsWith('🔍')) {
                    return <div key={i} className="text-gray-400">{line}</div>
                  }
                  return <div key={i} className="py-1">{line}</div>
                })}
              </div>
              
              {/* Sub-search section at the end of analysis */}
              <div className="mt-6 pt-4 border-t border-gray-600/30">
                <div className="flex items-center space-x-3 mb-3">
                  <i className="fas fa-search-plus text-neon-cyan text-sm"></i>
                  <span className="text-neon-cyan font-medium">Sub-pesquisa Específica</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Pesquisar tópico específico desta análise..."
                    className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 text-gray-100 text-sm focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const query = (e.target as HTMLInputElement).value;
                        if (query.trim() && onSubSearch) {
                          onSubSearch(query);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="específico"]') as HTMLInputElement;
                      if (input && input.value.trim() && onSubSearch) {
                        onSubSearch(input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/40 rounded-lg px-4 py-2 transition-colors"
                    title="Pesquisar"
                  >
                    <i className="fas fa-arrow-right text-neon-cyan text-sm"></i>
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Faça uma sub-pesquisa para explorar aspectos específicos desta análise
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection line between cards - Web effect */}
      {showSubSearch && aiCardMinimized && (
        <div 
          className="fixed z-40 pointer-events-none"
          style={{
            left: `${(cardPosition?.x || 50) + 350}px`,
            top: `${(cardPosition?.y || 250) + 32}px`,
            width: `${window.innerWidth - (cardPosition?.x || 50) - 350 - 340}px`,
            height: '2px',
            background: 'linear-gradient(to right, rgba(6, 182, 212, 0.5), rgba(147, 51, 234, 0.5))',
            borderRadius: '1px',
            animation: 'pulse 2s infinite'
          }}
        />
      )}

      {/* Sub-search lateral card - Full size when expanded */}
      {showSubSearch && subSearchResponse && !subCardMinimized && (
        <div 
          className="fixed right-6 bottom-8 w-80 h-[60vh] z-50 transition-all duration-300 ease-in-out"
          style={{ 
            transform: showSubSearch ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <div className="bg-gradient-to-b from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-sm rounded-xl border border-purple-500/40 shadow-2xl shadow-purple-500/10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <i className="fas fa-search-plus text-purple-400 text-xs"></i>
                </div>
                <h3 className="text-purple-400 font-medium text-sm">Sub-pesquisa: {subSearchQuery}</h3>
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" title="Conectado à análise principal"></div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={onToggleSubCard}
                  className="text-gray-400 hover:text-purple-400 transition-colors p-1"
                  title="Minimizar"
                >
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
                <button 
                  onClick={onCloseSubSearch}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Fechar"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="whitespace-pre-line leading-relaxed text-gray-100 text-sm">
                {subSearchResponse.split('\n').map((line, i) => {
                  // Títulos de estudos clicáveis
                  if (line.startsWith('🔬 **') || line.startsWith('📊 **')) {
                    const title = line.replace(/\*\*/g, '').replace('🔬 ', '').replace('📊 ', '');
                    return (
                      <button 
                        key={i} 
                        onClick={() => onPlanetClick('scientific')}
                        className="font-semibold text-emerald-400 hover:text-emerald-300 mt-3 block cursor-pointer underline decoration-dotted hover:bg-emerald-500/10 px-2 py-1 rounded transition-all text-left w-full text-xs"
                      >
                        🔬 {title}
                      </button>
                    )
                  }
                  if (line.startsWith('📈 **') || line.startsWith('📚 **')) {
                    return <div key={i} className="font-semibold text-blue-400 mt-3 text-sm">{line.replace(/\*\*/g, '')}</div>
                  }
                  // Casos clínicos clicáveis
                  if (line.startsWith('👨‍⚕️ **') || line.startsWith('🏥 **')) {
                    return (
                      <button 
                        key={i}
                        onClick={() => onPlanetClick('clinical')} 
                        className="font-semibold text-purple-400 hover:text-purple-300 mt-3 block cursor-pointer underline decoration-dotted hover:bg-purple-500/10 px-2 py-1 rounded transition-all text-left w-full text-xs"
                      >
                        {line.replace(/\*\*/g, '')}
                      </button>
                    )
                  }
                  // Alertas clicáveis
                  if (line.startsWith('⚠️ **')) {
                    return (
                      <button 
                        key={i}
                        onClick={() => onPlanetClick('alerts')} 
                        className="font-semibold text-amber-400 hover:text-amber-300 mt-3 block cursor-pointer underline decoration-dotted hover:bg-amber-500/10 px-2 py-1 rounded transition-all text-left w-full text-xs"
                      >
                        {line.replace(/\*\*/g, '')}
                      </button>
                    )
                  }
                  if (line.startsWith('🎯 **')) {
                    return <div key={i} className="font-semibold text-purple-400 mt-3 text-sm">{line.replace(/\*\*/g, '')}</div>
                  }
                  // Itens com bullet points
                  if (line.startsWith('•')) {
                    if (line.includes('HC-') || line.includes('caso')) {
                      return (
                        <button 
                          key={i} 
                          onClick={() => onPlanetClick('clinical')}
                          className="ml-4 text-gray-300 hover:text-white cursor-pointer hover:bg-gray-600/20 px-2 py-1 rounded transition-all text-left w-full text-xs"
                        >
                          {line}
                        </button>
                      )
                    }
                    return <div key={i} className="ml-4 text-gray-300 py-0.5 text-xs">{line}</div>
                  }
                  if (line.startsWith('❌') || line.startsWith('🔍')) {
                    return <div key={i} className="text-gray-400 text-xs">{line}</div>
                  }
                  return <div key={i} className="py-0.5 text-xs">{line}</div>
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-search card - Minimized and draggable */}
      {showSubSearch && subSearchResponse && subCardMinimized && (
        <div 
          className="fixed z-50 cursor-move transition-all duration-300 ease-in-out"
          style={{
            left: `${Math.max(20, Math.min(subCardPosition?.x || window.innerWidth - 350, window.innerWidth - 350))}px`,
            top: `${Math.max(350, Math.min(subCardPosition?.y || 400, window.innerHeight - 100))}px`,
            width: '320px'
          }}
          onMouseDown={onSubCardMouseDown}
        >
          <div className="bg-black/95 backdrop-blur-sm rounded-xl border border-purple-500/60 shadow-xl shadow-purple-500/30 animate-pulse-glow opacity-95">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center animate-pulse">
                  <i className="fas fa-search-plus text-purple-400 text-xs"></i>
                </div>
                <h3 className="text-purple-400 font-medium text-sm">
                  Sub-pesquisa: {subSearchQuery}
                </h3>
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" title="Conectado à análise principal"></div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={onToggleSubCard}
                  className="text-gray-400 hover:text-purple-400 transition-colors p-1"
                  title="Expandir"
                >
                  <i className="fas fa-chevron-up text-xs"></i>
                </button>
                <button 
                  onClick={onCloseSubSearch}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Fechar"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimized AI Card - Floating and draggable */}
      {aiResponse && aiCardMinimized && (
        <div 
          className="fixed z-50 cursor-move transition-all duration-300 ease-in-out"
          style={{
            left: `${Math.max(20, Math.min(cardPosition?.x || 50, window.innerWidth - 370))}px`,
            top: `${Math.max(180, Math.min(cardPosition?.y || 250, window.innerHeight - 100))}px`,
            width: '350px'
          }}
          onMouseDown={onMouseDown}
        >
          <div className={`bg-black/95 backdrop-blur-sm rounded-xl border shadow-xl animate-pulse-glow opacity-95 ${
            showSubSearch 
              ? 'border-neon-cyan/60 shadow-neon-cyan/30' 
              : 'border-neon-cyan/40 shadow-neon-cyan/20'
          }`}>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  showSubSearch 
                    ? 'bg-neon-cyan/30 animate-pulse' 
                    : 'bg-neon-cyan/20'
                }`}>
                  <i className="fas fa-robot text-neon-cyan text-xs animate-pulse"></i>
                </div>
                <h3 className="text-neon-cyan font-medium text-sm">
                  VerdiData IA: {aiSearchQuery || 'Análise'}
                </h3>
                {showSubSearch && (
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" title="Conectado à sub-pesquisa"></div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={onToggleAI}
                  className="text-gray-400 hover:text-neon-cyan transition-colors p-1"
                  title="Expandir"
                >
                  <i className="fas fa-chevron-up text-xs"></i>
                </button>
                <button 
                  onClick={onCloseAI}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Fechar"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </section>
  );
}
