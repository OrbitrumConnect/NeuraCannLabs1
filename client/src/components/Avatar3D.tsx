interface Avatar3DProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function Avatar3D({ 
  className = "w-32 h-32", 
  size = 150,
  color = "#00ffff" 
}: Avatar3DProps) {
  return (
    <div className={`${className} avatar-glow relative flex items-center justify-center`} style={{ width: size, height: size }}>
      {/* Holographic Avatar SVG */}
      <div className="relative animate-hologram">
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 100 100"
          className="animate-pulse-glow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
          
          {/* Inner medical symbol */}
          <circle cx="50" cy="35" r="12" fill={color} fillOpacity="0.3" />
          <path d="M35 65 Q 50 45 65 65 Q 50 85 35 65" fill={color} fillOpacity="0.2" />
          
          {/* Cannabis leaf silhouette */}
          <path 
            d="M50 25 Q 45 30 40 35 Q 45 40 50 45 Q 55 40 60 35 Q 55 30 50 25 Z" 
            fill={color} 
            fillOpacity="0.6"
          />
          
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
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-cyber-gray rounded-full border border-neon-cyan/30">
        <span className="text-xs text-neon-cyan animate-pulse">Dr. AI Assistant</span>
      </div>
    </div>
  );
}
