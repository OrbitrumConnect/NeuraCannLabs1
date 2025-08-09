import type { ScientificStudy, ClinicalCase, StudySubmission } from '@shared/schema';

interface AnalysisResult {
  accuracy: number;
  potentialErrors: string[];
  suggestions: string[];
  relatedStudies: string[];
  analysis: string;
}

export class StudyAnalyzer {
  // Analyze a study submission against the database
  static async analyzeStudy(
    submission: StudySubmission,
    studies: ScientificStudy[],
    cases: ClinicalCase[]
  ): Promise<AnalysisResult> {
    const content = submission.originalContent.toLowerCase();
    const title = submission.title.toLowerCase();
    
    // Check for common misunderstandings and errors
    const potentialErrors: string[] = [];
    const suggestions: string[] = [];
    const relatedStudies: string[] = [];

    // Common error patterns - CBD/medical cannabis context
    if (this.containsPattern(content, ['down', 'síndrome de down']) && 
        this.containsPattern(content, ['cbd', 'cannabidiol'])) {
      
      // Check if it's actually about Dravet syndrome (common confusion)
      const dravetStudies = studies.filter(study => 
        study.indication?.toLowerCase().includes('dravet') ||
        study.title.toLowerCase().includes('dravet')
      );
      
      if (dravetStudies.length > 0) {
        potentialErrors.push(
          "POSSÍVEL CONFUSÃO DETECTADA: Você mencionou 'Síndrome de Down' com CBD, mas há evidências científicas robustas apenas para 'Síndrome de Dravet' (epilepsia). Verifique se não houve confusão entre as condições."
        );
        
        suggestions.push(
          "Revisar se o estudo se refere à Síndrome de Dravet (epilepsia pediátrica refratária) ao invés de Síndrome de Down. O CBD tem aprovação FDA para Dravet."
        );
        
        relatedStudies.push(...dravetStudies.map(s => s.title));
      }
    }

    // Dosage accuracy checks
    if (this.containsPattern(content, ['dose', 'dosagem', 'mg/kg'])) {
      const dosageNumbers = this.extractDosages(content);
      
      for (const dosage of dosageNumbers) {
        if (dosage > 50) {
          potentialErrors.push(
            `DOSAGEM QUESTIONÁVEL: ${dosage}mg/kg está acima das dosagens típicas de CBD (2-25mg/kg/dia em estudos aprovados). Verificar se há erro de unidade.`
          );
          
          suggestions.push(
            "Revisar dosagens contra protocolos estabelecidos. Epidiolex usa 5-10mg/kg 2x/dia para Dravet."
          );
        }
      }
    }

    // Age group accuracy
    if (this.containsPattern(content, ['pediátrico', 'criança', 'infantil']) &&
        this.containsPattern(content, ['alzheimer', 'demência', 'parkinson'])) {
      potentialErrors.push(
        "INCONSISTÊNCIA ETÁRIA: Condições neurodegenerativas (Alzheimer, Parkinson) raramente ocorrem em população pediátrica."
      );
    }

    // Generate analysis text
    let analysis = this.generateAnalysisText(submission, studies, cases, potentialErrors);

    return {
      accuracy: potentialErrors.length === 0 ? 95 : Math.max(60, 95 - potentialErrors.length * 15),
      potentialErrors,
      suggestions,
      relatedStudies,
      analysis
    };
  }

  private static containsPattern(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }

  private static extractDosages(text: string): number[] {
    const dosageRegex = /(\d+(?:\.\d+)?)\s*mg\/kg/gi;
    const matches: number[] = [];
    let match;
    while ((match = dosageRegex.exec(text)) !== null) {
      matches.push(parseFloat(match[1]));
    }
    return matches;
  }

  private static generateAnalysisText(
    submission: StudySubmission,
    studies: ScientificStudy[],
    cases: ClinicalCase[],
    errors: string[]
  ): string {
    let analysis = "## 🧠 Análise da IA Especializada\n\n";

    if (errors.length > 0) {
      analysis += "### ⚠️ Alertas Identificados:\n";
      errors.forEach((error, index) => {
        analysis += `${index + 1}. ${error}\n\n`;
      });
    }

    // Find related studies
    const keywords = this.extractKeywords(submission.originalContent);
    const relatedStudies = studies.filter(study => 
      keywords.some(keyword => 
        study.title.toLowerCase().includes(keyword) ||
        study.indication?.toLowerCase().includes(keyword) ||
        study.compound?.toLowerCase().includes(keyword)
      )
    ).slice(0, 3);

    if (relatedStudies.length > 0) {
      analysis += "### 📊 Estudos Relacionados Encontrados:\n";
      relatedStudies.forEach((study, index) => {
        analysis += `**${index + 1}. ${study.title}**\n`;
        analysis += `- Composto: ${study.compound || 'Não especificado'}\n`;
        analysis += `- Indicação: ${study.indication || 'Não especificado'}\n`;
        analysis += `- Status: ${study.status}\n\n`;
      });
    }

    // Find related cases
    const relatedCases = cases.filter(case_ => 
      keywords.some(keyword => 
        case_.description.toLowerCase().includes(keyword) ||
        case_.indication?.toLowerCase().includes(keyword)
      )
    ).slice(0, 2);

    if (relatedCases.length > 0) {
      analysis += "### 🏥 Casos Clínicos Relacionados:\n";
      relatedCases.forEach((case_, index) => {
        analysis += `**Caso ${case_.caseNumber}**: ${case_.description.slice(0, 100)}...\n`;
        analysis += `- Desfecho: ${case_.outcome || 'Não especificado'}\n\n`;
      });
    }

    if (errors.length === 0) {
      analysis += "### ✅ Validação Concluída:\n";
      analysis += "Não foram identificadas inconsistências óbvias. O estudo parece alinhado com a literatura científica disponível.\n\n";
    }

    analysis += "### 💡 Próximos Passos:\n";
    analysis += "1. Revisar os alertas identificados (se houver)\n";
    analysis += "2. Fazer correções necessárias na aba 'Editar & Corrigir IA'\n";
    analysis += "3. Submeter para análise profissional quando estiver satisfeito\n";

    return analysis;
  }

  private static extractKeywords(text: string): string[] {
    const commonWords = ['de', 'da', 'do', 'em', 'com', 'para', 'por', 'o', 'a', 'e', 'é', 'um', 'uma'];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 10);
  }
}