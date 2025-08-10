import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Crown, X, Zap } from 'lucide-react';

interface FreePlanNotificationProps {
  onClose: () => void;
}

export function FreePlanNotification({ onClose }: FreePlanNotificationProps) {
  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 backdrop-blur-md border-cyan-500/30 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </Button>
      
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-lg">Plano Gratuito Ativo</CardTitle>
            <CardDescription className="text-cyan-300 text-sm">
              Bem-vindo à NeuroCann Lab!
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center">
            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
            Recursos Inclusos (Gratuito)
          </h4>
          <div className="pl-6 space-y-2 text-sm text-gray-300">
            <div className="flex items-center justify-between">
              <span>• Pesquisas básicas no PubMed</span>
              <Badge variant="outline" className="text-green-400 border-green-400">5/dia</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>• Consultas ao Dr. Cannabis IA</span>
              <Badge variant="outline" className="text-green-400 border-green-400">10/dia</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>• Casos clínicos básicos</span>
              <Badge variant="outline" className="text-green-400 border-green-400">3/dia</Badge>
            </div>
            <div>• Acesso ao fórum de discussão (somente leitura)</div>
            <div>• Alertas regulatórios básicos</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center">
            <AlertTriangle className="w-4 h-4 text-orange-400 mr-2" />
            Limitações do Plano Gratuito
          </h4>
          <div className="pl-6 space-y-2 text-sm text-gray-400">
            <div>• Sem acesso ao sistema de submissão de estudos</div>
            <div>• Análises avançadas de IA bloqueadas</div>
            <div>• Sem download de relatórios</div>
            <div>• Sem acesso a dados premium do ClinicalTrials.gov</div>
            <div>• Sem participação ativa no fórum</div>
          </div>
        </div>

        <div className="pt-4 border-t border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Upgrade para Pro</span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white"
            >
              Ver Planos
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Desbloqueie todos os recursos profissionais e tenha acesso ilimitado à plataforma
          </p>
        </div>
      </CardContent>
    </Card>
  );
}