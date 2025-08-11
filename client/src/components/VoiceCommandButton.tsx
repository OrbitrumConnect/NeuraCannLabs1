import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";

export function VoiceCommandButton() {
  const { isSupported, isListening, lastCommand, startListening, stopListening } = useVoiceCommands();

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-4 right-20 z-50">
      {/* Indicador quando está escutando */}
      {isListening && (
        <Card className="bg-cyber-dark/95 border-neon-cyan p-3 mb-2 max-w-xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
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
              className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 w-8 h-8 p-0 rounded-full"
              data-testid="voice-stop-button"
            >
              <i className="fas fa-stop text-xs" />
            </Button>
          </div>
        </Card>
      )}

      {/* Botão de comando por voz */}
      {!isListening && (
        <Button
          onClick={startListening}
          size="sm"
          className="bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 w-10 h-10 p-0 rounded-full"
          data-testid="voice-command-button"
          title="Comandos por Voz - Dr. Cannabis IA"
        >
          <i className="fas fa-microphone text-sm" />
        </Button>
      )}
    </div>
  );
}