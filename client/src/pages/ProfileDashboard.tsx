import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import PatientDashboard from "./PatientDashboard";
import ProfessionalDashboard from "./ProfessionalDashboard";

export default function ProfileDashboard() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/profile"],
  });

  // Determinar tipo de usuário baseado no perfil
  const userType = profile?.role === 'medico' || profile?.role === 'admin' ? 'professional' : 'patient';

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
    const isAuthError = error?.message?.includes('401') || error?.message?.includes('Não autenticado');
    
    if (isAuthError) {
      return (
        <div className="container mx-auto px-4 py-8 pt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-circle text-white text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Perfil do Usuário</h2>
            <p className="text-gray-400 mb-6">Para acessar seu perfil, faça login no sistema</p>
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
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar perfil. Tente novamente.</p>
        </div>
      </div>
    );
  }

  // Renderizar dashboard baseado no tipo de usuário
  if (userType === 'professional') {
    return <ProfessionalDashboard />;
  } else {
    return <PatientDashboard />;
  }
}