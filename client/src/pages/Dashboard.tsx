import { useState, useEffect } from "react";
import { useParams } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import CosmicMap from "@/components/CosmicMap";
import Avatar3D from "@/components/Avatar3D";
import ScientificDashboard from "./ScientificDashboard";
import ClinicalDashboard from "./ClinicalDashboard";
import AlertsDashboard from "./AlertsDashboard";
import ProfileDashboard from "./ProfileDashboard";

export default function Dashboard() {
  const { section } = useParams();
  const [activeDashboard, setActiveDashboard] = useState(section || "overview");
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [globalFilter, setGlobalFilter] = useState("todos");

  useEffect(() => {
    if (section) {
      setActiveDashboard(section);
    }
  }, [section]);

  const handleMenuClick = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleDashboardChange = (dashboard: string) => {
    setActiveDashboard(dashboard);
    window.history.pushState({}, '', `/dashboard/${dashboard}`);
  };

  const handleCosmicPlanetClick = (dashboardId: string) => {
    handleDashboardChange(dashboardId);
  };

  const handleGlobalSearch = (term: string, filter: string) => {
    setGlobalSearchTerm(term);
    setGlobalFilter(filter);
  };

  // Close side nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const sideNav = document.querySelector('[data-testid="side-navigation"]');
      const menuToggle = document.querySelector('[data-testid="mobile-menu-toggle"]');
      
      if (sideNavOpen && sideNav && !sideNav.contains(target) && !menuToggle?.contains(target)) {
        setSideNavOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sideNavOpen]);

  const renderDashboardContent = () => {
    switch (activeDashboard) {
      case "scientific":
        return <ScientificDashboard />;
      case "clinical":
        return <ClinicalDashboard />;
      case "alerts":
        return <AlertsDashboard />;
      case "profile":
        return <ProfileDashboard />;
      default:
        return <OverviewDashboard 
          onPlanetClick={handleCosmicPlanetClick} 
          activeDashboard={activeDashboard}
          onSearch={handleGlobalSearch}
          searchTerm={globalSearchTerm}
          searchFilter={globalFilter}
        />;
    }
  };

  return (
    <DashboardLayout
      onMenuClick={handleMenuClick}
      onDashboardChange={handleDashboardChange}
      activeDashboard={activeDashboard}
      sideNavOpen={sideNavOpen}
      setSideNavOpen={setSideNavOpen}
    >
      {renderDashboardContent()}
    </DashboardLayout>
  );
}

interface OverviewDashboardProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
  onSearch?: (term: string, filter: string) => void;
  searchTerm?: string;
  searchFilter?: string;
}

function OverviewDashboard({ onPlanetClick, activeDashboard, onSearch }: OverviewDashboardProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Hero Section with 3D Avatar */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
        {/* 3D Avatar */}
        <div className="relative mb-8 lg:mb-0">
          <Avatar3D className="w-32 h-32" size={150} />
        </div>
        
        {/* Welcome Message */}
        <div className="text-center lg:text-left lg:ml-8">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Bem-vindo ao</span>
            <span className="neon-text block">Futuro da Medicina</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            Plataforma avançada para análise científica, casos clínicos e descobertas em cannabis medicinal
          </p>
          <button 
            className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 animate-pulse-glow"
            data-testid="explore-platform-button"
          >
            <i className="fas fa-rocket mr-2" />
            Explorar Plataforma
          </button>
        </div>
      </div>

      {/* Cosmic Knowledge Map */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 neon-text">Mapa do Conhecimento</h2>
        <CosmicMap onPlanetClick={onPlanetClick} activeDashboard={activeDashboard} onSearch={onSearch} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="data-card rounded-xl p-6 holographic-border">
          <div className="flex items-center justify-between mb-4">
            <i className="fas fa-flask text-2xl text-emerald-400" />
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">+12% hoje</span>
          </div>
          <h3 className="text-2xl font-bold text-white">2,547</h3>
          <p className="text-gray-400">Estudos Analisados</p>
        </div>
        
        <div className="data-card rounded-xl p-6 holographic-border">
          <div className="flex items-center justify-between mb-4">
            <i className="fas fa-heartbeat text-2xl text-blue-400" />
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">+5% hoje</span>
          </div>
          <h3 className="text-2xl font-bold text-white">1,234</h3>
          <p className="text-gray-400">Casos Registrados</p>
        </div>
        
        <div className="data-card rounded-xl p-6 holographic-border">
          <div className="flex items-center justify-between mb-4">
            <i className="fas fa-users text-2xl text-purple-400" />
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">+89 hoje</span>
          </div>
          <h3 className="text-2xl font-bold text-white">15,678</h3>
          <p className="text-gray-400">Médicos Ativos</p>
        </div>
        
        <div className="data-card rounded-xl p-6 holographic-border">
          <div className="flex items-center justify-between mb-4">
            <i className="fas fa-brain text-2xl text-amber-400" />
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">24/7</span>
          </div>
          <h3 className="text-2xl font-bold text-white">99.2%</h3>
          <p className="text-gray-400">Precisão IA</p>
        </div>
      </div>
    </section>
  );
}
