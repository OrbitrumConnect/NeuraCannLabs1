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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-green-900/20" />
          <div className="relative container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Integração Laboratorial
                </h1>
                <p className="text-gray-300">
                  Sistemas especializados para medicina de cannabis conforme regulamentações brasileiras
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo de Integração Laboratorial */}
        <LabIntegrationModule />
      </div>
    </DashboardLayout>
  );
}