import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type ScientificStudy } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ScientificDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: studies, isLoading, error } = useQuery<ScientificStudy[]>({
    queryKey: ["/api/scientific"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          <span className="ml-4 text-neon-cyan">Carregando dados científicos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar dados científicos. Tente novamente.</p>
        </div>
      </div>
    );
  }

  const filteredStudies = studies?.filter(study =>
    study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.compound?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.indication?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCompoundColor = (compound: string | null) => {
    switch (compound?.toUpperCase()) {
      case "CBD": return "bg-green-500/20 text-green-400";
      case "THC": return "bg-orange-500/20 text-orange-400";
      case "CBG": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPhaseColor = (phase: string | null) => {
    switch (phase) {
      case "Fase I": return "bg-yellow-500/20 text-yellow-400";
      case "Fase II": return "bg-blue-500/20 text-blue-400";
      case "Fase III": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getIndicationColor = (indication: string | null) => {
    switch (indication?.toLowerCase()) {
      case "epilepsia": return "bg-blue-500/20 text-blue-400";
      case "dor crônica": return "bg-red-500/20 text-red-400";
      case "neurodegenerativas": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center mr-4 animate-pulse-glow">
          <i className="fas fa-microscope text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold neon-text">Dados Científicos</h1>
          <p className="text-gray-400">Estudos e pesquisas sobre cannabis medicinal</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <Card className="data-card rounded-xl mb-8 holographic-border">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar estudos, compostos, indicações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-cyber-light border-neon-cyan/30 pl-12 text-white placeholder-gray-400 focus:border-neon-cyan"
                  data-testid="search-studies-input"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" />
              </div>
            </div>
            <Button 
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500"
              data-testid="advanced-filters-button"
            >
              <i className="fas fa-filter mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scientific Studies Grid */}
      {filteredStudies.length === 0 ? (
        <Card className="data-card rounded-xl p-8 text-center">
          <CardContent>
            <i className="fas fa-search text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum estudo encontrado</h3>
            <p className="text-gray-400">Tente ajustar os termos de busca ou filtros.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredStudies.map((study) => (
              <Card 
                key={study.id} 
                className="data-card rounded-xl holographic-border hover:border-emerald-400/50 transition-all cursor-pointer"
                data-testid={`study-card-${study.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-emerald-500/20 p-3 rounded-lg">
                      <i className="fas fa-dna text-emerald-400 text-xl" />
                    </div>
                    {study.compound && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getCompoundColor(study.compound)}`}>
                        {study.compound}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{study.title}</h3>
                  {study.description && (
                    <p className="text-gray-400 text-sm mb-4">{study.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{study.date}</span>
                    <div className="flex space-x-2">
                      {study.indication && (
                        <span className={`text-xs px-2 py-1 rounded ${getIndicationColor(study.indication)}`}>
                          {study.indication}
                        </span>
                      )}
                      {study.phase && (
                        <span className={`text-xs px-2 py-1 rounded ${getPhaseColor(study.phase)}`}>
                          {study.phase}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Research Insights */}
          <Card className="data-card rounded-xl holographic-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Insights da IA</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="fas fa-trending-up text-white text-xl" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Tendência Emergente</h3>
                  <p className="text-sm text-gray-400">CBG mostra potencial para doenças neurodegenerativas</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="fas fa-check-circle text-white text-xl" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Consenso Científico</h3>
                  <p className="text-sm text-gray-400">CBD eficaz para epilepsia refratária em crianças</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-white text-xl" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Lacuna de Pesquisa</h3>
                  <p className="text-sm text-gray-400">Necessários mais estudos em doses pediátricas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
