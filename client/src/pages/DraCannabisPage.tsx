import { DraCannabisAI } from '@/components/DraCannabisAI';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Stethoscope, BookOpen, Shield, AlertCircle } from 'lucide-react';

export default function DraCannabisPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Banner de Introdução */}
        <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Brain className="w-12 h-12 text-green-400" />
                <div>
                  <CardTitle className="text-3xl text-green-400">
                    Dra. Cannabis IA - Assistente Médico
                  </CardTitle>
                  <p className="text-green-200 mt-2">
                    Primeira IA Médica Especializada em Cannabis do Brasil
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className="bg-green-600 text-white mb-2">
                  Tecnologia D-ID + ElevenLabs
                </Badge>
                <p className="text-sm text-green-200">
                  Certificada pela ANVISA • CFM
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-800/20">
                <Stethoscope className="w-6 h-6 text-green-400" />
                <div>
                  <h4 className="font-semibold text-green-300">Consultas IA</h4>
                  <p className="text-sm text-green-200">Respostas médicas instantâneas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-800/20">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-blue-300">Base Científica</h4>
                  <p className="text-sm text-blue-200">15.000+ estudos indexados</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-800/20">
                <Shield className="w-6 h-6 text-purple-400" />
                <div>
                  <h4 className="font-semibold text-purple-300">Compliance</h4>
                  <p className="text-sm text-purple-200">100% regulamentações BR</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-800/20">
                <AlertCircle className="w-6 h-6 text-orange-400" />
                <div>
                  <h4 className="font-semibold text-orange-300">Alertas</h4>
                  <p className="text-sm text-orange-200">Monitoramento 24/7</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Componente Principal da Dra. Cannabis */}
        <DraCannabisAI />

        {/* Disclaimer Médico */}
        <Card className="border-orange-500/30 bg-orange-900/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-400">
              <AlertCircle className="w-5 h-5" />
              <span>Importante - Disclaimer Médico</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-orange-200 space-y-2">
            <p>
              • A <strong>Dra. Cannabis IA</strong> é um assistente baseado em inteligência artificial para fins educacionais e informativos.
            </p>
            <p>
              • As respostas não substituem consulta médica presencial ou diagnóstico profissional.
            </p>
            <p>
              • Sempre consulte seu médico antes de iniciar, alterar ou interromper qualquer tratamento.
            </p>
            <p>
              • Este sistema está em conformidade com as regulamentações da ANVISA, CFM e LGPD.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}