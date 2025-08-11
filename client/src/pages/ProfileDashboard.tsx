import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import VoiceSettings from "@/components/VoiceSettings";
import { PatientDataModal } from "@/components/PatientDataModal";
import { useState } from "react";

export default function ProfileDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'evolution' | 'analysis' | 'reports'>('add');
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(true);
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);
  
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Informações Pessoais</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPersonalInfoExpanded(!personalInfoExpanded)}
                  className="text-gray-400 hover:text-white"
                  data-testid="toggle-personal-info"
                >
                  <i className={`fas ${personalInfoExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </Button>
              </div>
              {personalInfoExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</Label>
                  <Input 
                    type="text" 
                    defaultValue={(profile as any)?.name || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white h-12"
                    data-testid="profile-name-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Especialidade Médica</Label>
                  <select 
                    defaultValue={(profile as any)?.specialty || "cannabis_medicine"} 
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
                    defaultValue={(profile as any)?.email || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-email-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">CRM / Registro Profissional</Label>
                  <Input 
                    type="text" 
                    defaultValue={(profile as any)?.crm || ""} 
                    placeholder="Ex: CRM/SP 123456 ou CFM 123456"
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-crm-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Instituição</Label>
                  <Input 
                    type="text" 
                    defaultValue={(profile as any)?.institution || ""} 
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
                  <Button 
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
                    data-testid="save-profile-button"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Preferências da Plataforma</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreferencesExpanded(!preferencesExpanded)}
                  className="text-gray-400 hover:text-white"
                  data-testid="toggle-preferences"
                >
                  <i className={`fas ${preferencesExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </Button>
              </div>
              {preferencesExpanded && (
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
              )}
            </CardContent>
          </Card>

          {/* POTÊNCIA DE DADOS - Sistema de Coleta Médica */}
          <Card className="bg-gray-800/50 border border-green-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <i className="fas fa-database text-green-400 text-2xl mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Potência de Dados</h2>
                  <p className="text-sm text-gray-400">Coleta estruturada para pesquisa e IA</p>
                </div>
              </div>
              
              <div className="bg-green-900/20 p-4 rounded-lg mb-6">
                <h3 className="text-green-400 font-medium mb-2">🧠 Como funciona:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Registre sintomas, evolução e mudanças de tratamento</li>
                  <li>• IA detecta padrões e correlações automaticamente</li>
                  <li>• Dados anonimizados geram estudos científicos</li>
                  <li>• Exemplo: "CBD isolado eficaz em 68% dos casos de dor crônica"</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 h-auto"
                  data-testid="add-patient-data-button"
                  onClick={() => {
                    setModalMode('add');
                    setModalOpen(true);
                  }}
                >
                  <div className="text-center">
                    <i className="fas fa-plus-circle text-lg mb-1" />
                    <div className="text-sm font-medium">Registrar Caso</div>
                    <div className="text-xs opacity-80">Novo paciente</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 h-auto"
                  data-testid="track-evolution-button"
                  onClick={() => {
                    setModalMode('evolution');
                    setModalOpen(true);
                  }}
                >
                  <div className="text-center">
                    <i className="fas fa-chart-line text-lg mb-1" />
                    <div className="text-sm font-medium">Evolução</div>
                    <div className="text-xs opacity-80">Acompanhar progresso</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 h-auto"
                  data-testid="ai-analysis-button"
                  onClick={() => {
                    setModalMode('analysis');
                    setModalOpen(true);
                  }}
                >
                  <div className="text-center">
                    <i className="fas fa-brain text-lg mb-1" />
                    <div className="text-sm font-medium">Análise IA</div>
                    <div className="text-xs opacity-80">Padrões detectados</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 h-auto"
                  data-testid="anonymized-reports-button"
                  onClick={() => {
                    setModalMode('reports');
                    setModalOpen(true);
                  }}
                >
                  <div className="text-center">
                    <i className="fas fa-file-medical text-lg mb-1" />
                    <div className="text-sm font-medium">Relatórios</div>
                    <div className="text-xs opacity-80">Dados anonimizados</div>
                  </div>
                </Button>
              </div>

              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-white font-medium mb-3">📊 Estatísticas Atuais:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">23</div>
                    <div className="text-xs text-gray-400">Casos registrados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">156</div>
                    <div className="text-xs text-gray-400">Pontos evolução</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">8</div>
                    <div className="text-xs text-gray-400">Padrões IA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">100%</div>
                    <div className="text-xs text-gray-400">Anonimizado</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Stats */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center profile-avatar">
                <i className="fas fa-user-md text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{(profile as any)?.name || "Usuário"}</h3>
              <p className="text-gray-400 mb-4">{(profile as any)?.specialty || "Médico"}</p>
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

      {/* Modal Potência de Dados */}
      <PatientDataModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
      />
    </div>
  );
}