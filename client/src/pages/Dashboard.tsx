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

      {/* Compact Side Stats - 20% larger width, 15% shorter height */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 space-y-2">
        <div className="data-card rounded-lg p-2.5 holographic-border w-24 transition-all hover:w-36 group">
          <div className="text-center">
            <div className="bg-emerald-500/20 p-2 rounded-full mx-auto w-8 h-8 flex items-center justify-center mb-1.5">
              <i className="fas fa-flask text-emerald-400 text-sm"></i>
            </div>
            <p className="text-white text-sm font-bold">2,547</p>
            <p className="text-emerald-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Estudos</p>
          </div>
        </div>

        <div className="data-card rounded-lg p-2.5 holographic-border w-24 transition-all hover:w-36 group">
          <div className="text-center">
            <div className="bg-blue-500/20 p-2 rounded-full mx-auto w-8 h-8 flex items-center justify-center mb-1.5">
              <i className="fas fa-heartbeat text-blue-400 text-sm"></i>
            </div>
            <p className="text-white text-sm font-bold">1,234</p>
            <p className="text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Casos</p>
          </div>
        </div>

        <div className="data-card rounded-lg p-2.5 holographic-border w-24 transition-all hover:w-36 group">
          <div className="text-center">
            <div className="bg-purple-500/20 p-2 rounded-full mx-auto w-8 h-8 flex items-center justify-center mb-1.5">
              <i className="fas fa-users text-purple-400 text-sm"></i>
            </div>
            <p className="text-white text-sm font-bold">15.6K</p>
            <p className="text-purple-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Médicos</p>
          </div>
        </div>

        <div className="data-card rounded-lg p-2.5 holographic-border w-24 transition-all hover:w-36 group">
          <div className="text-center">
            <div className="bg-amber-500/20 p-2 rounded-full mx-auto w-8 h-8 flex items-center justify-center mb-1.5">
              <i className="fas fa-brain text-amber-400 text-sm"></i>
            </div>
            <p className="text-white text-sm font-bold">99.2%</p>
            <p className="text-amber-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">IA</p>
          </div>
        </div>
      </div>
    </section>
  );
}
