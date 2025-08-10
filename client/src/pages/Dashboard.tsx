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
import GlobalAdminDashboard from "./GlobalAdminDashboard";

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

  return (
    <div className="relative">
      <AdminNavigation />
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
      >
      {activeDashboard === "overview" && (
        <OverviewDashboard 
          onPlanetClick={handleCosmicPlanetClick}
          activeDashboard={activeDashboard}
          onSearch={handleGlobalSearch}
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
    </div>
  );
}

interface OverviewDashboardProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
  onSearch?: (term: string, filter: string) => void;
}

function OverviewDashboard({ onPlanetClick, activeDashboard, onSearch }: OverviewDashboardProps) {
  return (
    <section className="relative container mx-auto px-4 py-8">
      {/* Cosmic Knowledge Map */}
      <div className="mb-8">
        <ImprovedCosmicMap onPlanetClick={onPlanetClick} activeDashboard={activeDashboard} onSearch={onSearch} />
      </div>
    </section>
  );
}