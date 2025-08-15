import NewDraCannabisTest from '@/components/NewDraCannabisTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Zap } from 'lucide-react';

export default function NewAvatarTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-green-500 text-white px-3 py-1">
              <Star className="w-4 h-4 mr-1" />
              Novo Avatar
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Dra. Cannabis - Nova Versão
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Teste a nova versão da Dra. Cannabis com o agente D-ID atualizado. 
            Movimento labial sincronizado e voz natural para uma experiência mais imersiva.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold">Movimento Labial</h3>
              </div>
              <p className="text-sm text-gray-600">
                Sincronização perfeita entre fala e movimento dos lábios para uma experiência mais realista.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold">Voz Natural</h3>
              </div>
              <p className="text-sm text-gray-600">
                Voz feminina profissional com entonação natural e expressividade médica.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-6 h-6 text-purple-500" />
                <h3 className="font-semibold">IA Avançada</h3>
              </div>
              <p className="text-sm text-gray-600">
                Conhecimento médico especializado em cannabis medicinal com personalidade acolhedora.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Component */}
        <NewDraCannabisTest />

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Como Usar o Novo Avatar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Digite sua mensagem</p>
                <p className="text-sm opacity-80">Faça uma pergunta sobre cannabis medicinal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Clique em "Testar Novo Avatar"</p>
                <p className="text-sm opacity-80">O sistema processará sua mensagem</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Veja a resposta animada</p>
                <p className="text-sm opacity-80">Texto e vídeo com movimento labial sincronizado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Info */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Informações Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p><strong>Agente D-ID:</strong> v2_agt_mzs8kQcn</p>
            <p><strong>API:</strong> D-ID Agents</p>
            <p><strong>Recursos:</strong> Movimento labial, voz natural, IA conversacional</p>
            <p><strong>Especialidade:</strong> Cannabis medicinal</p>
            <p><strong>Personalidade:</strong> Médica acolhedora e empática</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
