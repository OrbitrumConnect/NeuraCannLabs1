/**
 * Serviço para integração com PubMed API (NCBI E-Utilities)
 * Permite buscar artigos científicos relacionados à cannabis medicinal
 */

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  publicationDate: string;
  doi?: string;
  keywords: string[];
  url: string;
}

export interface PubMedSearchResult {
  articles: PubMedArticle[];
  totalCount: number;
  hasMore: boolean;
}

class PubMedService {
  private baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  private apiKey = process.env.NEXT_PUBLIC_PUBMED_API_KEY || '';
  private delay = 100; // Delay entre requisições para respeitar limites da API

  /**
   * Busca artigos no PubMed relacionados à cannabis medicinal
   * @param termo - Termo de busca
   * @param maxResults - Número máximo de resultados (padrão: 10)
   * @param startFrom - Índice inicial para paginação
   */
  async buscarArtigosPubMed(
    termo: string, 
    maxResults: number = 10, 
    startFrom: number = 0
  ): Promise<PubMedSearchResult> {
    try {
      // Adiciona termos específicos para cannabis medicinal
      const searchTerm = this.buildSearchTerm(termo);
      
      // Passo 1: Buscar IDs dos artigos
      const searchUrl = `${this.baseUrl}esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerm)}&retmode=json&retmax=${maxResults}&retstart=${startFrom}&sort=relevance${this.apiKey ? `&api_key=${this.apiKey}` : ''}`;
      
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error(`Erro na busca PubMed: ${searchResponse.status}`);
      }
      
      const searchData = await searchResponse.json();
      const idList = searchData.esearchresult?.idlist || [];
      
      if (idList.length === 0) {
        return {
          articles: [],
          totalCount: 0,
          hasMore: false
        };
      }

      // Aguarda para respeitar limites da API
      await this.delayRequest();

      // Passo 2: Buscar detalhes dos artigos
      const fetchUrl = `${this.baseUrl}efetch.fcgi?db=pubmed&id=${idList.join(',')}&retmode=xml${this.apiKey ? `&api_key=${this.apiKey}` : ''}`;
      
      const fetchResponse = await fetch(fetchUrl);
      if (!fetchResponse.ok) {
        throw new Error(`Erro ao buscar detalhes PubMed: ${fetchResponse.status}`);
      }
      
      const xmlText = await fetchResponse.text();
      const articles = this.parsePubMedXML(xmlText);

      return {
        articles,
        totalCount: parseInt(searchData.esearchresult?.count || '0'),
        hasMore: startFrom + maxResults < parseInt(searchData.esearchresult?.count || '0')
      };

    } catch (error) {
      console.error('Erro no serviço PubMed:', error);
      throw new Error(`Falha ao buscar artigos PubMed: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Constrói termo de busca otimizado para cannabis medicinal
   */
  private buildSearchTerm(termo: string): string {
    const baseTerms = [
      'cannabis[Title/Abstract]',
      'cannabidiol[Title/Abstract]',
      'CBD[Title/Abstract]',
      'tetrahydrocannabinol[Title/Abstract]',
      'THC[Title/Abstract]',
      'cannabinoid[Title/Abstract]'
    ];

    const userTerm = termo.trim();
    if (!userTerm) {
      return baseTerms.join(' OR ');
    }

    // Combina o termo do usuário com termos de cannabis
    const combinedTerms = [
      `(${userTerm}) AND (${baseTerms.join(' OR ')})`,
      `${userTerm}[Title/Abstract] AND (cannabis OR cannabinoid)`
    ];

    return combinedTerms.join(' OR ');
  }

  /**
   * Parse XML do PubMed para objetos JavaScript
   */
  private parsePubMedXML(xmlText: string): PubMedArticle[] {
    const articles: PubMedArticle[] = [];
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const pubmedArticles = xmlDoc.getElementsByTagName('PubmedArticle');

      for (let i = 0; i < pubmedArticles.length; i++) {
        const article = pubmedArticles[i];
        
        const pmid = this.getTextContent(article, 'PMID');
        const title = this.getTextContent(article, 'ArticleTitle');
        const abstract = this.getTextContent(article, 'AbstractText');
        const journal = this.getJournalTitle(article);
        const publicationDate = this.getPublicationDate(article);
        const doi = this.getTextContent(article, 'ELocationID[@EIdType="doi"]');
        
        // Extrair autores
        const authors: string[] = [];
        const authorList = article.getElementsByTagName('Author');
        for (let j = 0; j < authorList.length; j++) {
          const author = authorList[j];
          const lastName = this.getTextContent(author, 'LastName');
          const foreName = this.getTextContent(author, 'ForeName');
          if (lastName && foreName) {
            authors.push(`${foreName} ${lastName}`);
          }
        }

        // Extrair keywords
        const keywords: string[] = [];
        const keywordList = article.getElementsByTagName('Keyword');
        for (let j = 0; j < keywordList.length; j++) {
          const keyword = keywordList[j].textContent;
          if (keyword) {
            keywords.push(keyword);
          }
        }

        if (pmid && title) {
          articles.push({
            pmid,
            title,
            authors,
            abstract: abstract || 'Resumo não disponível',
            journal,
            publicationDate,
            doi,
            keywords,
            url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
          });
        }
      }
    } catch (error) {
      console.error('Erro ao fazer parse do XML PubMed:', error);
    }

    return articles;
  }

  /**
   * Extrai texto de um elemento XML
   */
  private getTextContent(parent: Element, selector: string): string {
    try {
      const element = parent.querySelector(selector);
      return element?.textContent?.trim() || '';
    } catch (error) {
      console.warn(`Erro ao extrair texto com seletor '${selector}':`, error);
      return '';
    }
  }

  /**
   * Extrai título do journal de forma segura
   */
  private getJournalTitle(article: Element): string {
    try {
      // Tenta diferentes seletores para o título do journal
      const journalElement = article.querySelector('Journal');
      if (journalElement) {
        const titleElement = journalElement.querySelector('Title');
        if (titleElement) {
          return titleElement.textContent?.trim() || 'Journal não disponível';
        }
      }
      return 'Journal não disponível';
    } catch (error) {
      console.warn('Erro ao extrair título do journal:', error);
      return 'Journal não disponível';
    }
  }

  /**
   * Extrai data de publicação do artigo
   */
  private getPublicationDate(article: Element): string {
    const pubDate = article.querySelector('PubDate');
    if (!pubDate) return 'Data não disponível';

    const year = this.getTextContent(pubDate, 'Year');
    const month = this.getTextContent(pubDate, 'Month');
    const day = this.getTextContent(pubDate, 'Day');

    if (year) {
      return `${day || '01'}/${month || '01'}/${year}`;
    }

    return 'Data não disponível';
  }

  /**
   * Aguarda um tempo para respeitar limites da API
   */
  private async delayRequest(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  /**
   * Busca artigos relacionados a um termo específico
   */
  async buscarArtigosRelacionados(termo: string, maxResults: number = 5): Promise<PubMedArticle[]> {
    const result = await this.buscarArtigosPubMed(termo, maxResults);
    return result.articles;
  }

  /**
   * Busca artigos mais recentes sobre cannabis medicinal
   */
  async buscarArtigosRecentes(maxResults: number = 10): Promise<PubMedArticle[]> {
    const searchTerm = 'cannabis[Title/Abstract] AND ("2023"[Date - Publication] : "3000"[Date - Publication])';
    const result = await this.buscarArtigosPubMed(searchTerm, maxResults);
    return result.articles;
  }
}

// Instância singleton do serviço
export const pubmedService = new PubMedService();
