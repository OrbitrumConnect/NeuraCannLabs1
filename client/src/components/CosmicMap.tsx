import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle, MessageCircle, Send, Bot } from "lucide-react";
import MedicalAvatar3D from "./MedicalAvatar3D";
import TextToSpeech from "./TextToSpeech";

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
  
  // Fetch real data from APIs
  const { data: scientificData } = useQuery({ queryKey: ['/api/scientific'] });
  const { data: clinicalData } = useQuery({ queryKey: ['/api/clinical'] });
  const { data: alertsData } = useQuery({ queryKey: ['/api/alerts'] });

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
          query: userMessage,
          scientificData,
          clinicalData,
          alertsData
        }),
      });

      const result = await aiResponse.json();
      
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

      setChatMessages(prev => [...prev, { type: 'ai', message: result.answer }]);
      
      if (onAIResponse) {
        onAIResponse(result.answer, result.suggestions || [], result.relatedResults || [], userMessage);
      }
    } catch (error) {
      console.error('Erro na busca IA:', error);
      const fallbackTab: SearchTab = {
        id: `tab-${Date.now()}`,
        query: userMessage,
        response: `Análise cruzada sobre: "${userMessage}"\n\nDados da plataforma processados com sucesso.\n\nDesculpe, erro temporário no sistema. Tente novamente.`,
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
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      
      {/* Cosmic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-white rounded-full animate-ping opacity-20"></div>
        </div>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Cannabis Clinical Hub</h1>
              <span className="text-sm text-cyan-400 bg-cyan-400/20 px-2 py-1 rounded">v2.5 Neural</span>
            </div>
          </div>
        </div>
      </div>

      {/* Central Search Interface */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
        <div className="w-[800px] p-6">
          
          {/* Dr. Cannabis IA Avatar */}
          <div className="mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <MedicalAvatar3D />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/50">
                    <span className="text-xs text-cyan-400 font-medium">Dr. Cannabis IA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleChatSubmit} className="w-full mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pergunte sobre estudos, dosagens, eficácia..."
                className="w-full h-14 bg-black/60 border border-gray-600/30 rounded-lg px-6 pr-16 text-white placeholder-gray-400 focus:border-cyan-400/60 focus:outline-none text-base backdrop-blur-md"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !searchTerm.trim()}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 rounded-lg flex items-center justify-center transition-all disabled:cursor-not-allowed"
              >
                {isTyping ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                    selectedFilter === filter.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50'
                      : 'bg-gray-800/40 text-gray-400 border border-gray-600/30 hover:border-gray-500/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Data Summary */}
          <div className="text-center mb-8">
            <div className="bg-black/40 backdrop-blur-md border border-gray-600/30 rounded-lg px-4 py-3">
              <div className="text-sm text-gray-300">
                📊 Base de dados: <span className="text-blue-300">{scientificData?.length || 0} estudos</span> • 
                <span className="text-green-300 ml-2">{clinicalData?.length || 0} casos clínicos</span> • 
                <span className="text-red-300 ml-2">{alertsData?.length || 0} alertas</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Research Cards - Expandidos */}
      {searchTabs.filter(tab => tab.type === 'main').map((mainTab, index) => (
        <div
          key={mainTab.id}
          className="absolute z-40"
          style={{
            left: '50%',
            top: '300px',
            transform: 'translateX(-50%)',
            width: '1080px'
          }}
        >
          <div className="bg-black/95 backdrop-blur-md rounded-lg border border-cyan-400/60 shadow-lg shadow-cyan-400/20 p-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-cyan-400">
                Análise: {mainTab.query}
              </h3>
              <button 
                onClick={() => setSearchTabs(prev => prev.filter(t => t.id !== mainTab.id))}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              
              {/* Response */}
              <div className="text-lg text-gray-300 leading-relaxed max-h-80 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ 
                  __html: mainTab.response
                    .replace(/🔬|📊|🏥|⚠️|💊|🧠|🎯|•/g, '')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>')
                    .replace(/\n/g, '<br/>')
                }} />
              </div>

              {/* Text-to-Speech */}
              <div className="mb-4">
                <TextToSpeech 
                  text={`Análise sobre ${mainTab.query}: ${mainTab.response
                    .replace(/[🔬📊🏥⚠️💊🧠🎯•→]/g, '')
                    .replace(/\*\*/g, '')
                    .replace(/\n/g, ' ')
                    .replace(/ANÁLISE CRUZADA DE DADOS - /g, '')
                    .substring(0, 300)
                    .trim()
                  }`}
                  className="text-sm"
                />
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-900/30 p-4 rounded border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-300">{scientificData?.length || 0}</div>
                  <div className="text-sm text-blue-400">Estudos Científicos</div>
                </div>
                <div className="bg-green-900/30 p-4 rounded border border-green-500/30">
                  <div className="text-2xl font-bold text-green-300">{clinicalData?.length || 0}</div>
                  <div className="text-sm text-green-400">Casos Clínicos</div>
                </div>
                <div className="bg-red-900/30 p-4 rounded border border-red-500/30">
                  <div className="text-2xl font-bold text-red-300">{alertsData?.length || 0}</div>
                  <div className="text-sm text-red-400">Alertas Ativos</div>
                </div>
              </div>

              {/* Sub-search Suggestions */}
              {mainTab.suggestions && mainTab.suggestions.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {mainTab.suggestions.slice(0, 4).map((suggestion, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSubSearch(suggestion, mainTab.id)}
                      className="px-3 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded text-sm hover:bg-purple-600/30 transition-all text-left"
                    >
                      🔍 {suggestion}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      ))}

      {/* Data Cards - Neural Structure */}
      {searchTabs.length > 0 && (
        <>
          {/* Scientific Studies */}
          {scientificData && scientificData.length > 0 && (
            <div className="absolute bottom-20 left-8 z-40">
              <div className="w-80 bg-blue-950/90 backdrop-blur-md rounded-lg border border-blue-500/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-blue-300 flex items-center">
                    <Microscope className="w-4 h-4 mr-2" />
                    Estudos Científicos ({scientificData.length})
                  </h3>
                  <TextToSpeech 
                    text={`${scientificData.length} estudos científicos: ${scientificData.map((s: any) => s.title).join(', ')}`}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {scientificData.map((study: any, idx: number) => (
                    <div key={idx} className="text-xs text-blue-200 p-2 bg-blue-900/40 rounded border-l-2 border-blue-400/60">
                      <div className="font-medium">{study.title}</div>
                      <div className="text-blue-300 mt-1">{study.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clinical Cases */}
          {clinicalData && clinicalData.length > 0 && (
            <div className="absolute bottom-20 left-96 z-40">
              <div className="w-80 bg-green-950/90 backdrop-blur-md rounded-lg border border-green-500/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-green-300 flex items-center">
                    <Pill className="w-4 h-4 mr-2" />
                    Casos Clínicos ({clinicalData.length})
                  </h3>
                  <TextToSpeech 
                    text={`${clinicalData.length} casos clínicos: ${clinicalData.map((c: any) => c.caseNumber).join(', ')}`}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {clinicalData.map((case_: any, idx: number) => (
                    <div key={idx} className="text-xs text-green-200 p-2 bg-green-900/40 rounded border-l-2 border-green-400/60">
                      <div className="font-medium">{case_.caseNumber}</div>
                      <div className="text-green-300 mt-1">{case_.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Regulatory Alerts */}
          {alertsData && alertsData.length > 0 && (
            <div className="absolute bottom-20 right-8 z-40">
              <div className="w-80 bg-red-950/90 backdrop-blur-md rounded-lg border border-red-500/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-red-300 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Alertas Regulatórios ({alertsData.length})
                  </h3>
                  <TextToSpeech 
                    text={`${alertsData.length} alertas regulatórios: ${alertsData.map((a: any) => a.message).join(', ')}`}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {alertsData.map((alert: any, idx: number) => (
                    <div key={idx} className="text-xs text-red-200 p-2 bg-red-900/40 rounded border-l-2 border-red-400/60">
                      <div className="font-medium">{alert.type}</div>
                      <div className="text-red-300 mt-1">{alert.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Sub-search Cards */}
      {searchTabs.filter(tab => tab.type === 'sub').map((subTab, index) => (
        <div
          key={subTab.id}
          className="absolute z-50"
          style={{
            right: '20px',
            top: `${300 + (index * 280)}px`
          }}
        >
          <div className="w-96 bg-purple-950/90 backdrop-blur-md rounded-lg border border-purple-500/40 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-purple-300">
                Sub-pesquisa: {subTab.query.substring(0, 25)}...
              </h3>
              <button 
                onClick={() => setSearchTabs(prev => prev.filter(t => t.id !== subTab.id))}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-purple-200 leading-relaxed max-h-40 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ 
                __html: subTab.response
                  .replace(/[🔬📊🏥⚠️💊🧠🎯•→]/g, '')
                  .replace(/\*\*/g, '')
                  .substring(0, 300)
                  .replace(/\n/g, '<br/>') 
              }} />
            </div>
          </div>
        </div>
      ))}

      {/* Floating Planets */}
      {planets.map((planet) => {
        const isActive = activeDashboard === planet.id;
        const isHovered = hoveredPlanet === planet.id;

        return (
          <div
            key={planet.id}
            className={`absolute ${planet.size} z-30 cursor-pointer transition-all duration-300 ${
              isActive ? 'scale-125' : isHovered ? 'scale-110' : 'scale-100'
            }`}
            style={planet.position}
            onClick={() => onPlanetClick(planet.id)}
            onMouseEnter={() => setHoveredPlanet(planet.id)}
            onMouseLeave={() => setHoveredPlanet(null)}
          >
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${planet.color} animate-pulse shadow-lg ${
              isActive ? 'ring-4 ring-white/50' : isHovered ? 'ring-2 ring-white/30' : ''
            }`}></div>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                isActive ? 'bg-white/90 text-black' : 'bg-black/80 text-white/80'
              }`}>
                {planet.name}
              </div>
            </div>
          </div>
        );
      })}

    </div>
  );
}