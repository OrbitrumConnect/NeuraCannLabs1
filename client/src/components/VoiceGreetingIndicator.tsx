import { useVoiceGreeting } from '@/hooks/useVoiceGreeting';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function VoiceGreetingIndicator() {
  // SISTEMA ANTIGO DE SAUDAÇÃO ROBÓTICA DESABILITADO COMPLETAMENTE
  // A partir da v3.0 da plataforma, usamos apenas a Dra. Cannabis IA moderna

  console.log('🎤 Sistema de saudação antiga DESABILITADO - Usando apenas Dra. Cannabis IA moderna');
  return null; // Componente totalmente desabilitado
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