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

const dashboardOptions = [
  { id: "overview", name: "Visão Geral", icon: "fas fa-chart-line" },
  { id: "scientific", name: "Dados Científicos", icon: "fas fa-microscope" },
  { id: "clinical", name: "Casos Clínicos", icon: "fas fa-user-md" },
  { id: "alerts", name: "Alertas", icon: "fas fa-bell" },
  { id: "my-study", name: "Meu Estudo", icon: "fas fa-brain" },
  { id: "forum", name: "Fórum", icon: "fas fa-comments" },
  { id: "admin", name: "Admin Global", icon: "fas fa-shield-alt" },
  { id: "profile", name: "Perfil", icon: "fas fa-user-circle" },
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

  // Avatar: timing final (15%-25%) - ascende sempre que linha passar
  const handleScanUpdate = (position: number) => {
    setScanPosition(position);
    const isScanning = position >= 15 && position <= 25;
    setAvatarScanning(isScanning);
    
    // Debug: Avatar ascende sempre que linha passar
    if (isScanning) {
      console.log(`🟡 AVATAR SEMPRE! Posição: ${position.toFixed(1)}%`);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-cyber-dark via-cyber-gray to-cyber-dark border-b border-neon-cyan/30 backdrop-blur-md">
        <div className="container mx-auto px-2 sm:px-4 py-0 sm:py-0.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-lime-400 rounded-lg flex items-center justify-center animate-pulse-glow shadow-lg shadow-green-500/50">
              <i className="fas fa-cannabis text-white text-xs sm:text-lg" />
            </div>
            <h1 className="text-sm sm:text-2xl font-bold neon-text">NeuroCann Lab</h1>
          </div>
          
          <div className="flex items-center space-x-4">
          <nav className="hidden lg:flex items-center space-x-6">
            {dashboardOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDashboardClick(option.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeDashboard === option.id
                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                    : "hover:bg-green-500/20 hover:text-green-500"
                }`}
                data-testid={`nav-${option.id}`}
              >
                <i className={`${option.icon} mr-2`} />
                {option.name}
                {option.id === "alerts" && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
                )}
                {option.id === "my-study" && (
                  <span className="ml-1 bg-purple-500 text-white text-xs rounded-full px-1">NEW</span>
                )}
                {option.id === "forum" && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1">29</span>
                )}
                {option.id === "admin" && (
                  <span className="ml-1 bg-green-500 text-white text-xs rounded-full px-1">🌍</span>
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
            <h2 className="text-lg font-semibold text-green-500 neon-text">Menu</h2>
            <button
              onClick={() => setSideNavOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all active:scale-95 touch-manipulation"
              aria-label="Fechar menu"
            >
              <i className="fas fa-times text-green-500 text-sm" />
            </button>
          </div>
          
          <div className="space-y-2">
            {dashboardOptions.map((option) => (
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
                      option.id === "scientific" ? "text-emerald-400" :
                      option.id === "clinical" ? "text-blue-400" :
                      option.id === "alerts" ? "text-amber-400" :
                      option.id === "admin" ? "text-green-400" :
                      option.id === "profile" ? "text-purple-400" : ""
                    }`} />
                    <span className="font-semibold text-base">{option.name}</span>
                  </div>
                  {option.id === "alerts" && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                  )}
                  {option.id === "my-study" && (
                    <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1">NEW</span>
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
                  {option.id === "scientific" && "Estudos e pesquisas"}
                  {option.id === "clinical" && "Registros médicos"}
                  {option.id === "alerts" && "Notificações importantes"}
                  {option.id === "my-study" && "Submissões de estudos"}
                  {option.id === "forum" && "Discussões colaborativas"}
                  {option.id === "admin" && "Central científica mundial"}
                  {option.id === "profile" && "Configurações pessoais"}
                </div>
              </button>
            ))}
          </div>

          {/* User Info & Logout - Mobile */}
          <div className="mt-4 pt-4 border-t border-neon-cyan/20">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-4 h-4 text-neon-cyan" />
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
