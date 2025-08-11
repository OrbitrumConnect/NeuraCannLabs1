import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";

export function VoiceCommandButton() {
  const { isSupported, isListening, lastCommand, startListening, stopListening } = useVoiceCommands();

  if (!isSupported) return null;

  return (
    <div className="hidden md:block fixed bottom-4 left-16 z-50">
      {/* Indicador quando está escutando */}
      {isListening && (
        <Card className="bg-cyber-dark/95 border-neon-cyan p-2 mb-1 max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-neon-cyan text-xs font-medium">Escutando comandos...</p>
              <p className="text-gray-400 text-xs">Diga: "pesquisar CBD" ou "ir para estudos"</p>
              {lastCommand && (
                <p className="text-yellow-400 text-xs mt-1">"{lastCommand}"</p>
              )}
            </div>
            <Button
              onClick={stopListening}
              size="sm"
              className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 w-6 h-6 p-0 rounded-full"
              data-testid="voice-stop-button"
            >
              <i className="fas fa-stop text-xs" />
            </Button>
          </div>
        </Card>
      )}

      {/* Botão de comando por voz - APENAS DESKTOP */}
      {!isListening && (
        <Button
          onClick={startListening}
          size="sm"
          className="bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 w-5 h-5 md:w-7 md:h-7 p-0 rounded-full"
          data-testid="voice-command-button"
          title="Comandos por Voz - Dr. Cannabis IA"
        >
          <i className="fas fa-microphone text-xs" />
        </Button>
      )}
    </div>
  );
}