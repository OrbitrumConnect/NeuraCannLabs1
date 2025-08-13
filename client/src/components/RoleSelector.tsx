import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, User } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface RoleSelectorProps {
  onRoleSelected: (role: string) => void;
}

export default function RoleSelector({ onRoleSelected }: RoleSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const selectRole = async (role: 'medico' | 'paciente') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao definir role');
      }
      
      // Salvar no localStorage para redirecionamento
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        localStorage.setItem('user', JSON.stringify({ ...userData, role }));
      }
      
      toast({
        title: "Perfil definido",
        description: `Você será redirecionado para o painel ${role === 'medico' ? 'médico' : 'do usuário'}.`
      });
      
      onRoleSelected(role);
    } catch (error) {
      console.error('Erro ao definir role:', error);
      toast({
        title: "Erro",
        description: "Não foi possível definir o perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-emerald-400">
            Bem-vindo ao NeuroCann Lab
          </h1>
          <p className="text-slate-400">
            Escolha seu perfil para personalizar sua experiência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profissional da Saúde */}
          <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center justify-center space-x-2">
                <Stethoscope className="h-8 w-8" />
                <span>Profissional da Saúde</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-slate-300">
                  Acesso completo a ferramentas médicas, estatísticas de pacientes e recursos profissionais
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                    Painel Médico
                  </Badge>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                    Consultas IA
                  </Badge>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                    Relatórios
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={() => selectRole('medico')}
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isLoading ? 'Configurando...' : 'Sou Profissional da Saúde'}
              </Button>
            </CardContent>
          </Card>

          {/* Usuário/Paciente */}
          <Card className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center justify-center space-x-2">
                <User className="h-8 w-8" />
                <span>Usuário</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-slate-300">
                  Interface amigável para acompanhamento pessoal, consultas e histórico médico
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    Painel Pessoal
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    Dra. Cannabis
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    Acompanhamento
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={() => selectRole('paciente')}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? 'Configurando...' : 'Sou Usuário/Paciente'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-slate-500">
          Você pode alterar seu perfil a qualquer momento nas configurações
        </div>
      </div>
    </div>
  );
}