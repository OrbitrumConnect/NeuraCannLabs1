import { DraCannabisAI } from '@/components/DraCannabisAI';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Stethoscope, BookOpen, Shield, AlertCircle } from 'lucide-react';

export default function DraCannabisPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Layout principal focado na Dra. Cannabis IA */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Componente Principal da Dra. Cannabis - Ocupa 4 colunas (80% da tela) */}
          <div className="lg:col-span-4">
            <div className="min-h-[700px]">
              <DraCannabisAI />
            </div>
          </div>
          
          {/* Sidebar compacta com informações - Ocupa 1 coluna */}
          <div className="space-y-4">
            
            {/* Header compacto */}
            <Card className="border-green-500/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-green-400">Dra. Cannabis IA</CardTitle>
                    <Badge className="bg-green-600 text-white text-xs mt-1">
                      D-ID + ElevenLabs
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-green-200 mt-2">
                  Certificada ANVISA • CFM
                </p>
              </CardHeader>
            </Card>

            {/* Recursos disponíveis integrados */}
            <Card className="border-blue-500/30 bg-blue-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-400 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Recursos Médicos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Stethoscope className="w-3 h-3 text-green-400" />
                  <span className="text-gray-300">Consultas IA instantâneas</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <BookOpen className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-300">15.000+ estudos científicos</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span className="text-gray-300">Compliance total BR</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-3 h-3 text-orange-400" />
                  <span className="text-gray-300">Alertas em tempo real</span>
                </div>
              </CardContent>
            </Card>

            {/* Exemplos de Consultas */}
            <Card className="border-purple-500/30 bg-purple-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-400 flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Exemplos de Consultas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <div className="text-xs text-gray-300 space-y-1">
                  <button 
                    className="text-left w-full hover:text-purple-300 hover:bg-purple-800/20 p-1 rounded transition-colors cursor-pointer"
                    onClick={() => {
                      const input = document.querySelector('[data-testid="chat-input"]') as HTMLInputElement;
                      if (input) {
                        input.value = "Como o CBD ajuda no tratamento da epilepsia?";
                        input.focus();
                      }
                    }}
                  >
                    • Como o CBD ajuda no tratamento da epilepsia?
                  </button>
                  <button 
                    className="text-left w-full hover:text-purple-300 hover:bg-purple-800/20 p-1 rounded transition-colors cursor-pointer"
                    onClick={() => {
                      const input = document.querySelector('[data-testid="chat-input"]') as HTMLInputElement;
                      if (input) {
                        input.value = "Qual a dosagem recomendada para dor crônica?";
                        input.focus();
                      }
                    }}
                  >
                    • Qual a dosagem recomendada para dor crônica?
                  </button>
                  <button 
                    className="text-left w-full hover:text-purple-300 hover:bg-purple-800/20 p-1 rounded transition-colors cursor-pointer"
                    onClick={() => {
                      const input = document.querySelector('[data-testid="chat-input"]') as HTMLInputElement;
                      if (input) {
                        input.value = "Cannabis medicinal é eficaz para ansiedade?";
                        input.focus();
                      }
                    }}
                  >
                    • Cannabis medicinal é eficaz para ansiedade?
                  </button>
                  <button 
                    className="text-left w-full hover:text-purple-300 hover:bg-purple-800/20 p-1 rounded transition-colors cursor-pointer"
                    onClick={() => {
                      const input = document.querySelector('[data-testid="chat-input"]') as HTMLInputElement;
                      if (input) {
                        input.value = "Efeitos colaterais do THC em oncologia?";
                        input.focus();
                      }
                    }}
                  >
                    • Efeitos colaterais do THC em oncologia?
                  </button>
                  <button 
                    className="text-left w-full hover:text-purple-300 hover:bg-purple-800/20 p-1 rounded transition-colors cursor-pointer"
                    onClick={() => {
                      const input = document.querySelector('[data-testid="chat-input"]') as HTMLInputElement;
                      if (input) {
                        input.value = "Protocolo para síndrome de Dravet";
                        input.focus();
                      }
                    }}
                  >
                    • Protocolo para síndrome de Dravet
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer médico compacto */}
            <Card className="border-orange-500/30 bg-orange-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-400 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Aviso Médico</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-orange-200 space-y-1">
                <p>• IA para fins educacionais</p>
                <p>• Não substitui consulta médica</p>
                <p>• Sempre consulte seu médico</p>
                <p>• Conforme ANVISA, CFM e LGPD</p>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}