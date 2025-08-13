import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useScan } from "@/contexts/ScanContext"

interface DynamicMedicalBackgroundProps {
  context: 'overview' | 'scientific' | 'clinical' | 'alerts' | 'forum' | 'profile' | 'admin'
  className?: string
  onScanUpdate?: (scanPosition: number) => void
}

export function DynamicMedicalBackground({ context, className, onScanUpdate }: DynamicMedicalBackgroundProps) {
  const [currentPattern, setCurrentPattern] = useState(0)
  const [intensity, setIntensity] = useState(0.3)
  const { avatarScanning } = useScan()

  // Configurações específicas por contexto médico - PALETA NEUROCANN RIGOROSA
  const contextConfigs = {
    overview: {
      color: '#00ff00', // Verde neon (70%)
      pattern: 'heartbeat',
      speed: 1200,
      intensity: 0.15,
      particleCount: 10,
      lineCount: 10
    },
    scientific: {
      color: '#00ff00', // Verde neon (70%)
      pattern: 'brainwaves',
      speed: 800,
      intensity: 0.2,
      particleCount: 15,
      lineCount: 10
    },
    clinical: {
      color: '#ffff00', // Amarelo (20%)
      pattern: 'vitals',
      speed: 1000,
      intensity: 0.25,
      particleCount: 12,
      lineCount: 10
    },
    alerts: {
      color: '#ff0000', // Vermelho (10%)
      pattern: 'alert_pulse',
      speed: 600,
      intensity: 0.35,
      particleCount: 20,
      lineCount: 10
    },
    forum: {
      color: '#00ff00', // Verde neon (70%)
      pattern: 'network',
      speed: 2000,
      intensity: 0.1,
      particleCount: 8,
      lineCount: 10
    },
    profile: {
      color: '#00ff00', // Verde neon (70%)
      pattern: 'personal',
      speed: 1500,
      intensity: 0.125,
      particleCount: 6,
      lineCount: 10
    },
    admin: {
      color: '#ffff00', // Amarelo (20%)
      pattern: 'system',
      speed: 500,
      intensity: 0.3,
      particleCount: 25,
      lineCount: 10
    }
  }

  const config = contextConfigs[context] || contextConfigs.overview

  // Sincronização UNIVERSAL - linha e avatar usam mesma posição exata
  const { setScanPosition } = useScan();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPattern(prev => {
        const newPattern = (prev + 0.3) % 100 // Movimento bem mais lento
        
        // CRITICAL: Sincronizar posição exata entre linha e avatar
        setScanPosition(newPattern);
        
        return newPattern
      })
      // Variação sutil na intensidade para efeito "respiratório"
      setIntensity(0.2 + Math.sin(Date.now() / 3000) * 0.2)
    }, 50) // Movimento mais lento e suave

    return () => clearInterval(interval)
  }, [config.speed, setScanPosition])

  // Notifica a posição do scan em um useEffect separado para evitar warnings
  useEffect(() => {
    onScanUpdate?.(currentPattern)
  }, [currentPattern, onScanUpdate])

  // Efeito neon lateral sutil
  const generateSideGlow = () => {
    return (
      <>
        {/* Glow lateral esquerdo */}
        <div
          className="absolute left-0 top-0 bottom-0 w-8"
          style={{
            background: `linear-gradient(90deg, ${config.color}15, transparent)`,
            opacity: intensity * 0.5
          }}
        />
        {/* Glow lateral direito */}
        <div
          className="absolute right-0 top-0 bottom-0 w-8"
          style={{
            background: `linear-gradient(270deg, ${config.color}15, transparent)`,
            opacity: intensity * 0.5
          }}
        />
      </>
    )
  }

  // Padrões SVG específicos para cada contexto
  const renderPattern = () => {
    switch (config.pattern) {
      case 'brainwaves':
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: intensity }}>
            <defs>
              <pattern id="brainwave" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                <path
                  d="M0,50 Q20,20 40,50 T80,50 Q120,80 160,50 T200,50"
                  fill="none"
                  stroke={config.color}
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brainwave)" />
          </svg>
        )

      case 'vitals':
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: intensity }}>
            <defs>
              <pattern id="vitals" x="0" y="0" width="300" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M0,40 L50,40 L55,20 L65,60 L70,40 L100,40 L110,30 L120,50 L140,40 L200,40 L210,10 L220,70 L230,40 L300,40"
                  fill="none"
                  stroke={config.color}
                  strokeWidth="2"
                  opacity="0.4"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vitals)" />
          </svg>
        )

      case 'alert_pulse':
        return (
          <div className="absolute inset-0">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="absolute inset-0 animate-ping"
                style={{
                  background: `radial-gradient(circle, ${config.color}10 0%, transparent 70%)`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        )

      case 'network':
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: intensity }}>
            <defs>
              <pattern id="network" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="2" fill={config.color} opacity="0.3" />
                <line x1="60" y1="60" x2="120" y2="30" stroke={config.color} strokeWidth="0.5" opacity="0.2" />
                <line x1="60" y1="60" x2="30" y2="120" stroke={config.color} strokeWidth="0.5" opacity="0.2" />
                <line x1="60" y1="60" x2="90" y2="90" stroke={config.color} strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network)" />
          </svg>
        )

      case 'system':
        return (
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, ${config.color}22 25%, transparent 25%),
                  linear-gradient(-45deg, ${config.color}22 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, ${config.color}22 75%),
                  linear-gradient(-45deg, transparent 75%, ${config.color}22 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                animation: 'move 4s linear infinite'
              }}
            />
          </div>
        )

      default: // heartbeat
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: intensity }}>
            <defs>
              <pattern id="heartbeat" x="0" y="0" width="200" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M0,30 L40,30 L45,25 L50,35 L55,15 L60,50 L65,30 L80,30 L85,25 L90,35 L95,30 L200,30"
                  fill="none"
                  stroke={config.color}
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heartbeat)" />
          </svg>
        )
    }
  }

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Background com círculos sutis similar à landing page mas mais escuro */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 255, 0, 0.025) 0%, transparent 50%),
            radial-gradient(circle at 90% 70%, rgba(0, 255, 0, 0.015) 0%, transparent 50%),
            radial-gradient(circle at 10% 20%, rgba(0, 255, 0, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 60% 40%, rgba(0, 255, 0, 0.018) 0%, transparent 50%),
            linear-gradient(135deg, hsl(0, 0%, 8%) 0%, hsl(0, 0%, 10%) 50%, hsl(0, 0%, 8%) 100%)
          `
        }}
      />
      
      {/* Efeito neon lateral verde sutil */}
      {generateSideGlow()}
      
      {/* Linha horizontal que escaneia - desaparece no final e reaparece no topo */}
      <div
        className="absolute left-0 right-0 h-0.5"
        style={{
          background: (() => {
            const currentPos = (currentPattern * 2) % 100;
            // Zona amarela UNIVERSAL: 32% a 42% - sincronização melhorada para mobile/web
            const isYellowZone = currentPos >= 32 && currentPos <= 42;
            
            // Log para verificar sincronização em diferentes dispositivos
            if (isYellowZone) {
              const isMobile = window.innerWidth < 640;
              console.log(`✅ SINCRONIZAÇÃO PERFEITA! Avatar + Linha: ${currentPos.toFixed(1)}% | Mobile: ${isMobile}`);
            }
            
            return isYellowZone
              ? `linear-gradient(90deg, transparent, rgba(255,235,59,0.8), rgba(255,235,59,1.0), rgba(255,235,59,0.8), transparent)`
              : `linear-gradient(90deg, transparent, ${config.color}88, ${config.color}, ${config.color}88, transparent)`;
          })(),
          top: `${(currentPattern * 2) % 100}%`,
          filter: (() => {
            const currentPos = (currentPattern * 2) % 100;
            const isYellowZone = currentPos >= 32 && currentPos <= 42;
            
            return isYellowZone
              ? `blur(1px) drop-shadow(0 0 4px rgba(255,235,59,0.8))`
              : `blur(1px) drop-shadow(0 0 4px ${config.color})`;
          })(),
          opacity: (() => {
            const currentPos = (currentPattern * 2) % 100;
            // Fade out nos últimos 10% e fade in nos primeiros 10%
            if (currentPos > 85) {
              return ((100 - currentPos) / 15) * 0.6; // Fade out gradual
            } else if (currentPos < 15) {
              return (currentPos / 15) * 0.6; // Fade in gradual
            }
            return 0.6; // Opacidade normal
          })(),
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </div>
  )
}

// Styles CSS adicionais para animações
export const medicalBackgroundStyles = `
  @keyframes move {
    0% { transform: translateX(-20px) translateY(-20px); }
    100% { transform: translateX(20px) translateY(20px); }
  }
  
  @keyframes neural-pulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.6; }
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; transform: scaleY(1); }
    100% { opacity: 1; transform: scaleY(1.5); }
  }
`