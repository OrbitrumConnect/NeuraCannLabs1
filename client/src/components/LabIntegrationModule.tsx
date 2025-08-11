import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  AlertTriangle,
  Zap
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LabIntegrationModule() {
  const [activeFunction, setActiveFunction] = useState("referrals");
  const { toast } = useToast();

  const labFunctions = [
    {
      id: "referrals",
      title: "Encaminhamentos",
      description: "Sistema de encaminhamento entre especialistas",
      icon: Users,
      color: "bg-blue-500/20 border-blue-500/30",
      iconColor: "text-blue-400",
      endpoint: "/api/modules/referrals"
    },
    {
      id: "anamnesis", 
      title: "Anamnese Digital",
      description: "Assistente de anamnese com IA médica",
      icon: Stethoscope,
      color: "bg-green-500/20 border-green-500/30",
      iconColor: "text-green-400",
      endpoint: "/api/modules/anamnesis"
    },
    {
      id: "lab-integration",
      title: "Laboratórios",
      description: "Integração com laboratórios em tempo real",
      icon: FlaskConical,
      color: "bg-purple-500/20 border-purple-500/30", 
      iconColor: "text-purple-400",
      endpoint: "/api/modules/labs"
    },
    {
      id: "medical-team",
      title: "Equipe Médica",
      description: "Gestão de equipe multidisciplinar",
      icon: UserCheck,
      color: "bg-orange-500/20 border-orange-500/30",
      iconColor: "text-orange-400",
      endpoint: "/api/modules/team"
    },
    {
      id: "compliance",
      title: "Compliance",
      description: "Auditoria e conformidade regulatória",
      icon: Shield,
      color: "bg-red-500/20 border-red-500/30",
      iconColor: "text-red-400",
      endpoint: "/api/modules/compliance"
    }
  ];

  const currentFunction = labFunctions.find(f => f.id === activeFunction) || labFunctions[0];

  // Query para dados da função ativa
  const { data: functionData, isLoading } = useQuery({
    queryKey: [currentFunction.endpoint],
    enabled: !!currentFunction.endpoint
  });

  // Mutation para executar ações
  const executeFunction = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(currentFunction.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Sucesso", 
        description: data?.message || "Ação executada com sucesso",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.message || "Erro ao executar ação",
        variant: "destructive"
      });
    }
  });

  const handleExecute = () => {
    const sampleData: Record<string, any> = {
      referrals: {
        patientName: "Maria Silva",
        fromSpecialty: "Clínica Geral", 
        toSpecialty: "Neurologia",
        condition: "Epilepsia refratária",
        urgency: "alta",
        cannabisProtocol: "CBD 50mg/dia"
      },
      anamnesis: {
        patientId: "patient-456",
        symptoms: ["dor crônica", "insônia"],
        medications: ["CBD 25mg"]
      },
      "lab-integration": {
        patientId: "patient-789",
        testType: "Canabinoides séricos",
        priority: "normal"
      },
      "medical-team": {
        name: "Dr. Carlos Mendes",
        specialty: "Psiquiatria",
        role: "Médico Especialista",
        cannabisExperience: "2 anos"
      },
      compliance: {
        type: "full_compliance_check",
        scope: "ANVISA_LGPD_CFM"
      }
    };

    executeFunction.mutate(sampleData[activeFunction] || {});
  };

  return (
    <section className="container mx-auto px-3 py-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-green-500">
              Integração Laboratorial
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Funcionalidades médicas hospitalares avançadas
            </p>
          </div>
          
          {/* Seletor de Função */}
          <div className="w-full sm:w-80">
            <Select value={activeFunction} onValueChange={setActiveFunction}>
              <SelectTrigger className="w-full bg-cyber-dark border-green-500/30 text-white">
                <SelectValue placeholder="Selecionar função" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-dark border-green-500/30">
                {labFunctions.map((func) => {
                  const Icon = func.icon;
                  return (
                    <SelectItem key={func.id} value={func.id} className="text-white hover:bg-green-500/10">
                      <div className="flex items-center">
                        <Icon className={`w-4 h-4 mr-2 ${func.iconColor}`} />
                        <span>{func.title}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Função Ativa */}
        <Card className={`${currentFunction.color} holographic-border backdrop-blur-md`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${currentFunction.color} mr-4`}>
                  <currentFunction.icon className={`w-6 h-6 ${currentFunction.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="text-white">{currentFunction.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {currentFunction.description}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Zap className="w-3 h-3 mr-1" />
                Ativo
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Dados da Função */}
                {functionData && Array.isArray(functionData) && functionData.length > 0 && (
                  <div className="grid gap-3">
                    <h4 className="text-sm font-semibold text-white">Dados Recentes:</h4>
                    {functionData.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="p-3 bg-black/30 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-white">
                            {String(item.patientName || item.name || item.type || `Item ${index + 1}`)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.status || item.urgency || "Ativo"}
                          </Badge>
                        </div>
                        {item.condition && (
                          <div className="text-xs text-gray-400 mt-1">{item.condition}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Ação Rápida */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                  <div className="text-sm text-gray-300">
                    Executar função selecionada
                  </div>
                  <Button
                    onClick={handleExecute}
                    disabled={executeFunction.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    {executeFunction.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Executar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          {labFunctions.map((func) => {
            const Icon = func.icon;
            const isActive = func.id === activeFunction;
            return (
              <Card
                key={func.id}
                className={`cursor-pointer transition-all ${
                  isActive 
                    ? `${func.color} holographic-border` 
                    : 'bg-cyber-dark/50 border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setActiveFunction(func.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isActive ? func.iconColor : 'text-gray-400'}`} />
                    <Badge variant="outline" className="text-xs">
                      {func.id === 'referrals' && '24'}
                      {func.id === 'anamnesis' && '89'}  
                      {func.id === 'lab-integration' && '12'}
                      {func.id === 'medical-team' && '45'}
                      {func.id === 'compliance' && '98%'}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {func.title}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}