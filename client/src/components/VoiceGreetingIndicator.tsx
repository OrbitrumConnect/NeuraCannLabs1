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
    <div className="fixed bottom-12 left-4 sm:bottom-4 sm:left-4 z-50">
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
        <div className="flex flex-col gap-2">
          {/* Trigger IA - Reposicionado para onde estava o limpa cache no mobile */}
          <Button
            onClick={playGreeting}
            size="sm"
            className="bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/30 w-3 h-3 md:w-7 md:h-7 p-0 rounded-full"
            data-testid="voice-greeting-button"
            title={hasPlayedToday ? 'Repetir Saudação' : 'Saudação por Voz'}
          >
            <i className="fas fa-volume-up" style={{ fontSize: '6px' }} />
          </Button>
          
          {/* Botão de debug - APENAS DESKTOP */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              onClick={() => {
                localStorage.removeItem('last_login_free-user');
                localStorage.removeItem('greeting_played_free-user');
                localStorage.removeItem('last_login_user-1');
                localStorage.removeItem('greeting_played_user-1');
                console.log('🎤 Cache limpo - próximo acesso tocará novamente');
              }}
              size="sm"
              className="hidden md:block bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 w-6 h-6 md:w-7 md:h-7 p-0 rounded-full"
              title="Limpar cache de voz (dev)"
            >
              <i className="fas fa-trash text-xs" />
            </Button>
          )}
        </div>
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