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
      setCurrentBeat(prev => (prev + 1) % 100)
    }, speed / 100)

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

  // Efeito de pulso para simular monitoramento
  const pulseIntensity = Math.sin(Date.now() / 500) * 0.3 + 0.7

  return (
    <div className={cn("w-full h-16 relative overflow-hidden", className)}>
      {/* Grid médico de fundo */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(${color}22 1px, transparent 1px),
            linear-gradient(90deg, ${color}22 1px, transparent 1px)
          `,
          backgroundSize: '20px 10px'
        }}
      />
      
      {/* Linha de batimento cardíaco */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      >
        {/* Linha base */}
        <line 
          x1="0" 
          y1="50" 
          x2="100" 
          y2="50" 
          stroke={color}
          strokeWidth="0.5"
          opacity="0.3"
        />
        
        {/* Padrão de batimento principal */}
        <path
          d={createHeartbeatPath()}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={pulseIntensity}
          className="animate-pulse"
        />
        
        {/* Efeito de scanning line que se move */}
        <line
          x1={currentBeat}
          y1="0"
          x2={currentBeat}
          y2="100"
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
          className="animate-pulse"
          style={{ filter: `blur(0.5px)` }}
        />
        
        {/* Múltiplas linhas de batimento para efeito mais denso */}
        <path
          d={createHeartbeatPath()}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.4"
          transform="translate(25, 0)"
        />
        
        <path
          d={createHeartbeatPath()}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
          transform="translate(50, 0)"
        />
        
        <path
          d={createHeartbeatPath()}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.2"
          transform="translate(75, 0)"
        />
      </svg>
      
      {/* Informações médicas simuladas */}
      <div className="absolute top-1 left-4 flex items-center gap-4 text-xs font-mono opacity-60">
        <span style={{ color }}>HR: 72 BPM</span>
        <span style={{ color }}>BP: 120/80</span>
        <span style={{ color }}>SpO₂: 98%</span>
        <span className="animate-pulse" style={{ color }}>●</span>
      </div>
      
      {/* Status do sistema */}
      <div className="absolute top-1 right-4 flex items-center gap-2 text-xs font-mono opacity-60">
        <span style={{ color }}>NeuroCann Lab</span>
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
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