import { HeyGenController } from "@/components/HeyGenController";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Mic, Volume2, Video, MessageCircle } from "lucide-react";

export default function HeyGenAvatarPage() {
  return (
    <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 pt-12 sm:pt-14 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl flex items-center justify-center mr-4">
            <Zap className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-base sm:text-2xl font-bold text-white">Avatar Streaming IA</h1>
            <p className="text-xs sm:text-sm text-gray-400">Interação em tempo real com Dr. Cannabis IA</p>
          </div>
        </div>
        
        <Badge className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
          HeyGen Powered
        </Badge>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-white">Avatar 3D</h3>
            <p className="text-xs text-gray-400">Streaming em tempo real</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <Volume2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-white">Texto-para-Fala</h3>
            <p className="text-xs text-gray-400">Voz em português</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <Mic className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-white">Chat por Voz</h3>
            <p className="text-xs text-gray-400">Conversação natural</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-white">IA Médica</h3>
            <p className="text-xs text-gray-400">Cannabis medicinal</p>
          </CardContent>
        </Card>
      </div>

      {/* Main HeyGen Controller */}
      <HeyGenController />

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-300 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              <div>
                <p className="font-medium text-white">Iniciar Sessão</p>
                <p className="text-gray-400">Conecte-se ao avatar streaming do HeyGen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              <div>
                <p className="font-medium text-white">Texto ou Voz</p>
                <p className="text-gray-400">Digite ou fale diretamente com o avatar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              <div>
                <p className="font-medium text-white">Resposta Instantânea</p>
                <p className="text-gray-400">Avatar responde em tempo real com voz natural</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Capacidades Médicas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-300 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Análise de estudos científicos sobre cannabis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Orientações sobre dosagens e protocolos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Informações sobre interações medicamentosas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Atualizações regulatórias da ANVISA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Correlações entre casos clínicos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Details */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Detalhes Técnicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-white mb-2">Plataforma</h4>
              <p className="text-gray-400">HeyGen Streaming Avatar SDK</p>
              <p className="text-gray-400">WebRTC para baixa latência</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Voz</h4>
              <p className="text-gray-400">Voz: pt-BR-AntonioNeural</p>
              <p className="text-gray-400">Suporte a emoções e pausas naturais</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Qualidade</h4>
              <p className="text-gray-400">Qualidade baixa para teste</p>
              <p className="text-gray-400">Avatar: angela_public_3_20240108</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}