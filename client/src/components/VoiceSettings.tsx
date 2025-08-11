import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/useAuth';
import { useVoiceGreeting } from '@/hooks/useVoiceGreeting';
import { VoiceMessagePreview } from './VoiceGreetingIndicator';

export default function VoiceSettings() {
  const { user } = useAuth();
  const { playGreeting, isSupported, currentMessage } = useVoiceGreeting();
  
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [rate, setRate] = useState(90);
  const [pitch, setPitch] = useState(100);
  const [isTestPlaying, setIsTestPlaying] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`voice_settings_${user.id}`);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setVoiceEnabled(settings.enabled ?? true);
        setVolume(settings.volume ?? 70);
        setRate(settings.rate ?? 90);
        setPitch(settings.pitch ?? 100);
      }
    }
  }, [user]);

  // Salvar configurações no localStorage
  const saveSettings = () => {
    if (user) {
      const settings = {
        enabled: voiceEnabled,
        volume,
        rate,
        pitch
      };
      localStorage.setItem(`voice_settings_${user.id}`, JSON.stringify(settings));
    }
  };

  // Aplicar configurações em tempo real
  useEffect(() => {
    saveSettings();
  }, [voiceEnabled, volume, rate, pitch]);

  // Testar voz com configurações atuais
  const testVoice = () => {
    if (!isSupported || isTestPlaying) return;
    
    setIsTestPlaying(true);
    
    const testMessage = `Olá, ${user?.name?.split(' ')[0] || 'Doutor'}! Esta é uma demonstração das configurações de voz do Dr. Cannabis IA.`;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(testMessage);
    utterance.volume = volume / 100;
    utterance.rate = rate / 100;
    utterance.pitch = pitch / 100;
    utterance.lang = 'pt-BR';
    
    // Tentar usar voz em português
    const voices = window.speechSynthesis.getVoices();
    const portugueseVoice = voices.find(voice => 
      voice.lang.includes('pt') || voice.lang.includes('BR')
    );
    
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }
    
    utterance.onend = () => setIsTestPlaying(false);
    utterance.onerror = () => setIsTestPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return (
      <Card className="bg-cyber-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle" />
            Voz não suportada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">
            Seu navegador não suporta síntese de voz (Text-to-Speech). 
            Tente usar um navegador mais recente como Chrome, Edge ou Firefox.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-cyber-dark border-neon-cyan/30">
        <CardHeader>
          <CardTitle className="text-neon-cyan flex items-center gap-2">
            <i className="fas fa-microphone-alt" />
            Configurações de Voz - Dr. Cannabis IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Ativar/Desativar Saudações */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Saudações por Voz</h3>
              <p className="text-sm text-gray-400">
                Dr. Cannabis IA fala quando você faz login
              </p>
            </div>
            <Switch
              checked={voiceEnabled}
              onCheckedChange={setVoiceEnabled}
              data-testid="voice-enabled-switch"
            />
          </div>

          {voiceEnabled && (
            <>
              {/* Controle de Volume */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-white">Volume</label>
                  <span className="text-sm text-gray-400">{volume}%</span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                  data-testid="volume-slider"
                />
              </div>

              {/* Controle de Velocidade */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-white">Velocidade</label>
                  <span className="text-sm text-gray-400">{rate}%</span>
                </div>
                <Slider
                  value={[rate]}
                  onValueChange={(value) => setRate(value[0])}
                  max={150}
                  min={50}
                  step={5}
                  className="w-full"
                  data-testid="rate-slider"
                />
              </div>

              {/* Controle de Tom */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-white">Tom da Voz</label>
                  <span className="text-sm text-gray-400">{pitch}%</span>
                </div>
                <Slider
                  value={[pitch]}
                  onValueChange={(value) => setPitch(value[0])}
                  max={150}
                  min={50}
                  step={5}
                  className="w-full"
                  data-testid="pitch-slider"
                />
              </div>

              {/* Botões de Teste */}
              <div className="flex gap-3">
                <Button
                  onClick={testVoice}
                  disabled={isTestPlaying}
                  className="flex-1 bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/30"
                  data-testid="test-voice-button"
                >
                  <i className={`fas ${isTestPlaying ? 'fa-volume-up animate-pulse' : 'fa-play'} mr-2`} />
                  {isTestPlaying ? 'Reproduzindo...' : 'Testar Voz'}
                </Button>
                
                <Button
                  onClick={playGreeting}
                  className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                  data-testid="test-greeting-button"
                >
                  <i className="fas fa-microphone mr-2" />
                  Testar Saudação
                </Button>
              </div>
            </>
          )}

          {/* Preview da Mensagem */}
          {voiceEnabled && currentMessage && (
            <div className="mt-4">
              <VoiceMessagePreview />
            </div>
          )}

        </CardContent>
      </Card>

      {/* Informações sobre o Dr. Cannabis IA */}
      <Card className="bg-cyber-dark border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-robot text-white text-lg" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Sobre o Dr. Cannabis IA</h3>
              <p className="text-sm text-gray-400 mb-2">
                O Dr. Cannabis IA é seu assistente virtual especializado em cannabis medicinal. 
                Ele fornece saudações personalizadas baseadas no horário e pode ler os resultados das pesquisas.
              </p>
              <div className="text-xs text-gray-500">
                <p>• Saudações baseadas no horário (bom dia/tarde/noite)</p>
                <p>• Personalização com seu nome</p>
                <p>• Configurações de voz ajustáveis</p>
                <p>• Pode ser desabilitado a qualquer momento</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}