import { useVoiceGreeting } from '@/hooks/useVoiceGreeting';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function VoiceGreetingIndicator() {
  const { 
    isPlaying, 
    hasPlayedToday, 
    playGreeting, 
    stopGreeting, 
    isSupported,
    currentMessage
  } = useVoiceGreeting();

  if (!isSupported) return null;

  return (
    <div className="relative">
      {/* Indicador quando está falando */}
      {isPlaying && (
        <Card className="bg-cyber-dark/95 border-neon-cyan p-4 mb-2 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center animate-pulse">
                <i className="fas fa-microphone text-cyber-dark text-sm" />
              </div>
              <div className="absolute -inset-1 bg-neon-cyan/30 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-xs font-medium text-neon-cyan">Dr. Cannabis IA</p>
              <p className="text-xs text-gray-300">Falando...</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={stopGreeting}
              className="text-gray-400 hover:text-red-400"
              data-testid="stop-voice-button"
            >
              <i className="fas fa-stop text-xs" />
            </Button>
          </div>
        </Card>
      )}

      {/* Controles de voz - Mobile: apenas IA trigger, Desktop: todos */}
      {!isPlaying && (
        <Button
            onClick={playGreeting}
            size="sm"
            className="bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/30 w-8 h-8 p-0 rounded-full"
            data-testid="voice-greeting-button"
            title={hasPlayedToday ? 'Repetir Saudação' : 'Saudação por Voz'}
          >
            <i className="fas fa-volume-up text-xs" />
          </Button>
      )}
    </div>
  );
}

// Componente para mostrar mensagem atual (opcional)
export function VoiceMessagePreview() {
  const { currentMessage, isSupported } = useVoiceGreeting();
  
  if (!isSupported || !currentMessage) return null;

  return (
    <Card className="bg-cyber-dark/80 border-neon-cyan/30 p-3 max-w-md">
      <p className="text-xs text-gray-400 mb-1">Mensagem de Saudação:</p>
      <p className="text-sm text-gray-200 italic">"{currentMessage}"</p>
    </Card>
  );
}