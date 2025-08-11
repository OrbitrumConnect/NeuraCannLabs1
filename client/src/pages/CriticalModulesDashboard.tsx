import LabIntegrationModule from "@/components/LabIntegrationModule";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useLocation } from "wouter";

export default function CriticalModulesDashboard() {
  const [, setLocation] = useLocation();
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const handleMenuClick = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleDashboardChange = (dashboard: string) => {
    if (dashboard === "overview") {
      setLocation("/dashboard");
    } else {
      setLocation(`/dashboard/${dashboard}`);
    }
  };

  return (
    <DashboardLayout
      activeDashboard="critical-modules"
      onDashboardChange={handleDashboardChange}
      onMenuClick={handleMenuClick}
      sideNavOpen={sideNavOpen}
      setSideNavOpen={setSideNavOpen}
      onSearchQuery={() => {}} // Empty function for search
    >
      {/* Módulo de Integração Laboratorial */}
      <LabIntegrationModule />
    </DashboardLayout>
  );
}