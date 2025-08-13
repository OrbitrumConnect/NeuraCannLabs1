import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedHeader from "@/components/UnifiedHeader";
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
      status: "enrolled",
      modules: 12,
      completedModules: 0
    },
    {
      id: "3",
      title: "Pediatria e Cannabis: Casos Especiais",
      description: "Abordagem especializada para uso de cannabis medicinal em pacientes pediátricos.",
      category: "Especialização",
      level: "avancado",
      duration: 90,
      coverImage: "/api/placeholder/400/200", 
      progress: 100,
      status: "completed",
      modules: 6,
      completedModules: 6
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

  // Obter dados do usuário para o cabeçalho
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-gray">
      {/* Cabeçalho Unificado */}
      <UnifiedHeader 
        userRole={currentUser.role}
        userName={currentUser.name || "Usuário"}
        currentPage="Academy"
      />

      {/* Avatar da Dra. Cannabis IA - Posicionado ACIMA dos triggers */}
      {isDrAIActive && (
        <DraCannabisAI
          isActive={isDrAIActive}
          onClose={() => setIsDrAIActive(false)}
          context="education"
          welcomeMessage="Olá! Sou a Dra. Cannabis IA e vou te ajudar em sua jornada educacional. Posso explicar conceitos, sugerir cursos e dar feedback sobre seu progresso. Como posso ajudar hoje?"
        />
      )}

      {/* Trigger para Ativar Dra. IA - Posicionado APÓS o avatar */}
      <div className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <Button
            onClick={() => setIsDrAIActive(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl shadow-2xl border border-purple-400/20 transition-all duration-300 hover:scale-105"
            data-testid="button-activate-dra"
            disabled={isDrAIActive}
          >
            <Brain className="w-6 h-6 mr-3" />
            {isDrAIActive ? 'Dra. Cannabis IA Ativa' : 'Ativar Dra. Cannabis IA'}
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal - Estrutura Fixa e Organizada */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        
        {/* Dashboard de Estatísticas - Cards Organizados */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">📊 Painel de Progresso</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card Cursos Ativos */}
            <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 border-emerald-500/40 backdrop-blur-sm hover:shadow-emerald-500/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Cursos Ativos</p>
                    <p className="text-3xl font-bold text-emerald-400">2</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            {/* Card Tempo Total */}
            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/40 backdrop-blur-sm hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Tempo Total</p>
                    <p className="text-3xl font-bold text-blue-400">45h</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            {/* Card Certificados */}
            <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/40 backdrop-blur-sm hover:shadow-purple-500/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Certificados</p>
                    <p className="text-3xl font-bold text-purple-400">1</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            {/* Card Média Geral */}
            <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-800/40 border-yellow-500/40 backdrop-blur-sm hover:shadow-yellow-500/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">Média Geral</p>
                    <p className="text-3xl font-bold text-yellow-400">89%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs do Sistema Educacional */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="courses" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <BookOpen className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Award className="w-4 h-4 mr-2" />
              Certificados
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <FileText className="w-4 h-4 mr-2" />
              Pesquisa
            </TabsTrigger>
          </TabsList>

          {/* Aba Cursos */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Meus Cursos</h2>
              <Button className="bg-emerald-500 hover:bg-emerald-600" data-testid="button-browse-courses">
                Explorar Cursos
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockCourses.map((course) => (
                <Card key={course.id} className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-all">
                  <div className="aspect-video bg-gradient-to-br from-emerald-900/50 to-blue-900/50 rounded-t-lg flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${course.category === 'Básico' ? 'border-green-500 text-green-400' : ''}
                          ${course.category === 'Avançado' ? 'border-yellow-500 text-yellow-400' : ''}
                          ${course.category === 'Especialização' ? 'border-purple-500 text-purple-400' : ''}
                        `}
                      >
                        {course.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{course.completedModules}/{course.modules} módulos</span>
                        <span>{course.duration} min</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-emerald-400 font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2">
                        {course.status === 'completed' ? (
                          <Button className="flex-1 bg-green-600 hover:bg-green-700" data-testid={`button-view-certificate-${course.id}`}>
                            <Award className="w-4 h-4 mr-2" />
                            Ver Certificado
                          </Button>
                        ) : (
                          <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" data-testid={`button-continue-course-${course.id}`}>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {course.status === 'enrolled' ? 'Iniciar' : 'Continuar'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Aba Certificados */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Meus Certificados</h2>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500">
                {certificates.length} Certificado{certificates.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {certificatesLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-slate-900 border-slate-800 animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-slate-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : certificates.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800 text-center p-8">
                <Award className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum certificado ainda</h3>
                <p className="text-slate-400 mb-6">
                  Complete cursos para ganhar certificados oficiais da NeuroCann Academy
                </p>
                <Button 
                  onClick={() => setActiveTab('courses')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="button-explore-courses"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explorar Cursos
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <CertificateComponent
                    key={cert.id}
                    certificate={{
                      ...cert,
                      courseTitle: cert.courseTitle || `Curso ${cert.courseId}`,
                      completionPercentage: cert.finalScore,
                      verificationHash: cert.certificateNumber
                    }}
                    userName="Usuário do Sistema"
                    onDownload={(certId) => {
                      console.log('Download iniciado para certificado:', certId);
                    }}
                    onShare={(certId) => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Meu Certificado NeuroCann Academy',
                          text: `Acabei de conquistar um certificado da NeuroCann Academy!`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        // Aqui você poderia mostrar um toast de sucesso
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Aba Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Relatórios e Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Áreas de Força
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.strongAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Áreas para Melhoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.weakAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Pesquisa */}
          <TabsContent value="research" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Pesquisa Científica</h2>
              <Button className="bg-yellow-500 hover:bg-yellow-600" data-testid="button-new-research">
                Nova Pesquisa
              </Button>
            </div>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-400">Integração com NeuroCannLab</CardTitle>
                <CardDescription className="text-gray-400">
                  Acesse dados clínicos, análises avançadas e relatórios gerados pelo sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="border-emerald-500 text-emerald-400 justify-start" data-testid="button-clinical-data">
                    <Users className="w-4 h-4 mr-2" />
                    Dados Clínicos
                  </Button>
                  <Button variant="outline" className="border-blue-500 text-blue-400 justify-start" data-testid="button-analytics-reports">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Relatórios Analytics
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-400 justify-start" data-testid="button-export-data">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}