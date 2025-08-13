interface Avatar3DProps {
  className?: string;
  size?: number;
  color?: string;
  isScanning?: boolean;
}

export default function Avatar3D({ 
  className = "w-20 sm:w-32 h-20 sm:h-32", 
  size = 100,
  color = "#22c55e",
  isScanning = false 
}: Avatar3DProps) {
  return (
    <div className={`${className} avatar-glow relative flex items-center justify-center ${isScanning ? 'avatar-scanning' : ''}`} style={{ width: size, height: size }}>
      {/* Efeito de scan especial */}
      {isScanning && (
        <div className="absolute inset-0 rounded-full animate-ping border-4 border-green-500/60" />
      )}
      {isScanning && (
        <div className="absolute inset-2 rounded-full animate-pulse bg-green-500/10 border-2 border-green-500/40" />
      )}
      
      {/* Holographic Avatar SVG */}
      <div className={`relative animate-hologram ${isScanning ? 'scale-110' : ''} transition-transform duration-300`}>
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 100 100"
          className={`animate-pulse-glow ${isScanning ? 'animate-bounce' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: isScanning ? `drop-shadow(0 0 20px ${color}) brightness(1.5)` : undefined }}
        >
          {/* Outer holographic ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="url(#holographicGradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-spin"
            style={{ animationDuration: '8s' }}
          />
          
          {/* Cabeça da Dra. Cannabis */}
          <circle cx="50" cy="30" r="12" fill={color} fillOpacity="0.4" />
          <circle cx="47" cy="28" r="1.5" fill={color} fillOpacity="0.8" />
          <circle cx="53" cy="28" r="1.5" fill={color} fillOpacity="0.8" />
          <path d="M47 32 Q50 34 53 32" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
          
          {/* Corpo médico da Dra. Cannabis */}
          <path d="M38 42 Q50 38 62 42 L60 72 Q50 76 40 72 Z" fill={color} fillOpacity="0.3" />
          
          {/* Cruz médica no peito */}
          <path d="M48 50 L52 50 M50 48 L50 52" stroke="#ffffff" strokeWidth="1.8" opacity="0.9" />
          
          {/* Folha de Cannabis estilizada */}
          <path 
            d="M50 18 Q45 22 42 26 Q47 30 50 34 Q53 30 58 26 Q55 22 50 18 Z" 
            fill="#16a34a" 
            fillOpacity="0.7"
            className={isScanning ? "animate-bounce" : "animate-pulse"}
          />
          <path d="M48 20 L52 20 M46 24 L54 24 M44 28 L56 28" stroke="#15803d" strokeWidth="0.6" opacity="0.6" />
          
          {/* Estetoscópio */}
          <path d="M42 46 Q38 50 42 54 Q46 50 42 46" fill={color} fillOpacity="0.5" />
          <path d="M42 46 Q50 44 58 46" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7" />
          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="holographicGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4"/>
              <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-cyber-gray rounded-full border border-green-500/30">
        <span className="text-xs text-green-500 animate-pulse">Dra. Cannabis IA</span>
      </div>
    </div>
  );
}
