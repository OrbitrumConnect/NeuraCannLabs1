import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import VoiceSettings from "@/components/VoiceSettings";
import { PatientDataModal } from "@/components/PatientDataModal";
import { useState } from "react";

export default function ProfessionalDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'evolution' | 'analysis' | 'reports'>('add');
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(false);
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);
  const [patientManagementExpanded, setPatientManagementExpanded] = useState(false);
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/profile"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-blue-500">Carregando perfil profissional...</span>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error?.message?.includes('401') || error?.message?.includes('Não autenticado');
    
    if (isAuthError) {
      return (
        <div className="container mx-auto px-4 py-8 pt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-md text-white text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Perfil Profissional</h2>
            <p className="text-gray-400 mb-6">Para acessar e personalizar seu perfil médico, faça login no sistema</p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <i className="fas fa-sign-in-alt mr-2" />
              Fazer Login
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <i className="fas fa-exclamiation-triangle text-4xl mb-4" />
          <p>Erro ao carregar perfil. Tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 pt-12 sm:pt-14">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
          <i className="fas fa-user-md text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-base sm:text-2xl font-bold text-white">Perfil Profissional</h1>
          <p className="text-xs sm:text-sm text-gray-400">Configurações médicas e gestão de pacientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Professional Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Dados Profissionais</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPersonalInfoExpanded(!personalInfoExpanded)}
                  className="text-gray-400 hover:text-white"
                  data-testid="toggle-professional-info"
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
                    data-testid="professional-name-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Especialidade Médica</Label>
                  <select 
                    defaultValue={(profile as any)?.specialty || "cannabis_medicine"} 
                    className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-3 h-12"
                    data-testid="professional-specialty-select"
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
                    data-testid="professional-email-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">CRM / Registro Profissional</Label>
                  <Input 
                    type="text" 
                    defaultValue={(profile as any)?.crm || ""} 
                    placeholder="Ex: CRM/SP 123456 ou CFM 123456"
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="professional-crm-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Instituição</Label>
                  <Input 
                    type="text" 
                    defaultValue={(profile as any)?.institution || ""} 
                    placeholder="Hospital, Clínica ou Universidade"
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="professional-institution-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Experiência com Cannabis Medicinal</Label>
                  <select 
                    defaultValue="intermediate" 
                    className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-2"
                    data-testid="professional-cannabis-experience-select"
                  >
                    <option value="beginner">Iniciante (&lt; 1 ano)</option>
                    <option value="intermediate">Intermediário (1-3 anos)</option>
                    <option value="advanced">Avançado (3-5 anos)</option>
                    <option value="expert">Especialista (&gt; 5 anos)</option>
                  </select>
                </div>
                  <Button 
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                    data-testid="save-professional-profile"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Management System */}
          <Card className="bg-gray-800/50 border border-emerald-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <i className="fas fa-users text-emerald-400 text-2xl mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Gestão de Pacientes</h2>
                    <p className="text-sm text-gray-400">Prontuários e acompanhamento</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPatientManagementExpanded(!patientManagementExpanded)}
                  className="text-gray-400 hover:text-white"
                  data-testid="toggle-patient-management"
                >
                  <i className={`fas ${patientManagementExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </Button>
              </div>

              {patientManagementExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 h-auto"
                  data-testid="view-patient-list-button"
                >
                  <div className="text-center">
                    <i className="fas fa-list text-lg mb-1" />
                    <div className="text-sm font-medium">Lista de Pacientes</div>
                    <div className="text-xs opacity-80">Ver todos os prontuários</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 h-auto"
                  data-testid="new-prescription-button"
                >
                  <div className="text-center">
                    <i className="fas fa-prescription text-lg mb-1" />
                    <div className="text-sm font-medium">Nova Receita</div>
                    <div className="text-xs opacity-80">Prescrever tratamento</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 h-auto"
                  data-testid="patient-requests-button"
                >
                  <div className="text-center">
                    <i className="fas fa-bell text-lg mb-1" />
                    <div className="text-sm font-medium">Solicitações</div>
                    <div className="text-xs opacity-80">Pedidos de pacientes</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 h-auto"
                  data-testid="treatment-analytics-button"
                >
                  <div className="text-center">
                    <i className="fas fa-chart-bar text-lg mb-1" />
                    <div className="text-sm font-medium">Analytics</div>
                    <div className="text-xs opacity-80">Eficácia dos tratamentos</div>
                  </div>
                </Button>
              </div>
              )}

              <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg">
                <h4 className="text-white font-medium mb-3">📊 Estatísticas da Clínica:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-400">42</div>
                    <div className="text-xs text-gray-400">Pacientes ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">87%</div>
                    <div className="text-xs text-gray-400">Taxa de melhora</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">156</div>
                    <div className="text-xs text-gray-400">Prescrições</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">23</div>
                    <div className="text-xs text-gray-400">Este mês</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Data System - Professional */}
          <Card className="bg-gray-800/50 border border-green-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <i className="fas fa-database text-green-400 text-2xl mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Base de Dados Científicos</h2>
                  <p className="text-sm text-gray-400">Coleta estruturada para pesquisa e IA</p>
                </div>
              </div>
              
              <div className="bg-green-900/20 p-4 rounded-lg mb-6">
                <h3 className="text-green-400 font-medium mb-2">🧠 Sistema Integrado:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Registre casos, evolução e mudanças de tratamento</li>
                  <li>• IA detecta padrões e correlações automaticamente</li>
                  <li>• Dados anonimizados geram estudos científicos</li>
                  <li>• Exemplo: "CBD isolado eficaz em 68% dos casos de dor crônica"</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 h-auto"
                  data-testid="add-case-data-button"
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
                  data-testid="track-patient-evolution-button"
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
                  data-testid="ai-pattern-analysis-button"
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
                  data-testid="research-reports-button"
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
                <h4 className="text-white font-medium mb-3">📊 Contribuição Científica:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">89</div>
                    <div className="text-xs text-gray-400">Casos registrados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">340</div>
                    <div className="text-xs text-gray-400">Pontos evolução</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">15</div>
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

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Voice Settings */}
          <VoiceSettings />

          {/* Professional Preferences */}
          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Configurações Médicas</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreferencesExpanded(!preferencesExpanded)}
                  className="text-gray-400 hover:text-white"
                  data-testid="toggle-medical-preferences"
                >
                  <i className={`fas ${preferencesExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </Button>
              </div>
              {preferencesExpanded && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Dra. Cannabis IA - Consultas por voz</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="voice-consultation-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notificações de pacientes</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="patient-notifications-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Alertas de prescrições</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="prescription-alerts-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Relatórios semanais</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="weekly-reports-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Contribuir para pesquisa</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="contribute-research-toggle"
                  />
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-600 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500"
                  data-testid="emergency-prescription-button"
                >
                  <i className="fas fa-plus mr-2" />
                  Receita de Emergência
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
                  data-testid="patient-consultation-button"
                >
                  <i className="fas fa-video mr-2" />
                  Consulta Online
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
                  data-testid="research-contribution-button"
                >
                  <i className="fas fa-flask mr-2" />
                  Contribuir Pesquisa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patient Data Modal */}
      <PatientDataModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
      />
    </div>
  );
}