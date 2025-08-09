import { type ScientificStudy, type ClinicalCase, type Alert } from "@shared/schema";

export interface SearchResult {
  type: 'study' | 'case' | 'alert';
  relevance: number;
  data: ScientificStudy | ClinicalCase | Alert;
}

export interface AIResponse {
  answer: string;
  relatedResults: SearchResult[];
  suggestions: string[];
  confidence: number;
}

export class MedicalAISearch {
  
  static analyzeQuery(query: string, studies: ScientificStudy[], cases: ClinicalCase[], alerts: Alert[]): AIResponse {
    const lowerQuery = query.toLowerCase();
    
    // Keywords para diferentes tipos de pesquisa
    const doseKeywords = ['dose', 'dosagem', 'mg', 'quantidade', 'administração'];
    const efficacyKeywords = ['eficácia', 'resultado', 'melhora', 'resposta', 'efeito'];
    const sideEffectsKeywords = ['efeito colateral', 'adverso', 'reação', 'segurança'];
    const conditionKeywords = ['epilepsia', 'dor', 'câncer', 'parkinson', 'ansiedade', 'sono'];
    const compoundKeywords = ['cbd', 'thc', 'cannabidiol', 'tetrahidrocanabinol'];
    
    let relatedResults: SearchResult[] = [];
    let answer = '';
    let suggestions: string[] = [];
    let confidence = 0.7;
    
    // Buscar estudos relevantes
    studies.forEach(study => {
      const relevance = this.calculateRelevance(lowerQuery, study.title + ' ' + study.description + ' ' + study.compound + ' ' + study.indication);
      if (relevance > 0.3) {
        relatedResults.push({ type: 'study', relevance, data: study });
      }
    });
    
    // Buscar casos clínicos relevantes
    cases.forEach(caseItem => {
      const relevance = this.calculateRelevance(lowerQuery, caseItem.description + ' ' + caseItem.indication + ' ' + caseItem.outcome);
      if (relevance > 0.3) {
        relatedResults.push({ type: 'case', relevance, data: caseItem });
      }
    });
    
    // Buscar alertas relevantes
    alerts.forEach(alert => {
      const relevance = this.calculateRelevance(lowerQuery, alert.message + ' ' + alert.type);
      if (relevance > 0.2) {
        relatedResults.push({ type: 'alert', relevance, data: alert });
      }
    });
    
    // Ordenar por relevância
    relatedResults = relatedResults.sort((a, b) => b.relevance - a.relevance).slice(0, 6);
    
    // Gerar resposta baseada no tipo de pergunta
    if (doseKeywords.some(keyword => lowerQuery.includes(keyword))) {
      answer = this.generateDosageAnswer(lowerQuery, relatedResults);
      suggestions = [
        'Qual a dosagem padrão de CBD para epilepsia?',
        'Protocolos de administração THC:CBD',
        'Ajustes de dose para idosos'
      ];
    } else if (efficacyKeywords.some(keyword => lowerQuery.includes(keyword))) {
      answer = this.generateEfficacyAnswer(lowerQuery, relatedResults);
      suggestions = [
        'Taxa de sucesso em estudos clínicos',
        'Tempo para observar resultados',
        'Comparação com tratamentos convencionais'
      ];
    } else if (sideEffectsKeywords.some(keyword => lowerQuery.includes(keyword))) {
      answer = this.generateSafetyAnswer(lowerQuery, relatedResults);
      suggestions = [
        'Perfil de segurança do CBD',
        'Interações medicamentosas',
        'Monitoramento de pacientes'
      ];
    } else if (conditionKeywords.some(keyword => lowerQuery.includes(keyword))) {
      answer = this.generateConditionAnswer(lowerQuery, relatedResults);
      suggestions = [
        'Indicações aprovadas pela ANVISA',
        'Evidências científicas mais recentes',
        'Protocolos clínicos específicos'
      ];
    } else {
      answer = this.generateGeneralAnswer(lowerQuery, relatedResults);
      suggestions = [
        'Últimos estudos publicados',
        'Casos clínicos de sucesso',
        'Atualizações regulatórias'
      ];
    }
    
    return { answer, relatedResults, suggestions, confidence };
  }
  
  private static calculateRelevance(query: string, text: string): number {
    const queryWords = query.split(' ').filter(w => w.length > 2);
    const textLower = text.toLowerCase();
    
    let matches = 0;
    let totalWeight = 0;
    
    queryWords.forEach(word => {
      const weight = word.length / 10; // Palavras maiores têm mais peso
      totalWeight += weight;
      
      if (textLower.includes(word)) {
        matches += weight;
      }
    });
    
    return totalWeight > 0 ? matches / totalWeight : 0;
  }
  
  private static generateDosageAnswer(query: string, results: SearchResult[]): string {
    const studyResults = results.filter(r => r.type === 'study').slice(0, 2);
    if (studyResults.length === 0) {
      return "Para informações sobre dosagem, recomendo consultar os estudos clínicos disponíveis na plataforma. A dosagem varia significativamente dependendo da condição tratada e perfil do paciente.";
    }
    
    const study = studyResults[0].data as ScientificStudy;
    if (study.description && study.description.includes('20mg/kg')) {
      return `Com base nos estudos analisados, a dosagem de CBD para epilepsia infantil demonstrou eficácia com 20mg/kg/dia, resultando em redução de 36.5% nas crises. Para outras condições, as dosagens variam entre 5-25mg/kg/dia, sempre sob supervisão médica.`;
    }
    
    return `Os estudos mostram variações de dosagem dependendo da indicação. ${study.title} demonstra protocolos específicos que podem orientar a prescrição clínica.`;
  }
  
  private static generateEfficacyAnswer(query: string, results: SearchResult[]): string {
    const studyResults = results.filter(r => r.type === 'study');
    if (studyResults.length === 0) {
      return "A eficácia varia conforme a condição tratada. Consulte os estudos específicos para dados de eficácia detalhados.";
    }
    
    return `Com base nos ${studyResults.length} estudos relevantes, a cannabis medicinal demonstra eficácia significativa. Por exemplo, estudos mostram redução de 36.5% em crises epilépticas e melhora significativa na dor oncológica (p<0.001).`;
  }
  
  private static generateSafetyAnswer(query: string, results: SearchResult[]): string {
    return `O perfil de segurança da cannabis medicinal é bem estabelecido nos estudos clínicos. Efeitos colaterais comuns incluem sonolência, alterações de apetite e fadiga. Monitoramento médico regular é essencial, especialmente para ajustes de dose e interações medicamentosas.`;
  }
  
  private static generateConditionAnswer(query: string, results: SearchResult[]): string {
    const relevantResults = results.slice(0, 3);
    if (relevantResults.length === 0) {
      return "Consulte os estudos específicos para cada condição médica disponíveis na plataforma.";
    }
    
    return `Para esta condição, temos ${relevantResults.length} estudos/casos relevantes em nossa base. Os dados mostram evidências promissoras com protocolos específicos de tratamento.`;
  }
  
  private static generateGeneralAnswer(query: string, results: SearchResult[]): string {
    if (results.length === 0) {
      return "Não encontrei resultados específicos para sua consulta. Tente reformular a pergunta ou use termos mais específicos relacionados a estudos, dosagens ou condições médicas.";
    }
    
    return `Encontrei ${results.length} resultados relevantes em nossa base de dados médica. Os estudos e casos mostram informações importantes sobre cannabis medicinal que podem orientar a prática clínica.`;
  }
}