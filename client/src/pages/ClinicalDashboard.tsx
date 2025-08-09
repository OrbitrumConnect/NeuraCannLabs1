import { useQuery } from "@tanstack/react-query";
import { type ClinicalCase } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClinicalDashboard() {
  const { data: cases, isLoading, error } = useQuery<ClinicalCase[]>({
    queryKey: ["/api/clinical"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          <span className="ml-4 text-neon-cyan">Carregando casos clínicos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar casos clínicos. Tente novamente.</p>
        </div>
      </div>
    );
  }

  const getOutcomeColor = (outcome: string | null) => {
    switch (outcome?.toLowerCase()) {
      case "melhora significativa": return "bg-green-500/20 text-green-400";
      case "efeitos adversos leves": return "bg-amber-500/20 text-amber-400";
      case "sem melhora": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getOutcomeIcon = (outcome: string | null) => {
    switch (outcome?.toLowerCase()) {
      case "melhora significativa": return "fas fa-check-circle";
      case "efeitos adversos leves": return "fas fa-exclamation-triangle";
      case "sem melhora": return "fas fa-times-circle";
      default: return "fas fa-question-circle";
    }
  };

  const getCompoundColor = (compound: string | null) => {
    switch (compound?.toUpperCase()) {
      case "CBD": return "bg-green-500/20 text-green-400";
      case "THC": return "bg-orange-500/20 text-orange-400";
      case "CBG": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getIndicationColor = (indication: string | null) => {
    switch (indication?.toLowerCase()) {
      case "epilepsia": return "bg-blue-500/20 text-blue-400";
      case "dor crônica": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
          <i className="fas fa-user-md text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Casos Clínicos</h1>
          <p className="text-gray-400">Registros médicos e experiências clínicas</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button 
          className="data-card rounded-xl p-4 h-auto hover:border-blue-400/50 transition-all text-left flex flex-col items-start"
          data-testid="new-case-button"
        >
          <i className="fas fa-plus-circle text-blue-400 text-2xl mb-2" />
          <h3 className="font-semibold text-white">Novo Caso</h3>
          <p className="text-sm text-gray-400">Registrar novo caso clínico</p>
        </Button>
        <Button 
          className="data-card rounded-xl p-4 h-auto hover:border-emerald-400/50 transition-all text-left flex flex-col items-start"
          data-testid="search-cases-button"
        >
          <i className="fas fa-search text-emerald-400 text-2xl mb-2" />
          <h3 className="font-semibold text-white">Buscar Casos</h3>
          <p className="text-sm text-gray-400">Encontrar casos similares</p>
        </Button>
        <Button 
          className="data-card rounded-xl p-4 h-auto hover:border-purple-400/50 transition-all text-left flex flex-col items-start"
          data-testid="ai-analysis-button"
        >
          <i className="fas fa-chart-bar text-purple-400 text-2xl mb-2" />
          <h3 className="font-semibold text-white">Análise IA</h3>
          <p className="text-sm text-gray-400">Insights automáticos</p>
        </Button>
      </div>

      {/* Clinical Cases List */}
      {!cases || cases.length === 0 ? (
        <Card className="data-card rounded-xl p-8 text-center">
          <CardContent>
            <i className="fas fa-user-md text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum caso encontrado</h3>
            <p className="text-gray-400">Comece registrando seu primeiro caso clínico.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cases.map((clinicalCase) => (
              <Card 
                key={clinicalCase.id} 
                className="data-card rounded-xl hover:border-blue-400/50 transition-all"
                data-testid={`case-card-${clinicalCase.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`w-10 h-10 ${
                          clinicalCase.outcome?.includes("significativa") ? "bg-green-500/20" : "bg-amber-500/20"
                        } rounded-lg flex items-center justify-center mr-3`}>
                          <i className={`${getOutcomeIcon(clinicalCase.outcome)} ${
                            clinicalCase.outcome?.includes("significativa") ? "text-green-400" : "text-amber-400"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{clinicalCase.caseNumber}</h3>
                          <p className="text-sm text-gray-400">{clinicalCase.doctorName}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{clinicalCase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {clinicalCase.compound && (
                          <span className={`text-xs px-2 py-1 rounded ${getCompoundColor(clinicalCase.compound)}`}>
                            {clinicalCase.compound} {clinicalCase.dosage}
                          </span>
                        )}
                        {clinicalCase.indication && (
                          <span className={`text-xs px-2 py-1 rounded ${getIndicationColor(clinicalCase.indication)}`}>
                            {clinicalCase.indication}
                          </span>
                        )}
                        {clinicalCase.outcome && (
                          <span className={`text-xs px-2 py-1 rounded ${getOutcomeColor(clinicalCase.outcome)}`}>
                            {clinicalCase.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end">
                      <span className="text-sm text-gray-400 mb-2">
                        {clinicalCase.createdAt ? new Date(clinicalCase.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                      </span>
                      <Button 
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                        data-testid={`view-case-${clinicalCase.id}`}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Case Analytics */}
          <Card className="data-card rounded-xl holographic-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Análise de Casos</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">78%</div>
                  <p className="text-sm text-gray-400">Taxa de Sucesso</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{cases.length}</div>
                  <p className="text-sm text-gray-400">Casos Registrados</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">12%</div>
                  <p className="text-sm text-gray-400">Efeitos Adversos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">45</div>
                  <p className="text-sm text-gray-400">Médicos Colaboradores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
