import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Shield, 
  Users, 
  Microscope, 
  FileText, 
  MessageSquare, 
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Building,
  UserPlus,
  LogIn,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('about');
  const [scrollY, setScrollY] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <i className="fas fa-cannabis w-8 h-8 text-green-500" />,
      title: "IA Médica Especializada",
      description: "Dr. Cannabis IA com conhecimento científico atualizado em cannabis medicinal"
    },
    {
      icon: <Microscope className="w-8 h-8 text-cyan-500" />,
      title: "Pesquisa Científica",
      description: "Acesso direto a estudos do PubMed, ClinicalTrials.gov e ANVISA"
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "Sistema de Submissão",
      description: "Envie e revise estudos científicos com validação por pares"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-orange-600" />,
      title: "Fórum Médico",
      description: "Discussões entre profissionais de saúde especializados"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Segurança Médica",
      description: "Plataforma certificada para dados médicos sensíveis"
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Colaboração Médica",
      description: "Rede de profissionais e instituições parceiras"
    }
  ];

  const partners = [
    { name: "Hospital das Clínicas", logo: "/api/placeholder/150/80", category: "Hospitais" },
    { name: "ANVISA", logo: "/api/placeholder/150/80", category: "Reguladores" },
    { name: "Universidade de São Paulo", logo: "/api/placeholder/150/80", category: "Universidades" },
    { name: "Instituto Nacional do Câncer", logo: "/api/placeholder/150/80", category: "Institutos" },
    { name: "Sociedade Brasileira de Neurologia", logo: "/api/placeholder/150/80", category: "Sociedades" },
    { name: "Cannabis Research Institute", logo: "/api/placeholder/150/80", category: "Pesquisa" }
  ];

  const testimonials = [
    {
      name: "Dr. Maria Silva",
      role: "Neurologista - HC-FMUSP",
      text: "Revolucionou minha prática clínica. Acesso rápido a evidências científicas atualizadas.",
      rating: 5
    },
    {
      name: "Dr. João Santos",
      role: "Oncologista - INCA",
      text: "Plataforma essencial para prescrição segura de cannabis medicinal.",
      rating: 5
    },
    {
      name: "Dra. Ana Costa",
      role: "Pesquisadora - UNIFESP",
      text: "Sistema de submissão de estudos mais eficiente que já usei.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div 
          className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-40 left-1/2 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-2000"
          style={{ transform: `translateY(${scrollY * 0.7}px)` }}
        />
      </div>

      {/* Header - Mobile Optimized */}
      <header className="relative z-50 bg-background/40 backdrop-blur-md border-b border-primary/30 sticky top-0 transition-all duration-300">
        <div className="container mx-auto px-2 sm:px-3 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 sm:space-x-2 group cursor-pointer">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-cyan-400 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <i className="fas fa-cannabis w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  NeuroCann Lab
                </h1>
                <p className="text-xs text-primary group-hover:text-primary/80 transition-colors duration-300 hidden sm:block">
                  Plataforma Médica de Cannabis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Button 
                variant="ghost" 
                className="text-foreground hover:bg-foreground/10 hover:scale-105 transition-all duration-300 group h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" 
                data-testid="button-login"
                onClick={() => window.location.href = '/login'}
              >
                <LogIn className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 group-hover:text-cyan-300 transition-colors" />
                Entrar
              </Button>
              <Button 
                className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" 
                data-testid="button-register"
                onClick={() => window.location.href = '/register'}
              >
                <UserPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative py-8 sm:py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-cyan-600/20" />
        <div className="container mx-auto px-2 sm:px-3 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-3 sm:mb-4 bg-green-600/20 text-green-300 border-green-500 hover:bg-green-600/30 hover:scale-105 transition-all duration-500 cursor-default text-xs">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
              Plataforma Médica Oficial
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Cannabis Medicinal
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary hover:from-green-300 hover:to-primary/80 transition-all duration-500">
                {" "}Baseada em Evidência
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground mb-5 sm:mb-6 md:mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              Plataforma científica para profissionais de saúde com IA especializada, 
              pesquisa atualizada e sistema colaborativo de estudos médicos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 group w-full sm:w-auto"
                data-testid="button-start-trial"
                onClick={() => {
                  // Simular login do usuário para acesso direto à plataforma
                  localStorage.setItem('user', JSON.stringify({
                    id: 'admin-1',
                    name: 'Administrador',
                    email: 'Phpg69@gmail.com',
                    userType: 'admin',
                    plan: 'free'
                  }));
                  window.location.href = '/';
                }}
              >
                <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Começar Gratuitamente
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-200 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
                data-testid="button-demo"
              >
                Ver Demonstração
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="container mx-auto px-3 py-8 sm:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto bg-black/20 backdrop-blur-md border border-cyan-500/20 h-10 sm:h-auto">
            <TabsTrigger 
              value="about" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 hover:bg-white/5 transition-all duration-300 group"
            >
              <i className="fas fa-cannabis w-4 h-4 mr-2 group-hover:text-green-300 transition-colors" />
              <span className="hidden sm:inline">Sobre Nós</span>
              <span className="sm:hidden">Sobre</span>
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 hover:bg-white/5 transition-all duration-300 group"
            >
              <Zap className="w-4 h-4 mr-2 group-hover:text-green-300 transition-colors" />
              <span className="hidden sm:inline">Funcionalidades</span>
              <span className="sm:hidden">Features</span>
            </TabsTrigger>
            <TabsTrigger 
              value="partners" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 hover:bg-white/5 transition-all duration-300 group"
            >
              <Users className="w-4 h-4 mr-2 group-hover:text-green-300 transition-colors" />
              <span className="hidden sm:inline">Parceiros</span>
              <span className="sm:hidden">Parceiros</span>
            </TabsTrigger>
            <TabsTrigger 
              value="testimonials" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 hover:bg-white/5 transition-all duration-300 group"
            >
              <Star className="w-4 h-4 mr-2 group-hover:text-green-300 transition-colors" />
              <span className="hidden sm:inline">Depoimentos</span>
              <span className="sm:hidden">Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-12">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-white mb-4">
                    Revolucionando a Medicina Canábica
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Primeira plataforma brasileira dedicada exclusivamente à cannabis medicinal 
                    com validação científica e suporte de IA especializada.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Nossa Missão</h3>
                      <p className="text-gray-300">
                        Democratizar o acesso a informações científicas sobre cannabis medicinal,
                        fornecendo ferramentas avançadas para profissionais de saúde tomarem 
                        decisões baseadas em evidência.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Diferenciais</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          IA treinada especificamente em cannabis medicinal
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          Dados em tempo real de fontes oficiais
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          Sistema de peer review científico
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          Interface 3D imersiva e intuitiva
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Funcionalidades Profissionais
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/40 backdrop-blur-md border-cyan-500/30 hover:border-cyan-400/50 hover:bg-black/50 transition-all duration-500 group cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <CardHeader className="text-center">
                      <div className={`mx-auto mb-4 p-3 rounded-full w-fit transition-all duration-500 ${
                        hoveredFeature === index 
                          ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 scale-110' 
                          : 'bg-white/10'
                      }`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="text-white text-lg group-hover:text-green-300 transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-center group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="mt-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-4">
                Parceiros Institucionais
              </h2>
              <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                Trabalhamos com as principais instituições médicas e de pesquisa do Brasil
                para garantir a máxima qualidade científica.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partners.map((partner, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/40 backdrop-blur-md border-cyan-500/30 hover:border-cyan-400/50 hover:bg-black/50 transition-all duration-500 group cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-full h-20 bg-gradient-to-br from-white/10 to-green-500/10 rounded-lg mb-4 flex items-center justify-center group-hover:from-green-500/20 group-hover:to-cyan-500/20 transition-all duration-500">
                        <Building className="w-8 h-8 text-gray-400 group-hover:text-green-300 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <h3 className="font-semibold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                        {partner.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className="text-cyan-300 border-cyan-500 group-hover:bg-cyan-500/10 group-hover:border-cyan-400 transition-all duration-300"
                      >
                        {partner.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-12 bg-gradient-to-br from-green-900/20 via-black/40 to-cyan-900/20 backdrop-blur-md border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Seja Nosso Parceiro</CardTitle>
                  <CardDescription className="text-cyan-200">
                    Instituições médicas interessadas em parceria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="group">
                      <Label htmlFor="institution" className="text-white group-hover:text-green-300 transition-colors duration-300">
                        Nome da Instituição
                      </Label>
                      <Input 
                        id="institution" 
                        placeholder="Hospital, Universidade, Clínica..." 
                        className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 hover:bg-white/15 transition-all duration-300"
                        data-testid="input-institution"
                      />
                    </div>
                    <div className="group">
                      <Label htmlFor="contact" className="text-white group-hover:text-green-300 transition-colors duration-300">
                        E-mail de Contato
                      </Label>
                      <Input 
                        id="contact" 
                        type="email" 
                        placeholder="contato@instituicao.com.br" 
                        className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 hover:bg-white/15 transition-all duration-300"
                        data-testid="input-contact"
                      />
                    </div>
                    <div className="group">
                      <Label htmlFor="message" className="text-white group-hover:text-green-300 transition-colors duration-300">
                        Mensagem
                      </Label>
                      <Textarea 
                        id="message" 
                        placeholder="Conte-nos sobre sua instituição e interesse..."
                        className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 hover:bg-white/15 transition-all duration-300 min-h-[100px]"
                        data-testid="textarea-message"
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 group" 
                      data-testid="button-partnership"
                    >
                      <Building className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Solicitar Parceria
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="mt-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                O Que Dizem Os Profissionais
              </h2>
              <div className="grid md:grid-cols-1 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/40 backdrop-blur-md border-cyan-500/30 hover:border-cyan-400/50 hover:bg-black/50 transition-all duration-500 group hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" 
                            style={{ transitionDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300 text-lg italic mb-6 group-hover:text-gray-200 transition-colors duration-300">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-cyan-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-300">
                            {testimonial.name}
                          </h4>
                          <p className="text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-800/30 to-cyan-800/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto Para Revolucionar Sua Prática Médica?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já utilizam nossa plataforma 
            para decisões médicas baseadas em evidência científica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white px-8 py-4 text-lg hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 group"
              data-testid="button-register-cta"
            >
              <UserPlus className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Cadastrar Gratuitamente
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-300 px-8 py-4 text-lg hover:scale-105 transition-all duration-300 group"
              data-testid="button-contact"
            >
              <MessageSquare className="w-5 h-5 mr-2 group-hover:text-cyan-300 transition-colors" />
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-md border-t border-cyan-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-cannabis w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">NeuroCann Lab</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Plataforma médica de cannabis baseada em evidência científica.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Pesquisa Científica</li>
                <li>IA Médica</li>
                <li>Sistema de Submissão</li>
                <li>Fórum Profissional</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>Tutoriais</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
                <li>LGPD</li>
                <li>Certificações</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cyan-500/20 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 NeuroCann Lab. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}