import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { useScan } from "@/contexts/ScanContext";
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle, MessageCircle, Send, Bot } from "lucide-react";
// import MedicalAvatar3D from "./MedicalAvatar3D"; // Substituído pela imagem da Dra. Cannabis IA
import MainCard from "./MainCard";
import TextToSpeech from "./TextToSpeech";
import { AvatarThoughtBubble } from "./AvatarThoughtBubble";
// import { VoiceGreetingIndicator } from "./VoiceGreetingIndicator"; // DESABILITADO - usando apenas Dra. Cannabis IA moderna
// Voice commands removido conforme solicitado
import { ConversationIndicator } from "./ConversationIndicator";
import { ConversationManager } from "./ConversationManager";
import { useVoiceGreeting } from "@/hooks/useVoiceGreeting";
import { useConversations } from "@/hooks/useConversations";

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
    size: "w-9 h-9 sm:w-11 sm:h-11",
    color: "from-cyan-400 to-blue-600",
    icon: "fas fa-flask",
    delay: "0s",
  },
  {
    id: "clinical",
    name: "Casos Clínicos",
    position: { top: "35%", right: "5%" },
    size: "w-9 h-9 sm:w-11 sm:h-11", 
    color: "from-blue-400 to-indigo-600",
    icon: "fas fa-user-md",
    delay: "0s",
  },
  {
    id: "alerts",
    name: "Alertas",
    position: { top: "50%", right: "5%" },
    size: "w-7 h-7 sm:w-9 sm:h-9",
    color: "from-orange-400 to-red-500",
    icon: "fas fa-bell",
    delay: "0s",
  },
  {
    id: "profile",
    name: "Perfil",
    position: { top: "65%", right: "5%" },
    size: "w-7 h-7 sm:w-9 sm:h-9",
    color: "from-purple-400 to-pink-500",
    icon: "fas fa-user-circle",
    delay: "0s",
  },
];

export default function ImprovedCosmicMap({ onPlanetClick, activeDashboard, onSearch }: CosmicMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Filter state removido
  const [chatMode, setChatMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTabs, setSearchTabs] = useState<SearchTab[]>([]);
  const [subSearchTerm, setSubSearchTerm] = useState("");
  const [isDrAIActive, setIsDrAIActive] = useState(false);
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [isMainCardMinimized, setIsMainCardMinimized] = useState(false);
  const [studyNotes, setStudyNotes] = useState("");
  const [studyTitle, setStudyTitle] = useState("");
  const [currentStudyTopic, setCurrentStudyTopic] = useState("");
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [mainCardMode, setMainCardMode] = useState<'search' | 'study'>('search'); // Controla se mostra pesquisa ou estudo
  const { avatarScanning } = useScan();
  
  // Voice commands removido conforme solicitado
  const {
    conversations,
    currentConversation,
    createNewConversation,
    addMessage,
    deleteConversation,
    selectConversation,
    mergeConversations,
    createDocument,
    createSynthesis,
    clearCurrentConversation
  } = useConversations();

  // Voice greeting para detectar quando o avatar está falando
  const { isPlaying: isAvatarSpeaking } = useVoiceGreeting();

  // Fetch real data from APIs with proper typing
  const { data: scientificData = [] } = useQuery<ScientificStudy[]>({ queryKey: ['/api/scientific'] });
  const { data: clinicalData = [] } = useQuery<ClinicalCase[]>({ queryKey: ['/api/clinical'] });
  const { data: alertsData = [] } = useQuery<Alert[]>({ queryKey: ['/api/alerts'] });

  // Load saved draft on component mount
  useEffect(() => {
    const saved = localStorage.getItem('study_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setStudyTitle(draft.title || '');
        setStudyNotes(draft.notes || '');
        setCurrentStudyTopic(draft.topic || '');
      } catch (error) {
        console.error('Error loading saved draft:', error);
      }
    }
  }, []);

  // Auto-abrir rascunho quando há conversação ativa (CORREÇÃO CRÍTICA)
  useEffect(() => {
    const hasActiveConversation = currentConversation?.messages && currentConversation.messages.length > 0;
    
    if (hasActiveConversation && isDrAIActive) {
      // Automaticamente ativa o modo estudo e mostra o rascunho SEM clicar "Ver"
      setMainCardMode('study');
      setShowConversationHistory(true);
      // Mantém o card aberto para mostrar o rascunho diretamente
      setIsMainCardMinimized(false);
    }
  }, [currentConversation?.messages, isDrAIActive]);

  // Remover useEffect - voice commands agora é direto no input

  // Escuta evento para forçar abertura do card principal
  useEffect(() => {
    const handleForceOpenMainCard = (event: CustomEvent) => {
      if (event.detail?.conversation) {
        // Ativa o Dr AI para mostrar o card principal
        setIsDrAIActive(true);
        
        // Se não há resultado atual, cria um resultado básico para mostrar o card
        if (!currentResult && event.detail.conversation.messages.length > 0) {
          const lastMessage = event.detail.conversation.messages[event.detail.conversation.messages.length - 1];
          setCurrentResult(lastMessage.content || 'Conversa anterior carregada');
        }
        
        // Abre o card minimizado para permitir ver "Explorar mais" e "Estudos"
        setIsMainCardMinimized(true);
      }
    };

    window.addEventListener('forceOpenMainCard', handleForceOpenMainCard as EventListener);
    
    return () => {
      window.removeEventListener('forceOpenMainCard', handleForceOpenMainCard as EventListener);
    };
  }, [currentResult]);

  // Filtros removidos para economizar espaço na interface

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isTyping) return;

    const userMessage = searchTerm;
    
    // Ativar Dr AI quando fazer pesquisa (correção para mostrar opções)
    setIsDrAIActive(true);
    
    // Garantir que o card principal abre automaticamente ao pesquisar
    setIsMainCardMinimized(false);
    setMainCardMode('search');
    
    // Update current study topic when searching
    setCurrentStudyTopic(userMessage);
    
    // Auto-set study title if empty
    if (!studyTitle.trim()) {
      setStudyTitle(`Estudo sobre ${userMessage}`);
    }
    
    setSearchTerm("");
    setIsTyping(true);

    // Adicionar mensagem do usuário
    addMessage({ role: 'user', content: userMessage, timestamp: Date.now() });

    try {
      const response = await fetch('/api/doctor/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userMessage, 
          context: 'cross_study_research'
        })
      });

      const data = await response.json();
      const assistantResponse = data.response || 'Resposta não disponível';

      // Adicionar resposta da IA
      addMessage({ role: 'assistant', content: assistantResponse, timestamp: Date.now() });

      // Estruturar dados completos para o MainCard
      const structuredResult = {
        query: userMessage,
        response: assistantResponse,
        meta: {
          counts: {
            studies: data.results?.studies?.length || 0,
            trials: data.results?.cases?.length || 0
          }
        },
        categories: {
          scientific: data.results?.studies || [],
          clinical: data.results?.cases || [], 
          alerts: data.results?.alerts || []
        }
      };

      // Atualizar resultado atual com dados estruturados (convert to string)
      setCurrentResult(JSON.stringify(structuredResult));
      setMainCardMode('search'); // Força modo pesquisa ao fazer nova pesquisa

      const newTab: SearchTab = {
        id: `search-${Date.now()}`,
        query: userMessage,
        response: assistantResponse,
        suggestions: data.suggestions || [],
        results: data.results || [],
        timestamp: Date.now(),
        type: 'main'
      };

      setSearchTabs([newTab]);
    } catch (error) {
      console.error('Erro na busca:', error);
      const errorResponse = 'Erro ao processar consulta. Tente novamente.';
      
      // Adicionar erro ao histórico também
      addMessage({ role: 'assistant', content: errorResponse, timestamp: Date.now() });
      
      const errorTab: SearchTab = {
        id: `search-${Date.now()}`,
        query: userMessage,
        response: errorResponse,
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
        body: JSON.stringify({ query: suggestion, filter: 'todos' })
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

  // Gerar objeto formatado com dados REAIS da plataforma para MainCard  
  const formattedResult = currentResult ? {
    query: searchTabs.find(tab => tab.type === 'main')?.query || '',
    response: currentResult,
    meta: {
      counts: {
        studies: scientificData.length, // Dados reais da API
        trials: clinicalData.length,    // Dados reais da API
        alerts: alertsData.length       // Dados reais da API
      }
    },
    categories: {
      scientific: scientificData,  // Dados reais completos
      clinical: clinicalData,      // Dados reais completos 
      alerts: alertsData           // Dados reais completos
    },
    // Resumo automático dos dados cruzados
    crossDataSummary: `Análise cruzada atual: ${scientificData.length} estudos científicos, ${clinicalData.length} casos clínicos e ${alertsData.length} alertas regulatórios. NOA ESPERANÇA identifica correlações entre ${scientificData.filter(s => s.compound?.includes('CBD')).length} estudos com CBD, ${clinicalData.filter(c => c.indication?.includes('epilepsia')).length} casos de epilepsia e alertas recentes da ANVISA.`
  } : {
    // Dados iniciais quando não há pesquisa ativa
    query: 'Dashboard de Estudos Cruzados',
    response: 'NOA ESPERANÇA - Inteligência Principal ativa. Dados da plataforma carregados para análise cruzada.',
    meta: {
      counts: {
        studies: scientificData.length,
        trials: clinicalData.length,
        alerts: alertsData.length
      }
    },
    categories: {
      scientific: scientificData,
      clinical: clinicalData,
      alerts: alertsData
    },
    crossDataSummary: `Base de conhecimento atual: ${scientificData.length} estudos científicos, ${clinicalData.length} casos clínicos e ${alertsData.length} alertas. NOA está preparada para análise cruzada e correlações médicas precisas.`
  };

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
            className={`relative transition-all duration-300 ${
              isAvatarSpeaking ? 'animate-pulse filter brightness-110' : ''
            }`}
            style={{
              filter: isDrAIActive 
                ? 'brightness(0.75) saturate(0.5) grayscale(30%)' 
                : 'none'
            }}
          >
            <img 
              src="/dra-cannabis-nova.png" 
              alt="Dra. Cannabis IA - Estudos Cruzados" 
              className={`
                w-16 sm:w-40 h-16 sm:h-40
                rounded-lg object-contain shadow-2xl 
                bg-transparent
                transition-all duration-500
                ${avatarScanning ? 'drop-shadow-lg animate-pulse' : ''}
                ${isDrAIActive ? 'filter brightness-75 saturate-50 grayscale-[30%]' : ''}
              `}
              style={{
                filter: avatarScanning 
                  ? 'drop-shadow(0 0 15px rgba(255, 235, 59, 0.6))' 
                  : 'none'
              }}
            />
            
            {/* Badge IA Status */}
            {isDrAIActive && (
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                <div className="bg-green-500 text-white text-xs px-1 sm:px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-lg">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium">IA</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Texto "Toque para ativar" removido - interface limpa */}
        </div>
      </div>

      {/* Search Interface - Clean mobile flow, Desktop overlay - Only show when Dr AI is active */}
      {isDrAIActive && (
        <div className="mt-8 mx-3 sm:absolute sm:top-8 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-30 w-full max-w-2xl sm:px-0">
          <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-white/10 p-3 sm:p-6">
            
            {/* Conversation Indicator */}
            <ConversationIndicator 
              messageCount={currentConversation?.messages.length || 0}
              messages={currentConversation?.messages || []}
              onClear={() => {
                createNewConversation();
                // Limpar a pesquisa atual
                setSearchTabs([]);
                setCurrentResult(null);
                setSearchTerm("");
                setMainCardMode('search'); // Reset para pesquisa
                setShowConversationHistory(false); // Fecha o chat de estudos
                setIsMainCardMinimized(false); // Card principal abre normal
              }}
              onToggleHistory={() => {
                if (!showConversationHistory) {
                  // Quando clica "Ver": ativa o chat de estudos
                  setMainCardMode('study');
                  setShowConversationHistory(true);
                  setIsMainCardMinimized(false); // Abre o card
                } else {
                  // Quando clica "Pesquisar": volta para o modo pesquisa
                  setMainCardMode('search');
                  setShowConversationHistory(false);
                  setIsMainCardMinimized(false); // Mantém o card aberto
                }
              }}
              showingHistory={showConversationHistory}
              onMinimizeMainCard={() => setIsMainCardMinimized(true)}
            />
            


            {/* Search Bar */}
            <form onSubmit={handleChatSubmit} className="flex items-center space-x-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={currentConversation?.messages.length ? "Continue a conversa..." : "Digite sua consulta médica..."}
                  className="w-full pl-8 pr-10 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 text-sm"
                  disabled={isTyping}
                />
                {/* Voice Command Button integrado na barra de pesquisa */}
                {/* Voice commands removido conforme solicitado */}
              </div>
              <button
                type="submit"
                disabled={isTyping}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {isTyping ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Send className="w-4 h-4" />}
              </button>
            </form>


          </div>
        </div>
      )}

      {/* Main Result Card - Mobile sequential, Desktop positioned - Only show when Dr AI is active */}
      {isDrAIActive && formattedResult && (
        <div className="relative mt-4 mx-3 sm:absolute sm:top-64 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-20 sm:px-0">
          <MainCard 
            result={formattedResult} 
            isMinimized={isMainCardMinimized}
            onToggleMinimize={() => setIsMainCardMinimized(!isMainCardMinimized)}
            onClose={() => {
              // Fechar o card principal
              setSearchTabs([]);
              setCurrentResult(null);
              setSearchTerm("");
              setMainCardMode('search');
              setIsMainCardMinimized(false);
            }}
          />
          {/* Mode Toggle Buttons - Mostrar apenas quando o card está minimizado */}
          {isMainCardMinimized && (
            <div className="mt-2 flex gap-1.5 sm:gap-2 justify-center">
              <button
                onClick={() => {
                  setMainCardMode('search');
                  setIsMainCardMinimized(false); // Abre o card
                }}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs rounded transition-all ${
                  mainCardMode === 'search' 
                    ? 'bg-blue-600/80 text-white border border-blue-400/50' 
                    : 'bg-gray-800/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/50'
                }`}
              >
                <span className="hidden sm:inline">🔍 </span>Explorar mais
              </button>
              <button
                onClick={() => {
                  setMainCardMode('study');
                  setShowConversationHistory(true); // Abre o rascunho de estudo
                  setIsMainCardMinimized(false); // Abre o card
                }}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs rounded transition-all ${
                  mainCardMode === 'study' 
                    ? 'bg-purple-600/80 text-white border border-purple-400/50' 
                    : 'bg-gray-800/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/50'
                }`}
              >
                <span className="hidden sm:inline">📝 </span>Estudos
              </button>
            </div>
          )}
          
          {/* Suggestions for Sub-search - Responsive layout - Mostrar apenas no modo pesquisa */}
          {mainCardMode === 'search' && searchTabs.find(tab => tab.type === 'main')?.suggestions && searchTabs.find(tab => tab.type === 'main')!.suggestions.length > 0 && (
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

          {/* Study Notes - Focused on drafting studies - Mostrar quando no modo study OU quando showConversationHistory está ativo */}
          {(mainCardMode === 'study' || showConversationHistory) && (
            <div className="mt-3 bg-gray-900/40 backdrop-blur-lg rounded-lg border border-gray-600/30 relative">
              <div className="flex items-center justify-between p-3 border-b border-gray-600/30">
                <h4 className="text-sm font-medium text-blue-300">
                  📝 Rascunho de Estudo - {studyTitle || "Novo Estudo"}
                </h4>
                <button
                  onClick={() => {
                    setShowConversationHistory(false);
                    setMainCardMode('search'); // Volta para o modo pesquisa
                  }}
                  className="text-gray-400 hover:text-gray-300 p-1 rounded hover:bg-gray-800/50"
                  title="Fechar rascunho"
                >
                  ✕
                </button>
              </div>
              
              {/* Single column - only study notes */}
              <div className="p-4 space-y-3">
                {/* Study Title */}
                <input
                  type="text"
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                  placeholder="Título do estudo..."
                  className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-600/50 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
                />
                
                {/* Study Notes */}
                <textarea
                  value={studyNotes}
                  onChange={(e) => setStudyNotes(e.target.value)}
                  placeholder="Escreva suas ideias, metodologia, objetivos, observações..."
                  className="w-full h-40 px-3 py-2 text-sm bg-gray-800/50 border border-gray-600/50 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 resize-none"
                />
                
                {/* Assistente de Estudos Científicos - Funcionalidades migradas */}
                <div className="space-y-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                  <h4 className="text-emerald-400 text-sm font-medium flex items-center">
                    <i className="fas fa-brain mr-2" />
                    Assistente de Estudos Científicos
                  </h4>
                  
                  {/* Configurações do Estudo */}
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="text-xs bg-gray-800 border border-gray-600 text-white p-2 rounded"
                      defaultValue="observacional"
                    >
                      <option value="observacional">Observacional</option>
                      <option value="experimental">Experimental</option>
                      <option value="clinico">Clínico</option>
                      <option value="revisao">Revisão</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Palavras-chave..."
                      className="text-xs bg-gray-800 border border-gray-600 text-white p-2 rounded placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    {/* Gerar Estudo Completo */}
                    <button
                      onClick={async () => {
                        const notesToSend = studyNotes.trim() || studyTitle || 'Estudo sobre cannabis medicinal';
                        
                        try {
                          setIsTyping(true);
                          const response = await fetch('/api/generate-study', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: studyTitle,
                              studyType: 'observacional',
                              keywords: 'cannabis, CBD, medicinal',
                              userId: 'free-user'
                            })
                          });
                          
                          const data = await response.json();
                          
                          if (data.generatedStudy) {
                            setStudyNotes(data.generatedStudy);
                            alert(`Estudo completo gerado! (${data.wordCount} palavras)`);
                          } else {
                            alert('Erro ao gerar estudo. Tente novamente.');
                          }
                        } catch (error) {
                          alert('Erro ao conectar com IA. Verifique sua conexão.');
                        } finally {
                          setIsTyping(false);
                        }
                      }}
                      disabled={isTyping}
                      className="w-full px-3 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                    >
                      {isTyping ? '🧠 Gerando Estudo...' : '📝 Gerar Estudo Completo'}
                    </button>

                    {/* Melhorar Rascunho */}
                    {studyNotes.length > 50 && (
                      <button
                        onClick={async () => {
                          try {
                            setIsTyping(true);
                            const response = await fetch('/api/study-draft', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                draftContent: studyNotes,
                                improvementType: 'metodologia',
                                userId: 'free-user'
                              })
                            });
                            
                            const data = await response.json();
                            
                            if (data.improvedContent) {
                              setStudyNotes(data.improvedContent);
                              alert(`Rascunho melhorado!`);
                            } else {
                              alert('Erro ao melhorar rascunho.');
                            }
                          } catch (error) {
                            alert('Erro ao conectar com IA.');
                          } finally {
                            setIsTyping(false);
                          }
                        }}
                        disabled={isTyping}
                        className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                      >
                        ✨ Melhorar Rascunho
                      </button>
                    )}

                    {/* Continuar com IA */}
                    <button
                      onClick={async () => {
                        // Usar o título ou tópico atual da conversa como base
                        const topicToUse = studyTitle || currentStudyTopic || 'cannabis medicinal';
                        const notesToSend = studyNotes.trim() || `Análise sobre ${topicToUse}`;
                        
                        try {
                          setIsTyping(true);
                          const response = await fetch('/api/generate-study', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              topic: topicToUse, // Parâmetro correto que o backend espera
                              keywords: [], // Baseado na conversa atual
                              studyType: 'observacional',
                              maxWords: 400,
                              userId: 'free-user',
                              currentNotes: notesToSend, // Notas atuais do usuário
                              conversationContext: currentConversation?.messages || [] // Contexto completo
                            })
                          });
                          
                          const data = await response.json();
                          
                          if (data.success && data.study) {
                            setStudyNotes(prev => prev + '\n\n---\n\n**🤖 NOA ESPERANÇA - Análise Colaborativa:**\n\n' + data.study.content);
                            alert(`Estudo gerado! (${data.study.wordCount} palavras, ${data.study.relatedDataSources.studies + data.study.relatedDataSources.cases + data.study.relatedDataSources.conversations} fontes integradas)`);
                          } else {
                            alert('Erro ao gerar estudo: ' + (data.error || 'Erro desconhecido'));
                          }
                        } catch (error) {
                          alert('Erro ao conectar com IA. Verifique sua conexão.');
                        } finally {
                          setIsTyping(false);
                        }
                      }}
                      disabled={isTyping}
                      className="w-full px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50 border border-purple-400/30"
                    >
                      {isTyping ? '🤖 Analisando...' : '💬 Continuar com IA'}
                    </button>
                  </div>
                </div>

                {/* Analytics e Calendário */}
                <div className="space-y-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <h4 className="text-blue-400 text-sm font-medium flex items-center">
                    <i className="fas fa-chart-bar mr-2" />
                    Analytics & Calendário
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-800/50 p-2 rounded">
                      <div className="text-green-400 font-medium">Progresso</div>
                      <div className="text-white">{Math.round((studyNotes.length / 1000) * 100)}%</div>
                    </div>
                    <div className="bg-gray-800/50 p-2 rounded">
                      <div className="text-blue-400 font-medium">Palavras</div>
                      <div className="text-white">{studyNotes.split(' ').length}</div>
                    </div>
                  </div>

                  {/* Mini Calendário */}
                  <div className="bg-gray-800/50 p-2 rounded">
                    <div className="text-yellow-400 text-xs font-medium mb-1">📅 Próxima Sessão</div>
                    <div className="text-white text-xs">{new Date(Date.now() + 24*60*60*1000).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem('study_draft', JSON.stringify({
                        title: studyTitle,
                        notes: studyNotes,
                        topic: currentStudyTopic,
                        timestamp: Date.now()
                      }));
                      alert('Rascunho salvo localmente!');
                    }}
                    className="px-2 py-1.5 bg-green-600/80 hover:bg-green-600 text-white rounded-lg text-xs transition-all"
                  >
                    💾 Salvar
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('Excluir rascunho atual?')) {
                        setStudyTitle('');
                        setStudyNotes('');
                        localStorage.removeItem('study_draft');
                      }
                    }}
                    className="px-2 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs transition-all"
                  >
                    🗑️ Excluir
                  </button>
                  
                  <button
                    onClick={() => {
                      const content = `TÍTULO: ${studyTitle || 'Estudo sem título'}

TÓPICO: ${currentStudyTopic || 'Não especificado'}

PROTOCOLO/ANOTAÇÕES:
${studyNotes || 'Nenhuma anotação'}`;
                      
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${studyTitle || 'estudo'}.txt`;
                      a.click();
                    }}
                    className="px-2 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-xs transition-all"
                  >
                    📄 Baixar
                  </button>
                  
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/study-submissions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: studyTitle || 'Estudo sem título',
                            content: studyNotes,
                            topic: currentStudyTopic,
                            status: 'draft'
                          })
                        });
                        
                        if (response.ok) {
                          alert('Enviado para "Meus Estudos" com sucesso!');
                          setStudyTitle('');
                          setStudyNotes('');
                        } else {
                          alert('Erro ao enviar. Tente novamente.');
                        }
                      } catch (error) {
                        alert('Erro ao enviar. Verifique sua conexão.');
                      }
                    }}
                    className="px-2 py-1.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-xs transition-all"
                  >
                    📤 Enviar p/ Meus Estudos
                  </button>
                </div>
                
                {/* Compact Status Info */}
                <div className="text-xs text-gray-400 p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>📊 {currentStudyTopic || "Nenhum tópico"}</span>
                    <span>📝 {studyNotes.length} caracteres</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}



      {/* Sub-search Results - Responsive positioning com mais espaçamento - Only show when Dr AI is active */}
      {isDrAIActive && searchTabs.filter(tab => tab.type === 'sub').map((subTab, index) => (
        <div
          key={subTab.id}
          className="relative mt-4 mx-3 sm:fixed sm:left-8 z-30 sm:z-30"
          style={{ 
            top: window.innerWidth >= 640 ? `${320 + (index * 220)}px` : 'auto',
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

      {/* Voice Controls DESABILITADO - Sistema antigo removido */}
      {/* <VoiceGreetingIndicator /> - DESABILITADO: usando apenas Dra. Cannabis IA moderna */}

      {/* Conversation Manager - APENAS DESKTOP */}
      <div className="hidden lg:block">
        <ConversationManager
          currentConversation={currentConversation}
          conversations={conversations}
          onSelectConversation={selectConversation}
          onCreateNew={() => createNewConversation()}
          onDeleteConversation={deleteConversation}
          onMergeConversations={mergeConversations}
          onCreateDocument={createDocument}
          onCreateSynthesis={createSynthesis}
        />
      </div>

{/* Planets removed - clean area above search bar */}
    </div>
  );
}