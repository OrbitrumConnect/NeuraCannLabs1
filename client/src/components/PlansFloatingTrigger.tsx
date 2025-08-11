import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, X, Check, Star, Zap, ArrowLeft } from 'lucide-react';

export function PlansFloatingTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Para começar a explorar",
      features: [
        "5 pesquisas/dia no PubMed",
        "10 consultas/dia Dr. Cannabis IA", 
        "3 casos clínicos/dia",
        "Acesso ao fórum (leitura)",
        "Alertas regulatórios básicos"
      ],
      limitations: [
        "Sem submissão de estudos",
        "Sem análises avançadas de IA",
        "Sem download de relatórios"
      ],
      color: "from-green-600 to-green-500",
      current: true
    },
    {
      name: "Básico",
      price: "R$ 10",
      period: "/mês",
      description: "Para estudantes e iniciantes",
      features: [
        "20 pesquisas/dia no PubMed",
        "30 consultas/dia Dr. Cannabis IA",
        "10 casos clínicos/dia",
        "Submissão de estudos (1/mês)",
        "Participação no fórum",
        "Download básico de relatórios"
      ],
      color: "from-blue-600 to-blue-500"
    },
    {
      name: "Profissional",
      price: "R$ 20",
      period: "/mês",
      description: "Para profissionais da saúde",
      features: [
        "50 pesquisas/dia no PubMed",
        "100 consultas/dia Dr. Cannabis IA",
        "Casos clínicos ilimitados",
        "Submissão de estudos (3/mês)",
        "Análises avançadas de IA",
        "Download de relatórios PDF",
        "Suporte prioritário"
      ],
      color: "from-purple-600 to-purple-500",
      popular: true
    },
    {
      name: "Premium Full",
      price: "R$ 30", 
      period: "/mês",
      description: "Acesso completo à plataforma",
      features: [
        "Pesquisas ILIMITADAS",
        "Consultas Dr. Cannabis IA ILIMITADAS",
        "Submissão de estudos ILIMITADA",
        "IA avançada para análise",
        "API personalizada",
        "Consultoria médica",
        "Suporte 24/7"
      ],
      color: "from-orange-600 to-red-500"
    }
  ];

  return (
    <>
      {/* Trigger Button - Integrado no rodapé preto */}
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 rounded-full w-8 h-8 flex items-center justify-center"
        title="Ver Planos"
      >
        <Crown className="w-4 h-4" />
      </Button>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl sm:max-w-6xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md border-cyan-500/30">
              {/* Header com Botão Voltar */}
              <CardHeader className="pb-4 border-b border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg sm:text-2xl">Planos NeuroCann Lab</CardTitle>
                      <CardDescription className="text-cyan-300 text-sm sm:text-base">
                        Escolha o plano ideal para sua prática médica
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {plans.map((plan, index) => (
                    <Card 
                      key={index}
                      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                        plan.current 
                          ? 'bg-gradient-to-br from-green-900/20 to-cyan-900/20 border-green-500/50' 
                          : plan.popular
                          ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/50'
                          : 'bg-gradient-to-br from-gray-900/20 to-black/20 border-gray-600/50'
                      } backdrop-blur-md`}
                    >
                      {plan.popular && (
                        <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              {plan.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-white">{plan.price}</span>
                            <span className="text-gray-400 ml-1">{plan.period}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="text-white font-medium flex items-center">
                            <Check className="w-4 h-4 text-green-400 mr-2" />
                            Recursos Inclusos
                          </h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-300">
                                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {plan.limitations && (
                          <div className="space-y-3 pt-3 border-t border-gray-700/50">
                            <h4 className="text-orange-400 font-medium text-sm">Limitações</h4>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-400">
                                  <X className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                                  {limitation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-4">
                          <Button 
                            className={`w-full text-sm font-medium ${
                              plan.current 
                                ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed' 
                                : `bg-gradient-to-r ${plan.color} hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`
                            } text-white`}
                            disabled={plan.current}
                          >
                            {plan.current ? '✅ Plano Atual' : '🚀 Upgrade para ' + plan.name}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-cyan-500/20 text-center">
                  <p className="text-gray-400 text-sm">
                    Todos os planos incluem suporte técnico e atualizações automáticas
                  </p>
                  <p className="text-cyan-300 text-sm mt-1">
                    Cancele a qualquer momento • Sem taxas de configuração
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}