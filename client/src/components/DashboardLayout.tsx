import { useState } from "react";
import Avatar3D from "./Avatar3D";
import { DynamicMedicalBackground } from "./DynamicMedicalBackground";
import { useScan } from "@/contexts/ScanContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";


interface DashboardLayoutProps {
  children: React.ReactNode;
  onMenuClick: () => void;
  onDashboardChange: (dashboard: string) => void;
  activeDashboard: string;
  sideNavOpen: boolean;
  setSideNavOpen: (open: boolean) => void;
  onSearchQuery?: (query: string) => void;
  avatarScanning?: boolean;
}

// Menu específico para cada tipo de usuário
const getMenuOptionsForUser = (userRole: string) => {
  // Menu base comum
  const baseOptions = [
    { id: "dra-cannabis", name: "Dra. Cannabis IA", icon: "fas fa-robot" },
    { id: "profile", name: "Perfil", icon: "fas fa-user-circle" },
  ];

  // Adicionar opções específicas por tipo de usuário
  if (userRole === 'admin') {
    return [
      ...baseOptions,
      { id: "overview", name: "Estudo de Dados Cruzados", icon: "fas fa-chart-line" },
      { id: "scientific", name: "Científico", icon: "fas fa-microscope" },
      { id: "clinical", name: "Clínico", icon: "fas fa-user-md" },
      { id: "forum", name: "Fórum", icon: "fas fa-comments" },
      { id: "alerts", name: "Alertas", icon: "fas fa-bell" },
      { id: "admin", name: "Painel Admin", icon: "fas fa-shield-alt" },
    ];
  } else if (userRole === 'medico') {
    return [
      ...baseOptions,
      { id: "clinical", name: "Casos Clínicos", icon: "fas fa-user-md" },
      { id: "scientific", name: "Científico", icon: "fas fa-microscope" },
      { id: "forum", name: "Fórum Médico", icon: "fas fa-comments" },
      { id: "alerts", name: "Alertas Clínicos", icon: "fas fa-bell" },
    ];
  } else {
    // Paciente
    return [
      ...baseOptions,
      { id: "forum", name: "Comunidade", icon: "fas fa-comments" },
      { id: "alerts", name: "Minhas Notificações", icon: "fas fa-bell" },
    ];
  }
};

// Cabeçalho desktop também específico por usuário
const getDesktopHeaderOptions = (userRole: string) => {
  if (userRole === 'admin' || userRole === 'medico') {
    return [
      { id: "forum", name: "Fórum", icon: "fas fa-comments" },
      { id: "alerts", name: "Alertas", icon: "fas fa-bell" },
      { id: "scientific", name: "Científico", icon: "fas fa-microscope" },
    ];
  } else {
    return [
      { id: "forum", name: "Comunidade", icon: "fas fa-comments" },
      { id: "alerts", name: "Notificações", icon: "fas fa-bell" },
    ];
  }
};

export default function DashboardLayout({
  children,
  onMenuClick,
  onDashboardChange,
  activeDashboard,
  sideNavOpen,
  setSideNavOpen,
  onSearchQuery,
}: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Determinar o tipo de usuário - com detecção inteligente baseada na URL
  const currentPath = window.location.pathname;
  let detectedUserRole = user?.role || 'paciente';
  
  // Detecção baseada na página atual para sistemas não autenticados
  if (!user || !isAuthenticated) {
    if (currentPath.includes('/admin')) {
      detectedUserRole = 'admin';
    } else if (currentPath.includes('/professional')) {
      detectedUserRole = 'medico';
    } else if (currentPath.includes('/patient')) {
      detectedUserRole = 'paciente';
    } else {
      // Página principal - assumir admin por padrão no desenvolvimento
      detectedUserRole = 'admin';
    }
  }
  
  const mobileMenuOptions = getMenuOptionsForUser(detectedUserRole);
  const desktopHeaderOptions = getDesktopHeaderOptions(detectedUserRole);
  
  // Sistema de detecção funcionando corretamente ✅
  const { setAvatarScanning, setScanPosition, avatarScanning, scanPosition } = useScan();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        localStorage.removeItem('user');
        toast({
          title: "Logout realizado com sucesso!",
          description: "Redirecionando para a landing page..."
        });
        setTimeout(() => {
          window.location.href = '/landing';
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };
  const handleDashboardClick = (dashboardId: string) => {
    onDashboardChange(dashboardId);
    setSideNavOpen(false);
  };

  // Avatar: sincronização perfeita - exatamente durante linha amarela (32%-42%)
  const handleScanUpdate = (position: number) => {
    setScanPosition(position);
    const linePos = (position * 2) % 100; // Mesma fórmula da linha
    const isScanning = linePos >= 32 && linePos <= 42; // Exatamente quando linha amarela aparece
    setAvatarScanning(isScanning);
    
    // Debug: Avatar sincronizado com linha amarela + detecção mobile
    const isMobile = window.innerWidth < 768;
    if (isScanning) {
      console.log(`🟡 AVATAR + LINHA SINCRONIZADOS! Linha: ${linePos.toFixed(1)}% | Mobile: ${isMobile}`);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-cyber-dark via-cyber-gray to-cyber-dark border-b border-green-500/30 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-lime-400 rounded-lg flex items-center justify-center animate-pulse-glow shadow-lg shadow-green-500/50">
              <i className="fas fa-cannabis text-white text-sm sm:text-xl" />
            </div>
            <h1 className="text-base sm:text-3xl font-bold text-green-400">NeuroCann Lab</h1>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Dra. Cannabis IA - Botão Especial (maior) */}
            <button 
              onClick={() => handleDashboardClick("dra-cannabis")}
              className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all border border-purple-400/30 hover:border-purple-400/50"
              data-testid="nav-dra-cannabis-header"
            >
              <i className="fas fa-robot text-purple-400 text-sm" />
              <span className="text-purple-400 text-sm">Dra. IA</span>
            </button>
            
            {/* Grupos com dropdown */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Grupo Pesquisa & Dados */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-600/20 transition-colors border border-gray-500/30">
                  <i className="fas fa-search text-gray-300 text-sm" />
                  <span className="text-gray-300 text-sm">Pesquisa</span>
                  <i className="fas fa-chevron-down text-sm" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button onClick={() => handleDashboardClick("overview")} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-chart-line mr-2" />Estudos Cruzados
                  </button>
                  <button onClick={() => handleDashboardClick("scientific")} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-microscope mr-2" />Dados Científicos
                  </button>
                  <button onClick={() => handleDashboardClick("clinical")} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-user-md mr-2" />Casos Clínicos
                  </button>
                  <div className="border-t border-gray-600 my-1"></div>
                  <button onClick={() => handleDashboardClick("forum")} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-comments mr-2" />Fórum <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">29</span>
                  </button>
                  <button onClick={() => handleDashboardClick("alerts")} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-bell mr-2" />Alertas <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                  </button>
                </div>
              </div>

              {/* Grupo Sistema */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-600/20 transition-colors border border-gray-500/30">
                  <i className="fas fa-cog text-gray-300 text-sm" />
                  <span className="text-gray-300 text-sm">Sistema</span>
                  <i className="fas fa-chevron-down text-sm" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button onClick={() => window.location.href = '/patient'} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-heart mr-2" />Perfil Paciente
                  </button>
                  <button onClick={() => window.location.href = '/professional'} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-user-md mr-2" />Perfil Profissional
                  </button>
                  <button onClick={() => window.location.href = '/dashboard/overview'} className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300">
                    <i className="fas fa-shield-alt mr-2" />Admin Global
                  </button>
                </div>
              </div>
            </div>
            
          {/* Remoção de duplicação: os botões científico, fórum, alertas já estão no dropdown "Pesquisa" */}
          
          {/* Logout - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 ml-7">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="default"
              className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-gray-600 hover:border-red-400 px-4 py-2"
              data-testid="button-logout-desktop"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </Button>
          </div>
          
          <div className="lg:hidden flex items-center space-x-3">
            <button
              id="menuToggle"
              onClick={onMenuClick}
              className="w-12 h-12 flex items-center justify-center rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all active:scale-95 touch-manipulation"
              data-testid="mobile-menu-toggle"
              aria-label="Menu"
            >
              <i className="fas fa-bars text-green-500 text-lg" />
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* Side Navigation - positioned below complete overview without scroll */}
      {sideNavOpen && (
        <div className="relative mt-6 mx-3 mb-6 lg:hidden">
          <nav 
            className="bg-gradient-to-b from-cyber-gray to-cyber-light backdrop-blur-md holographic-border rounded-xl"
            data-testid="side-navigation"
          >
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-green-500">Menu</h2>
            <button
              onClick={() => setSideNavOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all active:scale-95 touch-manipulation"
              aria-label="Fechar menu"
            >
              <i className="fas fa-times text-green-500 text-base" />
            </button>
          </div>
          
          <div className="space-y-3">
            {mobileMenuOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDashboardClick(option.id)}
                className={`w-full text-left p-4 rounded-lg transition-all data-card touch-manipulation min-h-16 ${
                  activeDashboard === option.id
                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                    : "hover:bg-green-500/10"
                }`}
                data-testid={`side-nav-${option.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`${option.icon} mr-4 text-lg ${
                      option.id === "overview" ? "text-cyan-400" :
                      option.id === "dra-cannabis" ? "text-purple-400" :
                      option.id === "scientific" ? "text-emerald-400" :
                      option.id === "clinical" ? "text-blue-400" :
                      option.id === "forum" ? "text-orange-400" :
                      option.id === "alerts" ? "text-amber-400" :
                      option.id === "profile" ? "text-pink-400" :
                      option.id === "admin" ? "text-green-400" : "text-gray-400"
                    }`} />
                    <span className="font-semibold text-lg">{option.name}</span>
                  </div>
                  {option.id === "dra-cannabis" && (
                    <span className="bg-purple-500 text-white text-sm rounded-full px-3 py-1">🤖</span>
                  )}
                  {option.id === "alerts" && (
                    <span className="bg-red-500 text-white text-sm rounded-full px-3 py-1">3</span>
                  )}
                  {option.id === "forum" && (
                    <span className="bg-blue-500 text-white text-sm rounded-full px-3 py-1">29</span>
                  )}
                  {option.id === "admin" && (
                    <span className="bg-green-500 text-white text-sm rounded-full px-3 py-1">🌍</span>
                  )}
                </div>
                <div className="text-sm text-gray-400 mt-2 ml-8">
                  {option.id === "overview" && "Dashboard principal"}
                  {option.id === "dra-cannabis" && "Consulta médica com IA empática"}
                  {option.id === "scientific" && "Estudos e pesquisas"}
                  {option.id === "clinical" && "Registros médicos"}
                  {option.id === "my-study" && "Submissões de estudos"}
                  {option.id === "alerts" && "Notificações importantes"}
                  {option.id === "forum" && "Discussões colaborativas"}
                  {option.id === "profile" && "Configurações pessoais"}
                  {option.id === "admin" && "Central científica mundial"}
                </div>
              </button>
            ))}
          </div>

          {/* User Info & Logout - Mobile */}
          <div className="mt-5 pt-5 border-t border-green-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-white font-medium text-base">{user?.name || 'Administrador'}</div>
                <div className="text-sm text-gray-400">{user?.email || 'Phpg69@gmail.com'}</div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="default"
              className="w-full text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-gray-600 hover:border-red-400 py-3"
              data-testid="button-logout-mobile"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Fazer Logout
            </Button>
          </div>
        </div>
          </nav>
        </div>
      )}



      {/* Main Content */}
      <main className="pt-16 sm:pt-24 min-h-screen cyber-grid relative">
        {/* Dynamic Medical Background */}
        <DynamicMedicalBackground 
          context={activeDashboard as any}
          className="z-0"
          onScanUpdate={handleScanUpdate}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Removido: mensagem verde de scan conforme solicitado */}



      </main>
    </div>
  );
}
