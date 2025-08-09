import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle, MessageCircle, Send, Bot } from "lucide-react";
import MedicalAvatar3D from "./MedicalAvatar3D";
import MainCard from "./MainCard";
import TextToSpeech from "./TextToSpeech";

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
    size: "w-11 h-11",
    color: "from-cyan-400 to-blue-600",
    icon: "fas fa-flask",
    delay: "0s",
  },
  {
    id: "clinical",
    name: "Casos Clínicos",
    position: { top: "35%", right: "5%" },
    size: "w-11 h-11", 
    color: "from-blue-400 to-indigo-600",
    icon: "fas fa-user-md",
    delay: "0s",
  },
  {
    id: "alerts",
    name: "Alertas",
    position: { top: "50%", right: "5%" },
    size: "w-9 h-9",
    color: "from-orange-400 to-red-500",
    icon: "fas fa-bell",
    delay: "0s",
  },
  {
    id: "profile",
    name: "Perfil",
    position: { top: "65%", right: "5%" },
    size: "w-9 h-9",
    color: "from-purple-400 to-pink-500",
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
  const [isDrAIActive, setIsDrAIActive] = useState(false);

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
      
      {/* Dr. Cannabis IA - Avatar moved to center-left to avoid menu conflict */}
      <div className="absolute top-32 left-1/4 transform -translate-x-1/2 w-72 h-72 z-20">
        <div 
          className={`w-72 h-72 cursor-pointer transition-all duration-500 flex items-center justify-center ${
            isDrAIActive 
              ? 'scale-105 drop-shadow-2xl filter brightness-75 saturate-50 grayscale-[30%]' 
              : 'hover:scale-102 drop-shadow-lg'
          }`}
          onClick={() => setIsDrAIActive(!isDrAIActive)}
          style={{
            filter: isDrAIActive 
              ? 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.2))' 
              : 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.1))'
          }}
        >
          <div 
            style={{
              filter: isDrAIActive 
                ? 'brightness(0.75) saturate(0.5) grayscale(30%)' 
                : 'none'
            }}
          >
            <MedicalAvatar3D className="w-40" />
          </div>
        </div>
      </div>

      {/* Search Interface - Same position on all devices - Only show when Dr AI is active */}
      {isDrAIActive && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-2xl px-4 sm:px-0">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-4 sm:p-6">
            
            {/* Search Bar */}
            <form onSubmit={handleChatSubmit} className="flex items-center space-x-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite sua consulta médica..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 text-sm sm:text-base"
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
      )}

      {/* Main Result Card - Only show when Dr AI is active */}
      {isDrAIActive && currentResult && (
        <div className="absolute top-64 left-1/2 transform -translate-x-1/2 z-20">
          <MainCard result={currentResult} />
          {/* TextToSpeech já está integrado no MainCard, não precisa duplicar aqui */}
          
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

      {/* Tela principal limpa - sem cards de dados que devem ficar no dashboard */}

      {/* Sub-search Results - Left Side positioned lower - Only show when Dr AI is active */}
      {isDrAIActive && searchTabs.filter(tab => tab.type === 'sub').map((subTab, index) => (
        <div
          key={subTab.id}
          className="fixed left-8 z-30"
          style={{ 
            top: `${280 + (index * 200)}px`, 
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
                onClick={() => {
                  // Stop any ongoing speech synthesis when closing card
                  window.speechSynthesis.cancel();
                  setSearchTabs(prev => prev.filter(t => t.id !== subTab.id));
                }}
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
            
            {/* TextToSpeech para sub-pesquisas */}
            <div className="mt-2 flex justify-center">
              <TextToSpeech text={subTab.response} />
            </div>
          </div>
        </div>
      ))}

{/* Planets removed - clean area above search bar */}
    </div>
  );
}