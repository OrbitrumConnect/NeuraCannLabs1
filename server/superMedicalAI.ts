import OpenAI from "openai";
import { storage } from "./storage";

// Super IA Médica com Conhecimento Especializado
export class SuperMedicalAI {
  private openai: OpenAI | null;
  private medicalKnowledgeBase: string[];
  private conversationHistory: Map<string, any[]> = new Map();

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ OPENAI_API_KEY não encontrada - Super IA Médica em modo limitado");
      this.openai = null;
    } else {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log("🧠 Super IA Médica inicializada com ChatGPT-4o");
    }

    // Base de conhecimento médico especializado (será expandida com a API externa)
    this.medicalKnowledgeBase = [
      "Cannabis medicinal para tratamento de epilepsia refratária",
      "Dosagem de CBD para ansiedade em idosos",
      "Interações medicamentosas entre THC e anticoagulantes",
      "Protocolos de titulação para dor crônica neuropática",
      "Efeitos adversos de cannabinoides em pediatria"
    ];
  }

  // Processa consulta médica com conhecimento especializado
  async processConsultation(
    userId: string,
    question: string,
    userContext: any = {}
  ): Promise<{
    response: string;
    medicalInsights: string[];
    confidence: number;
    recommendations: string[];
    needsSpecialist: boolean;
  }> {
    try {
      // Recupera histórico do usuário para contexto
      const userHistory = this.conversationHistory.get(userId) || [];
      
      // Salva a pergunta no histórico
      userHistory.push({
        type: 'user',
        content: question,
        timestamp: new Date(),
        context: userContext
      });

      let response: string;
      let medicalInsights: string[] = [];
      let confidence: number = 0.8;
      let recommendations: string[] = [];
      let needsSpecialist: boolean = false;

      if (this.openai) {
        // Usa ChatGPT-4o com conhecimento médico especializado
        const medicalContext = this.buildMedicalContext(userHistory);
        
        const completion = await this.openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: `Você é a Dra. Cannabis IA, uma assistente médica especializada em cannabis medicinal com conhecimento avançado em:
              
              CONHECIMENTO ESPECIALIZADO:
              ${this.medicalKnowledgeBase.join('\n- ')}
              
              CONTEXTO MÉDICO DO USUÁRIO:
              ${medicalContext}
              
              DIRETRIZES:
              - Seja empática e acolhedora, sempre aprofunde a conversa
              - Faça anamnese completa explorando aspectos emocionais e sociais  
              - Adapte-se ao perfil do paciente (conversas longas vs diretas)
              - Sempre pergunte "há mais alguma coisa?" para explorar completamente
              - Forneça insights médicos baseados em evidências
              - Identifique quando é necessário encaminhamento para especialista
              - Mantenha o foco na educação médica e segurança do paciente`
            },
            {
              role: "user",
              content: question
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });

        response = completion.choices[0].message.content || "Desculpe, não consegui processar sua consulta.";
        
        // Analisa a resposta para extrair insights médicos
        medicalInsights = await this.extractMedicalInsights(question, response);
        confidence = await this.calculateConfidence(question, response);
        recommendations = await this.generateRecommendations(question, response, userHistory);
        needsSpecialist = await this.assessSpecialistNeed(question, response, userHistory);

      } else {
        // Modo limitado sem OpenAI
        response = this.generateLimitedResponse(question);
        medicalInsights = ["Conhecimento limitado - aguardando integração completa"];
        confidence = 0.5;
      }

      // Salva a resposta no histórico
      userHistory.push({
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        medicalInsights,
        confidence,
        recommendations,
        needsSpecialist
      });

      // Atualiza histórico do usuário
      this.conversationHistory.set(userId, userHistory);

      // Salva no sistema de aprendizado contínuo
      await this.saveConversationForLearning(userId, question, response, {
        medicalInsights,
        confidence,
        recommendations,
        needsSpecialist
      });

      return {
        response,
        medicalInsights,
        confidence,
        recommendations,
        needsSpecialist
      };

    } catch (error) {
      console.error("❌ Erro na Super IA Médica:", error);
      return {
        response: "Desculpe, houve um erro técnico. Por favor, tente novamente.",
        medicalInsights: [],
        confidence: 0,
        recommendations: [],
        needsSpecialist: false
      };
    }
  }

  // Constrói contexto médico do histórico do usuário
  private buildMedicalContext(userHistory: any[]): string {
    const recentConversations = userHistory.slice(-5); // Últimas 5 interações
    return recentConversations
      .map(entry => `${entry.type}: ${entry.content}`)
      .join('\n');
  }

  // Extrai insights médicos da conversa
  private async extractMedicalInsights(question: string, response: string): Promise<string[]> {
    const insights: string[] = [];
    
    // Análise simples baseada em palavras-chave (será melhorada com IA)
    const medicalKeywords = ['cbd', 'thc', 'cannabis', 'dor', 'ansiedade', 'epilepsia', 'insônia'];
    
    for (const keyword of medicalKeywords) {
      if (question.toLowerCase().includes(keyword) || response.toLowerCase().includes(keyword)) {
        insights.push(`Tópico identificado: ${keyword.toUpperCase()}`);
      }
    }

    return insights;
  }

  // Calcula nível de confiança da resposta
  private async calculateConfidence(question: string, response: string): Promise<number> {
    // Lógica simples - será melhorada com IA
    let confidence = 0.8;
    
    if (response.includes("não tenho certeza") || response.includes("consulte um médico")) {
      confidence -= 0.2;
    }
    
    if (response.length > 200) {
      confidence += 0.1; // Respostas mais detalhadas tendem a ser mais confiáveis
    }

    return Math.min(Math.max(confidence, 0), 1);
  }

  // Gera recomendações personalizadas
  private async generateRecommendations(question: string, response: string, history: any[]): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Recomendações baseadas no contexto
    if (question.toLowerCase().includes('dor')) {
      recommendations.push("Considere manter um diário de dor para monitorar padrões");
      recommendations.push("Avalie técnicas complementares como meditação ou fisioterapia");
    }
    
    if (question.toLowerCase().includes('ansiedade')) {
      recommendations.push("Técnicas de respiração podem ajudar nos momentos de crise");
      recommendations.push("Exercícios regulares são benéficos para ansiedade");
    }

    return recommendations;
  }

  // Avalia se é necessário encaminhamento para especialista
  private async assessSpecialistNeed(question: string, response: string, history: any[]): Promise<boolean> {
    const emergencyKeywords = ['emergência', 'urgente', 'grave', 'severo', 'hospitalar'];
    const complexCases = ['múltiplas', 'complicações', 'resistente', 'refratário'];
    
    const needsEmergency = emergencyKeywords.some(keyword => 
      question.toLowerCase().includes(keyword) || response.toLowerCase().includes(keyword)
    );
    
    const isComplex = complexCases.some(keyword => 
      question.toLowerCase().includes(keyword) || response.toLowerCase().includes(keyword)
    );

    return needsEmergency || isComplex || history.length > 10; // Conversas muito longas
  }

  // Resposta limitada quando OpenAI não está disponível
  private generateLimitedResponse(question: string): string {
    const responses = [
      "Entendo sua preocupação. Para uma consulta completa, precisamos ativar o sistema completo da IA.",
      "Sua pergunta é importante. Vou anotar para quando o sistema completo estiver disponível.",
      "Obrigada por compartilhar. Para uma resposta médica adequada, aguarde a ativação completa do sistema."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Salva conversa no sistema de aprendizado contínuo
  private async saveConversationForLearning(
    userId: string,
    question: string,
    response: string,
    metadata: any
  ): Promise<void> {
    try {
      // Salva no sistema de aprendizado existente
      const conversationData = {
        userId,
        userMessage: question,
        aiResponse: response,
        timestamp: new Date(),
        medicalTopic: this.extractMedicalTopic(question),
        ...metadata
      };

      // Integra com o sistema de aprendizado contínuo existente
      await storage.createConversation({
        sessionId: userId,
        userMessage: question,
        aiResponse: response,
        medicalTopic: this.extractMedicalTopic(question),
        successRating: metadata.confidence || 0.8,
        context: JSON.stringify(metadata)
      });
      
      console.log(`💬 Conversa salva para aprendizado: ${userId}`);
    } catch (error) {
      console.error("❌ Erro ao salvar conversa para aprendizado:", error);
    }
  }

  // Extrai tópico médico principal
  private extractMedicalTopic(question: string): string {
    const topics = {
      'dor': ['dor', 'analgesia', 'analgésico'],
      'ansiedade': ['ansiedade', 'estresse', 'pânico'],
      'epilepsia': ['epilepsia', 'convulsão', 'crise'],
      'insônia': ['insônia', 'sono', 'dormir'],
      'cancer': ['câncer', 'tumor', 'oncologia'],
      'pediatria': ['criança', 'infantil', 'pediátrico']
    };

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => question.toLowerCase().includes(keyword))) {
        return topic;
      }
    }

    return 'geral';
  }

  // Integra conhecimento externo de APIs médicas
  async integrateExternalKnowledge(apiData: any): Promise<void> {
    console.log("🔄 Integrando conhecimento médico externo...");
    
    if (apiData.studies) {
      this.medicalKnowledgeBase.push(...apiData.studies);
    }
    
    if (apiData.protocols) {
      this.medicalKnowledgeBase.push(...apiData.protocols);
    }

    console.log(`✅ Conhecimento integrado - Total: ${this.medicalKnowledgeBase.length} itens`);
  }

  // Obtém estatísticas do sistema
  getSystemStats(): any {
    return {
      activeUsers: this.conversationHistory.size,
      knowledgeBaseSize: this.medicalKnowledgeBase.length,
      totalConversations: Array.from(this.conversationHistory.values()).reduce(
        (total, history) => total + history.length, 0
      ),
      aiEnabled: !!this.openai
    };
  }
}

// Instância singleton da Super IA Médica
export const superMedicalAI = new SuperMedicalAI();