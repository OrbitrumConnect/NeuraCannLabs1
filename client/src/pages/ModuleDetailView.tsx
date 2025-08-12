import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  Shield,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  AlertCircle
} from "lucide-react";

export default function ModuleDetailView() {
  const { moduleId } = useParams();
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

  // Dados simulados de pacientes para demonstração
  const patientsData = {
    referrals: [
      {
        id: "PAC-001",
        nome: "Maria Silva Santos",
        idade: 45,
        cpf: "123.456.789-00",
        telefone: "(11) 98765-4321",
        email: "maria.santos@email.com",
        endereco: "Rua das Flores, 123 - São Paulo/SP",
        medico: "Dr. João Oliveira",
        especialidade: "Neurologia",
        dataEncaminhamento: "2024-08-10",
        status: "Aguardando consulta",
        prioridade: "Alta",
        observacoes: "Paciente com histórico de epilepsia resistente a tratamento convencional"
      },
      {
        id: "PAC-002", 
        nome: "Carlos Mendes",
        idade: 38,
        cpf: "987.654.321-00",
        telefone: "(11) 91234-5678",
        email: "carlos.mendes@email.com",
        endereco: "Av. Paulista, 456 - São Paulo/SP",
        medico: "Dra. Ana Costa",
        especialidade: "Oncologia",
        dataEncaminhamento: "2024-08-11",
        status: "Consulta agendada",
        prioridade: "Média",
        observacoes: "Tratamento de dor oncológica crônica"
      }
    ],
    anamnesis: [
      {
        id: "ANA-001",
        paciente: "Maria Silva Santos",
        dataColeta: "2024-08-10",
        medico: "Dr. João Oliveira",
        queixaPrincipal: "Crises epilépticas recorrentes",
        historiaAtual: "Paciente relata crises tônico-clônicas há 15 anos, sem controle adequado com medicações convencionais",
        antecedentes: "Epilepsia refratária, sem comorbidades",
        medicacoes: "Carbamazepina 400mg, Levetiracetam 1000mg",
        exames: "EEG alterado, RM de crânio normal",
        indicacao: "Cannabis medicinal para controle de crises",
        status: "Completa"
      }
    ],
    medical_team: [
      {
        id: "MED-001",
        nome: "Dr. João Oliveira",
        especialidade: "Neurologia",
        crm: "CRM/SP 123456",
        telefone: "(11) 3333-1111", 
        email: "joao.oliveira@hospital.com",
        status: "Ativo",
        pacientesAtivos: 24,
        proximaConsulta: "2024-08-12 14:00"
      },
      {
        id: "MED-002",
        nome: "Dra. Ana Costa",
        especialidade: "Oncologia",
        crm: "CRM/SP 654321",
        telefone: "(11) 3333-2222",
        email: "ana.costa@hospital.com", 
        status: "Ativo",
        pacientesAtivos: 31,
        proximaConsulta: "2024-08-12 15:30"
      }
    ],
    compliance: [
      {
        id: "COMP-001",
        categoria: "Prescrições Cannabis",
        descricao: "Conformidade com RDC 327/2019 - ANVISA",
        status: "Conforme",
        ultimaAuditoria: "2024-08-01",
        proximaAuditoria: "2024-11-01",
        percentual: "98%",
        observacoes: "2 prescrições com documentação pendente"
      },
      {
        id: "COMP-002",
        categoria: "Documentação Médica",
        descricao: "Prontuários e registros completos",
        status: "Conforme", 
        ultimaAuditoria: "2024-08-05",
        proximaAuditoria: "2024-11-05",
        percentual: "95%",
        observacoes: "Evoluções médicas em dia"
      }
    ]
  };

  const getModuleData = () => {
    switch (moduleId) {
      case 'referrals':
        return {
          title: 'Encaminhamentos',
          icon: Users,
          data: patientsData.referrals,
          type: 'patients'
        };
      case 'anamnesis':
        return {
          title: 'Anamnese Digital', 
          icon: Stethoscope,
          data: patientsData.anamnesis,
          type: 'anamnesis'
        };
      case 'medical-team':
        return {
          title: 'Equipe Médica',
          icon: UserCheck,
          data: patientsData.medical_team,
          type: 'team'
        };
      case 'compliance':
        return {
          title: 'Compliance',
          icon: Shield,
          data: patientsData.compliance,
          type: 'compliance'
        };
      default:
        return null;
    }
  };

  const moduleData = getModuleData();
  
  if (!moduleData) {
    return <div>Módulo não encontrado</div>;
  }

  const Icon = moduleData.icon;

  const renderPatientsTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Paciente</TableHead>
          <TableHead>Idade</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Médico</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>
              <div>
                <div className="font-semibold text-white">{patient.nome}</div>
                <div className="text-sm text-gray-400">{patient.cpf}</div>
              </div>
            </TableCell>
            <TableCell>{patient.idade}</TableCell>
            <TableCell>
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {patient.telefone}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" />
                  {patient.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium text-white">{patient.medico}</div>
                <div className="text-sm text-gray-400">{patient.especialidade}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={patient.status === "Consulta agendada" ? "default" : "secondary"}>
                {patient.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={patient.prioridade === "Alta" ? "destructive" : "outline"}>
                {patient.prioridade}
              </Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="outline">
                Ver Detalhes
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderAnamnesisTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Paciente</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Médico</TableHead>
          <TableHead>Queixa Principal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              <div className="font-semibold text-white">{record.paciente}</div>
            </TableCell>
            <TableCell>{record.dataColeta}</TableCell>
            <TableCell>{record.medico}</TableCell>
            <TableCell className="max-w-xs truncate">{record.queixaPrincipal}</TableCell>
            <TableCell>
              <Badge variant="default">{record.status}</Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="outline">
                Ver Anamnese
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderTeamTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Médico</TableHead>
          <TableHead>Especialidade</TableHead>
          <TableHead>CRM</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Pacientes</TableHead>
          <TableHead>Próxima Consulta</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell>
              <div className="font-semibold text-white">{doctor.nome}</div>
            </TableCell>
            <TableCell>{doctor.especialidade}</TableCell>
            <TableCell>{doctor.crm}</TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{doctor.telefone}</div>
                <div className="text-gray-400">{doctor.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{doctor.pacientesAtivos}</Badge>
            </TableCell>
            <TableCell>{doctor.proximaConsulta}</TableCell>
            <TableCell>
              <Badge variant="default">{doctor.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderComplianceTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoria</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Conformidade</TableHead>
          <TableHead>Última Auditoria</TableHead>
          <TableHead>Próxima</TableHead>
          <TableHead>Observações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-semibold text-white">{item.categoria}</TableCell>
            <TableCell className="max-w-xs">{item.descricao}</TableCell>
            <TableCell>
              <Badge variant="default">{item.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="text-green-400 font-bold">{item.percentual}</div>
              </div>
            </TableCell>
            <TableCell>{item.ultimaAuditoria}</TableCell>
            <TableCell>{item.proximaAuditoria}</TableCell>
            <TableCell className="text-sm text-gray-400 max-w-xs truncate">
              {item.observacoes}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderTable = () => {
    switch (moduleData.type) {
      case 'patients':
        return renderPatientsTable(moduleData.data);
      case 'anamnesis':
        return renderAnamnesisTable(moduleData.data);
      case 'team':
        return renderTeamTable(moduleData.data);
      case 'compliance':
        return renderComplianceTable(moduleData.data);
      default:
        return <div>Tipo de dados não suportado</div>;
    }
  };

  return (
    <DashboardLayout
      activeDashboard="critical-modules"
      onDashboardChange={handleDashboardChange}
      onMenuClick={handleMenuClick}
      sideNavOpen={sideNavOpen}
      setSideNavOpen={setSideNavOpen}
      onSearchQuery={() => {}}
    >
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard/critical-modules")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-green-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">{moduleData.title}</h2>
                <p className="text-gray-400">Dados médicos em tempo real</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-cyber-dark/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">
              {moduleData.data.length} registro(s) encontrado(s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderTable()}
          </CardContent>
        </Card>

        {/* Resumo Estatístico */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-cyber-dark/30 border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {moduleData.data.length}
              </div>
              <div className="text-sm text-gray-400">Total de Registros</div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-dark/30 border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-sm text-gray-400">Taxa de Completude</div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-dark/30 border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">24h</div>
              <div className="text-sm text-gray-400">Última Atualização</div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-dark/30 border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">Ativo</div>
              <div className="text-sm text-gray-400">Status do Módulo</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardLayout>
  );
}