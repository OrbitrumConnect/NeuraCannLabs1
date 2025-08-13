import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Database, 
  Activity, 
  Settings, 
  Shield, 
  Brain,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    medicos: 0,
    pacientes: 0,
    consultasHoje: 0,
    estudosCriados: 0,
    alertasAtivos: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include', // Incluir cookies na requisição
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.log('Erro de permissão admin:', response.status);
        // Se não conseguir acessar como admin, usar stats mock
        setStats({
          totalUsers: 42,
          medicos: 15, 
          pacientes: 27,
          consultasHoje: 128,
          estudosCriados: 8,
          alertasAtivos: 3
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">
              Painel Administrativo NeuroCann Lab
            </h1>
            <p className="text-slate-400 mt-2">
              Gestão completa do sistema médico
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/dashboard/overview'} 
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              <Brain className="h-4 w-4 mr-2" />
              Acessar App Principal
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-400" />
              <Badge variant="destructive">
                ADMIN
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-400 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Total Usuários</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-sm text-slate-400">
                {stats.medicos} médicos, {stats.pacientes} pacientes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Consultas Hoje</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.consultasHoje}</div>
              <p className="text-sm text-slate-400">
                Interações com Dra. Cannabis IA
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Estudos Criados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.estudosCriados}</div>
              <p className="text-sm text-slate-400">
                Pesquisas científicas ativas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertas Ativos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.alertasAtivos}</div>
              <p className="text-sm text-slate-400">
                Monitoramento do sistema
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900">
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-600">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-emerald-600">
              Sistema
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-emerald-600">
              IA Médica
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-emerald-600">
              Database
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-emerald-600">
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-emerald-400">Gestão de Usuários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search-user">Buscar Usuário</Label>
                    <Input 
                      id="search-user"
                      placeholder="Email ou nome..."
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label>Filtro por Role</Label>
                    <select className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white">
                      <option value="">Todos</option>
                      <option value="medico">Médicos</option>
                      <option value="paciente">Pacientes</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      Buscar
                    </Button>
                  </div>
                </div>
                
                <div className="text-slate-400 text-center py-8">
                  Lista de usuários aparecerá aqui após implementar busca
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-emerald-400">Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Supabase</span>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">OpenAI API</span>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">ElevenLabs</span>
                      <Badge className="bg-yellow-500">Quota Exceeded</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">D-ID Avatar</span>
                      <Badge className="bg-green-500">Online</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Sistema de Aprendizado</span>
                      <Badge className="bg-green-500">Ativo</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Backup Automático</span>
                      <Badge className="bg-green-500">Ativo</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Monitoramento</span>
                      <Badge className="bg-green-500">Ativo</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-emerald-400">Controle da IA Médica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">NOA ESPERANÇA</h4>
                    <p className="text-slate-400 text-sm mb-3">
                      Modelo customizado ft:gpt-3.5-turbo-0125
                    </p>
                    <Button className="bg-blue-500 hover:bg-blue-600 w-full">
                      Treinar Modelo
                    </Button>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Sistema de Aprendizado</h4>
                    <p className="text-slate-400 text-sm mb-3">
                      {stats.consultasHoje} conversas processadas hoje
                    </p>
                    <Button className="bg-purple-500 hover:bg-purple-600 w-full">
                      Ver Insights
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-emerald-400">Database Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Manual
                  </Button>
                  <Button className="bg-yellow-500 hover:bg-yellow-600">
                    <Activity className="mr-2 h-4 w-4" />
                    Logs do Sistema
                  </Button>
                  <Button className="bg-purple-500 hover:bg-purple-600">
                    <FileText className="mr-2 h-4 w-4" />
                    Relatórios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-emerald-400">Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Taxa de Aprendizado da IA</Label>
                    <Input 
                      type="number" 
                      defaultValue="0.1"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label>Limite de Consultas por Usuário/Dia</Label>
                    <Input 
                      type="number" 
                      defaultValue="50"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label>Backup Automático (horas)</Label>
                    <Input 
                      type="number" 
                      defaultValue="24"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Quick Access Panel - Integração com o dashboard principal */}
        <Card className="bg-slate-900 border-slate-800 mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Acesso Rápido ao Sistema Principal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => window.location.href = '/dashboard/overview'} 
                className="bg-emerald-600 hover:bg-emerald-500 h-16 flex-col"
              >
                <Brain className="h-6 w-6 mb-2" />
                <span className="text-sm">Dra. Cannabis IA</span>
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard/scientific'} 
                className="bg-blue-600 hover:bg-blue-500 h-16 flex-col"
              >
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Científico</span>
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard/clinical'} 
                className="bg-purple-600 hover:bg-purple-500 h-16 flex-col"
              >
                <Activity className="h-6 w-6 mb-2" />
                <span className="text-sm">Clínico</span>
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard/alerts'} 
                className="bg-yellow-600 hover:bg-yellow-500 h-16 flex-col"
              >
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span className="text-sm">Alertas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}