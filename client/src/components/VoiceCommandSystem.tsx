import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceCommandSystemProps {
  onVoiceCommand: (command: string) => void
  onTranscriptUpdate: (transcript: string) => void
  className?: string
}

export function VoiceCommandSystem({ 
  onVoiceCommand, 
  onTranscriptUpdate, 
  className 
}: VoiceCommandSystemProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [isSupported, setIsSupported] = useState(false)
  const [volume, setVolume] = useState(0)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)

  // Comandos médicos específicos reconhecidos
  const medicalCommands = [
    'pesquisar cannabis epilepsia',
    'buscar estudos dor crônica', 
    'mostrar protocolos CBD',
    'avatar modo consulta',
    'ativar síntese de voz',
    'abrir dashboard',
    'salvar pesquisa',
    'exportar resultados'
  ]

  useEffect(() => {
    // Verificar suporte do browser
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      initializeSpeechRecognition()
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'pt-BR' // Português brasileiro para medicina
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      setIsListening(true)
      setupAudioVisualization()
    }

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        const confidenceScore = event.results[i][0].confidence

        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart
          setConfidence(confidenceScore)
          
          // Processar comando médico
          if (isValidMedicalCommand(transcriptPart)) {
            onVoiceCommand(transcriptPart.trim())
            setCommandHistory(prev => [transcriptPart.trim(), ...prev.slice(0, 4)])
          }
        } else {
          interimTranscript += transcriptPart
        }
      }

      const fullTranscript = finalTranscript + interimTranscript
      setTranscript(fullTranscript)
      onTranscriptUpdate(fullTranscript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setVolume(0)
    }

    recognitionRef.current = recognition
  }

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
      
      microphoneRef.current.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setVolume(average / 255 * 100)
          requestAnimationFrame(updateVolume)
        }
      }
      
      updateVolume()
    } catch (error) {
      console.error('Error setting up audio visualization:', error)
    }
  }

  const isValidMedicalCommand = (text: string): boolean => {
    const lowerText = text.toLowerCase()
    return medicalCommands.some(cmd => 
      lowerText.includes(cmd.toLowerCase()) || 
      lowerText.includes('cannabis') ||
      lowerText.includes('cbd') ||
      lowerText.includes('pesquisa') ||
      lowerText.includes('buscar') ||
      lowerText.includes('protocolo')
    )
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="pt-4">
          <div className="text-center text-red-600 dark:text-red-400">
            <VolumeX className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">Comando de voz não suportado neste browser</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-2 transition-all duration-300", 
      isListening ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200",
      className
    )}>
      <CardContent className="pt-4 space-y-4">
        {/* Controles principais */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="relative"
              data-testid="button-voice-toggle"
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  Parar
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Falar
                </>
              )}
            </Button>
            
            {isListening && (
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-green-600" />
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-100" 
                    style={{ width: `${volume}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {confidence > 0 && (
            <Badge variant="secondary">
              Precisão: {Math.round(confidence * 100)}%
            </Badge>
          )}
        </div>

        {/* Transcrição em tempo real */}
        {transcript && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ouvindo:</p>
            <p className="text-gray-900 dark:text-gray-100" data-testid="text-transcript">
              {transcript}
            </p>
          </div>
        )}

        {/* Comandos sugeridos */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Comandos sugeridos:</p>
          <div className="flex flex-wrap gap-1">
            {medicalCommands.slice(0, 4).map((cmd, idx) => (
              <Badge 
                key={idx}
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary/10"
                onClick={() => onVoiceCommand(cmd)}
                data-testid={`badge-command-${idx}`}
              >
                "{cmd}"
              </Badge>
            ))}
          </div>
        </div>

        {/* Histórico de comandos */}
        {commandHistory.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Últimos comandos:</p>
            <div className="space-y-1">
              {commandHistory.map((cmd, idx) => (
                <div key={idx} className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  {cmd}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Extensões da Web Speech API para TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number
    start(): void
    stop(): void
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number
    readonly results: SpeechRecognitionResultList
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string
  }

  interface SpeechRecognitionResultList {
    readonly length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean
    readonly length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string
    readonly confidence: number
  }
}