import React, { useState } from 'react';
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
  LogIn
} from 'lucide-react';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('about');

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "IA Médica Especializada",
      description: "Dr. Cannabis IA com conhecimento científico atualizado em cannabis medicinal"
    },
    {
      icon: <Microscope className="w-8 h-8 text-blue-600" />,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">NeuroCann Lab</h1>
                <p className="text-sm text-purple-300">Plataforma Médica de Cannabis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10" data-testid="button-login">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" data-testid="button-register">
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500">
              Plataforma Médica Oficial
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Cannabis Medicinal
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {" "}Baseada em Evidência
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Plataforma científica para profissionais de saúde com IA especializada, 
              pesquisa atualizada e sistema colaborativo de estudos médicos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                data-testid="button-start-trial"
              >
                <Play className="w-5 h-5 mr-2" />
                Começar Gratuitamente
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-3 text-lg"
                data-testid="button-demo"
              >
                Ver Demonstração
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto bg-black/20 backdrop-blur-md">
            <TabsTrigger value="about" className="text-white data-[state=active]:bg-purple-600">
              Sobre Nós
            </TabsTrigger>
            <TabsTrigger value="features" className="text-white data-[state=active]:bg-purple-600">
              Funcionalidades
            </TabsTrigger>
            <TabsTrigger value="partners" className="text-white data-[state=active]:bg-purple-600">
              Parceiros
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="text-white data-[state=active]:bg-purple-600">
              Depoimentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-12">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-black/40 backdrop-blur-md border-purple-500/30">
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
                  <Card key={index} className="bg-black/40 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-colors">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-white/10 rounded-full w-fit">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-center">{feature.description}</p>
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
                  <Card key={index} className="bg-black/40 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="w-full h-20 bg-white/10 rounded-lg mb-4 flex items-center justify-center">
                        <Building className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{partner.name}</h3>
                      <Badge variant="outline" className="text-purple-300 border-purple-500">
                        {partner.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-12 bg-purple-900/20 backdrop-blur-md border-purple-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Seja Nosso Parceiro</CardTitle>
                  <CardDescription className="text-purple-200">
                    Instituições médicas interessadas em parceria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <Label htmlFor="institution" className="text-white">Nome da Instituição</Label>
                      <Input 
                        id="institution" 
                        placeholder="Hospital, Universidade, Clínica..." 
                        className="bg-white/10 border-purple-500/30 text-white"
                        data-testid="input-institution"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact" className="text-white">E-mail de Contato</Label>
                      <Input 
                        id="contact" 
                        type="email" 
                        placeholder="contato@instituicao.com.br" 
                        className="bg-white/10 border-purple-500/30 text-white"
                        data-testid="input-contact"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-white">Mensagem</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Conte-nos sobre sua instituição e interesse..."
                        className="bg-white/10 border-purple-500/30 text-white"
                        data-testid="textarea-message"
                      />
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" data-testid="button-partnership">
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
                  <Card key={index} className="bg-black/40 backdrop-blur-md border-purple-500/30">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-300 text-lg italic mb-6">"{testimonial.text}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{testimonial.name}</h4>
                          <p className="text-purple-300">{testimonial.role}</p>
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
      <section className="py-20 bg-gradient-to-r from-purple-800/30 to-blue-800/30">
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
              data-testid="button-register-cta"
            >
              Cadastrar Gratuitamente
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
              data-testid="button-contact"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-md border-t border-purple-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
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
          <div className="border-t border-purple-500/20 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 NeuroCann Lab. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}