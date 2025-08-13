import DraCannabisAI from '@/components/DraCannabisAI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Stethoscope, BookOpen, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DraCannabisPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      
      {/* Cabeçalho Principal - Padronizado com outros dashboards */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-b border-emerald-500/30">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setLocation('/')}
                variant="ghost"
                size="sm"
                className="text-neon-green hover:text-neon-green/80 hover:bg-neon-green/10 drop-shadow-[0_0_5px_rgba(57,255,20,0.3)]"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                  <Brain className="w-4 h-4 text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">Dra. Cannabis IA</h1>
                  <p className="text-xs text-neon-green/80 drop-shadow-[0_0_5px_rgba(57,255,20,0.3)]">Assistente Médico Inteligente</p>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </div>

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
            <Card className="border-neon-green/30 bg-gradient-to-br from-neon-green/5 to-black shadow-[0_0_20px_rgba(57,255,20,0.1)]">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                    <Brain className="w-5 h-5 text-neon-green drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-neon-green drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">Dra. Cannabis IA</CardTitle>

                  </div>
                </div>

              </CardHeader>
            </Card>

            {/* Recursos disponíveis integrados */}
            <Card className="border-neon-green/30 bg-neon-green/5 shadow-[0_0_10px_rgba(57,255,20,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.4)] flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Recursos Médicos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Stethoscope className="w-3 h-3 text-neon-green drop-shadow-[0_0_3px_rgba(57,255,20,0.4)]" />
                  <span className="text-gray-300">Consultas IA instantâneas</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <BookOpen className="w-3 h-3 text-yellow-400 drop-shadow-[0_0_3px_rgba(255,235,59,0.4)]" />
                  <span className="text-gray-300">15.000+ estudos científicos</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Shield className="w-3 h-3 text-neon-green drop-shadow-[0_0_3px_rgba(57,255,20,0.4)]" />
                  <span className="text-gray-300">Compliance total BR</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-3 h-3 text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.4)]" />
                  <span className="text-gray-300">Alertas em tempo real</span>
                </div>
              </CardContent>
            </Card>

            {/* Exemplos de Consultas */}
            <Card className="border-yellow-400/30 bg-yellow-400/5 shadow-[0_0_10px_rgba(255,235,59,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-400 drop-shadow-[0_0_5px_rgba(255,235,59,0.4)] flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Exemplos de Consultas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <div className="text-xs text-gray-300 space-y-1">
                  <button 
                    className="text-left w-full hover:text-yellow-300 hover:bg-yellow-400/10 p-1 rounded transition-colors cursor-pointer"
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
                    className="text-left w-full hover:text-yellow-300 hover:bg-yellow-400/10 p-1 rounded transition-colors cursor-pointer"
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
                    className="text-left w-full hover:text-yellow-300 hover:bg-yellow-400/10 p-1 rounded transition-colors cursor-pointer"
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
                    className="text-left w-full hover:text-yellow-300 hover:bg-yellow-400/10 p-1 rounded transition-colors cursor-pointer"
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
                    className="text-left w-full hover:text-yellow-300 hover:bg-yellow-400/10 p-1 rounded transition-colors cursor-pointer"
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
            <Card className="border-red-400/30 bg-red-400/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)] flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Aviso Médico</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-red-200 space-y-1">
                <p>• IA para fins educacionais</p>
                <p>• Não substitui consulta médica</p>
                <p>• Sempre consulte seu médico</p>
                <p>• Conforme ANVISA, CFM e LGPD</p>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
}