// Serviço para integração com a Super IA Médica
export interface SuperAIConsultation {
  response: string;
  medicalInsights: string[];
  confidence: number;
  recommendations: string[];
  needsSpecialist: boolean;
}

export interface SuperAIStats {
  activeUsers: number;
  knowledgeBaseSize: number;
  totalConversations: number;
  aiEnabled: boolean;
}

export class SuperAIService {
  private baseUrl = '/api/super-ai';

  // Integrar conhecimento médico externo
  async integrateExternalKnowledge(data: {
    apiData?: any;
    knowledgeBase?: string[];
    protocols?: string[];
    studies?: string[];
  }): Promise<{ success: boolean; message: string; stats: SuperAIStats }> {
    try {
      const response = await fetch(`${this.baseUrl}/integrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na integração: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao integrar Super IA:', error);
      throw error;
    }
  }

  // Consulta com a Super IA Médica
  async consult(
    question: string,
    userId?: string,
    userContext?: any
  ): Promise<{ success: boolean; consultation: SuperAIConsultation }> {
    try {
      const response = await fetch(`${this.baseUrl}/consult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          userId: userId || `guest-${Date.now()}`,
          userContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na consulta: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro na consulta Super IA:', error);
      throw error;
    }
  }

  // Obter estatísticas da Super IA
  async getStats(): Promise<SuperAIStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);

      if (!response.ok) {
        throw new Error(`Erro ao obter stats: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  // Processar resposta da IA para diferentes comandos
  processAICommand(consultation: SuperAIConsultation): {
    shouldSpeak: boolean;
    shouldShowRecommendations: boolean;
    shouldReferSpecialist: boolean;
    confidenceLevel: 'low' | 'medium' | 'high';
  } {
    const confidenceLevel = 
      consultation.confidence >= 0.8 ? 'high' :
      consultation.confidence >= 0.6 ? 'medium' : 'low';

    return {
      shouldSpeak: consultation.response.length > 0,
      shouldShowRecommendations: consultation.recommendations.length > 0,
      shouldReferSpecialist: consultation.needsSpecialist,
      confidenceLevel,
    };
  }

  // Adaptar resposta para o sistema atual da Dra. Cannabis
  adaptForDraCannabis(consultation: SuperAIConsultation): {
    message: string;
    actions: Array<{
      type: 'speak' | 'recommend' | 'refer' | 'insight';
      content: string;
      priority: number;
    }>;
  } {
    const actions: Array<{
      type: 'speak' | 'recommend' | 'refer' | 'insight';
      content: string;
      priority: number;
    }> = [];

    // Resposta principal
    actions.push({
      type: 'speak',
      content: consultation.response,
      priority: 1,
    });

    // Insights médicos
    consultation.medicalInsights.forEach((insight, index) => {
      actions.push({
        type: 'insight',
        content: insight,
        priority: 2 + index,
      });
    });

    // Recomendações
    consultation.recommendations.forEach((recommendation, index) => {
      actions.push({
        type: 'recommend',
        content: recommendation,
        priority: 10 + index,
      });
    });

    // Encaminhamento se necessário
    if (consultation.needsSpecialist) {
      actions.push({
        type: 'refer',
        content: 'Baseado na análise, recomendo consulta com especialista para avaliação mais detalhada.',
        priority: 99,
      });
    }

    return {
      message: consultation.response,
      actions: actions.sort((a, b) => a.priority - b.priority),
    };
  }
}

// Instância singleton do serviço
export const superAIService = new SuperAIService();