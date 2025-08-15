/**
 * Serviço para integração com ClinicalTrials.gov API v2
 * Permite buscar ensaios clínicos relacionados à cannabis medicinal
 */

export interface ClinicalTrial {
  nctId: string;
  briefTitle: string;
  officialTitle?: string;
  overallStatus: string;
  startDate: string;
  completionDate?: string;
  condition: string[];
  interventionName: string[];
  interventionType: string[];
  locationCountry: string[];
  enrollment: number;
  phase?: string;
  studyType: string;
  leadSponsor?: string;
  briefSummary?: string;
  detailedDescription?: string;
  url: string;
}

export interface ClinicalTrialsSearchResult {
  trials: ClinicalTrial[];
  totalCount: number;
  hasMore: boolean;
}

class ClinicalTrialsService {
  private baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
  private maxResults = 10; // Limite padrão da API

  /**
   * Busca ensaios clínicos no ClinicalTrials.gov
   * @param termo - Termo de busca
   * @param maxResults - Número máximo de resultados (padrão: 10)
   * @param startFrom - Índice inicial para paginação
   */
  async buscarEnsaiosClinicos(
    termo: string,
    maxResults: number = 10,
    startFrom: number = 0
  ): Promise<ClinicalTrialsSearchResult> {
    try {
      const searchTerm = this.buildSearchTerm(termo);
      
      const queryParams = new URLSearchParams({
        'query.term': searchTerm,
        'fields': 'NCTId,BriefTitle,OfficialTitle,OverallStatus,StartDate,CompletionDate,Condition,InterventionName,InterventionType,LocationCountry,Enrollment,Phase,StudyType,LeadSponsorName,BriefSummary,DetailedDescription',
        'max_rnk': maxResults.toString(),
        'min_rnk': (startFrom + 1).toString(),
        'format': 'json'
      });

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na busca ClinicalTrials.gov: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.studies || data.studies.length === 0) {
        return {
          trials: [],
          totalCount: 0,
          hasMore: false
        };
      }

      const trials = data.studies.map((study: any) => this.mapStudyToTrial(study));

      return {
        trials,
        totalCount: data.totalCount || 0,
        hasMore: startFrom + maxResults < (data.totalCount || 0)
      };

    } catch (error) {
      console.error('Erro no serviço ClinicalTrials.gov:', error);
      throw new Error(`Falha ao buscar ensaios clínicos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Constrói termo de busca otimizado para cannabis medicinal
   */
  private buildSearchTerm(termo: string): string {
    const baseTerms = [
      'cannabis',
      'cannabidiol',
      'CBD',
      'tetrahydrocannabinol',
      'THC',
      'cannabinoid',
      'marijuana',
      'medical marijuana'
    ];

    const userTerm = termo.trim();
    if (!userTerm) {
      return baseTerms.join(' OR ');
    }

    // Simplifica a query para evitar erros 400
    return `${userTerm} cannabis`;
  }

  /**
   * Mapeia dados da API para interface ClinicalTrial
   */
  private mapStudyToTrial(study: any): ClinicalTrial {
    return {
      nctId: study.nctId || '',
      briefTitle: study.briefTitle || 'Título não disponível',
      officialTitle: study.officialTitle,
      overallStatus: study.overallStatus || 'Status desconhecido',
      startDate: this.formatDate(study.startDate),
      completionDate: this.formatDate(study.completionDate),
      condition: Array.isArray(study.condition) ? study.condition : [study.condition || 'Condição não especificada'],
      interventionName: Array.isArray(study.interventionName) ? study.interventionName : [study.interventionName || 'Intervenção não especificada'],
      interventionType: Array.isArray(study.interventionType) ? study.interventionType : [study.interventionType || 'Tipo não especificado'],
      locationCountry: Array.isArray(study.locationCountry) ? study.locationCountry : [study.locationCountry || 'País não especificado'],
      enrollment: parseInt(study.enrollment) || 0,
      phase: study.phase,
      studyType: study.studyType || 'Tipo de estudo não especificado',
      leadSponsor: study.leadSponsorName,
      briefSummary: study.briefSummary,
      detailedDescription: study.detailedDescription,
      url: `https://clinicaltrials.gov/ct2/show/${study.nctId}`
    };
  }

  /**
   * Formata data para exibição
   */
  private formatDate(dateString: string): string {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  }

  /**
   * Busca ensaios clínicos por condição médica
   */
  async buscarPorCondicao(condicao: string, maxResults: number = 10): Promise<ClinicalTrial[]> {
    const result = await this.buscarEnsaiosClinicos(condicao, maxResults);
    return result.trials;
  }

  /**
   * Busca ensaios clínicos por status
   */
  async buscarPorStatus(status: string, maxResults: number = 10): Promise<ClinicalTrial[]> {
    const queryParams = new URLSearchParams({
      'query.status': status,
      'fields': 'NCTId,BriefTitle,OfficialTitle,OverallStatus,StartDate,CompletionDate,Condition,InterventionName,InterventionType,LocationCountry,Enrollment,Phase,StudyType,LeadSponsorName,BriefSummary,DetailedDescription',
      'max_rnk': maxResults.toString(),
      'format': 'json'
    });

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar por status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.studies?.map((study: any) => this.mapStudyToTrial(study)) || [];
  }

  /**
   * Busca ensaios clínicos recentes sobre cannabis
   */
  async buscarEnsaiosRecentes(maxResults: number = 10): Promise<ClinicalTrial[]> {
    try {
      const queryParams = new URLSearchParams({
        'query.term': 'cannabis',
        'fields': 'NCTId,BriefTitle,OfficialTitle,OverallStatus,StartDate,CompletionDate,Condition,InterventionName,InterventionType,LocationCountry,Enrollment,Phase,StudyType,LeadSponsorName,BriefSummary,DetailedDescription',
        'max_rnk': maxResults.toString(),
        'format': 'json'
      });

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar ensaios recentes: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.studies || data.studies.length === 0) {
        return [];
      }

      return data.studies.map((study: any) => this.mapStudyToTrial(study));
    } catch (error) {
      console.error('Erro ao buscar ensaios recentes:', error);
      return [];
    }
  }

  /**
   * Busca ensaios clínicos por fase
   */
  async buscarPorFase(fase: string, maxResults: number = 10): Promise<ClinicalTrial[]> {
    const queryParams = new URLSearchParams({
      'query.phase': fase,
      'query.cond': 'cannabis OR cannabidiol OR THC',
      'fields': 'NCTId,BriefTitle,OfficialTitle,OverallStatus,StartDate,CompletionDate,Condition,InterventionName,InterventionType,LocationCountry,Enrollment,Phase,StudyType,LeadSponsorName,BriefSummary,DetailedDescription',
      'max_rnk': maxResults.toString(),
      'format': 'json'
    });

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar por fase: ${response.status}`);
    }
    
    const data = await response.json();
    return data.studies?.map((study: any) => this.mapStudyToTrial(study)) || [];
  }

  /**
   * Busca ensaios clínicos por país
   */
  async buscarPorPais(pais: string, maxResults: number = 10): Promise<ClinicalTrial[]> {
    const queryParams = new URLSearchParams({
      'query.loc': pais,
      'query.cond': 'cannabis OR cannabidiol OR THC',
      'fields': 'NCTId,BriefTitle,OfficialTitle,OverallStatus,StartDate,CompletionDate,Condition,InterventionName,InterventionType,LocationCountry,Enrollment,Phase,StudyType,LeadSponsorName,BriefSummary,DetailedDescription',
      'max_rnk': maxResults.toString(),
      'format': 'json'
    });

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar por país: ${response.status}`);
    }
    
    const data = await response.json();
    return data.studies?.map((study: any) => this.mapStudyToTrial(study)) || [];
  }

  /**
   * Obtém detalhes completos de um ensaio clínico específico
   */
  async obterDetalhesEnsaio(nctId: string): Promise<ClinicalTrial | null> {
    try {
      const queryParams = new URLSearchParams({
        'query.term': nctId,
        'fields': 'NCTId,BriefTitle,OfficialTitle,OverallStatus,StartDate,CompletionDate,Condition,InterventionName,InterventionType,LocationCountry,Enrollment,Phase,StudyType,LeadSponsorName,BriefSummary,DetailedDescription',
        'max_rnk': '1',
        'format': 'json'
      });

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do ensaio: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.studies && data.studies.length > 0) {
        return this.mapStudyToTrial(data.studies[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter detalhes do ensaio:', error);
      return null;
    }
  }
}

// Instância singleton do serviço
export const clinicalTrialsService = new ClinicalTrialsService();
