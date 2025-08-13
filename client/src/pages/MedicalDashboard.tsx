import { useState } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DraCannabisAI from "@/components/DraCannabisAI";
import MainCard from "@/components/MainCard";
import ImprovedCosmicMap from "@/components/ImprovedCosmicMap";
import { useAuth } from "@/hooks/useAuth";
import { 
  Stethoscope, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  Brain,
  Activity
} from "lucide-react";

export default function MedicalDashboard() {
  const { user } = useAuth();
  const [isDrAIActive, setIsDrAIActive] = useState(false);

  // Dados específicos para médicos
  const medicalStats = {
    totalPatients: 127,
    activeConsultations: 8,
    pendingReports: 15,
    todayAppointments: 6
  };

  const recentPatients = [
    { id: 1, name: "Maria Silva", condition: "Epilepsia refratária", lastVisit: "2 dias atrás" },
    { id: 2, name: "João Santos", condition: "Dor crônica", lastVisit: "1 semana atrás" },
    { id: 3, name: "Ana Costa", condition: "Ansiedade severa", lastVisit: "3 dias atrás" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Médico */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">
              Painel Médico - NeuroCann Lab
            </h1>
            <p className="text-slate-400">
              Bem-vindo, Dr(a). {user?.name} | CRM: {user?.crm}
            </p>
          </div>
          <Badge variant="outline" className="text-emerald-400 border-emerald-400">
            {user?.specialty}
          </Badge>
        </div>

        {/* Estatísticas Médicas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total de Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{medicalStats.totalPatients}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Consultas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{medicalStats.activeConsultations}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Relatórios Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{medicalStats.pendingReports}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{medicalStats.todayAppointments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Layout Principal - Médico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pacientes Recentes */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Pacientes Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{patient.name}</p>
                      <p className="text-sm text-slate-400">{patient.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{patient.lastVisit}</p>
                      <Button size="sm" variant="outline" className="text-emerald-400 border-emerald-400">
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ferramentas Médicas */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Ferramentas Médicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white justify-start"
                  onClick={() => setIsDrAIActive(true)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Consultar Dra. Cannabis IA
                </Button>
                
                <Button variant="outline" className="text-yellow-400 border-yellow-400 justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Análise de Casos
                </Button>
                
                <Button variant="outline" className="text-red-400 border-red-400 justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dra. Cannabis IA para Médicos */}
        {isDrAIActive && (
          <div className="space-y-4">
            <DraCannabisAI />
            
            <MainCard />
            
            <ImprovedCosmicMap />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}