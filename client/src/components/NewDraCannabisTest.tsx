import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageCircle, Video, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewDraCannabisTest() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const testNewAvatar = async () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem Obrigatória",
        description: "Digite uma mensagem para testar o novo avatar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/dra-cannabis/test-new-did', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const result = await response.json();

      if (result.success) {
        setResponse(result.response);
        setVideoUrl(result.videoUrl);
        
        toast({
          title: "Novo Avatar Funcionando!",
          description: "Dra. Cannabis respondeu com sucesso",
          variant: "default",
        });
      } else {
        throw new Error(result.message || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('Erro testando novo avatar:', error);
      toast({
        title: "Erro no Teste",
        description: error.message || "Falha ao conectar com novo avatar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Teste do Novo Avatar da Dra. Cannabis
          </CardTitle>
          <div className="text-sm text-gray-600">
            Teste a nova versão da Dra. Cannabis com o agente D-ID atualizado
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="https://create-images-results.d-id.com/google-oauth2|101218376087780649774/upl_C3ha4xZC1dc1diswoqZOH/image.jpeg"
                alt="Nova Dra. Cannabis"
                className="w-32 h-32 rounded-lg object-cover shadow-lg"
              />
              <Badge className="absolute -top-2 -right-2 bg-green-500">
                Novo
              </Badge>
            </div>
          </div>

          {/* Test Form */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem para Dra. Cannabis:</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem para testar o novo avatar..."
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={testNewAvatar}
            disabled={isLoading || !message.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testando Novo Avatar...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Testar Novo Avatar
              </>
            )}
          </Button>

          {/* Response Display */}
          {response && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Resposta da Dra. Cannabis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 whitespace-pre-wrap">{response}</p>
                
                {videoUrl && (
                  <div className="mt-4">
                    <h4 className="font-medium text-green-800 mb-2">Vídeo Animado:</h4>
                    <video 
                      controls 
                      className="w-full rounded-lg"
                      src={videoUrl}
                    >
                      Seu navegador não suporta vídeo.
                    </video>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Agent Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="text-sm text-blue-800">
                <p><strong>Agente D-ID:</strong> v2_agt_mzs8kQcn</p>
                <p><strong>Status:</strong> Ativo</p>
                <p><strong>Recursos:</strong> Movimento labial sincronizado, voz natural</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
