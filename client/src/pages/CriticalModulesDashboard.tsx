import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  Shield,
  Plus
} from "lucide-react";

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

  const criticalModules = [
    {
      id: "referrals",
      title: "Encaminhamentos", 
      description: "Sistema de encaminhamento entre especialistas",
      icon: Users,
      count: "24",
      status: "Ativo"
    },
    {
      id: "anamnesis",
      title: "Anamnese Digital",
      description: "Assistente de anamnese com IA médica", 
      icon: Stethoscope,
      count: "89",
      status: "Ativo"
    },
    {
      id: "medical-team",
      title: "Equipe Médica",
      description: "Gestão de equipe multidisciplinar",
      icon: UserCheck, 
      count: "45",
      status: "Ativo"
    },
    {
      id: "compliance",
      title: "Compliance",
      description: "Auditoria e conformidade regulatória",
      icon: Shield,
      count: "98%", 
      status: "Ativo"
    }
  ];

  return (
    <DashboardLayout
      activeDashboard="critical-modules"
      onDashboardChange={handleDashboardChange}
      onMenuClick={handleMenuClick}
      sideNavOpen={sideNavOpen}
      setSideNavOpen={setSideNavOpen}
      onSearchQuery={() => {}} // Empty function for search
    >
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Módulos Críticos</h2>
            <p className="text-gray-400 mt-1">Funcionalidades médicas hospitalares avançadas</p>
          </div>
        </div>

        {/* Grid dos Módulos Críticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {criticalModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                className="cursor-pointer transition-all bg-cyber-dark/50 border-gray-600 hover:border-gray-500 hover:bg-cyber-dark/80"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <Badge variant="outline" className="text-xs">
                      {module.count}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-semibold text-gray-300">
                      {module.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {module.description}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {module.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Executar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações Adicionais */}
        <Card className="bg-cyber-dark/30 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">156</div>
                <div className="text-sm text-gray-400">Processos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">98%</div>
                <div className="text-sm text-gray-400">Taxa de Sucesso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">24/7</div>
                <div className="text-sm text-gray-400">Disponibilidade</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}