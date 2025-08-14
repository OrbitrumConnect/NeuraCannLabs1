import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuscarPubMed, useArtigosRecentesPubMed } from "@/hooks/useBuscarDados";
import { type PubMedArticle } from "@/services/pubmedService";

interface ScientificDashboardProps {
  searchTerm?: string;
}

export default function ScientificDashboard({ searchTerm: initialSearchTerm = "" }: ScientificDashboardProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);
  const [activeTab, setActiveTab] = useState("recent");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Buscar artigos PubMed
  const {
    articles: searchResults,
    totalCount,
    hasMore,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    loadMore,
    resetSearch
  } = useBuscarPubMed(debouncedSearchTerm, { maxResults: 10 });

  // Buscar artigos recentes
  const {
    data: recentArticles,
    isLoading: isRecentLoading,
    isError: isRecentError,
    error: recentError
  } = useArtigosRecentesPubMed(10);

  const isLoading = isSearchLoading || isRecentLoading;
  const isError = isSearchError || isRecentError;
  const error = searchError || recentError;

  // Loading state
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

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar dados científicos: {error}</p>
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

  const renderArticleCard = (article: PubMedArticle) => (
    <Card key={article.pmid} className="data-card rounded-xl hover:border-emerald-400/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg font-semibold line-clamp-2">
              {article.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                PubMed
              </Badge>
              {article.doi && (
                <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                  DOI
                </Badge>
              )}
              <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                {article.publicationDate}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-gray-300 text-sm line-clamp-3">
              {article.abstract}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {article.authors.slice(0, 3).map((author, index) => (
              <Badge key={index} className="bg-purple-500/20 text-purple-400 text-xs">
                {author}
              </Badge>
            ))}
            {article.authors.length > 3 && (
              <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                +{article.authors.length - 3} mais
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-gray-400 text-sm">
              {article.journal}
            </span>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => window.open(article.url, '_blank')}
            >
              <i className="fas fa-external-link-alt mr-2" />
              Ver Artigo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 pt-12 sm:pt-14">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
          <i className="fas fa-microscope text-white text-lg sm:text-2xl" />
        </div>
        <div>
          <h1 className="text-base sm:text-2xl font-bold text-white">Dados Científicos</h1>
          <p className="text-xs sm:text-sm text-gray-400">Estudos PubMed e pesquisas sobre cannabis medicinal</p>
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
                  placeholder="Buscar artigos científicos sobre cannabis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-cyber-light border-gray-600 pl-12 text-white placeholder-gray-400 focus:border-emerald-500"
                  data-testid="search-studies-input"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setActiveTab("search")}
                data-testid="search-studies-button"
              >
                <i className="fas fa-search mr-2" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:border-emerald-500"
                onClick={() => {
                  setSearchTerm("");
                  resetSearch();
                  setActiveTab("recent");
                }}
                data-testid="clear-search-button"
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
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="recent" className="data-card">
            <i className="fas fa-clock mr-2" />
            Artigos Recentes
          </TabsTrigger>
          <TabsTrigger value="search" className="data-card">
            <i className="fas fa-search mr-2" />
            Resultados da Busca
            {totalCount > 0 && (
              <Badge className="ml-2 bg-emerald-600 text-white">
                {totalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {recentArticles?.map((article) => renderArticleCard(article))}
          </div>
          
          {recentArticles?.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-newspaper text-4xl mb-4" />
              <p>Nenhum artigo recente encontrado</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {debouncedSearchTerm.length > 2 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {searchResults.map((article) => renderArticleCard(article))}
              </div>
              
              {hasMore && (
                <div className="text-center pt-4">
                  <Button 
                    onClick={loadMore}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
                  <p>Nenhum artigo encontrado para "{debouncedSearchTerm}"</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <i className="fas fa-search text-4xl mb-4" />
              <p>Digite pelo menos 3 caracteres para buscar artigos</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
