import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";

interface NavigationProps {
  userRole: string | null;
}

export default function DashboardNavigation({ userRole }: NavigationProps) {
  const [location, navigate] = useLocation();

  // Função para determinar se o usuário é profissional
  const isProfessional = userRole === 'medico' || userRole === 'admin';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {/* Botão Dashboard Atual */}
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-2 flex items-center gap-2">
        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-white font-medium">
          {isProfessional ? 'Modo Profissional' : 'Modo Paciente'}
        </span>
      </div>

      {/* Botões de Navegação */}
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-1 flex gap-1">
        {isProfessional ? (
          <>
            {/* Professional Navigation */}
            <Button
              variant={location === '/professional' || location === '/' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/professional')}
              className={`text-xs px-3 ${
                location === '/professional' || location === '/' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              data-testid="nav-professional-dashboard"
            >
              <i className="fas fa-user-md mr-1" />
              Profissional
            </Button>
            <Button
              variant={location === '/patient' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/patient')}
              className={`text-xs px-3 ${
                location === '/patient' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              data-testid="nav-patient-view"
            >
              <i className="fas fa-heart mr-1" />
              Vista Paciente
            </Button>
          </>
        ) : (
          <>
            {/* Patient Navigation */}
            <Button
              variant={location === '/patient' || location === '/' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/patient')}
              className={`text-xs px-3 ${
                location === '/patient' || location === '/' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              data-testid="nav-patient-dashboard"
            >
              <i className="fas fa-heart mr-1" />
              Paciente
            </Button>
            <Button
              variant={location === '/professional' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/professional')}
              className={`text-xs px-3 ${
                location === '/professional' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              data-testid="nav-professional-view"
            >
              <i className="fas fa-user-md mr-1" />
              Vista Médica
            </Button>
          </>
        )}

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* Education */}
        <Button
          variant={location === '/education' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleNavigate('/education')}
          className={`text-xs px-3 ${
            location === '/education' 
              ? 'bg-yellow-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          data-testid="nav-education"
        >
          <i className="fas fa-graduation-cap mr-1" />
          Academy
        </Button>

        {/* Profile */}
        <Button
          variant={location === '/profile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleNavigate('/profile')}
          className={`text-xs px-3 ${
            location === '/profile' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          data-testid="nav-profile"
        >
          <i className="fas fa-user-circle mr-1" />
          Perfil
        </Button>

        {/* Admin Panel (só para admins) */}
        {userRole === 'admin' && (
          <Button
            variant={location === '/admin' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigate('/admin')}
            className={`text-xs px-3 ${
              location === '/admin' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            data-testid="nav-admin"
          >
            <i className="fas fa-cog mr-1" />
            Admin
          </Button>
        )}
      </div>

      {/* Help Button */}
      <Button
        variant="ghost"
        size="sm"
        className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
        data-testid="nav-help"
        onClick={() => {
          alert('Sistema NeuroCann Lab v3.0\n\n' +
                '🏥 Paciente: Histórico médico, encontrar médicos\n' +
                '👩‍⚕️ Profissional: Gerenciar pacientes, prescrições\n' +
                '⚙️ Admin: Controle total do sistema\n\n' +
                'Use os botões do cabeçalho para navegar!');
        }}
      >
        <i className="fas fa-question-circle" />
      </Button>
    </div>
  );
}