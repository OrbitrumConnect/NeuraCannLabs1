import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle, MessageCircle, Send, Bot } from "lucide-react";
import MedicalAvatar3D from "./MedicalAvatar3D";
import MainCard from "./MainCard";
import CategoryCard from "./CategoryCard";

// Import the missing interface for proper typing
interface ScientificStudy {
  id: string;
  title: string;
  description: string;
  compound: string;
  indication: string;
  status: string;
}

interface ClinicalCase {
  id: string;
  caseNumber: string;
  description: string;
  indication: string;
  outcome: string;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  priority: string;
  readStatus: boolean;
}

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
    icon: "fas fa-flask",
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

export default function ImprovedCosmicMap({ onPlanetClick, activeDashboard, onSearch, onAIResponse }: CosmicMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [chatMode, setChatMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTabs, setSearchTabs] = useState<SearchTab[]>([]);
  const [subSearchTerm, setSubSearchTerm] = useState("");

  // Fetch real data from APIs with proper typing
  const { data: scientificData = [] } = useQuery<ScientificStudy[]>({ queryKey: ['/api/scientific'] });
  const { data: clinicalData = [] } = useQuery<ClinicalCase[]>({ queryKey: ['/api/clinical'] });
  const { data: alertsData = [] } = useQuery<Alert[]>({ queryKey: ['/api/alerts'] });

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
    setSearchTerm("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage, filter: selectedFilter })
      });

      const data = await response.json();

      const newTab: SearchTab = {
        id: `search-${Date.now()}`,
        query: userMessage,
        response: data.answer || 'Resposta não disponível',
        suggestions: data.suggestions || [],
        results: data.results || [],
        timestamp: Date.now(),
        type: 'main'
      };

      setSearchTabs([newTab]);
      
      if (onAIResponse) {
        onAIResponse(data.answer, data.suggestions, data.results, userMessage);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      const errorTab: SearchTab = {
        id: `search-${Date.now()}`,
        query: userMessage,
        response: 'Erro ao processar consulta. Tente novamente.',
        suggestions: [],
        results: [],
        timestamp: Date.now(),
        type: 'main'
      };
      setSearchTabs([errorTab]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubSearch = async (suggestion: string) => {
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: suggestion, filter: selectedFilter })
      });

      const data = await response.json();

      const newSubTab: SearchTab = {
        id: `sub-search-${Date.now()}`,
        query: suggestion,
        response: data.answer || 'Resposta não disponível',
        suggestions: data.suggestions || [],
        results: data.results || [],
        timestamp: Date.now(),
        type: 'sub',
        parentId: searchTabs.find(t => t.type === 'main')?.id
      };

      setSearchTabs(prev => [...prev, newSubTab]);
    } catch (error) {
      console.error('Erro na sub-pesquisa:', error);
    }
  };

  // Format result for MainCard
  const currentResult = searchTabs.find(tab => tab.type === 'main') ? {
    query: searchTabs.find(tab => tab.type === 'main')?.query || '',
    response: searchTabs.find(tab => tab.type === 'main')?.response || '',
    meta: {
      counts: {
        studies: scientificData?.length || 0,
        trials: clinicalData?.length || 0
      }
    },
    categories: {
      scientific: scientificData || [],
      clinical: clinicalData || [],
      alerts: alertsData || []
    }
  } : null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* Avatar Section - Left Side */}
      <div className="absolute top-8 left-8 w-80 h-80 z-20">
        <MedicalAvatar3D />
      </div>

      {/* Search Interface - Top Center */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-2xl">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          
          {/* Search Bar */}
          <form onSubmit={handleChatSubmit} className="flex items-center space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite sua consulta médica..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
                disabled={isTyping}
              />
            </div>
            <button
              type="submit"
              disabled={isTyping}
              className="px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all disabled:opacity-50"
            >
              {isTyping ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div> : <Send className="w-5 h-5" />}
            </button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all flex items-center space-x-1 ${
                  selectedFilter === filter.id
                    ? "bg-blue-600/80 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <filter.icon className="w-3 h-3" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Result Card */}
      {currentResult && (
        <div className="absolute top-64 left-1/2 transform -translate-x-1/2 z-20">
          <MainCard result={currentResult} />
          
          {/* Suggestions for Sub-search */}
          {searchTabs.find(tab => tab.type === 'main')?.suggestions && searchTabs.find(tab => tab.type === 'main')!.suggestions.length > 0 && (
            <div className="mt-4 p-3 bg-black/40 backdrop-blur-lg rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">🧠 Explore mais:</h4>
              <div className="flex flex-wrap gap-2">
                {searchTabs.find(tab => tab.type === 'main')!.suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubSearch(suggestion)}
                    className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded text-xs hover:bg-purple-600/30 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Cards - Stacked vertically on the right */}
      {currentResult && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 space-y-4" style={{ width: '380px' }}>
          
          {/* Scientific Studies */}
          {scientificData.length > 0 && (
            <div className="bg-blue-950/90 backdrop-blur-md rounded-lg border border-blue-500/40 p-4">
              <h3 className="text-sm font-semibold text-blue-300 flex items-center mb-3">
                <Microscope className="w-4 h-4 mr-2" />
                Estudos Científicos ({scientificData.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {scientificData.slice(0, 3).map((study, idx) => (
                  <div key={study.id} className="text-xs text-blue-200 p-2 bg-blue-900/40 rounded border-l-2 border-blue-400/60">
                    <div className="font-medium">{study.title}</div>
                    <div className="text-blue-300 mt-1">{study.description}</div>
                    <div className="text-blue-400 mt-1 text-xs">📍 {study.compound} • {study.indication}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Cases */}
          {clinicalData.length > 0 && (
            <div className="bg-green-950/90 backdrop-blur-md rounded-lg border border-green-500/40 p-4">
              <h3 className="text-sm font-semibold text-green-300 flex items-center mb-3">
                <Pill className="w-4 h-4 mr-2" />
                Casos Clínicos ({clinicalData.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {clinicalData.slice(0, 3).map((case_, idx) => (
                  <div key={case_.id} className="text-xs text-green-200 p-2 bg-green-900/40 rounded border-l-2 border-green-400/60">
                    <div className="font-medium">{case_.caseNumber}</div>
                    <div className="text-green-300 mt-1">{case_.description}</div>
                    <div className="text-green-400 mt-1 text-xs">👨‍⚕️ {case_.indication} • Resultado: {case_.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory Alerts */}
          {alertsData.length > 0 && (
            <div className="bg-red-950/90 backdrop-blur-md rounded-lg border border-red-500/40 p-4">
              <h3 className="text-sm font-semibold text-red-300 flex items-center mb-3">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alertas Regulatórios ({alertsData.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {alertsData.slice(0, 3).map((alert, idx) => (
                  <div key={alert.id} className="text-xs text-red-200 p-2 bg-red-900/40 rounded border-l-2 border-red-400/60">
                    <div className="font-medium">{alert.type}</div>
                    <div className="text-red-300 mt-1">{alert.message}</div>
                    <div className="text-red-400 mt-1 text-xs">🚨 Prioridade: {alert.priority}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-search Results - Left Side with better spacing */}
      {searchTabs.filter(tab => tab.type === 'sub').map((subTab, index) => (
        <div
          key={subTab.id}
          className="fixed left-8 z-30"
          style={{ 
            top: `${150 + (index * 200)}px`, 
            width: '300px',
            maxHeight: '180px'
          }}
        >
          <div className="bg-purple-950/90 backdrop-blur-md rounded-lg border border-purple-500/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-purple-300">
                🔍 {subTab.query.substring(0, 30)}...
              </h3>
              <button 
                onClick={() => setSearchTabs(prev => prev.filter(t => t.id !== subTab.id))}
                className="text-red-400 hover:text-red-300 text-lg"
              >
                ×
              </button>
            </div>
            <div className="text-xs text-purple-200 max-h-40 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ 
                __html: subTab.response.substring(0, 300).replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              }} />
            </div>
          </div>
        </div>
      ))}

      {/* Floating Planets - Now on the left */}
      {planets.map((planet, index) => (
        <div
          key={planet.id}
          className={`absolute ${planet.size} rounded-full bg-gradient-to-br ${planet.color} 
            cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50
            flex items-center justify-center text-white font-bold text-xs z-10
            ${hoveredPlanet === planet.id ? 'animate-pulse' : 'animate-float'}
            ${activeDashboard === planet.id ? 'ring-2 ring-cyan-400 shadow-cyan-400/50' : ''}
          `}
          style={{
            left: "20px",
            top: `${400 + (index * 80)}px`,
            animationDelay: planet.delay,
          }}
          onMouseEnter={() => setHoveredPlanet(planet.id)}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => onPlanetClick(planet.id)}
        >
          <i className={planet.icon}></i>
          {hoveredPlanet === planet.id && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {planet.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}