import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoiceCommandSystem } from './VoiceCommandSystem'
import { GestureControl, type GestureType } from './GestureControl'
import { TextToSpeech } from './TextToSpeech'
import { 
  Mic, 
  Hand, 
  Volume2, 
  Brain, 
  Zap, 
  Eye, 
  Sparkles,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SmartInteractionHubProps {
  onSearchQuery: (query: string) => void
  onModeChange: (mode: 'voice' | 'gesture' | 'text') => void
  className?: string
}

interface InteractionState {
  primaryMode: 'voice' | 'gesture' | 'text'
  voiceActive: boolean
  gestureActive: boolean
  smartMode: boolean
  contextAware: boolean
}

export function SmartInteractionHub({ 
  onSearchQuery, 
  onModeChange, 
  className 
}: SmartInteractionHubProps) {
  const [state, setState] = useState<InteractionState>({
    primaryMode: 'text',
    voiceActive: false,
    gestureActive: false,
    smartMode: true,
    contextAware: true
  })

  const [activeFeatures, setActiveFeatures] = useState<string[]>([])
  const [currentContext, setCurrentContext] = useState<string>('dashboard')
  const [adaptiveResponse, setAdaptiveResponse] = useState<string>('')
  const [interactionHistory, setInteractionHistory] = useState<any[]>([])

  // Contextos médicos inteligentes
  const medicalContexts = {
    dashboard: {
      voiceCommands: ['mostrar resumo', 'buscar casos', 'abrir pesquisa'],
      gestures: ['swipe_right', 'double_tap'],
      suggestions: ['Diga: "buscar cannabis epilepsia"', 'Arraste para navegar']
    },
    research: {
      voiceCommands: ['pesquisar', 'filtrar por', 'salvar estudo', 'ler resumo'],
      gestures: ['pinch_zoom_in', 'swipe_left', 'long_press'],
      suggestions: ['Use pinça para zoom', 'Pressione para salvar']
    },
    clinical: {
      voiceCommands: ['abrir caso', 'adicionar nota', 'próximo paciente'],
      gestures: ['swipe_up', 'swipe_down', 'double_tap'],
      suggestions: ['Navegue com gestos', 'Fale comandos clínicos']
    }
  }

  useEffect(() => {
    // Detectar contexto automaticamente baseado na URL
    const path = window.location.pathname
    if (path.includes('scientific')) setCurrentContext('research')
    else if (path.includes('clinical')) setCurrentContext('clinical')
    else setCurrentContext('dashboard')
  }, [])

  // Sistema de aprendizado adaptativo
  useEffect(() => {
    const preferences = localStorage.getItem('neurocann_interaction_prefs')
    if (preferences) {
      const parsed = JSON.parse(preferences)
      setState(prev => ({ ...prev, ...parsed }))
    }
  }, [])

  const handleVoiceCommand = (command: string) => {
    const processedCommand = processIntelligentCommand(command)
    onSearchQuery(processedCommand)
    
    // Aprender padrões do usuário
    updateInteractionHistory('voice', command, currentContext)
    
    // Resposta adaptativa
    if (state.contextAware) {
      generateAdaptiveResponse(command)
    }
  }

  const handleGestureDetected = (gesture: GestureType, data?: any) => {
    const gestureAction = mapGestureToAction(gesture, currentContext)
    if (gestureAction) {
      executeGestureAction(gestureAction)
      updateInteractionHistory('gesture', gesture, currentContext)
    }
  }

  const processIntelligentCommand = (command: string): string => {
    const lowerCommand = command.toLowerCase()
    
    // Mapeamento inteligente de comandos em português
    const commandMap: Record<string, string> = {
      'pesquisar cannabis': 'cannabis medical studies',
      'buscar cbd': 'cannabidiol clinical trials',
      'estudos epilepsia': 'cannabis epilepsy treatment',
      'protocolos dor': 'cannabis pain management protocols',
      'efeitos colaterais': 'cannabis side effects research',
      'dosagem recomendada': 'cannabis dosing guidelines',
      'interações medicamentosas': 'cannabis drug interactions'
    }

    // Buscar melhor match
    for (const [key, value] of Object.entries(commandMap)) {
      if (lowerCommand.includes(key)) {
        return value
      }
    }

    return command // Retorna original se não há mapeamento
  }

  const mapGestureToAction = (gesture: GestureType, context: string): string | null => {
    const contextGestures = medicalContexts[context as keyof typeof medicalContexts]?.gestures || []
    
    if (!contextGestures.includes(gesture)) return null

    const gestureActions: Record<GestureType, string> = {
      swipe_left: 'navigate_back',
      swipe_right: 'navigate_forward', 
      swipe_up: 'scroll_up',
      swipe_down: 'scroll_down',
      pinch_zoom_in: 'zoom_in',
      pinch_zoom_out: 'zoom_out',
      double_tap: 'toggle_audio',
      long_press: 'context_menu',
      rotate_clockwise: 'rotate_right',
      rotate_counter_clockwise: 'rotate_left'
    }

    return gestureActions[gesture] || null
  }

  const executeGestureAction = (action: string) => {
    switch (action) {
      case 'navigate_back':
        window.history.back()
        break
      case 'navigate_forward':
        window.history.forward()
        break
      case 'toggle_audio':
        // Implementar toggle TTS
        break
      case 'zoom_in':
        document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') + 0.1).toString()
        break
      case 'zoom_out':
        document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') - 0.1).toString()
        break
    }
  }

  const updateInteractionHistory = (type: string, command: string, context: string) => {
    const interaction = {
      type,
      command,
      context,
      timestamp: new Date().toISOString(),
      success: true
    }
    
    setInteractionHistory(prev => [interaction, ...prev.slice(0, 19)])
    
    // Salvar preferências
    const preferences = { ...state }
    localStorage.setItem('neurocann_interaction_prefs', JSON.stringify(preferences))
  }

  const generateAdaptiveResponse = (command: string) => {
    const responses = [
      'Entendido! Processando sua pesquisa médica...',
      'Buscando nos estudos científicos...',
      'Analisando dados clínicos relevantes...',
      'Encontrando protocolos atualizados...'
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    setAdaptiveResponse(randomResponse)
    
    setTimeout(() => setAdaptiveResponse(''), 3000)
  }

  const toggleSmartMode = () => {
    setState(prev => {
      const newState = { ...prev, smartMode: !prev.smartMode }
      localStorage.setItem('neurocann_interaction_prefs', JSON.stringify(newState))
      return newState
    })
  }

  const currentContextData = medicalContexts[currentContext as keyof typeof medicalContexts]

  return (
    <Card className={cn("border-2 border-gradient-to-r from-purple-500 to-blue-500", className)}>
      <CardContent className="p-4 space-y-4">
        {/* Header com status inteligente */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Interação Inteligente</h3>
            {state.smartMode && (
              <Badge variant="default" className="bg-purple-600">
                <Sparkles className="h-3 w-3 mr-1" />
                IA Ativa
              </Badge>
            )}
          </div>
          
          <Button
            onClick={toggleSmartMode}
            variant="outline"
            size="sm"
            data-testid="button-smart-toggle"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Resposta adaptativa */}
        {adaptiveResponse && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {adaptiveResponse}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs de interação */}
        <Tabs value={state.primaryMode} onValueChange={(mode) => {
          setState(prev => ({ ...prev, primaryMode: mode as any }))
          onModeChange(mode as any)
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice" className="flex items-center gap-1">
              <Mic className="h-3 w-3" />
              Voz
            </TabsTrigger>
            <TabsTrigger value="gesture" className="flex items-center gap-1">
              <Hand className="h-3 w-3" />
              Gestos
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Visual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="mt-4">
            <VoiceCommandSystem
              onVoiceCommand={handleVoiceCommand}
              onTranscriptUpdate={(transcript) => {}}
            />
          </TabsContent>

          <TabsContent value="gesture" className="mt-4">
            <GestureControl
              onGestureDetected={handleGestureDetected}
              enabled={state.gestureActive}
            />
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <div className="text-center py-8">
              <Eye className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Use a interface visual tradicional
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Clique nos botões e menus normalmente
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Sugestões contextuais */}
        {state.contextAware && currentContextData && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardContent className="pt-3 pb-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Sugestões para {currentContext}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {currentContextData.suggestions.map((suggestion, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas de uso */}
        {interactionHistory.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {interactionHistory.length} interações registradas
          </div>
        )}
      </CardContent>
    </Card>
  )
}