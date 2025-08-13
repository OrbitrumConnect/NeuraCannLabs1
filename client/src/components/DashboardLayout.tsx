import { useState } from "react";
import Avatar3D from "./Avatar3D";
import { DynamicMedicalBackground } from "./DynamicMedicalBackground";
import { useScan } from "@/contexts/ScanContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import UnifiedHeader from "./UnifiedHeader";


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
      {/* Cabeçalho Unificado */}
      <UnifiedHeader 
        userRole={detectedUserRole}
        userName={user?.name || "Usuário"}
        currentPage="Dashboard"
        onLogout={handleLogout}
      />


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
