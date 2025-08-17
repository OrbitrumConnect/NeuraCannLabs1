/**
 * Hook personalizado para padronizar chamadas de API e gerenciar loading
 * Utilizado para PubMed e ClinicalTrials.gov
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pubmedService, PubMedSearchResult } from '@/services/pubmedService';
import { clinicalTrialsService, ClinicalTrialsSearchResult } from '@/services/clinicalTrialsService';

export interface UseBuscarDadosOptions {
  enabled?: boolean;
  maxResults?: number;
  debounceMs?: number;
}

export interface SearchState {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
}

/**
 * Hook para busca de artigos PubMed
 */
export function useBuscarPubMed(
  searchTerm: string,
  options: UseBuscarDadosOptions = {}
) {
  const { enabled = true, maxResults = 10, debounceMs = 500 } = options;
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<PubMedSearchResult>({
    queryKey: ['pubmed', searchTerm, currentPage, maxResults],
    queryFn: () => pubmedService.buscarArtigosPubMed(searchTerm, maxResults, currentPage * maxResults),
    enabled: enabled && searchTerm.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    retryDelay: 1000
  });

  const loadMore = useCallback(() => {
    if (data?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [data?.hasMore]);

  const resetSearch = useCallback(() => {
    setCurrentPage(0);
  }, []);

  return {
    articles: data?.articles || [],
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    isError,
    error: error?.message || null,
    loadMore,
    resetSearch,
    refetch,
    currentPage
  };
}

/**
 * Hook para busca de ensaios clínicos
 */
export function useBuscarClinicalTrials(
  searchTerm: string,
  options: UseBuscarDadosOptions = {}
) {
  const { enabled = true, maxResults = 10, debounceMs = 500 } = options;
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<ClinicalTrialsSearchResult>({
    queryKey: ['clinical-trials', searchTerm, currentPage, maxResults],
    queryFn: () => clinicalTrialsService.buscarEnsaiosClinicos(searchTerm, maxResults, currentPage * maxResults),
    enabled: enabled && searchTerm.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    retryDelay: 1000
  });

  const loadMore = useCallback(() => {
    if (data?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [data?.hasMore]);

  const resetSearch = useCallback(() => {
    setCurrentPage(0);
  }, []);

  return {
    trials: data?.trials || [],
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    isError,
    error: error?.message || null,
    loadMore,
    resetSearch,
    refetch,
    currentPage
  };
}

/**
 * Hook para busca de artigos recentes do PubMed
 */
export function useArtigosRecentesPubMed(maxResults: number = 10) {
  return useQuery({
    queryKey: ['pubmed-recent', maxResults],
    queryFn: () => pubmedService.buscarArtigosRecentes(maxResults),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2
  });
}

/**
 * Hook para busca de ensaios clínicos recentes
 */
export function useEnsaiosRecentesClinicalTrials(maxResults: number = 10) {
  return useQuery({
    queryKey: ['clinical-trials-recent', maxResults],
    queryFn: () => clinicalTrialsService.buscarEnsaiosRecentes(maxResults),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2
  });
}

/**
 * Hook para busca de ensaios por fase
 */
export function useEnsaiosPorFase(fase: string, maxResults: number = 10) {
  return useQuery({
    queryKey: ['clinical-trials-phase', fase, maxResults],
    queryFn: () => clinicalTrialsService.buscarPorFase(fase, maxResults),
    enabled: !!fase,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2
  });
}

/**
 * Hook para busca de ensaios por país
 */
export function useEnsaiosPorPais(pais: string, maxResults: number = 10) {
  return useQuery({
    queryKey: ['clinical-trials-country', pais, maxResults],
    queryFn: () => clinicalTrialsService.buscarPorPais(pais, maxResults),
    enabled: !!pais,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2
  });
}

/**
 * Hook para obter detalhes de um ensaio específico
 */
export function useDetalhesEnsaio(nctId: string) {
  return useQuery({
    queryKey: ['clinical-trial-details', nctId],
    queryFn: () => clinicalTrialsService.obterDetalhesEnsaio(nctId),
    enabled: !!nctId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2
  });
}

/**
 * Hook para busca de artigos relacionados
 */
export function useArtigosRelacionados(termo: string, maxResults: number = 5) {
  return useQuery({
    queryKey: ['pubmed-related', termo, maxResults],
    queryFn: () => pubmedService.buscarArtigosRelacionados(termo, maxResults),
    enabled: !!termo && termo.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2
  });
}

/**
 * Hook para busca de ensaios por condição
 */
export function useEnsaiosPorCondicao(condicao: string, maxResults: number = 10) {
  return useQuery({
    queryKey: ['clinical-trials-condition', condicao, maxResults],
    queryFn: () => clinicalTrialsService.buscarPorCondicao(condicao, maxResults),
    enabled: !!condicao && condicao.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2
  });
}

/**
 * Hook para busca de ensaios por status
 */
export function useEnsaiosPorStatus(status: string, maxResults: number = 10) {
  return useQuery({
    queryKey: ['clinical-trials-status', status, maxResults],
    queryFn: () => clinicalTrialsService.buscarPorStatus(status, maxResults),
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2
  });
}
