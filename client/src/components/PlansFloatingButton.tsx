import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, X, Check, Star, Zap } from 'lucide-react';

export function PlansFloatingButton() {
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
        "Sem download de relatórios",
        "Sem dados premium ClinicalTrials.gov"
      ],
      color: "from-green-600 to-green-500",
      current: true
    },
    {
      name: "Profissional",
      price: "R$ 29",
      period: "/mês",
      description: "Para profissionais da saúde",
      features: [
        "50 pesquisas/dia no PubMed",
        "100 consultas/dia Dr. Cannabis IA",
        "Casos clínicos ilimitados",
        "Submissão de estudos (3/mês)",
        "Análises avançadas de IA",
        "Download de relatórios PDF",
        "Participação ativa no fórum",
        "Dados premium ClinicalTrials.gov",
        "Suporte prioritário"
      ],
      color: "from-blue-600 to-blue-500",
      popular: true
    },
    {
      name: "Premium Full",
      price: "R$ 59",
      period: "/mês", 
      description: "Acesso completo à plataforma",
      features: [
        "Pesquisas ILIMITADAS",
        "Consultas Dr. Cannabis IA ILIMITADAS",
        "Submissão de estudos ILIMITADA",
        "IA avançada para análise de estudos",
        "Acesso a todas as bases de dados",
        "API personalizada",
        "Relatórios personalizados",
        "Fórum VIP",
        "Suporte 24/7",
        "Consultoria médica especializada"
      ],
      color: "from-purple-600 to-purple-500"
    }
  ];

  return (
    <>
      {/* Floating Button - Minimized */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Crown className="w-4 h-4" />
        </Button>
      </div>

      {/* Plans Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-cyber-gray to-cyber-light rounded-2xl border border-cyan-500/30 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Planos NeuroCann Lab</h2>
                  <p className="text-gray-400 text-sm">Escolha o melhor plano para suas necessidades</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`relative bg-gradient-to-br ${plan.color}/10 border-2 ${
                      plan.current 
                        ? 'border-green-500 shadow-lg shadow-green-500/20' 
                        : plan.popular 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                        : 'border-gray-600 hover:border-purple-500/50'
                    } transition-all duration-300 hover:scale-105`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Mais Popular
                      </Badge>
                    )}
                    {plan.current && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        Plano Atual
                      </Badge>
                    )}

                    <CardHeader className="text-center pb-3">
                      <CardTitle className="text-white text-lg">{plan.name}</CardTitle>
                      <div className="flex items-baseline justify-center space-x-1">
                        <span className="text-2xl font-bold text-white">{plan.price}</span>
                        <span className="text-gray-400 text-sm">{plan.period}</span>
                      </div>
                      <CardDescription className="text-gray-300 text-sm">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="text-white font-medium text-xs">✅ Recursos Inclusos</h4>
                        {plan.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs">
                            <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 4 && (
                          <p className="text-xs text-gray-400">+{plan.features.length - 4} recursos adicionais</p>
                        )}
                      </div>

                      {plan.limitations && (
                        <div className="space-y-1.5 pt-2 border-t border-gray-700">
                          <h4 className="text-gray-400 font-medium text-xs">⚠️ Limitações</h4>
                          {plan.limitations.slice(0, 2).map((limitation, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs">
                              <X className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-500">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white mt-4 ${
                          plan.current ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={plan.current}
                      >
                        {plan.current ? 'Plano Atual' : 'Escolher Plano'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-green-900/20 to-cyan-900/20 rounded-lg border border-cyan-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-cannabis text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-white font-medium">💡 Dica Especial</p>
                    <p className="text-gray-300 text-sm">
                      Todos os planos incluem acesso ao Dr. Cannabis IA, nossa inteligência artificial especializada 
                      em cannabis medicinal com dados científicos atualizados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}