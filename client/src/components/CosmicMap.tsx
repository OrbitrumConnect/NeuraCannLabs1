import { useState } from "react";
import { Search, Filter, Brain, Microscope, Pill, AlertTriangle } from "lucide-react";

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
  onSearch?: (term: string, filter: string) => void;
}

const planets: CosmicPlanet[] = [
  {
    id: "scientific",
    name: "Dados Científicos",
    position: { bottom: "25%", left: "25%" },
    size: "w-16 h-16",
    color: "from-emerald-400 to-green-600",
    icon: "fas fa-microscope",
    delay: "0.5s",
  },
  {
    id: "clinical",
    name: "Casos Clínicos",
    position: { bottom: "25%", right: "25%" },
    size: "w-16 h-16",
    color: "from-blue-400 to-indigo-600",
    icon: "fas fa-user-md",
    delay: "1s",
  },
  {
    id: "alerts",
    name: "Alertas",
    position: { bottom: "5%", left: "30%" },
    size: "w-12 h-12",
    color: "from-amber-400 to-orange-600",
    icon: "fas fa-bell",
    delay: "1.5s",
  },
  {
    id: "profile",
    name: "Perfil",
    position: { bottom: "5%", right: "30%" },
    size: "w-12 h-12",
    color: "from-purple-400 to-pink-600",
    icon: "fas fa-user-circle",
    delay: "2s",
  },
];

export default function CosmicMap({ onPlanetClick, activeDashboard, onSearch }: CosmicMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const filters = [
    { id: "todos", label: "Todos", icon: Brain },
    { id: "cbd", label: "CBD", icon: Pill },
    { id: "thc", label: "THC", icon: Pill },
    { id: "epilepsia", label: "Epilepsia", icon: Microscope },
    { id: "dor", label: "Dor", icon: AlertTriangle },
  ];

  return (
    <div className="relative h-96 overflow-hidden">
      {/* Central Search Bar */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-neon-cyan/20 w-96">
          <div className="flex items-center space-x-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-cyan/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquisar estudos, casos, alertas..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  onSearch?.(e.target.value, selectedFilter);
                }}
                className="w-full bg-transparent border border-neon-cyan/30 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-neon-cyan/60"
              />
            </div>
            <Filter className="text-neon-cyan/60 w-4 h-4" />
          </div>
          
          {/* Filter Options */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setSelectedFilter(filter.id);
                  onSearch?.(searchTerm, filter.id);
                }}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${
                  selectedFilter === filter.id
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                    : "bg-gray-800/60 text-gray-300 border border-gray-600/40 hover:bg-gray-700/60"
                }`}
              >
                <filter.icon className="w-3 h-3" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Knowledge Planets - Reduced brightness */}
      {planets.map((planet) => (
        <div
          key={planet.id}
          className={`absolute ${planet.size} bg-gradient-to-br ${planet.color} rounded-full animate-float cursor-pointer hover:scale-110 transition-transform opacity-80 ${
            activeDashboard === planet.id ? "ring-2 ring-neon-cyan/30 ring-opacity-50" : ""
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
            <i className={`${planet.icon} text-white/80 ${planet.size.includes("16") ? "" : "text-sm"}`} />
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/70 whitespace-nowrap">
            {planet.name}
          </div>
        </div>
      ))}
      
      {/* Subtle connecting lines from search bar to planets */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgba(0,255,255,0.1)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "rgba(0,255,255,0.03)", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <line x1="50%" y1="25%" x2="25%" y2="75%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="75%" y2="75%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="30%" y2="95%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="70%" y2="95%" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.3"/>
      </svg>
    </div>
  );
}
