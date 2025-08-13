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
  Heart, 
  MessageCircle, 
  Calendar, 
  FileText, 
  TrendingUp,
  Brain,
  User,
  Clock
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [isDrAIActive, setIsDrAIActive] = useState(false);

  // Dados específicos para pacientes
  const patientStats = {
    consultationsTotal: 12,
    nextAppointment: "15 Ago, 14:30",
    activeSymptoms: 3,
    treatmentDays: 45
  };

  const recentActivities = [
    { id: 1, type: "consultation", title: "Consulta com Dr. Silva", date: "3 dias atrás", status: "completed" },
    { id: 2, type: "symptom", title: "Relatório de sintomas", date: "1 semana atrás", status: "pending" },
    { id: 3, type: "medication", title: "Ajuste de dosagem", date: "2 semanas atrás", status: "completed" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Paciente */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">
              Meu Painel - NeuroCann Lab
            </h1>
            <p className="text-slate-400">
              Olá, {user?.name}! Como você está se sentindo hoje?
            </p>
          </div>
          <Badge variant="outline" className="text-emerald-400 border-emerald-400">
            Paciente
          </Badge>
        </div>

        {/* Estatísticas do Paciente */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Total de Consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{patientStats.consultationsTotal}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Próxima Consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-yellow-400">{patientStats.nextAppointment}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Sintomas Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{patientStats.activeSymptoms}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Dias de Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{patientStats.treatmentDays}</div>
            </CardContent>
          </Card>
        </div>

        {/* Layout Principal - Paciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atividades Recentes */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{activity.title}</p>
                      <p className="text-sm text-slate-400">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className={activity.status === 'completed' ? 'bg-emerald-500' : 'bg-yellow-500'}
                      >
                        {activity.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ferramentas do Paciente */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Suas Ferramentas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white justify-start"
                  onClick={() => setIsDrAIActive(true)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Conversar com Dra. Cannabis
                </Button>
                
                <Button variant="outline" className="text-yellow-400 border-yellow-400 justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Relatar Sintomas
                </Button>
                
                <Button variant="outline" className="text-blue-400 border-blue-400 justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Meus Relatórios
                </Button>

                <Button variant="outline" className="text-purple-400 border-purple-400 justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Agendar Consulta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dra. Cannabis IA para Pacientes */}
        {isDrAIActive && (
          <div className="space-y-4">
            <DraCannabisAI />
            
            <MainCard />
            
            <ImprovedCosmicMap />
          </div>
        )}

        {/* Informações Importantes */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-emerald-400">Lembretes Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-slate-300">
              <p>• Tome sua medicação sempre no mesmo horário</p>
              <p>• Registre seus sintomas diariamente para melhor acompanhamento</p>
              <p>• Em caso de emergência, procure atendimento médico imediato</p>
              <p>• Próxima consulta: {patientStats.nextAppointment}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}