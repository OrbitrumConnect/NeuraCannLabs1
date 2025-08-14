import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuscarClinicalTrials, useEnsaiosRecentesClinicalTrials, useEnsaiosPorFase, useEnsaiosPorStatus } from "@/hooks/useBuscarDados";
import { type ClinicalTrial } from "@/services/clinicalTrialsService";

export default function ClinicalDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Buscar ensaios clínicos
  const {
    trials: searchResults,
    totalCount,
    hasMore,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    loadMore,
    resetSearch
  } = useBuscarClinicalTrials(debouncedSearchTerm, { maxResults: 10 });

  // Buscar ensaios recentes
  const {
    data: recentTrials,
    isLoading: isRecentLoading,
    isError: isRecentError,
    error: recentError
  } = useEnsaiosRecentesClinicalTrials(10);

  // Buscar por fase
  const {
    data: phaseTrials,
    isLoading: isPhaseLoading,
    isError: isPhaseError
  } = useEnsaiosPorFase(selectedPhase, 10);

  // Buscar por status
  const {
    data: statusTrials,
    isLoading: isStatusLoading,
    isError: isStatusError
  } = useEnsaiosPorStatus(selectedStatus, 10);

  const isLoading = isSearchLoading || isRecentLoading || isPhaseLoading || isStatusLoading;
  const isError = isSearchError || isRecentError || isPhaseError || isStatusError;
  const error = searchError || recentError;

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          <span className="ml-4 text-neon-cyan">Carregando ensaios clínicos...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar ensaios clínicos: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "recruiting": return "bg-green-500/20 text-green-400";
      case "active, not recruiting": return "bg-blue-500/20 text-blue-400";
      case "completed": return "bg-purple-500/20 text-purple-400";
      case "terminated": return "bg-red-500/20 text-red-400";
      case "suspended": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase?.toLowerCase()) {
      case "phase 1": return "bg-yellow-500/20 text-yellow-400";
      case "phase 2": return "bg-blue-500/20 text-blue-400";
      case "phase 3": return "bg-purple-500/20 text-purple-400";
      case "phase 4": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const renderTrialCard = (trial: ClinicalTrial) => (
    <Card key={trial.nctId} className="data-card rounded-xl hover:border-blue-400/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg font-semibold line-clamp-2">
              {trial.briefTitle}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                ClinicalTrials.gov
              </Badge>
              <Badge className={`text-xs ${getStatusColor(trial.overallStatus)}`}>
                {trial.overallStatus}
              </Badge>
              {trial.phase && (
                <Badge className={`text-xs ${getPhaseColor(trial.phase)}`}>
                  {trial.phase}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {trial.briefSummary && (
            <div>
              <p className="text-gray-300 text-sm line-clamp-3">
                {trial.briefSummary}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1">
            {trial.condition.slice(0, 2).map((condition, index) => (
              <Badge key={index} className="bg-purple-500/20 text-purple-400 text-xs">
                {condition}
              </Badge>
            ))}
            {trial.condition.length > 2 && (
              <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                +{trial.condition.length - 2} mais
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {trial.interventionName.slice(0, 2).map((intervention, index) => (
              <Badge key={index} className="bg-emerald-500/20 text-emerald-400 text-xs">
                {intervention}
              </Badge>
            ))}
            {trial.interventionName.length > 2 && (
              <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                +{trial.interventionName.length - 2} mais
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-gray-400 text-sm">
              <div>Início: {trial.startDate}</div>
              {trial.enrollment > 0 && (
                <div>Participantes: {trial.enrollment}</div>
              )}
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open(trial.url, '_blank')}
            >
              <i className="fas fa-external-link-alt mr-2" />
              Ver Ensaio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-1 sm:px-4 py-3 sm:py-8 pt-12 sm:pt-14">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
          <i className="fas fa-user-md text-white text-lg sm:text-2xl" />
        </div>
        <div>
          <h1 className="text-base sm:text-2xl font-bold text-white">Ensaios Clínicos</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Ensaios clínicos sobre cannabis medicinal</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="data-card rounded-xl mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar ensaios clínicos sobre cannabis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-cyber-light border-gray-600 pl-12 text-white placeholder-gray-400 focus:border-blue-500"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-40 bg-cyber-light border-gray-600 text-white">
                  <SelectValue placeholder="Fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as Fases</SelectItem>
                  <SelectItem value="Phase 1">Fase 1</SelectItem>
                  <SelectItem value="Phase 2">Fase 2</SelectItem>
                  <SelectItem value="Phase 3">Fase 3</SelectItem>
                  <SelectItem value="Phase 4">Fase 4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 bg-cyber-light border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Status</SelectItem>
                  <SelectItem value="Recruiting">Recrutando</SelectItem>
                  <SelectItem value="Active, not recruiting">Ativo</SelectItem>
                  <SelectItem value="Completed">Concluído</SelectItem>
                  <SelectItem value="Terminated">Terminado</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setActiveTab("search")}
              >
                <i className="fas fa-search mr-2" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:border-blue-500"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPhase("");
                  setSelectedStatus("");
                  resetSearch();
                  setActiveTab("recent");
                }}
              >
                <i className="fas fa-times mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="recent" className="data-card">
            <i className="fas fa-clock mr-2" />
            Recentes
          </TabsTrigger>
          <TabsTrigger value="search" className="data-card">
            <i className="fas fa-search mr-2" />
            Busca
            {totalCount > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white">
                {totalCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="phase" className="data-card">
            <i className="fas fa-layer-group mr-2" />
            Por Fase
          </TabsTrigger>
          <TabsTrigger value="status" className="data-card">
            <i className="fas fa-chart-line mr-2" />
            Por Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {recentTrials?.map((trial) => renderTrialCard(trial))}
          </div>
          
          {recentTrials?.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-flask text-4xl mb-4" />
              <p>Nenhum ensaio recente encontrado</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {debouncedSearchTerm.length > 2 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {searchResults.map((trial) => renderTrialCard(trial))}
              </div>
              
              {hasMore && (
                <div className="text-center pt-4">
                  <Button 
                    onClick={loadMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSearchLoading}
                  >
                    {isSearchLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus mr-2" />
                        Carregar Mais
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {searchResults.length === 0 && !isSearchLoading && (
                <div className="text-center text-gray-400 py-8">
                  <i className="fas fa-search text-4xl mb-4" />
                  <p>Nenhum ensaio encontrado para "{debouncedSearchTerm}"</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-search text-4xl mb-4" />
              <p>Digite pelo menos 3 caracteres para buscar ensaios</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="phase" className="space-y-4">
          {selectedPhase ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {phaseTrials?.map((trial) => renderTrialCard(trial))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-layer-group text-4xl mb-4" />
              <p>Selecione uma fase para ver os ensaios</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          {selectedStatus ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {statusTrials?.map((trial) => renderTrialCard(trial))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-chart-line text-4xl mb-4" />
              <p>Selecione um status para ver os ensaios</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
