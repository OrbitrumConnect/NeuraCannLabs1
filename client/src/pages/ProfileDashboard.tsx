import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileDashboard() {
  const { data: profile, isLoading, error } = useQuery<Omit<User, 'password'>>({
    queryKey: ["/api/profile"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          <span className="ml-4 text-neon-cyan">Carregando perfil...</span>
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mr-4 profile-avatar">
          <i className="fas fa-user-circle text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Perfil do Usuário</h1>
          <p className="text-gray-400">Configurações e preferências pessoais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-name-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Especialidade</Label>
                  <Input 
                    type="text" 
                    defaultValue={profile?.specialty || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-specialty-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Email</Label>
                  <Input 
                    type="email" 
                    defaultValue={profile?.email || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-email-input"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">CRM</Label>
                  <Input 
                    type="text" 
                    defaultValue={profile?.crm || ""} 
                    className="w-full bg-gray-700 border-gray-500 text-white"
                    data-testid="profile-crm-input"
                  />
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
                  <span className="text-gray-300">Tema escuro</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="dark-theme-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notificações por email</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="email-notifications-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Avatar 3D interativo</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="avatar-3d-toggle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Análise automática IA</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded bg-gray-700 border-gray-500"
                    data-testid="ai-analysis-toggle"
                  />
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
              <h3 className="text-xl font-semibold text-white mb-2">{profile?.name || "Usuário"}</h3>
              <p className="text-gray-400 mb-4">{profile?.specialty || "Médico"}</p>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">4.9</div>
                  <div className="text-xs text-gray-400">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">156</div>
                  <div className="text-xs text-gray-400">Casos</div>
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
                    <p className="text-sm text-white">Novo caso registrado</p>
                    <p className="text-xs text-gray-400">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-comment text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm text-white">Comentário adicionado</p>
                    <p className="text-xs text-gray-400">Há 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-download text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm text-white">Relatório exportado</p>
                    <p className="text-xs text-gray-400">Ontem</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-600 rounded-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-4">Conquistas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
                  <i className="fas fa-medal text-white text-xl mb-1" />
                  <p className="text-xs text-white">100 Casos</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg">
                  <i className="fas fa-star text-white text-xl mb-1" />
                  <p className="text-xs text-white">Expert</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
