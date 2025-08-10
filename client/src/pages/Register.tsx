import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    crm: '',
    specialty: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          crm: formData.crm,
          specialty: formData.specialty
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Sua conta foi criada. Redirecionando para o login...",
        });
        setTimeout(() => {
          setLocation('/login');
        }, 2000);
      } else {
        toast({
          title: "Erro no cadastro",
          description: data.message || "Erro ao criar conta",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Erro de conexão com o servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-green-400/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Card className="w-full max-w-lg bg-black/40 backdrop-blur-md border-cyan-500/30 relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-cannabis w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
          <CardDescription className="text-cyan-300">
            Junte-se à Plataforma Médica NeuroCann Lab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Dr. João Silva"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                  required
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm" className="text-white">
                  CRM
                </Label>
                <Input
                  id="crm"
                  name="crm"
                  type="text"
                  placeholder="123456/SP"
                  value={formData.crm}
                  onChange={handleInputChange}
                  className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                  required
                  data-testid="input-crm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-white">
                Especialidade
              </Label>
              <Input
                id="specialty"
                name="specialty"
                type="text"
                placeholder="ex: Neurologia, Oncologia"
                value={formData.specialty}
                onChange={handleInputChange}
                className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                required
                data-testid="input-specialty"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 pr-10"
                    required
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 pr-10"
                    required
                    data-testid="input-confirm-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors"
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              data-testid="button-register"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Criando Conta...' : 'Criar Conta'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-3">
            <div className="text-sm text-gray-400">
              Já tem uma conta?
            </div>
            <Button
              variant="ghost"
              onClick={() => setLocation('/login')}
              className="text-cyan-300 hover:text-cyan-200 hover:bg-white/5"
              data-testid="button-go-login"
            >
              Fazer Login
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/landing')}
              className="text-gray-400 hover:text-gray-300 hover:bg-white/5 block mx-auto"
              data-testid="button-back-landing"
            >
              ← Voltar para Landing Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}