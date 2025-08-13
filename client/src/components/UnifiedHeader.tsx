import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UnifiedHeaderProps {
  userRole?: string | null;
  userName?: string;
  currentPage?: string;
  onLogout?: () => void;
}

export default function UnifiedHeader({ 
  userRole = null, 
  userName = "Usuário", 
  currentPage = "Dashboard",
  onLogout 
}: UnifiedHeaderProps) {
  const [location, navigate] = useLocation();

  const isProfessional = userRole === 'medico' || userRole === 'admin';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
    onLogout?.();
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'Academy': return 'NeuroCann Academy';
      case 'Admin': return 'Painel Administrativo';
      case 'Professional': return 'Dashboard Profissional';
      case 'Patient': return 'Dashboard Paciente';
      case 'Profile': return 'Perfil do Usuário';
      default: return 'NeuroCann Lab';
    }
  };

  const getRoleIndicator = () => {
    if (userRole === 'admin') return { color: 'bg-red-500', text: 'Administrador' };
    if (userRole === 'medico') return { color: 'bg-emerald-500', text: 'Profissional' };
    return { color: 'bg-blue-500', text: 'Paciente' };
  };

  const role = getRoleIndicator();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        
        {/* Logo e Título da Página */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
          </div>
          
          {/* Indicador de Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-800/60 rounded-full border border-gray-600">
            <div className={`w-2 h-2 ${role.color} rounded-full animate-pulse`}></div>
            <span className="text-xs font-medium text-gray-300">{role.text}</span>
          </div>
        </div>

        {/* Navegação Principal */}
        <nav className="hidden md:flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
          {/* Dashboard Buttons */}
          {isProfessional ? (
            <>
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
                👩‍⚕️ Profissional
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
                ❤️ Vista Paciente
              </Button>
            </>
          ) : (
            <>
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
                ❤️ Paciente
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
                👩‍⚕️ Vista Médica
              </Button>
            </>
          )}

          {/* Separador */}
          <div className="w-px h-6 bg-gray-600 mx-1"></div>

          {/* Academy - Destaque especial */}
          <Button
            variant={location === '/education' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleNavigate('/education')}
            className={`text-xs px-3 font-semibold border transition-all ${
              location === '/education' 
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/25' 
                : 'text-emerald-300 border-emerald-600/50 bg-emerald-900/20 hover:text-white hover:bg-emerald-600 hover:border-emerald-500'
            }`}
            data-testid="nav-education"
          >
            🎓 Academy
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
            👤 Perfil
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
              ⚙️ Admin
            </Button>
          )}
        </nav>

        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:block text-sm font-medium">{userName}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
            <DropdownMenuLabel className="text-gray-300">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              onClick={() => handleNavigate('/profile')}
              className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-400 hover:text-white hover:bg-red-600 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu Mobile (Hamburguer) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-300">
                <div className="w-6 h-6 flex flex-col justify-center gap-1">
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
              <DropdownMenuLabel className="text-gray-300">Navegação</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              
              <DropdownMenuItem onClick={() => handleNavigate(isProfessional ? '/professional' : '/patient')} className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                {isProfessional ? '👩‍⚕️ Profissional' : '❤️ Paciente'}
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleNavigate('/education')} className="text-emerald-300 hover:text-white hover:bg-emerald-700 cursor-pointer">
                🎓 Academy
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleNavigate('/profile')} className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                👤 Perfil
              </DropdownMenuItem>
              
              {userRole === 'admin' && (
                <DropdownMenuItem onClick={() => handleNavigate('/admin')} className="text-red-300 hover:text-white hover:bg-red-700 cursor-pointer">
                  ⚙️ Admin
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-white hover:bg-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}