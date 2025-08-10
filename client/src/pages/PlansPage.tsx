import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Crown, Zap, Rocket } from "lucide-react";

export default function PlansPage() {
  const [currentPlan] = useState("free"); // Simulando plano atual

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Explore funcionalidades básicas",
      features: [
        "3 pesquisas por dia",
        "5 consultas Dr. Cannabis IA",
        "Acesso limitado às bases científicas",
        "1 submissão de estudo por mês"
      ],
      limitations: [
        "Pesquisas limitadas",
        "IA com restrições",
        "Dados básicos apenas"
      ],
      color: "from-gray-600 to-gray-500",
      current: currentPlan === "free",
      icon: <Crown className="w-5 h-5" />
    },
    {
      name: "Professional",
      price: "R$ 29",
      period: "/mês", 
      description: "Para profissionais da saúde",
      features: [
        "50 pesquisas por dia",
        "100 consultas Dr. Cannabis IA",
        "Acesso completo PubMed",
        "10 submissões de estudo",
        "Relatórios avançados",
        "Suporte prioritário"
      ],
      limitations: [
        "Pesquisas com limite diário",
        "IA com algumas restrições"
      ],
      color: "from-blue-600 to-blue-500",
      popular: true,
      icon: <Zap className="w-5 h-5" />
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
        "IA avançada para análise",
        "Acesso a todas as bases de dados",
        "API personalizada",
        "Relatórios personalizados",
        "Fórum VIP",
        "Suporte 24/7",
        "Consultoria médica especializada"
      ],
      color: "from-purple-600 to-purple-500",
      icon: <Rocket className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Planos NeuroCann Lab</h1>
              <p className="text-gray-400 text-sm md:text-base">Escolha o melhor plano para suas necessidades médicas</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              {/* Popular Badge */}
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1">
                  Mais Popular
                </Badge>
              )}

              {/* Current Plan Badge */}
              {plan.current && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1">
                  Plano Atual
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${plan.color}/20`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-300">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">✅ Recursos Inclusos</h4>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations && (
                  <div className="space-y-3 pt-3 border-t border-gray-700">
                    <h4 className="text-gray-400 font-medium text-sm">⚠️ Limitações</h4>
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-sm">
                        <X className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
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
                    {plan.current ? '✅ Plano Atual' : '🚀 Upgrade para Pro!'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-2">Precisa de mais informações?</h3>
          <p className="text-gray-400 mb-4">Entre em contato conosco para planos corporativos ou dúvidas específicas.</p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white">
            Falar com Especialista
          </Button>
        </div>
      </div>
    </div>
  );
}