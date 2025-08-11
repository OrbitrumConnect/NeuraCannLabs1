import { useState, useEffect } from "react";
import { useParams } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import ImprovedCosmicMap from "@/components/ImprovedCosmicMap";
import ScientificDashboard from "./ScientificDashboard";
import ClinicalDashboard from "./ClinicalDashboard";
import AlertsDashboard from "./AlertsDashboard";
import MyStudyDashboard from "./MyStudyDashboard";
import ForumDashboard from "./ForumDashboard";
import ProfileDashboard from "./ProfileDashboard";
import { AdminNavigation } from '@/components/AdminNavigation';
import { FreePlanNotification } from '@/components/FreePlanNotification';
import { PlansFloatingTrigger } from '@/components/PlansFloatingTrigger';

import { VoiceGreetingIndicator } from '@/components/VoiceGreetingIndicator';
import GlobalAdminDashboard from "./GlobalAdminDashboard";

export default function Dashboard() {
  const { section } = useParams();
  const [activeDashboard, setActiveDashboard] = useState(section || "overview");
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [globalFilter, setGlobalFilter] = useState("todos");
  const [showFreePlanNotification, setShowFreePlanNotification] = useState(false);

  // Verificar se é usuário do plano gratuito
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isFreePlan = currentUser.plan === 'free';

  useEffect(() => {
    if (section) {
      setActiveDashboard(section);
    }
    // Desabilitado - navegação via header agora
    // if (isFreePlan && !localStorage.getItem('freePlanNotificationShown')) {
    //   setShowFreePlanNotification(true);
    // }
  }, [section, isFreePlan]);

  const handleMenuClick = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleDashboardChange = (dashboard: string) => {
    if (dashboard === "admin") {
      // Redireciona para a rota admin dedicada
      window.location.href = "/admin";
      return;
    }
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

  const handleClosePlanNotification = () => {
    setShowFreePlanNotification(false);
    localStorage.setItem('freePlanNotificationShown', 'true');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-12">
      <AdminNavigation />
      
      {/* Free Plan Notification */}
      {showFreePlanNotification && (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 w-72 sm:w-80 max-w-sm">
          <FreePlanNotification onClose={handleClosePlanNotification} />
        </div>
      )}

      <DashboardLayout
        activeDashboard={activeDashboard}
        onDashboardChange={handleDashboardChange}
        onMenuClick={handleMenuClick}
        sideNavOpen={sideNavOpen}
        setSideNavOpen={setSideNavOpen}
        onSearchQuery={(query) => {
          setGlobalSearchTerm(query);
          // Auto-switch para scientific dashboard se for pesquisa médica
          if (query.toLowerCase().includes('cannabis') || 
              query.toLowerCase().includes('cbd') || 
              query.toLowerCase().includes('estudo')) {
            setActiveDashboard('scientific');
          }
        }}
        // avatarScanning handled internally by DashboardLayout
      >
      {activeDashboard === "overview" && (
        <OverviewDashboard 
          onPlanetClick={handleCosmicPlanetClick}
          activeDashboard={activeDashboard}
          onSearch={handleGlobalSearch}
          // avatarScanning agora vem do Context useScan
        />
      )}
      {activeDashboard === "scientific" && (
        <ScientificDashboard searchTerm={globalSearchTerm} />
      )}
      {activeDashboard === "clinical" && (
        <ClinicalDashboard />
      )}
      {activeDashboard === "alerts" && (
        <AlertsDashboard />
      )}
      {activeDashboard === "my-study" && (
        <MyStudyDashboard />
      )}
      {activeDashboard === "forum" && (
        <ForumDashboard />
      )}
      {activeDashboard === "admin" && (
        <GlobalAdminDashboard />
      )}
      {activeDashboard === "profile" && (
        <ProfileDashboard />
      )}
      </DashboardLayout>
      
      {/* Rodapé preto fixo no limite inferior absoluto da viewport */}
      <footer className="fixed inset-x-0 bottom-0 bg-black border-t border-gray-800/30 px-3 py-2 z-50 h-12">
        <div className="flex items-center justify-between h-full max-w-full mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block font-medium">NeuroCann Lab v3.0</span>
          </div>
          
          {/* Triggers organizados no rodapé preto */}
          <div className="flex items-center gap-3">
            <VoiceGreetingIndicator />
            <PlansFloatingTrigger />
          </div>
        </div>
      </footer>
    </div>
  );
}

interface OverviewDashboardProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
  onSearch?: (term: string, filter: string) => void;
}

interface OverviewDashboardProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
  onSearch?: (term: string, filter: string) => void;
}

function OverviewDashboard({ onPlanetClick, activeDashboard, onSearch }: OverviewDashboardProps) {
  return (
    <section className="relative container mx-auto px-1 sm:px-4 py-3 sm:py-8">
      {/* Cosmic Knowledge Map */}
      <div className="mb-8">
        <ImprovedCosmicMap 
          onPlanetClick={onPlanetClick} 
          activeDashboard={activeDashboard} 
          onSearch={onSearch}
        />
      </div>
    </section>
  );
}