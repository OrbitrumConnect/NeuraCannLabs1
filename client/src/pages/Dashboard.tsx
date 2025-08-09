import { useState, useEffect } from "react";
import { useParams } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import CosmicMap from "@/components/CosmicMap";
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

  return (
    <DashboardLayout
      activeDashboard={activeDashboard}
      onDashboardChange={handleDashboardChange}
      onMenuClick={handleMenuClick}
      sideNavOpen={sideNavOpen}
      setSideNavOpen={setSideNavOpen}
    >
      {activeDashboard === "overview" && (
        <OverviewDashboard 
          onPlanetClick={handleCosmicPlanetClick}
          activeDashboard={activeDashboard}
          onSearch={handleGlobalSearch}
        />
      )}
      {activeDashboard === "scientific" && (
        <ScientificDashboard />
      )}
      {activeDashboard === "clinical" && (
        <ClinicalDashboard />
      )}
      {activeDashboard === "alerts" && (
        <AlertsDashboard />
      )}
      {activeDashboard === "profile" && (
        <ProfileDashboard />
      )}
    </DashboardLayout>
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
        <CosmicMap onPlanetClick={onPlanetClick} activeDashboard={activeDashboard} onSearch={onSearch} />
      </div>
    </section>
  );
}