import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import VoiceSettings from "@/components/VoiceSettings";

export default function ProfileDashboard() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/profile"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <span className="ml-4 text-green-500">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar perfil. Tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 pt-12 sm:pt-14">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mr-4">
          <i className="fas fa-user-circle text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-base sm:text-2xl font-bold text-white">Perfil do Usuário</h1>
          <p className="text-xs sm:text-sm text-gray-400">Configurações e preferências profissionais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Informações Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</Label>
                  <Input 
                    type="text" 
                    defaultValue={profile?.name || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white h-12"
                    data-testid="profile-name-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Especialidade Médica</Label>
                  <select 
                    defaultValue={profile?.specialty || "cannabis_medicine"} 
                    className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-3 h-12"
                    data-testid="profile-specialty-select"
                  >
                    <option value="cannabis_medicine">Medicina Cannabis</option>
                    <option value="neurology">Neurologia</option>
                    <option value="pediatrics">Pediatria</option>
                    <option value="psychiatry">Psiquiatria</option>
                    <option value="pain_medicine">Medicina da Dor</option>
                    <option value="oncology">Oncologia</option>
                    <option value="epilepsy">Epileptologia</option>
                    <option value="research">Pesquisador</option>
                  </select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Email Institucional</Label>
                  <Input 
                    type="email" 
                    defaultValue={profile?.email || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-email-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">CRM / Registro Profissional</Label>
                  <Input 
                    type="text" 
                    defaultValue={profile?.crm || ""} 
                    placeholder="Ex: CRM/SP 123456 ou CFM 123456"
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-crm-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Instituição</Label>
                  <Input 
                    type="text" 
                    defaultValue={profile?.institution || ""} 
                    placeholder="Hospital, Clínica ou Universidade"
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-institution-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Experiência com Cannabis Medicinal</Label>
                  <select 
                    defaultValue="intermediate" 
                    className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-2"
                    data-testid="profile-cannabis-experience-select"
                  >
                    <option value="beginner">Iniciante (&lt; 1 ano)</option>
                    <option value="intermediate">Intermediário (1-3 anos)</option>
                    <option value="advanced">Avançado (3-5 anos)</option>
                    <option value="expert">Especialista (&gt; 5 anos)</option>
                  </select>
                </div>
              </div>
              <Button 
                className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
                data-testid="save-profile-button"
              >
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Preferências da Plataforma</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Dr. Cannabis IA - Consultas por voz</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="voice-consultation-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Alertas regulatórios ANVISA/Health Canada</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="regulatory-alerts-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notificações de estudos científicos</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="scientific-notifications-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Análise automática de submissões</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="auto-analysis-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Correção automática de termos médicos</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="medical-correction-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Integração com fórum colaborativo</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="forum-integration-toggle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Settings Section */}
          <VoiceSettings />
        </div>

        {/* Profile Stats */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center profile-avatar">
                <i className="fas fa-user-md text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{profile?.name || "Usuário"}</h3>
              <p className="text-gray-400 mb-4">{profile?.specialty || "Médico"}</p>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">4.9</div>
                  <div className="text-xs text-gray-400">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">156</div>
                  <div className="text-xs text-gray-400">Estudos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <i className="fas fa-plus-circle text-green-400 mr-3" />
                  <div>
                    <p className="text-sm text-white">Estudo submetido para análise</p>
                    <p className="text-xs text-gray-400">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-comment text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm text-white">Discussão criada no fórum</p>
                    <p className="text-xs text-gray-400">Há 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-bell text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm text-white">Novo alerta ANVISA</p>
                    <p className="text-xs text-gray-400">Ontem</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-4">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                  <i className="fas fa-file-medical text-white text-xl mb-1" />
                  <p className="text-xs text-white">12 Estudos</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                  <i className="fas fa-comments text-white text-xl mb-1" />
                  <p className="text-xs text-white">8 Discussões</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg">
                  <i className="fas fa-chart-line text-white text-xl mb-1" />
                  <p className="text-xs text-white">3 Aprovados</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg">
                  <i className="fas fa-clock text-white text-xl mb-1" />
                  <p className="text-xs text-white">5 Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}