import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import DraCannabisAI from "@/components/DraCannabisAI";
import CertificateComponent from "@/components/CertificateComponent";
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  FileText,
  Download,
  Star,
  Target,
  Brain,
  Users
} from "lucide-react";
import type { Course, UserCourseProgress, Certificate } from "@shared/schema";

export default function EducationDashboard() {
  const [isDrAIActive, setIsDrAIActive] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  
  // Queries para dados do sistema educacional
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/education/courses'],
    retry: false,
  });

  const { data: userProgress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['/api/education/progress'],
    retry: false,
  });

  const { data: certificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ['/api/education/certificates'],
    retry: false,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/education/analytics'],
    retry: false,
  });

  // Mock data inicial para demonstração
  const mockCourses = [
    {
      id: "1",
      title: "Cannabis Medicinal: Fundamentos Científicos",
      description: "Introdução aos fundamentos científicos da cannabis medicinal, incluindo farmacocinética, dosagem e indicações terapêuticas.",
      category: "Básico",
      level: "iniciante",
      duration: 120,
      coverImage: "/api/placeholder/400/200",
      progress: 65,
      status: "in_progress",
      modules: 8,
      completedModules: 5
    },
    {
      id: "2", 
      title: "Protocolos Clínicos Avançados",
      description: "Protocolos avançados para prescrição e acompanhamento de pacientes em tratamento com cannabis medicinal.",
      category: "Avançado",
      level: "avancado", 
      duration: 180,
      coverImage: "/api/placeholder/400/200",
      progress: 0,
      status: "not_started",
      modules: 12,
      completedModules: 0
    },
    {
      id: "3",
      title: "Farmacologia da Cannabis",
      description: "Estudo detalhado dos compostos da cannabis e seus mecanismos de ação no organismo humano.",
      category: "Especialização",
      level: "especialista",
      duration: 240,
      coverImage: "/api/placeholder/400/200", 
      progress: 100,
      status: "completed",
      modules: 10,
      completedModules: 10
    }
  ];

  const mockCertificates = [
    {
      id: "cert1",
      courseTitle: "Cannabis Medicinal: Fundamentos Científicos",
      certificateNumber: "NCLAB-2025-001",
      issuedAt: "2025-01-10",
      finalScore: 89,
      isValid: true
    }
  ];

  const mockAnalytics = {
    totalTimeSpent: 45, // horas
    completedCourses: 1,
    averageScore: 89,
    weakAreas: ["Dosagem Pediátrica", "Interações Medicamentosas"],
    strongAreas: ["Farmacocinética", "Indicações Terapêuticas"]
  };

  return (
    <DashboardLayout>
      {/* Avatar da Dra. Cannabis IA */}
      {isDrAIActive && (
        <DraCannabisAI
          isActive={isDrAIActive}
          onClose={() => setIsDrAIActive(false)}
          context="education"
          welcomeMessage="Olá! Sou a Dra. Cannabis IA e vou te ajudar em sua jornada educacional. Posso explicar conceitos, sugerir cursos e dar feedback sobre seu progresso. Como posso ajudar hoje?"
        />
      )}

      {/* Botão Ativar Dra. IA */}
      <div className="mb-8 text-center">
        <Button
          onClick={() => setIsDrAIActive(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl shadow-2xl border border-emerald-400/20 transition-all duration-300 hover:scale-105"
          data-testid="button-activate-dra"
          disabled={isDrAIActive}
        >
          <Brain className="w-6 h-6 mr-3" />
          {isDrAIActive ? 'Dra. Cannabis IA Ativa' : 'Ativar Dra. Cannabis IA'}
        </Button>
      </div>

      {/* Dashboard de Estatísticas - Cards Organizados */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-4 shadow-2xl scale-90">
        <h2 className="text-lg font-bold text-white mb-3 text-center">📊 Painel de Progresso</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card Cursos Ativos */}
          <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 border-emerald-500/40 backdrop-blur-sm hover:shadow-emerald-500/20 hover:shadow-lg transition-all duration-300 scale-90">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-xs font-medium">Cursos Ativos</p>
                  <p className="text-lg font-bold text-emerald-400">2</p>
                </div>
                <BookOpen className="w-4 h-4 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          {/* Card Tempo Total */}
          <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/40 backdrop-blur-sm hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300 scale-90">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-xs font-medium">Tempo Total</p>
                  <p className="text-lg font-bold text-blue-400">45h</p>
                </div>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          {/* Card Certificados */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/40 backdrop-blur-sm hover:shadow-purple-500/20 hover:shadow-lg transition-all duration-300 scale-90">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-xs font-medium">Certificados</p>
                  <p className="text-lg font-bold text-purple-400">1</p>
                </div>
                <Award className="w-4 h-4 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          {/* Card Média Geral */}
          <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-800/40 border-yellow-500/40 backdrop-blur-sm hover:shadow-yellow-500/20 hover:shadow-lg transition-all duration-300 scale-90">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-xs font-medium">Média Geral</p>
                  <p className="text-lg font-bold text-yellow-400">89%</p>
                </div>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs do Sistema Educacional */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 scale-90">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700 h-8">
          <TabsTrigger value="courses" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-xs px-2 py-1">
            <BookOpen className="w-3 h-3 mr-1" />
            Cursos
          </TabsTrigger>
          <TabsTrigger value="certificates" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-xs px-2 py-1">
            <Award className="w-3 h-3 mr-1" />
            Certificados
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-xs px-2 py-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="research" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 text-xs px-2 py-1">
            <FileText className="w-3 h-3 mr-1" />
            Pesquisa
          </TabsTrigger>
        </TabsList>

        {/* Aba Cursos */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Meus Cursos</h2>
            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 bg-emerald-500 hover:bg-emerald-600 px-3 py-2 pl-[0px] pr-[0px] pt-[0px] pb-[0px] mt-[-2px] mb-[-2px] ml-[30px] mr-[30px] text-[12px] font-thin" data-testid="button-browse-courses">
              Explorar Cursos
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
            {mockCourses.map((course) => (
              <Card key={course.id} className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-all scale-75">
                <div className="aspect-video bg-gradient-to-br from-emerald-900/50 to-blue-900/50 rounded-t-lg flex items-center justify-center">
                  <PlayCircle className="w-4 h-4 text-emerald-400" />
                </div>
                
                <CardHeader className="pb-1 px-2 pt-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-xs leading-3 max-w-[60%]">{course.title}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1 py-0 scale-75
                        ${course.category === 'Básico' ? 'border-green-500 text-green-400' : ''}
                        ${course.category === 'Avançado' ? 'border-yellow-500 text-yellow-400' : ''}
                        ${course.category === 'Especialização' ? 'border-purple-500 text-purple-400' : ''}
                      `}
                    >
                      {course.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400 text-xs leading-3 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-1 pt-0 px-2 pb-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="text-xs">⏱️ {course.duration}min</span>
                    <span className="text-xs">📚 {course.completedModules}/{course.modules}</span>
                  </div>
                  
                  <Progress value={course.progress} className="w-full h-1" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400">{course.progress}%</span>
                    <Button 
                      size="sm"
                      className={`text-xs px-1 py-1 h-6 scale-90
                        ${course.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                        ${course.status === 'in_progress' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                        ${course.status === 'not_started' ? 'bg-gray-600 hover:bg-gray-700' : ''}
                      `}
                    >
                      {course.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs">OK</span>
                        </>
                      ) : course.status === 'in_progress' ? (
                        <>
                          <PlayCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs">Play</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs">Start</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Aba Certificados */}
        <TabsContent value="certificates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Certificados Obtidos</h2>
            <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
              Total: {mockCertificates.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {mockCertificates.map((cert) => (
              <Card key={cert.id} className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/40 scale-90">
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-start justify-between">
                    <Award className="w-5 h-5 text-purple-400" />
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs px-1">
                      Válido
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-sm leading-4">{cert.courseTitle}</CardTitle>
                  <CardDescription className="text-purple-300 text-xs">
                    {cert.certificateNumber}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-2 pt-0 px-3 pb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-300">Emitido:</span>
                    <span className="text-white">{new Date(cert.issuedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-300">Nota:</span>
                    <span className="text-yellow-400 font-bold">{cert.finalScore}%</span>
                  </div>
                  
                  <CertificateComponent certificateData={cert} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Aba Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Analytics de Aprendizado</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Estatísticas Gerais */}
            <Card className="bg-gray-800/50 border-gray-700 scale-90">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-white flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                  Estatísticas Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-3 pb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Tempo Total:</span>
                  <span className="text-blue-400 font-bold">{mockAnalytics.totalTimeSpent}h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Cursos:</span>
                  <span className="text-green-400 font-bold">{mockAnalytics.completedCourses}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Média:</span>
                  <span className="text-yellow-400 font-bold">{mockAnalytics.averageScore}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Áreas de Força e Melhoria */}
            <Card className="bg-gray-800/50 border-gray-700 scale-90">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-white flex items-center text-sm">
                  <Target className="w-4 h-4 mr-2 text-purple-400" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-3 pb-3">
                <div>
                  <p className="text-green-400 font-medium mb-1 text-xs">✅ Fortes:</p>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {mockAnalytics.strongAreas.map((area, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="w-2 h-2 mr-1 text-green-400" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="text-yellow-400 font-medium mb-1 text-xs">⚠️ Melhorar:</p>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {mockAnalytics.weakAreas.map((area, index) => (
                      <li key={index} className="flex items-center">
                        <Target className="w-2 h-2 mr-1 text-yellow-400" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Pesquisa */}
        <TabsContent value="research" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Pesquisa Colaborativa</h2>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-sm px-3 py-2" data-testid="button-new-research">
              <FileText className="w-3 h-3 mr-2" />
              Nova Pesquisa
            </Button>
          </div>
          
          <Card className="bg-gray-800/50 border-gray-700 scale-90">
            <CardContent className="p-4">
              <div className="text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-base mb-2">Sistema de Pesquisa em Desenvolvimento</p>
                <p className="text-xs">
                  Em breve você poderá colaborar em pesquisas científicas e contribuir para o avanço da medicina canábica.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}