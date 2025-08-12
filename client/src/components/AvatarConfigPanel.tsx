import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Volume2, Sparkles, Settings } from 'lucide-react';
import { professionalAvatarService } from '@/services/professionalAvatarService';
import { nativeAvatarService } from '@/services/nativeAvatarService';

interface AvatarConfig {
  useElevenLabs: boolean;
  nativeQuality: 'fast' | 'professional';
  autoWelcome: boolean;
}

export function AvatarConfigPanel() {
  const [config, setConfig] = useState<AvatarConfig>({
    useElevenLabs: true,
    nativeQuality: 'professional',
    autoWelcome: true
  });
  
  const [isTestingEleven, setIsTestingEleven] = useState(false);
  const [isTestingNative, setIsTestingNative] = useState(false);
  const [elevenLabsStatus, setElevenLabsStatus] = useState<'unknown' | 'working' | 'error'>('unknown');

  useEffect(() => {
    // Carregar configuração salva
    const saved = localStorage.getItem('neurocann-avatar-config');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const saveConfig = (newConfig: AvatarConfig) => {
    setConfig(newConfig);
    localStorage.setItem('neurocann-avatar-config', JSON.stringify(newConfig));
  };

  const testElevenLabs = async () => {
    setIsTestingEleven(true);
    try {
      await professionalAvatarService.speak('Testando sistema ElevenLabs. Esta é a qualidade profissional da Dra. Cannabis IA.', {
        quality: 'high'
      });
      setElevenLabsStatus('working');
    } catch (error) {
      setElevenLabsStatus('error');
      console.error('Erro no teste ElevenLabs:', error);
    } finally {
      setIsTestingEleven(false);
    }
  };

  const testNative = async () => {
    setIsTestingNative(true);
    try {
      await nativeAvatarService.makeAvatarSpeak(
        'Testando sistema nativo. Esta é a versão integrada da Dra. Cannabis IA.',
        config.nativeQuality
      );
    } catch (error) {
      console.error('Erro no teste nativo:', error);
    } finally {
      setIsTestingNative(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração da Dra. Cannabis IA
        </CardTitle>
        <CardDescription>
          Configure a qualidade de voz e o comportamento do assistente médico
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sistema ElevenLabs Profissional */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Sistema Profissional (ElevenLabs)
              </Label>
              <p className="text-sm text-muted-foreground">
                Voz de alta qualidade com naturalidade superior
              </p>
            </div>
            <Switch
              checked={config.useElevenLabs}
              onCheckedChange={(checked) => 
                saveConfig({ ...config, useElevenLabs: checked })
              }
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={testElevenLabs}
              disabled={isTestingEleven}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isTestingEleven ? 'Testando...' : 'Testar ElevenLabs'}
            </Button>
            
            {elevenLabsStatus === 'working' && (
              <Badge variant="default" className="bg-green-500">
                ✅ Funcionando
              </Badge>
            )}
            {elevenLabsStatus === 'error' && (
              <Badge variant="destructive">
                ❌ Requer API Key
              </Badge>
            )}
          </div>
        </div>

        {/* Sistema Nativo */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-base font-medium">
              Sistema Nativo (Backup)
            </Label>
            <p className="text-sm text-muted-foreground">
              Sistema integrado, sempre disponível
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={testNative}
              disabled={isTestingNative}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isTestingNative ? 'Testando...' : 'Testar Sistema Nativo'}
            </Button>
            
            <Badge variant="secondary">
              Sempre disponível
            </Badge>
          </div>
        </div>

        {/* Configurações Gerais */}
        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Saudação Automática
              </Label>
              <p className="text-sm text-muted-foreground">
                Dra. Cannabis fala automaticamente ao entrar no dashboard
              </p>
            </div>
            <Switch
              checked={config.autoWelcome}
              onCheckedChange={(checked) => 
                saveConfig({ ...config, autoWelcome: checked })
              }
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <strong>Sistema Híbrido:</strong> O NeuroCann Lab usa ElevenLabs para máxima qualidade quando disponível, 
          com fallback automático para o sistema nativo. Sua configuração é salva e respeitada em todas as interações.
        </div>
      </CardContent>
    </Card>
  );
}