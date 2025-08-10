import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MedicalHeartbeatProps {
  className?: string
  color?: string
  speed?: number
}

export function MedicalHeartbeat({ 
  className, 
  color = "#00ff88", 
  speed = 1200 
}: MedicalHeartbeatProps) {
  const [currentBeat, setCurrentBeat] = useState(0)
  const [isActive, setIsActive] = useState(true)

  // Padrão de batimento cardíaco realista (ECG)
  const heartbeatPath = [
    { x: 0, y: 50 },
    { x: 10, y: 50 },
    { x: 15, y: 50 },
    { x: 18, y: 45 },
    { x: 22, y: 20 }, // Primeira onda (P)
    { x: 25, y: 50 },
    { x: 30, y: 50 },
    { x: 35, y: 45 },
    { x: 38, y: 80 }, // Complexo QRS - pico principal
    { x: 40, y: 10 }, // Pico do batimento
    { x: 42, y: 85 },
    { x: 45, y: 50 },
    { x: 50, y: 50 },
    { x: 55, y: 45 },
    { x: 58, y: 35 }, // Onda T
    { x: 62, y: 50 },
    { x: 100, y: 50 } // Linha reta até o final
  ]

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCurrentBeat(prev => (prev + 0.2) % 100)
    }, speed / 200) // Mais lento e suave

    return () => clearInterval(interval)
  }, [speed, isActive])

  // Criar o path SVG do batimento
  const createHeartbeatPath = () => {
    let path = `M 0 50`
    
    heartbeatPath.forEach((point, index) => {
      if (index === 0) return
      path += ` L ${point.x} ${point.y}`
    })
    
    return path
  }

  // Efeito de pulso suave
  const pulseIntensity = Math.sin(Date.now() / 2000) * 0.1 + 0.6

  return (
    <div className={cn("w-full h-12 relative overflow-hidden bg-black/20", className)}>
      {/* Fundo escuro como monitor médico */}
      
      {/* Linha de batimento cardíaco */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      >
        {/* Linha base sutil */}
        <line 
          x1="0" 
          y1="50" 
          x2="100" 
          y2="50" 
          stroke={color}
          strokeWidth="0.3"
          opacity="0.2"
        />
        
        {/* Sinal vital principal */}
        <path
          d={createHeartbeatPath()}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          opacity={pulseIntensity}
          style={{ filter: `drop-shadow(0 0 3px ${color}66)` }}
        />
        
        {/* Cursor de varredura médico */}
        <line
          x1={currentBeat}
          y1="0"
          x2={currentBeat}
          y2="100"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.4"
          style={{ 
            filter: `blur(1px) drop-shadow(0 0 4px ${color})`,
            transition: 'all 0.1s ease'
          }}
        />
      </svg>
      
      {/* Informações médicas sutis */}
      <div className="absolute top-1 left-4 flex items-center gap-3 text-xs font-mono opacity-40">
        <span style={{ color }}>HR: 72</span>
        <span style={{ color }}>●</span>
        <span style={{ color }}>NeuroCann Lab</span>
      </div>
    </div>
  )
}

// Variações de cores para diferentes contextos
export const MedicalHeartbeatVariants = {
  green: "#00ff88",    // Verde médico padrão
  cyan: "#00ffff",     // Ciano cyberpunk
  blue: "#0088ff",     // Azul hospitalar
  orange: "#ff8800",   // Laranja de alerta
  red: "#ff4444",      // Vermelho de emergência
}