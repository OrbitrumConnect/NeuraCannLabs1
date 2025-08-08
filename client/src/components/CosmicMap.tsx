import { useState } from "react";

interface CosmicPlanet {
  id: string;
  name: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  size: string;
  color: string;
  icon: string;
  delay: string;
}

interface CosmicMapProps {
  onPlanetClick: (dashboardId: string) => void;
  activeDashboard: string;
}

const planets: CosmicPlanet[] = [
  {
    id: "scientific",
    name: "Dados Científicos",
    position: { top: "20%", left: "20%" },
    size: "w-16 h-16",
    color: "from-emerald-400 to-green-600",
    icon: "fas fa-microscope",
    delay: "0.5s",
  },
  {
    id: "clinical",
    name: "Casos Clínicos",
    position: { top: "20%", right: "20%" },
    size: "w-16 h-16",
    color: "from-blue-400 to-indigo-600",
    icon: "fas fa-user-md",
    delay: "1s",
  },
  {
    id: "alerts",
    name: "Alertas",
    position: { bottom: "20%", left: "20%" },
    size: "w-12 h-12",
    color: "from-amber-400 to-orange-600",
    icon: "fas fa-bell",
    delay: "1.5s",
  },
  {
    id: "profile",
    name: "Perfil",
    position: { bottom: "20%", right: "20%" },
    size: "w-12 h-12",
    color: "from-purple-400 to-pink-600",
    icon: "fas fa-user-circle",
    delay: "2s",
  },
];

export default function CosmicMap({ onPlanetClick, activeDashboard }: CosmicMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  return (
    <div className="relative h-96 bg-gradient-to-br from-cyber-dark via-cyber-gray to-cyber-light rounded-2xl border border-neon-cyan/30 overflow-hidden holographic-border">
      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-full animate-pulse-glow flex items-center justify-center">
        <i className="fas fa-cannabis text-white text-2xl" />
      </div>
      
      {/* Knowledge Planets */}
      {planets.map((planet) => (
        <div
          key={planet.id}
          className={`absolute ${planet.size} bg-gradient-to-br ${planet.color} rounded-full animate-float cursor-pointer hover:scale-110 transition-transform ${
            activeDashboard === planet.id ? "ring-2 ring-neon-cyan ring-opacity-50" : ""
          }`}
          style={{
            ...planet.position,
            animationDelay: planet.delay,
            transform: hoveredPlanet === planet.id ? "scale(1.15)" : "scale(1)",
          }}
          onClick={() => onPlanetClick(planet.id)}
          onMouseEnter={() => setHoveredPlanet(planet.id)}
          onMouseLeave={() => setHoveredPlanet(null)}
          data-testid={`cosmic-planet-${planet.id}`}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <i className={`${planet.icon} text-white ${planet.size.includes("16") ? "" : "text-sm"}`} />
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-80">
            {planet.name}
          </div>
        </div>
      ))}
      
      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgba(0,255,255,0.3)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "rgba(0,255,255,0.1)", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6"/>
        <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6"/>
        <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6"/>
        <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6"/>
      </svg>
    </div>
  );
}
