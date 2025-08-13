import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DoctorFinder from "@/components/DoctorFinder";
import DashboardLayout from "@/components/DashboardLayout";

export default function PatientDashboard() {
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(false);
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);
  const [findDoctorModalOpen, setFindDoctorModalOpen] = useState(false);
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/profile"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <span className="ml-4 text-green-500">Carregando perfil do paciente...</span>
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-heart text-white text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Perfil do Paciente</h2>
            <p className="text-gray-400 mb-6">Para acessar seu perfil e histórico médico, faça login no sistema</p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
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
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar perfil. Tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Meu Perfil - Paciente</h1>
        <p className="text-gray-400">Histórico médico e tratamento com cannabis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Profile Info */}
        <div className="lg:col-span-2 space-y-6 scale-80">
          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Informações Pessoais</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPersonalInfoExpanded(!personalInfoExpanded)}
                  className="text-gray-400 hover:text-white"
                  data-testid="toggle-patient-info"
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
                    data-testid="patient-name-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Data de Nascimento</Label>
                  <Input 
                    type="date" 
                    className="w-full bg-gray-700 border-gray-500 text-white h-12"
                    data-testid="patient-birth-date"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Email</Label>
                  <Input 
                    type="email" 
                    defaultValue={(profile as any)?.email || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="patient-email-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Telefone</Label>
                  <Input 
                    type="tel" 
                    placeholder="(11) 99999-9999"
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="patient-phone-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">CPF</Label>
                  <Input 
                    type="text" 
                    placeholder="000.000.000-00"
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="patient-cpf-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Condição Principal</Label>
                  <select 
                    className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-3 h-12"
                    data-testid="patient-condition-select"
                  >
                    <option value="">Selecione...</option>
                    <option value="chronic_pain">Dor Crônica</option>
                    <option value="anxiety">Ansiedade</option>
                    <option value="epilepsy">Epilepsia</option>
                    <option value="insomnia">Insônia</option>
                    <option value="depression">Depressão</option>
                    <option value="cancer">Câncer</option>
                    <option value="autism">TEA (Autismo)</option>
                    <option value="parkinson">Parkinson</option>
                    <option value="other">Outra</option>
                  </select>
                </div>
                  <Button 
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
                    data-testid="save-patient-profile"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="bg-gray-800/50 border border-blue-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <i className="fas fa-notes-medical text-blue-400 text-2xl mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Histórico Médico</h2>
                  <p className="text-sm text-gray-400">Registros do seu tratamento</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 h-auto"
                  data-testid="view-prescriptions-button"
                >
                  <div className="text-center">
                    <i className="fas fa-prescription text-lg mb-1" />
                    <div className="text-sm font-medium">Receitas</div>
                    <div className="text-xs opacity-80">Ver prescrições</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 h-auto"
                  data-testid="symptom-diary-button"
                >
                  <div className="text-center">
                    <i className="fas fa-calendar-check text-lg mb-1" />
                    <div className="text-sm font-medium">Diário</div>
                    <div className="text-xs opacity-80">Sintomas e efeitos</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-lime-600 hover:from-green-400 hover:to-lime-500 h-auto"
                  data-testid="treatment-progress-button"
                >
                  <div className="text-center">
                    <i className="fas fa-chart-line text-lg mb-1" />
                    <div className="text-sm font-medium">Progresso</div>
                    <div className="text-xs opacity-80">Evolução do tratamento</div>
                  </div>
                </Button>
                
                <Button 
                  className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 h-auto"
                  data-testid="medical-reports-button"
                >
                  <div className="text-center">
                    <i className="fas fa-file-medical-alt text-lg mb-1" />
                    <div className="text-sm font-medium">Relatórios</div>
                    <div className="text-xs opacity-80">Exames e consultas</div>
                  </div>
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
                <h4 className="text-white font-medium mb-3">📊 Resumo do Tratamento:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">45 dias</div>
                    <div className="text-xs text-gray-400">Em tratamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">78%</div>
                    <div className="text-xs text-gray-400">Melhora relatada</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">3</div>
                    <div className="text-xs text-gray-400">Medicamentos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">12</div>
                    <div className="text-xs text-gray-400">Registros diário</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 scale-80">
          {/* Find Doctor Card */}
          <Card className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-600 rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-md text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Procurar Médico</h3>
                <p className="text-sm text-gray-400 mb-4">Encontre um profissional especializado em cannabis medicinal</p>
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500"
                  data-testid="find-doctor-button"
                  onClick={() => setFindDoctorModalOpen(true)}
                >
                  <i className="fas fa-search mr-2" />
                  Buscar Especialistas
                </Button>
                
                {/* Doctor Finder Modal */}
                <DoctorFinder 
                  open={findDoctorModalOpen}
                  onOpenChange={setFindDoctorModalOpen}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-600 rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-phone-alt text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Contato de Emergência</h3>
                <p className="text-sm text-gray-400 mb-4">Precisa de ajuda médica urgente?</p>
                <Button 
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500"
                  data-testid="emergency-contact-button"
                >
                  <i className="fas fa-ambulance mr-2" />
                  Emergência
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Configurações</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreferencesExpanded(!preferencesExpanded)}
                  className="text-gray-400 hover:text-white"
                  data-testid="toggle-patient-preferences"
                >
                  <i className={`fas ${preferencesExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </Button>
              </div>
              {preferencesExpanded && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notificações de medicamento</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="medication-notifications-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Lembretes de diário</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="diary-reminders-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Compartilhar dados (anônimo)</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="share-anonymous-data-toggle"
                  />
                </div>
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}