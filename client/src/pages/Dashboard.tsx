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
        
        // Limitar movimento dentro da tela - deixar espaço para header
        const maxX = window.innerWidth - 370;
        const maxY = window.innerHeight - 100;
        const minY = 64; // Altura mínima para não sobrepor header
        
        setCardPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY))
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
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
  }, [isDragging, aiCardMinimized, dragStart]);

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
    // Reset position when new response comes - position below search bar
    setCardPosition({ x: 300, y: 200 });
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
    setCardPosition({ x: 300, y: 200 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (aiCardMinimized) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - (cardPosition.x || 300),
        y: e.clientY - (cardPosition.y || 200)
      });
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
}

function OverviewDashboard({ onPlanetClick, activeDashboard, onSearch, onAIResponse, aiResponse, aiResults, onCloseAI, aiCardMinimized, onToggleAI, aiSearchQuery, cardPosition, onMouseDown, isDragging }: OverviewDashboardProps) {
  return (
    <section className="relative container mx-auto px-4 py-8">
      {/* Hero Section with 3D Avatar */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
        {/* Welcome Message - Moved to left */}
        <div className="text-center lg:text-left lg:mr-8 mb-8 lg:mb-0">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Bem-vindo ao</span>
            <span className="neon-text block">Futuro da Medicina</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            Plataforma avançada para análise científica, casos clínicos e descobertas em cannabis medicinal
          </p>
          <button 
            className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 animate-pulse-glow"
            data-testid="explore-platform-button"
          >
            <i className="fas fa-rocket mr-2" />
            Explorar Plataforma
          </button>
        </div>
        
        {/* 3D Avatar - Moved to right */}
        <div className="relative">
          <Avatar3D className="w-32 h-32" size={150} />
        </div>
      </div>

      {/* Cosmic Knowledge Map */}
      <div className="mb-12">
        <CosmicMap onPlanetClick={onPlanetClick} activeDashboard={activeDashboard} onSearch={onSearch} onAIResponse={onAIResponse} />
      </div>



      {/* Floating Movable AI Card */}
      {aiResponse && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            aiCardMinimized ? 'cursor-move' : ''
          }`}
          style={{
            bottom: aiCardMinimized ? 'auto' : '24px',
            right: aiCardMinimized ? 'auto' : '24px',
            left: aiCardMinimized ? `${Math.max(0, Math.min(cardPosition?.x || 300, window.innerWidth - 370))}px` : 'auto',
            top: aiCardMinimized ? `${Math.max(64, Math.min(cardPosition?.y || 200, window.innerHeight - 100))}px` : 'auto'
          }}
          onMouseDown={onMouseDown}
        >
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl border border-neon-cyan/40 shadow-2xl shadow-neon-cyan/20 animate-pulse-glow animate-float-gentle" style={{
            width: aiCardMinimized ? '350px' : '650px',
            maxHeight: aiCardMinimized ? '64px' : '70vh',
            opacity: aiCardMinimized ? '0.97' : '1'
          }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-neon-cyan text-sm animate-pulse"></i>
                </div>
                <h3 className="text-neon-cyan font-semibold text-sm">
                  {aiCardMinimized ? `VerdiData IA: ${aiSearchQuery || 'Análise'}` : 'VerdiData IA - Análise Científica'}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onToggleAI}
                  className="text-gray-400 hover:text-neon-cyan transition-colors p-1"
                  title={aiCardMinimized ? "Expandir" : "Minimizar"}
                >
                  <i className={`fas ${aiCardMinimized ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs`}></i>
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
            
            {/* Content - Hidden when minimized */}
            {!aiCardMinimized && (
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="whitespace-pre-line leading-relaxed text-gray-100 text-sm">
                  {aiResponse.split('\n').map((line, i) => {
                    // Títulos de estudos clicáveis
                    if (line.startsWith('🔬 **') || line.startsWith('📊 **')) {
                      const title = line.replace(/\*\*/g, '').replace('🔬 ', '').replace('📊 ', '');
                      return (
                        <button 
                          key={i} 
                          onClick={() => onPlanetClick('scientific')}
                          className="font-semibold text-emerald-400 hover:text-emerald-300 mt-3 block cursor-pointer underline decoration-dotted hover:bg-emerald-500/10 px-2 py-1 rounded transition-all text-left w-full text-sm"
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
                          className="font-semibold text-purple-400 hover:text-purple-300 mt-3 block cursor-pointer underline decoration-dotted hover:bg-purple-500/10 px-2 py-1 rounded transition-all text-left w-full text-sm"
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
                          className="font-semibold text-amber-400 hover:text-amber-300 mt-3 block cursor-pointer underline decoration-dotted hover:bg-amber-500/10 px-2 py-1 rounded transition-all text-left w-full text-sm"
                        >
                          {line.replace(/\*\*/g, '')}
                        </button>
                      )
                    }
                    if (line.startsWith('🎯 **')) {
                      return <div key={i} className="font-semibold text-neon-cyan mt-3 text-sm">{line.replace(/\*\*/g, '')}</div>
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
            )}
          </div>
        </div>
      )}


    </section>
  );
}
