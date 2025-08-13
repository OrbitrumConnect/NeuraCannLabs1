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

// Menu completo para mobile
const mobileMenuOptions = [
  { id: "overview", name: "Estudo de Dados Cruzados", icon: "fas fa-chart-line" },
  { id: "dra-cannabis", name: "Dra. Cannabis IA", icon: "fas fa-robot" },
  { id: "scientific", name: "Científico", icon: "fas fa-microscope" },
  { id: "clinical", name: "Clínico", icon: "fas fa-user-md" },
  { id: "forum", name: "Fórum", icon: "fas fa-comments" },
  { id: "alerts", name: "Alertas", icon: "fas fa-bell" },
  { id: "profile", name: "Perfil", icon: "fas fa-user-circle" },
  { id: "admin", name: "Admin Global", icon: "fas fa-shield-alt" },
];

// Apenas itens essenciais para o cabeçalho desktop
const desktopHeaderOptions = [
  { id: "overview", name: "Estudo de Dados Cruzados", icon: "fas fa-chart-line" },
  { id: "forum", name: "Fórum", icon: "fas fa-comments" },
  { id: "alerts", name: "Alertas", icon: "fas fa-bell" },
  { id: "admin", name: "Admin Global", icon: "fas fa-shield-alt" },
];

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
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-lime-400 rounded-lg flex items-center justify-center animate-pulse-glow shadow-lg shadow-green-500/50">
              <i className="fas fa-cannabis text-white text-xs sm:text-lg" />
            </div>
            <h1 className="text-sm sm:text-2xl font-bold text-green-400">NeuroCann Lab</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dra. Cannabis IA - Botão Especial (menor) */}
            <button 
              onClick={() => handleDashboardClick("dra-cannabis")}
              className="hidden md:flex items-center space-x-1 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all border border-purple-400/30 hover:border-purple-400/50"
              data-testid="nav-dra-cannabis-header"
            >
              <i className="fas fa-robot text-purple-400 text-xs" />
              <span className="text-purple-400 text-xs">Dra. IA</span>
            </button>
            
            {/* Grupos com dropdown */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Grupo Pesquisa & Dados */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-gray-600/20 transition-colors border border-gray-500/30">
                  <i className="fas fa-search text-gray-300 text-xs" />
                  <span className="text-gray-300 text-xs">Pesquisa</span>
                  <i className="fas fa-chevron-down text-xs" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-40 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button onClick={() => handleDashboardClick("scientific")} className="w-full text-left px-3 py-2 hover:bg-gray-700 text-xs text-gray-300">
                    <i className="fas fa-microscope mr-2" />Dados Científicos
                  </button>
                  <button onClick={() => handleDashboardClick("clinical")} className="w-full text-left px-3 py-2 hover:bg-gray-700 text-xs text-gray-300">
                    <i className="fas fa-user-md mr-2" />Casos Clínicos
                  </button>
                </div>
              </div>

              {/* Grupo Perfil & Estudo */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-gray-600/20 transition-colors border border-gray-500/30">
                  <i className="fas fa-user text-gray-300 text-xs" />
                  <span className="text-gray-300 text-xs">Perfil</span>
                  <i className="fas fa-chevron-down text-xs" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button onClick={() => handleDashboardClick("my-study")} className="w-full text-left px-3 py-2 hover:bg-gray-700 text-xs text-gray-300">
                    <i className="fas fa-brain mr-2" />Meu Estudo
                  </button>
                  <button onClick={() => handleDashboardClick("profile")} className="w-full text-left px-3 py-2 hover:bg-gray-700 text-xs text-gray-300">
                    <i className="fas fa-user-circle mr-2" />Perfil
                  </button>
                </div>
              </div>
            </div>
            
          {/* Botões individuais normais */}
          <nav className="hidden lg:flex items-center space-x-2">
            {desktopHeaderOptions
              .map((option) => (
              <button
                key={option.id}
                onClick={() => handleDashboardClick(option.id)}
                className={`px-2 py-1 rounded-lg transition-all text-xs ${
                  activeDashboard === option.id
                    ? "bg-gray-600/30 text-white border border-gray-500/50"
                    : "text-gray-300 hover:bg-gray-600/20 hover:text-white border border-gray-500/30"
                }`}
                data-testid={`nav-${option.id}`}
              >
                <i className={`${option.icon} mr-1 text-xs`} />
                <span className="text-xs">{option.name}</span>
                {option.id === "alerts" && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">3</span>
                )}
                {option.id === "forum" && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1 py-0.5">29</span>
                )}
                {option.id === "admin" && (
                  <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-1 py-0.5">🌍</span>
                )}
              </button>
            ))}
          </nav>
          
          {/* Logout - Desktop */}
          <div className="hidden lg:flex items-center space-x-3 ml-6">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-gray-600 hover:border-red-400"
              data-testid="button-logout-desktop"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
          
          <div className="lg:hidden flex items-center space-x-2">
            <button
              id="menuToggle"
              onClick={onMenuClick}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all active:scale-95 touch-manipulation"
              data-testid="mobile-menu-toggle"
              aria-label="Menu"
            >
              <i className="fas fa-bars text-green-500 text-base" />
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
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-green-500">Menu</h2>
            <button
              onClick={() => setSideNavOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all active:scale-95 touch-manipulation"
              aria-label="Fechar menu"
            >
              <i className="fas fa-times text-green-500 text-sm" />
            </button>
          </div>
          
          <div className="space-y-2">
            {mobileMenuOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDashboardClick(option.id)}
                className={`w-full text-left p-3 rounded-lg transition-all data-card touch-manipulation min-h-14 ${
                  activeDashboard === option.id
                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                    : "hover:bg-green-500/10"
                }`}
                data-testid={`side-nav-${option.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`${option.icon} mr-3 text-base ${
                      option.id === "overview" ? "text-cyan-400" :
                      option.id === "dra-cannabis" ? "text-purple-400" :
                      option.id === "scientific" ? "text-emerald-400" :
                      option.id === "clinical" ? "text-blue-400" :
                      option.id === "forum" ? "text-orange-400" :
                      option.id === "alerts" ? "text-amber-400" :
                      option.id === "profile" ? "text-pink-400" :
                      option.id === "admin" ? "text-green-400" : "text-gray-400"
                    }`} />
                    <span className="font-semibold text-base">{option.name}</span>
                  </div>
                  {option.id === "dra-cannabis" && (
                    <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1">🤖</span>
                  )}
                  {option.id === "alerts" && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                  )}
                  {option.id === "forum" && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">29</span>
                  )}
                  {option.id === "admin" && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">🌍</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1 ml-7">
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
          <div className="mt-4 pt-4 border-t border-green-500/20">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-white font-medium text-sm">{user?.name || 'Administrador'}</div>
                <div className="text-xs text-gray-400">{user?.email || 'Phpg69@gmail.com'}</div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-gray-600 hover:border-red-400"
              data-testid="button-logout-mobile"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Fazer Logout
            </Button>
          </div>
        </div>
          </nav>
        </div>
      )}



      {/* Main Content */}
      <main className="pt-12 sm:pt-20 min-h-screen cyber-grid relative">
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
