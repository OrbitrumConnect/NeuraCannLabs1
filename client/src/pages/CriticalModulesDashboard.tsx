import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Stethoscope, 
  FlaskConical, 
  UserCheck, 
  Shield,
  ArrowRight,
  Plus,
  Activity,
  FileText,
  Clock,
  CheckCircle,
  Send,
  MessageSquare,
  TestTube,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CriticalModulesDashboard() {
  const [activeModule, setActiveModule] = useState("referrals");

  const criticalModules = [
    {
      id: "referrals",
      title: "Encaminhamento Especialistas",
      description: "Sistema seguro de encaminhamento entre médicos especialistas",
      icon: Users,
      color: "bg-blue-500/20 border-blue-500/30",
      iconColor: "text-blue-400",
      stats: { active: 24, pending: 8, completed: 156 },
      compliance: ["RDC 327/2019", "CFM 2.314/2022"]
    },
    {
      id: "anamnesis",
      title: "Anamnese Digital",
      description: "Assistente de anamnese em tempo real com IA médica",
      icon: Stethoscope,
      color: "bg-green-500/20 border-green-500/30",
      iconColor: "text-green-400",
      stats: { sessions: 89, completed: 76, avgTime: "12min" },
      compliance: ["LGPD 13.709/2018", "CFM 2.228/2019"]
    },
    {
      id: "lab-integration",
      title: "Integração Laboratorial",
      description: "Conexão direta com laboratórios para resultados em tempo real",
      icon: FlaskConical,
      color: "bg-purple-500/20 border-purple-500/30",
      iconColor: "text-purple-400",
      stats: { labs: 12, results: 234, pending: 18 },
      compliance: ["RDC 302/2005", "ANVISA IN 34/2014"]
    },
    {
      id: "medical-team",
      title: "Equipe Multidisciplinar",
      description: "Gestão integrada de equipe médica multidisciplinar",
      icon: UserCheck,
      color: "bg-orange-500/20 border-orange-500/30",
      iconColor: "text-orange-400",
      stats: { members: 45, specialties: 8, cases: 167 },
      compliance: ["CFM 2.314/2022", "RDC 327/2019"]
    },
    {
      id: "compliance",
      title: "Auditoria & Compliance",
      description: "Sistema completo de auditoria e conformidade regulatória",
      icon: Shield,
      color: "bg-red-500/20 border-red-500/30",
      iconColor: "text-red-400",
      stats: { audits: 12, compliance: "98.2%", alerts: 3 },
      compliance: ["LGPD 13.709/2018", "Lei 11.343/2006", "RDC 335/2020"]
    }
  ];

  const selectedModule = criticalModules.find(m => m.id === activeModule);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-green-900/20" />
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Módulos Críticos do Sistema
              </h1>
              <p className="text-gray-300">
                Sistemas especializados para medicina de cannabis conforme regulamentações brasileiras
              </p>
            </div>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Voltar ao Dashboard
            </Button>
          </div>

          {/* Módulos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {criticalModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card
                  key={module.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${module.color} ${
                    activeModule === module.id ? 'ring-2 ring-white/50' : ''
                  }`}
                  onClick={() => setActiveModule(module.id)}
                  data-testid={`module-card-${module.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <IconComponent className={`w-8 h-8 ${module.iconColor}`} />
                      <Badge variant="secondary" className="text-xs">
                        {module.stats.active || module.stats.sessions || module.stats.labs || module.stats.members || module.stats.audits}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-gray-300 text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {module.compliance.map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Módulo Detalhado */}
      {selectedModule && (
        <div className="container mx-auto px-4 pb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${selectedModule.color}`}>
                  <selectedModule.icon className={`w-8 h-8 ${selectedModule.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">{selectedModule.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {selectedModule.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="overview" className="text-gray-300">Visão Geral</TabsTrigger>
                  <TabsTrigger value="functionality" className="text-gray-300">Funcionalidades</TabsTrigger>
                  <TabsTrigger value="compliance" className="text-gray-300">Compliance</TabsTrigger>
                  <TabsTrigger value="integration" className="text-gray-300">Integração</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(selectedModule.stats).map(([key, value]) => (
                      <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 capitalize">{key}</span>
                          <Activity className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="text-2xl font-bold text-white mt-2">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Status do Sistema</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Sistema Operacional</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Última Sincronização</span>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400">2 min atrás</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Compliance Score</span>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400">98.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="functionality" className="space-y-4 mt-6">
                  <ModuleFunctionality moduleId={selectedModule.id} />
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4 mt-6">
                  <ComplianceDetails compliance={selectedModule.compliance} />
                </TabsContent>

                <TabsContent value="integration" className="space-y-4 mt-6">
                  <IntegrationStatus moduleId={selectedModule.id} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ModuleFeatures({ moduleId }: { moduleId: string }) {
  const features = {
    referrals: [
      "Encaminhamento seguro com criptografia ponta-a-ponta",
      "Histórico completo de transferências",
      "Notificações em tempo real",
      "Integração com agenda médica",
      "Relatórios de acompanhamento"
    ],
    anamnesis: [
      "Interface intuitiva para coleta de dados",
      "Sugestões baseadas em IA médica",
      "Validação automática de informações",
      "Integração com prontuário eletrônico",
      "Análise preditiva de riscos"
    ],
    "lab-integration": [
      "Conexão API com principais laboratórios",
      "Recebimento automático de resultados",
      "Alertas para valores críticos",
      "Histórico laboratorial completo",
      "Integração com prescrições"
    ],
    "medical-team": [
      "Gestão de papéis e permissões",
      "Comunicação segura entre membros",
      "Distribuição automática de casos",
      "Relatórios de performance",
      "Treinamento e certificação"
    ],
    compliance: [
      "Auditoria automática de processos",
      "Relatórios de conformidade",
      "Alertas de não conformidade",
      "Backup automático de dados",
      "Logs de auditoria detalhados"
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features[moduleId as keyof typeof features]?.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3 bg-gray-800/30 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span className="text-gray-300">{feature}</span>
        </div>
      ))}
    </div>
  );
}

function ComplianceDetails({ compliance }: { compliance: string[] }) {
  const complianceDetails = {
    "RDC 327/2019": "Regulamentação sobre Cannabis para fins medicinais",
    "RDC 335/2020": "Produtos de Cannabis para uso medicinal",
    "LGPD 13.709/2018": "Lei Geral de Proteção de Dados Pessoais",
    "CFM 2.314/2022": "Diretrizes para prescrição de Cannabis medicinal",
    "CFM 2.228/2019": "Telemedicina e prontuário eletrônico",
    "RDC 302/2005": "Regulamentação de laboratórios clínicos",
    "ANVISA IN 34/2014": "Boas práticas laboratoriais",
    "Lei 11.343/2006": "Sistema Nacional de Políticas Públicas sobre Drogas"
  };

  return (
    <div className="space-y-4">
      {compliance.map((comp) => (
        <div key={comp} className="bg-gray-800/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-white">{comp}</h4>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Conforme
            </Badge>
          </div>
          <p className="text-gray-300 text-sm">
            {complianceDetails[comp as keyof typeof complianceDetails]}
          </p>
        </div>
      ))}
    </div>
  );
}

function ModuleFunctionality({ moduleId }: { moduleId: string }) {
  const { toast } = useToast();

  // Buscar dados reais dos módulos
  const { data: moduleData, isLoading } = useQuery({
    queryKey: [`/api/${moduleId.replace('-', '-')}`],
    enabled: !!moduleId
  });

  // Mutations para ações dos módulos
  const createReferralMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/patient-referrals`, 'POST', data),
    onSuccess: () => toast({ title: "Encaminhamento criado com sucesso!" })
  });

  const startAnamnesisSessionMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/anamnesis-sessions`, 'POST', data),
    onSuccess: () => toast({ title: "Sessão de anamnese iniciada!" })
  });

  const requestLabResultMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/lab-results`, 'POST', data),
    onSuccess: () => toast({ title: "Solicitação de exame enviada!" })
  });

  const addTeamMemberMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/medical-team`, 'POST', data),
    onSuccess: () => toast({ title: "Membro adicionado à equipe!" })
  });

  const runComplianceAuditMutation = useMutation({
    mutationFn: () => apiRequest(`/api/compliance-audits`, 'POST', {}),
    onSuccess: () => toast({ title: "Auditoria de compliance iniciada!" })
  });

  if (isLoading) {
    return <div className="text-center text-gray-400">Carregando funcionalidades...</div>;
  }

  const renderModuleActions = () => {
    switch (moduleId) {
      case 'referrals':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Ações Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => createReferralMutation.mutate({ 
                  patientId: 'demo-patient', 
                  specialistType: 'neurologista',
                  reason: 'Avaliação para cannabis medicinal'
                })}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createReferralMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                Criar Encaminhamento
              </Button>
              <Button variant="outline" className="w-full border-blue-500 text-blue-400">
                <FileText className="w-4 h-4 mr-2" />
                Ver Histórico
              </Button>
            </div>
          </div>
        );
      
      case 'anamnesis':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Assistente de Anamnese</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => startAnamnesisSessionMutation.mutate({ 
                  patientId: 'demo-patient',
                  type: 'cannabis-evaluation'
                })}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={startAnamnesisSessionMutation.isPending}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Iniciar Anamnese IA
              </Button>
              <Button variant="outline" className="w-full border-green-500 text-green-400">
                <MessageSquare className="w-4 h-4 mr-2" />
                Templates Personalizados
              </Button>
            </div>
          </div>
        );
      
      case 'lab-integration':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Integração Laboratorial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => requestLabResultMutation.mutate({ 
                  patientId: 'demo-patient',
                  testType: 'cannabinoids-blood',
                  lab: 'fleury'
                })}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={requestLabResultMutation.isPending}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Solicitar Exame
              </Button>
              <Button variant="outline" className="w-full border-purple-500 text-purple-400">
                <Activity className="w-4 h-4 mr-2" />
                Resultados Recentes
              </Button>
            </div>
          </div>
        );
      
      case 'medical-team':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Gestão de Equipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => addTeamMemberMutation.mutate({ 
                  name: 'Dr. Silva',
                  specialty: 'Psiquiatria',
                  crm: '12345-SP'
                })}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={addTeamMemberMutation.isPending}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Membro
              </Button>
              <Button variant="outline" className="w-full border-orange-500 text-orange-400">
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Equipe
              </Button>
            </div>
          </div>
        );
      
      case 'compliance':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Auditoria & Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => runComplianceAuditMutation.mutate()}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={runComplianceAuditMutation.isPending}
              >
                <Shield className="w-4 h-4 mr-2" />
                Executar Auditoria
              </Button>
              <Button variant="outline" className="w-full border-red-500 text-red-400">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Relatórios de Compliance
              </Button>
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-400">Selecione um módulo para ver as funcionalidades.</div>;
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-6">
      {renderModuleActions()}
    </div>
  );
}

function IntegrationStatus({ moduleId }: { moduleId: string }) {
  const integrations = {
    referrals: [
      { name: "PEP (Prontuário Eletrônico)", status: "Conectado", type: "Sistema Interno" },
      { name: "Agenda Médica", status: "Conectado", type: "Sistema Interno" },
      { name: "WhatsApp Business API", status: "Configurando", type: "Notificações" }
    ],
    anamnesis: [
      { name: "OpenAI GPT-4", status: "Conectado", type: "IA Médica" },
      { name: "Sistema de Classificação CID-11", status: "Conectado", type: "Base de Dados" },
      { name: "Banco de Sintomas", status: "Conectado", type: "Base Médica" }
    ],
    "lab-integration": [
      { name: "Laboratório Fleury", status: "Conectado", type: "API REST" },
      { name: "Laboratório DASA", status: "Em Teste", type: "API REST" },
      { name: "Laboratório Hermes Pardini", status: "Planejado", type: "API REST" }
    ],
    "medical-team": [
      { name: "Sistema de Autenticação", status: "Conectado", type: "Segurança" },
      { name: "Chat Interno", status: "Conectado", type: "Comunicação" },
      { name: "Sistema de Agenda", status: "Conectado", type: "Gestão" }
    ],
    compliance: [
      { name: "Sistema de Backup", status: "Conectado", type: "Segurança" },
      { name: "Logs de Auditoria", status: "Conectado", type: "Monitoramento" },
      { name: "ANVISA Connect", status: "Em Desenvolvimento", type: "Regulatório" }
    ]
  };

  return (
    <div className="space-y-4">
      {integrations[moduleId as keyof typeof integrations]?.map((integration, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-4">
          <div>
            <h4 className="font-medium text-white">{integration.name}</h4>
            <p className="text-sm text-gray-400">{integration.type}</p>
          </div>
          <Badge 
            variant={integration.status === "Conectado" ? "default" : "secondary"}
            className={
              integration.status === "Conectado" 
                ? "bg-green-600 text-white" 
                : integration.status === "Em Teste" 
                ? "bg-yellow-600 text-white"
                : "bg-gray-600 text-white"
            }
          >
            {integration.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}