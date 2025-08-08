import { useState } from "react";
import Avatar3D from "./Avatar3D";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onMenuClick: () => void;
  onDashboardChange: (dashboard: string) => void;
  activeDashboard: string;
  sideNavOpen: boolean;
  setSideNavOpen: (open: boolean) => void;
}

const dashboardOptions = [
  { id: "overview", name: "Visão Geral", icon: "fas fa-chart-line" },
  { id: "scientific", name: "Dados Científicos", icon: "fas fa-microscope" },
  { id: "clinical", name: "Casos Clínicos", icon: "fas fa-user-md" },
  { id: "alerts", name: "Alertas", icon: "fas fa-bell" },
  { id: "profile", name: "Perfil", icon: "fas fa-user-circle" },
];

export default function DashboardLayout({
  children,
  onMenuClick,
  onDashboardChange,
  activeDashboard,
  sideNavOpen,
  setSideNavOpen,
}: DashboardLayoutProps) {
  const handleDashboardClick = (dashboardId: string) => {
    onDashboardChange(dashboardId);
    setSideNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-cyber-dark via-cyber-gray to-cyber-dark border-b border-neon-cyan/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center animate-pulse-glow">
              <i className="fas fa-cannabis text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold neon-text">Cannabis Clinical Hub</h1>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
              v2.0 BETA
            </span>
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
              </button>
            ))}
          </nav>
          
          <button
            id="menuToggle"
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all"
            data-testid="mobile-menu-toggle"
          >
            <i className="fas fa-bars text-neon-cyan" />
          </button>
        </div>
      </header>

      {/* Side Navigation */}
      <nav
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-cyber-gray to-cyber-light backdrop-blur-md transform transition-transform duration-300 z-40 lg:hidden holographic-border ${
          sideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-testid="side-navigation"
      >
        <div className="p-6 pt-20">
          <h2 className="text-xl font-semibold text-neon-cyan mb-8 neon-text">Plataforma Médica</h2>
          
          <div className="space-y-4">
            {dashboardOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDashboardClick(option.id)}
                className={`w-full text-left p-4 rounded-xl transition-all data-card ${
                  activeDashboard === option.id
                    ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30"
                    : "hover:bg-neon-cyan/10"
                }`}
                data-testid={`side-nav-${option.id}`}
              >
                <i className={`${option.icon} mr-3 ${
                  option.id === "scientific" ? "text-emerald-400" :
                  option.id === "clinical" ? "text-blue-400" :
                  option.id === "alerts" ? "text-amber-400" :
                  option.id === "profile" ? "text-purple-400" : ""
                }`} />
                <span className="font-semibold">{option.name}</span>
                {option.id === "alerts" && (
                  <span className="float-right bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                )}
                <div className="text-sm text-gray-400 mt-1">
                  {option.id === "overview" && "Dashboard principal"}
                  {option.id === "scientific" && "Estudos e pesquisas"}
                  {option.id === "clinical" && "Registros médicos"}
                  {option.id === "alerts" && "Notificações importantes"}
                  {option.id === "profile" && "Configurações pessoais"}
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 min-h-screen cyber-grid">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cyber-dark via-cyber-gray to-cyber-dark border-t border-neon-cyan/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center">
                <i className="fas fa-cannabis text-white text-sm" />
              </div>
              <span className="font-semibold text-gray-300">Cannabis Clinical Hub</span>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; 2025 Cannabis Clinical Hub — Todos os direitos reservados
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                <i className="fab fa-linkedin" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                <i className="fab fa-github" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
