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


  useEffect(() => {
    if (section) {
      setActiveDashboard(section);
    }
  }, [section]);

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

  const handleAIResponse = (response: string, suggestions: string[], results: any[]) => {
    setAiResponse(response);
    setAiSuggestions(suggestions);
    setAiResults(results);
  };

  const closeAiCard = () => {
    setAiResponse("");
    setAiSuggestions([]);
    setAiResults([]);
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
  onAIResponse?: (response: string, suggestions: string[], results: any[]) => void;
  aiResponse?: string;
  aiResults?: any[];
  onCloseAI?: () => void;
}

function OverviewDashboard({ onPlanetClick, activeDashboard, onSearch, onAIResponse, aiResponse, aiResults, onCloseAI }: OverviewDashboardProps) {
  return (
    <section className="container mx-auto px-4 py-8">
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



      {/* AI Response Area - Fixed position */}
      {aiResponse && (
        <div className="mt-16 pt-8 border-t border-gray-700/30">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-neon-cyan/40 shadow-2xl shadow-neon-cyan/20 animate-pulse-glow animate-float-gentle">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-neon-cyan text-sm animate-pulse"></i>
                </div>
                <h3 className="text-neon-cyan font-semibold text-lg">VerdiData IA - Análise Científica</h3>
              </div>
              <button 
                onClick={onCloseAI}
                className="text-gray-400 hover:text-red-400 transition-colors p-2"
                title="Fechar"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            
            <div className="whitespace-pre-line leading-relaxed text-gray-100 max-h-[60vh] overflow-y-auto">
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
                        className="ml-6 text-gray-300 hover:text-white cursor-pointer hover:bg-gray-600/20 px-3 py-2 rounded transition-all text-left w-full"
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

            {/* Related Sources */}
            {aiResults && aiResults.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <h4 className="text-sm font-medium text-gray-400 mb-3">📚 Fontes consultadas:</h4>
                <div className="grid gap-3">
                  {aiResults.slice(0, 3).map((result, index) => (
                    <button 
                      key={index} 
                      onClick={() => {
                        if (result.type === 'study') onPlanetClick('scientific');
                        if (result.type === 'case') onPlanetClick('clinical'); 
                        if (result.type === 'alert') onPlanetClick('alerts');
                      }}
                      className="text-left p-3 bg-gray-900/50 hover:bg-gray-800/60 rounded border border-gray-600/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {result.type === 'study' && <i className="fas fa-microscope text-emerald-400 text-sm"></i>}
                        {result.type === 'case' && <i className="fas fa-user-md text-purple-400 text-sm"></i>}
                        {result.type === 'alert' && <i className="fas fa-exclamation-triangle text-amber-400 text-sm"></i>}
                        <span className="text-gray-300 font-medium text-sm">
                          {result.type === 'study' && 'Estudo Científico'}
                          {result.type === 'case' && 'Caso Clínico'}
                          {result.type === 'alert' && 'Alerta Regulatório'}
                        </span>
                        <span className="text-gray-500 text-xs">({Math.round(result.relevance * 100)}% relevância)</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {result.data.title || result.data.description || result.data.message}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


    </section>
  );
}
