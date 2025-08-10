import { useState } from "react";
import Avatar3D from "./Avatar3D";

import { DynamicMedicalBackground } from "./DynamicMedicalBackground";
import { useScan } from "@/contexts/ScanContext";


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

  const { setAvatarScanning, setScanPosition, avatarScanning, scanPosition } = useScan();
  const handleDashboardClick = (dashboardId: string) => {
    onDashboardChange(dashboardId);
    setSideNavOpen(false);
  };

  // Avatar: 12% a 20% (timing perfeito - 0.4s antes da linha)
  const handleScanUpdate = (position: number) => {
    setScanPosition(position);
    const isScanning = position >= 12 && position <= 20;
    setAvatarScanning(isScanning);
    
    // Debug visual para confirmar detecção
    if (isScanning) {
      console.log(`🟡 LINHA AMARELA! Posição: ${position.toFixed(1)}%`);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-cyber-dark via-cyber-gray to-cyber-dark border-b border-neon-cyan/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-2 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-lime-400 rounded-lg flex items-center justify-center animate-pulse-glow shadow-lg shadow-green-500/50">
              <i className="fas fa-cannabis text-white text-sm sm:text-lg" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold neon-text">NeuroCann Lab</h1>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6">
            {dashboardOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDashboardClick(option.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeDashboard === option.id
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                    : "hover:bg-neon-cyan/20 hover:text-neon-cyan"
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
          
          <button
            id="menuToggle"
            onClick={onMenuClick}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-lg border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all active:scale-95 touch-manipulation"
            data-testid="mobile-menu-toggle"
            aria-label="Menu"
          >
            <i className="fas fa-bars text-neon-cyan text-lg" />
          </button>
        </div>
      </header>

      {/* Side Navigation - positioned below complete overview without scroll */}
      {sideNavOpen && (
        <div className="relative mt-8 mx-4 mb-8 lg:hidden">
          <nav 
            className="bg-gradient-to-b from-cyber-gray to-cyber-light backdrop-blur-md holographic-border rounded-2xl"
            data-testid="side-navigation"
          >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neon-cyan neon-text">Plataforma Médica</h2>
            <button
              onClick={() => setSideNavOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all active:scale-95 touch-manipulation"
              aria-label="Fechar menu"
            >
              <i className="fas fa-times text-neon-cyan text-lg" />
            </button>
          </div>
          
          <div className="space-y-3">
            {dashboardOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDashboardClick(option.id)}
                className={`w-full text-left p-5 rounded-xl transition-all data-card touch-manipulation min-h-20 ${
                  activeDashboard === option.id
                    ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30"
                    : "hover:bg-neon-cyan/10"
                }`}
                data-testid={`side-nav-${option.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`${option.icon} mr-4 text-xl ${
                      option.id === "scientific" ? "text-emerald-400" :
                      option.id === "clinical" ? "text-blue-400" :
                      option.id === "alerts" ? "text-amber-400" :
                      option.id === "admin" ? "text-green-400" :
                      option.id === "profile" ? "text-purple-400" : ""
                    }`} />
                    <span className="font-semibold text-lg">{option.name}</span>
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
                <div className="text-base text-gray-400 mt-2 ml-9">
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
          </div>
          </nav>
        </div>
      )}



      {/* Main Content */}
      <main className="pt-14 sm:pt-20 min-h-screen cyber-grid relative">
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
