import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Hand, Eye, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GestureControlProps {
  onGestureDetected: (gesture: GestureType, data?: any) => void
  enabled?: boolean
  className?: string
}

export type GestureType = 
  | 'swipe_left' 
  | 'swipe_right' 
  | 'swipe_up' 
  | 'swipe_down'
  | 'pinch_zoom_in'
  | 'pinch_zoom_out' 
  | 'double_tap'
  | 'long_press'
  | 'rotate_clockwise'
  | 'rotate_counter_clockwise'

interface GestureData {
  gesture: GestureType
  confidence: number
  timestamp: number
  coordinates?: { x: number; y: number }
  velocity?: number
}

export function GestureControl({ onGestureDetected, enabled = true, className }: GestureControlProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentGesture, setCurrentGesture] = useState<GestureType | null>(null)
  const [gestureHistory, setGestureHistory] = useState<GestureData[]>([])
  const [sensitivity, setSensitivity] = useState(0.7)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const gestureStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Configurações de gestos médicos específicos
  const medicalGestureMap: Record<GestureType, string> = {
    swipe_left: 'Voltar página anterior',
    swipe_right: 'Próxima página',
    swipe_up: 'Rolar para cima',
    swipe_down: 'Rolar para baixo', 
    pinch_zoom_in: 'Aumentar zoom (imagens médicas)',
    pinch_zoom_out: 'Diminuir zoom (imagens médicas)',
    double_tap: 'Ativar/pausar áudio',
    long_press: 'Menu contextual',
    rotate_clockwise: 'Girar imagem horário',
    rotate_counter_clockwise: 'Girar imagem anti-horário'
  }

  useEffect(() => {
    if (enabled && isActive) {
      initializeGestureDetection()
    }
    return () => {
      cleanup()
    }
  }, [enabled, isActive])

  const initializeGestureDetection = async () => {
    try {
      // Ativar câmera para detecção de gestos de mão (opcional)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.log('Camera não disponível, usando apenas touch gestures')
    }
  }

  const cleanup = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
    }
  }

  const detectGesture = useCallback((gesture: GestureType, confidence: number, coordinates?: { x: number; y: number }) => {
    const gestureData: GestureData = {
      gesture,
      confidence,
      timestamp: Date.now(),
      coordinates
    }

    setCurrentGesture(gesture)
    setGestureHistory(prev => [gestureData, ...prev.slice(0, 9)]) // Manter últimos 10
    onGestureDetected(gesture, gestureData)

    // Limpar gesto atual após feedback visual
    setTimeout(() => setCurrentGesture(null), 1000)
  }, [onGestureDetected])

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enabled || !isActive) return

    const touch = e.touches[0]
    gestureStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // Detectar long press
    longPressTimeoutRef.current = setTimeout(() => {
      detectGesture('long_press', 0.9, { x: touch.clientX, y: touch.clientY })
    }, 800)

    // Detectar double tap
    if (e.touches.length === 1) {
      const now = Date.now()
      const lastTap = (e.target as any)._lastTap || 0
      if (now - lastTap < 300) {
        detectGesture('double_tap', 0.95, { x: touch.clientX, y: touch.clientY })
      }
      ;(e.target as any)._lastTap = now
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enabled || !isActive || !gestureStartRef.current) return

    // Limpar long press se houve movimento
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }

    const touch = e.touches[0]
    const deltaX = touch.clientX - gestureStartRef.current.x
    const deltaY = touch.clientY - gestureStartRef.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Detectar pinch zoom
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      const previousDistance = (e.target as any)._previousPinchDistance
      if (previousDistance) {
        const pinchDelta = currentDistance - previousDistance
        if (Math.abs(pinchDelta) > 10) {
          const gesture = pinchDelta > 0 ? 'pinch_zoom_in' : 'pinch_zoom_out'
          detectGesture(gesture, 0.85)
        }
      }
      ;(e.target as any)._previousPinchDistance = currentDistance
    }

    // Detectar swipes (precisa de movimento mínimo)
    if (distance > 50) {
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      const absAngle = Math.abs(angle)

      let gesture: GestureType | null = null
      if (absAngle < 45 || absAngle > 135) {
        gesture = deltaX > 0 ? 'swipe_right' : 'swipe_left'
      } else {
        gesture = deltaY > 0 ? 'swipe_down' : 'swipe_up'
      }

      if (gesture) {
        const confidence = Math.min(distance / 200, 1) * sensitivity
        detectGesture(gesture, confidence, { x: touch.clientX, y: touch.clientY })
      }
    }
  }

  const handleTouchEnd = () => {
    gestureStartRef.current = null
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }
  }

  const toggleGestureDetection = () => {
    setIsActive(!isActive)
  }

  return (
    <Card className={cn("border-2 transition-all duration-300", 
      isActive ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-gray-200",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Hand className="h-4 w-4" />
            Controle por Gestos
          </CardTitle>
          <Button
            onClick={toggleGestureDetection}
            variant={isActive ? "destructive" : "default"}
            size="sm"
            data-testid="button-gesture-toggle"
          >
            {isActive ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Área de detecção de gestos */}
        <div 
          className={cn(
            "relative w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all",
            isActive ? "border-purple-300 bg-purple-50/50 dark:bg-purple-900/10" : "border-gray-300"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-testid="gesture-detection-area"
        >
          {isActive ? (
            <div className="text-center">
              <Eye className="mx-auto mb-2 h-6 w-6 text-purple-600" />
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Área ativa para gestos
              </p>
              {currentGesture && (
                <Badge className="mt-2 bg-purple-600">
                  {medicalGestureMap[currentGesture]}
                </Badge>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Hand className="mx-auto mb-2 h-6 w-6" />
              <p className="text-sm">Toque em "Ativar" para usar gestos</p>
            </div>
          )}
        </div>

        {/* Gestos disponíveis */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs">
            <Move className="h-3 w-3" />
            <span>Arrastar: Navegar</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ZoomIn className="h-3 w-3" />
            <span>Pinça: Zoom</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <RotateCcw className="h-3 w-3" />
            <span>Toque duplo: Áudio</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Hand className="h-3 w-3" />
            <span>Pressione: Menu</span>
          </div>
        </div>

        {/* Configurações */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Sensibilidade:</span>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-16"
              data-testid="slider-sensitivity"
            />
          </div>
        </div>

        {/* Histórico de gestos */}
        {gestureHistory.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Últimos gestos:</p>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {gestureHistory.slice(0, 3).map((gesture, idx) => (
                <div key={idx} className="text-xs p-1 bg-gray-50 dark:bg-gray-800 rounded">
                  {medicalGestureMap[gesture.gesture]} ({Math.round(gesture.confidence * 100)}%)
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Câmera de detecção (oculta) */}
        <video
          ref={videoRef}
          className="hidden"
          width="320"
          height="240"
          autoPlay
          muted
        />
        <canvas
          ref={canvasRef}
          className="hidden"
          width="320"
          height="240"
        />
      </CardContent>
    </Card>
  )
}