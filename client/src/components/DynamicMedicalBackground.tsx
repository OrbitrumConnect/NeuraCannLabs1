import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface DynamicMedicalBackgroundProps {
  context: 'overview' | 'scientific' | 'clinical' | 'alerts' | 'forum' | 'profile' | 'admin'
  className?: string
}

export function DynamicMedicalBackground({ context, className }: DynamicMedicalBackgroundProps) {
  const [currentPattern, setCurrentPattern] = useState(0)
  const [intensity, setIntensity] = useState(0.3)

  // Configurações específicas por contexto médico
  const contextConfigs = {
    overview: {
      color: '#00ff88',
      pattern: 'heartbeat',
      speed: 1200,
      intensity: 0.3,
      particleCount: 20
    },
    scientific: {
      color: '#00aaff',
      pattern: 'brainwaves',
      speed: 800,
      intensity: 0.4,
      particleCount: 30
    },
    clinical: {
      color: '#ff6600',
      pattern: 'vitals',
      speed: 1000,
      intensity: 0.5,
      particleCount: 25
    },
    alerts: {
      color: '#ff4444',
      pattern: 'alert_pulse',
      speed: 600,
      intensity: 0.7,
      particleCount: 40
    },
    forum: {
      color: '#8844ff',
      pattern: 'network',
      speed: 2000,
      intensity: 0.2,
      particleCount: 15
    },
    profile: {
      color: '#44ff88',
      pattern: 'personal',
      speed: 1500,
      intensity: 0.25,
      particleCount: 12
    },
    admin: {
      color: '#ffaa00',
      pattern: 'system',
      speed: 500,
      intensity: 0.6,
      particleCount: 50
    }
  }

  const config = contextConfigs[context] || contextConfigs.overview

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPattern(prev => (prev + 1) % 100)
      // Variação sutil na intensidade para efeito "respiratório"
      setIntensity(0.2 + Math.sin(Date.now() / 3000) * 0.2)
    }, config.speed / 10)

    return () => clearInterval(interval)
  }, [config.speed])

  // Gerador de partículas médicas flutuantes
  const generateParticles = () => {
    return Array.from({ length: config.particleCount }, (_, i) => (
      <div
        key={i}
        className="absolute animate-ping"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      >
        <div
          className="w-1 h-1 rounded-full"
          style={{
            backgroundColor: config.color,
            opacity: intensity * 0.3,
            boxShadow: `0 0 6px ${config.color}`
          }}
        />
      </div>
    ))
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
      {/* Grid médico base */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${config.color}33 1px, transparent 1px),
            linear-gradient(90deg, ${config.color}33 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Padrão específico do contexto */}
      {renderPattern()}
      
      {/* Partículas flutuantes */}
      {generateParticles()}
      
      {/* Linha de scan que atravessa a tela */}
      <div
        className="absolute top-0 w-full h-0.5 opacity-30"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          transform: `translateY(${(currentPattern * 5) % window.innerHeight}px)`,
          transition: 'transform 0.1s linear'
        }}
      />
      
      {/* Cantos médicos com informações */}
      <div 
        className="absolute top-4 left-4 text-xs font-mono opacity-40"
        style={{ color: config.color }}
      >
        {context.toUpperCase()} • NEURAL ACTIVE
      </div>
      
      <div 
        className="absolute top-4 right-4 text-xs font-mono opacity-40"
        style={{ color: config.color }}
      >
        {Math.round(intensity * 100)}% INTENSITY
      </div>
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
`