import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useScan } from "@/contexts/ScanContext";
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle, MessageCircle, Send, Bot } from "lucide-react";
import MedicalAvatar3D from "./MedicalAvatar3D";
import MainCard from "./MainCard";
import TextToSpeech from "./TextToSpeech";
import { AvatarThoughtBubble } from "./AvatarThoughtBubble";

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

export default function ImprovedCosmicMap({ onPlanetClick, activeDashboard, onSearch }: CosmicMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [chatMode, setChatMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTabs, setSearchTabs] = useState<SearchTab[]>([]);
  const [subSearchTerm, setSubSearchTerm] = useState("");
  const [isDrAIActive, setIsDrAIActive] = useState(false);
  const { avatarScanning } = useScan();

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
    <div className="relative w-full min-h-screen">
      
      {/* Dr. Cannabis IA - Mobile friendly positioning */}
      <div className="flex justify-center pt-8 sm:absolute sm:top-8 sm:-left-4 sm:w-72 sm:h-72 z-20">
        <div 
          className={`cursor-pointer transition-all duration-500 flex items-center justify-center relative ${
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
          {/* Avatar Thought Bubble */}
          <AvatarThoughtBubble 
            isActive={isDrAIActive}
            context={isTyping ? 'searching' : (isDrAIActive ? 'overview' : 'idle')}
            className="absolute"
          />
          
          <div 
            style={{
              filter: isDrAIActive 
                ? 'brightness(0.75) saturate(0.5) grayscale(30%)' 
                : 'none'
            }}
          >
            <MedicalAvatar3D className="w-20 sm:w-40" isScanning={avatarScanning} />
          </div>
          
          {!isDrAIActive && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center sm:hidden">
              <p className="text-xs text-cyan-400">Toque para ativar</p>
            </div>
          )}
        </div>
      </div>

      {/* Search Interface - Clean mobile flow, Desktop overlay - Only show when Dr AI is active */}
      {isDrAIActive && (
        <div className="mt-8 mx-3 sm:absolute sm:top-8 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-30 w-full max-w-2xl sm:px-0">
          <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-white/10 p-3 sm:p-6">
            
            {/* Search Bar */}
            <form onSubmit={handleChatSubmit} className="flex items-center space-x-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite sua consulta médica..."
                  className="w-full pl-8 pr-3 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 text-sm"
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={isTyping}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {isTyping ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Send className="w-4 h-4" />}
              </button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-2 py-1 rounded-full text-xs transition-all flex items-center space-x-1 ${
                    selectedFilter === filter.id
                      ? "bg-blue-600/80 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <filter.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Result Card - Mobile sequential, Desktop positioned - Only show when Dr AI is active */}
      {isDrAIActive && currentResult && (
        <div className="relative mt-4 mx-3 sm:absolute sm:top-64 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-20 sm:px-0">
          <MainCard result={currentResult} />
          {/* TextToSpeech já está integrado no MainCard, não precisa duplicar aqui */}
          
          {/* Suggestions for Sub-search - Responsive layout */}
          {searchTabs.find(tab => tab.type === 'main')?.suggestions && searchTabs.find(tab => tab.type === 'main')!.suggestions.length > 0 && (
            <div className="mt-3 p-2 sm:p-3 bg-black/40 backdrop-blur-lg rounded-lg border border-white/10">
              <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">🧠 Explore mais:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
                {searchTabs.find(tab => tab.type === 'main')!.suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubSearch(suggestion)}
                    className="px-2 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded text-xs hover:bg-purple-600/30 transition-all text-left sm:text-center"
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

      {/* Sub-search Results - Responsive positioning - Only show when Dr AI is active */}
      {isDrAIActive && searchTabs.filter(tab => tab.type === 'sub').map((subTab, index) => (
        <div
          key={subTab.id}
          className="relative mt-3 mx-3 sm:fixed sm:left-8 z-30 sm:z-30"
          style={{ 
            top: window.innerWidth >= 640 ? `${280 + (index * 200)}px` : 'auto',
            width: window.innerWidth >= 640 ? '280px' : 'auto',
            maxHeight: '160px'
          }}
        >
          <div className="bg-purple-950/90 backdrop-blur-md rounded-lg border border-purple-500/40 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-purple-300 truncate pr-2">
                🔍 {subTab.query.substring(0, 15)}...
              </h3>
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setSearchTabs(prev => prev.filter(t => t.id !== subTab.id));
                }}
                className="text-red-400 hover:text-red-300 text-base flex-shrink-0 w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="text-xs text-purple-200 max-h-24 sm:max-h-32 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ 
                __html: subTab.response.substring(0, 150).replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
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