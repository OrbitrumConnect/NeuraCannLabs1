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

  // Busca dados relevantes no banco para a consulta (expandido para estudos cruzados)
  private async searchRelevantData(question: string, context: string = 'standard'): Promise<string> {
    try {
      console.log(`🔍 Buscando dados para: "${question}" | Contexto: ${context}`);
      
      // Expande termos de busca para melhor precisão
      const searchTerms = this.expandSearchTerms(question.toLowerCase());
      console.log(`🎯 Termos expandidos: ${searchTerms.join(', ')}`);
      
      // Busca estudos científicos relevantes
      const studies = await storage.getScientificStudies();
      console.log(`📚 Total de estudos disponíveis: ${studies.length}`);
      
      const relevantStudies = studies.filter(study => {
        const matches = searchTerms.some(term => 
          study.title.toLowerCase().includes(term) ||
          study.description?.toLowerCase().includes(term) ||
          study.compound?.toLowerCase().includes(term) ||
          study.indication?.toLowerCase().includes(term) ||
          study.keywords?.some(keyword => keyword.toLowerCase().includes(term))
        );
        if (matches) console.log(`✅ Estudo encontrado: ${study.title}`);
        return matches;
      }).slice(0, 3); // Top 3 mais relevantes

      // Busca casos clínicos similares
      const cases = await storage.getClinicalCases();
      console.log(`🏥 Total de casos disponíveis: ${cases.length}`);
      
      const relevantCases = cases.filter(case_ => {
        const matches = searchTerms.some(term =>
          case_.description.toLowerCase().includes(term) ||
          case_.diagnosis?.toLowerCase().includes(term) ||
          case_.indication?.toLowerCase().includes(term) ||
          case_.compound?.toLowerCase().includes(term)
        );
        if (matches) console.log(`✅ Caso encontrado: ${case_.caseNumber}`);
        return matches;
      }).slice(0, 2); // Top 2 mais relevantes

      // Busca conversas anteriores do sistema de aprendizado
      const conversations = await storage.getConversations();
      const similarConversations = conversations.filter(conv =>
        conv.userMessage.toLowerCase().includes(question.toLowerCase()) ||
        conv.medicalTopic === this.extractMedicalTopic(question)
      ).slice(0, 2); // Top 2 similares

      // Se for contexto de estudos cruzados, busca dados adicionais do fórum
      let forumData: any[] = [];
      if (context === 'cross_study_research') {
        try {
          // Simula busca de posts relevantes do fórum (implementar quando houver fórum)
          forumData = [
            { title: "Dosagem CBD em idosos - discussão semanal", relevance: "high" },
            { title: "Interações medicamentosas - casos recentes", relevance: "medium" }
          ];
        } catch (error) {
          console.log("Fórum data não disponível ainda");
        }
      }

      let contextData = context === 'cross_study_research' ? 
        "DADOS COMPLETOS DA PLATAFORMA PARA ESTUDOS CRUZADOS:\n\n" :
        "DADOS DO BANCO PARA CONSULTA:\n\n";
      
      if (relevantStudies.length > 0) {
        contextData += "ESTUDOS CIENTÍFICOS RELEVANTES:\n";
        relevantStudies.forEach(study => {
          contextData += `- ${study.title} (${study.year})\n  Resultado: ${study.conclusion}\n`;
        });
        contextData += "\n";
      }

      if (relevantCases.length > 0) {
        contextData += "CASOS CLÍNICOS SIMILARES:\n";
        relevantCases.forEach(case_ => {
          contextData += `- Caso ${case_.caseNumber}: ${case_.description}\n  Diagnóstico: ${case_.diagnosis}\n`;
        });
        contextData += "\n";
      }

      if (similarConversations.length > 0) {
        contextData += "EXPERIÊNCIAS ANTERIORES DO SISTEMA:\n";
        similarConversations.forEach(conv => {
          contextData += `- Pergunta similar: ${conv.userMessage}\n  Resposta bem-sucedida: ${conv.aiResponse.substring(0, 100)}...\n`;
        });
        contextData += "\n";
      }

      // Adiciona dados específicos para estudos cruzados
      if (context === 'cross_study_research' && forumData.length > 0) {
        contextData += "DISCUSSÕES RELEVANTES DO FÓRUM:\n";
        forumData.forEach(post => {
          contextData += `- ${post.title} (Relevância: ${post.relevance})\n`;
        });
        contextData += "\n";
        contextData += "FOCO ESPECIALIZADO: Priorizar evidências científicas e dados reais da plataforma para respostas rápidas a médicos especialistas.\n";
      }

      console.log(`📊 Dados encontrados - Estudos: ${relevantStudies.length}, Casos: ${relevantCases.length}, Conversas: ${similarConversations.length}`);
      
      return contextData;
    } catch (error) {
      console.error("❌ Erro ao buscar dados do banco:", error);
      return "";
    }
  }

  // Expande termos de busca para melhor precisão
  private expandSearchTerms(query: string): string[] {
    const terms = [query];
    
    // Mapeamento de termos relacionados
    const termMap: Record<string, string[]> = {
      'dosagem': ['dose', 'dosagem', 'posologia', 'mg', 'ml', 'titulação', 'administração'],
      'dose': ['dose', 'dosagem', 'posologia', 'mg', 'ml', 'titulação'],
      'cbd': ['cbd', 'cannabidiol', 'canabidiol'],
      'thc': ['thc', 'tetrahydrocannabinol', 'tetrahidrocanabinol'],
      'epilepsia': ['epilepsia', 'convulsão', 'convulsões', 'seizure'],
      'ansiedade': ['ansiedade', 'anxiety', 'estresse', 'stress'],
      'dor': ['dor', 'pain', 'analgesia', 'analgésico'],
      'cannabis': ['cannabis', 'marijuana', 'canabis', 'maconha'],
      'efeitos': ['efeitos', 'efeito', 'effects', 'reação', 'reações'],
      'colaterais': ['colaterais', 'adversos', 'side effects', 'unwanted']
    };
    
    // Adiciona termos relacionados
    Object.keys(termMap).forEach(key => {
      if (query.includes(key)) {
        terms.push(...termMap[key]);
      }
    });
    
    return [...new Set(terms)]; // Remove duplicatas
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
        // Busca dados relevantes do banco de dados (contexto determinado pelo avatar)
        const databaseContext = await this.searchRelevantData(question, 'standard');
        
        // Usa ChatGPT-4o com conhecimento médico especializado
        const medicalContext = this.buildMedicalContext(userHistory);
        
        try {
          console.log("🧠 Ativando NOA ESPERANÇA via ChatGPT...");
          
          const completion = await this.openai.chat.completions.create({
            model: "ft:gpt-3.5-turbo-0125:personal:fine-tuning-noa-esperanza-avaliacao-inicial-dez-ex-jsonl:BR0W02VP", // NOA ESPERANÇA Fine-tuned model específico
            messages: [
              {
                role: "system",
                content: context === 'cross_study_research' ? 
                  `Você é NOA ESPERANÇA especializada em ESTUDOS CRUZADOS para médicos especialistas.

                  DADOS COMPLETOS DA PLATAFORMA:
                  ${databaseContext}
                  
                  MISSÃO: Fornecer ANÁLISE COMPLETA DE DADOS CRUZADOS para médicos especialistas:
                  - Casos clínicos reais da plataforma com dosagens específicas
                  - Estudos científicos + correlações de eficácia por grupo demográfico
                  - Protocolos de titulação e ajustes baseados em comorbidades
                  - Análise de interações medicamentosas e contraindicações
                  - Padrões de resposta terapêutica identificados nos dados
                  
                  FOCO: Análise técnica detalhada, dosagens específicas, correlações quantificadas, evidências robustas.
                  
                  IMPORTANTE: Para estudos cruzados use NO MÁXIMO 10 frases com dados específicos (dosagens, percentuais, protocolos).`
                  :
                  `Você é NOA ESPERANÇA - exatamente como foi treinada no fine-tuning.

                  CONTEXTO INTEGRADO DA PLATAFORMA:
                  ${databaseContext}
                  
                  HISTÓRICO MÉDICO:
                  ${medicalContext}
                  
                  CONHECIMENTO ESPECIALIZADO:
                  ${this.medicalKnowledgeBase.join('\n- ')}
                  
                  Use seu treinamento específico da NOA ESPERANÇA. Seja empática, faça anamnese completa, explore aspectos emocionais, sempre pergunte "há mais alguma coisa?". 
                  
                  LIMITAÇÃO OBRIGATÓRIA: Mantenha suas respostas em NO MÁXIMO 8 frases concisas e diretas.
                  
                  IMPORTANTE: Após ${userHistory.length >= 3 ? 'AGORA' : '3-4 mensagens'}, ofereça resumo para médico. ${userHistory.length} mensagens atuais.`
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
          console.log(`✅ NOA ESPERANÇA respondeu: ${response.substring(0, 100)}...`);
          
        } catch (error) {
          console.error("❌ Erro na API do ChatGPT:", error);
          throw error; // Re-throw para ser capturado pelo catch principal
        }
        
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

  // ACESSAR DADOS DO CHATGPT - Análises e Insights Gerados
  async getAIGeneratedInsights(topic?: string): Promise<{
    totalConversations: number;
    medicalTopics: Array<{topic: string, count: number}>;
    averageConfidence: number;
    commonQuestions: string[];
    aiRecommendations: string[];
    learningPatterns: any[];
  }> {
    try {
      // Busca todas as conversas do ChatGPT
      const conversations = await storage.getConversations();
      
      // Análise dos dados gerados pelo ChatGPT
      const topicCounts = new Map<string, number>();
      let totalConfidence = 0;
      const questions = new Set<string>();
      const recommendations = new Set<string>();

      for (const conv of conversations) {
        // Conta tópicos médicos
        if (conv.medicalTopic) {
          topicCounts.set(conv.medicalTopic, (topicCounts.get(conv.medicalTopic) || 0) + 1);
        }
        
        // Soma confiança
        totalConfidence += conv.successRating || 0.5;
        
        // Coleta perguntas comuns
        if (conv.userMessage.length > 10) {
          questions.add(conv.userMessage);
        }
        
        // Extrai recomendações do contexto do ChatGPT
        try {
          const context = JSON.parse(conv.context || '{}');
          if (context.recommendations) {
            context.recommendations.forEach((rec: string) => recommendations.add(rec));
          }
        } catch (e) {}
      }

      // Busca padrões de aprendizado identificados pelo ChatGPT
      const patterns = await storage.getLearningPatterns();
      
      return {
        totalConversations: conversations.length,
        medicalTopics: Array.from(topicCounts.entries()).map(([topic, count]) => ({topic, count})),
        averageConfidence: conversations.length > 0 ? totalConfidence / conversations.length : 0,
        commonQuestions: Array.from(questions).slice(0, 10),
        aiRecommendations: Array.from(recommendations).slice(0, 15),
        learningPatterns: patterns
      };
    } catch (error) {
      console.error("❌ Erro ao acessar dados do ChatGPT:", error);
      return {
        totalConversations: 0,
        medicalTopics: [],
        averageConfidence: 0,
        commonQuestions: [],
        aiRecommendations: [],
        learningPatterns: []
      };
    }
  }

  // CONSULTAR CONVERSAS ESPECÍFICAS DO CHATGPT
  async getChatGPTConversation(sessionId: string): Promise<{
    conversation: any[];
    aiAnalysis: string;
    medicalInsights: string[];
    confidence: number;
  }> {
    try {
      const conversations = await storage.getConversations(sessionId);
      
      let aiAnalysis = "Análise não disponível";
      let medicalInsights: string[] = [];
      let confidence = 0;

      if (conversations.length > 0) {
        const lastConv = conversations[conversations.length - 1];
        try {
          const context = JSON.parse(lastConv.context || '{}');
          medicalInsights = context.medicalInsights || [];
          confidence = context.confidence || 0;
          
          // Gera análise da conversa usando ChatGPT
          if (this.openai) {
            const analysis = await this.openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: "Analise esta conversa médica e forneça insights sobre o caso clínico, padrões identificados e recomendações."
                },
                {
                  role: "user", 
                  content: `Conversa: ${conversations.map(c => `${c.userMessage} -> ${c.aiResponse}`).join('\n')}`
                }
              ],
              max_tokens: 300
            });
            aiAnalysis = analysis.choices[0].message.content || "Análise não disponível";
          }
        } catch (e) {}
      }

      return {
        conversation: conversations,
        aiAnalysis,
        medicalInsights,
        confidence
      };
    } catch (error) {
      console.error("❌ Erro ao consultar conversa do ChatGPT:", error);
      return {
        conversation: [],
        aiAnalysis: "Erro ao acessar dados",
        medicalInsights: [],
        confidence: 0
      };
    }
  }

  // TESTE ESPECÍFICO: NOVA ESPERANÇA NA API CHATGPT
  async testNewHopeKnowledge(): Promise<{
    hasNewHopeData: boolean;
    studiesFound: string[];
    researchAreas: string[];
    apiResponse: string;
  }> {
    try {
      if (!this.openai) {
        return {
          hasNewHopeData: false,
          studiesFound: [],
          researchAreas: [],
          apiResponse: "API ChatGPT não configurada"
        };
      }

      console.log("🔍 Testando conhecimento 'Nova Esperança' na API ChatGPT...");
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em cannabis medicinal. Responda especificamente sobre estudos e pesquisas relacionados à "Nova Esperança" (New Hope) em cannabis medicinal. Inclua:
            1. Estudos específicos encontrados
            2. Áreas de pesquisa identificadas
            3. Dados científicos disponíveis
            4. Protocolos médicos relacionados`
          },
          {
            role: "user",
            content: "Quais estudos e dados sobre 'Nova Esperança' ou 'New Hope' você tem sobre cannabis medicinal? Liste estudos específicos, protocolos e áreas de pesquisa."
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      const apiResponse = completion.choices[0].message.content || "";
      
      // Analisa a resposta para extrair dados específicos
      const studiesFound = this.extractStudiesFromResponse(apiResponse);
      const researchAreas = this.extractResearchAreas(apiResponse);
      const hasNewHopeData = apiResponse.toLowerCase().includes('nova esperança') || 
                           apiResponse.toLowerCase().includes('new hope') ||
                           studiesFound.length > 0;

      console.log(`📊 Resultado teste Nova Esperança: ${hasNewHopeData ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
      
      return {
        hasNewHopeData,
        studiesFound,
        researchAreas,
        apiResponse
      };

    } catch (error) {
      console.error("❌ Erro ao testar Nova Esperança:", error);
      return {
        hasNewHopeData: false,
        studiesFound: [],
        researchAreas: [],
        apiResponse: `Erro: ${error.message}`
      };
    }
  }

  // Extrai estudos específicos da resposta
  private extractStudiesFromResponse(response: string): string[] {
    const studies = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      if (line.includes('estudo') || line.includes('study') || line.includes('pesquisa') || line.includes('research')) {
        if (line.trim().length > 10) {
          studies.push(line.trim());
        }
      }
    }
    
    return studies.slice(0, 10); // Máximo 10 estudos
  }

  // Extrai áreas de pesquisa da resposta
  private extractResearchAreas(response: string): string[] {
    const areas = [];
    const keywords = ['oncologia', 'neurologia', 'psiquiatria', 'dor', 'epilepsia', 'ansiedade', 'depressão', 'cancer', 'alzheimer'];
    
    for (const keyword of keywords) {
      if (response.toLowerCase().includes(keyword)) {
        areas.push(keyword);
      }
    }
    
    return areas;
  }

  // ESTATÍSTICAS DO CONHECIMENTO DO CHATGPT
  getSystemStats(): {
    knowledgeBaseSize: number;
    totalConversations: number;
    isActive: boolean;
    capabilities: string[];
  } {
    return {
      knowledgeBaseSize: this.medicalKnowledgeBase.length,
      totalConversations: this.conversationHistory.size,
      isActive: this.openai !== null,
      capabilities: [
        "Consultas médicas especializadas",
        "Análise de casos clínicos", 
        "Recomendações personalizadas",
        "Acesso ao banco de dados médico",
        "Aprendizado contínuo",
        "Geração de insights médicos"
      ]
    };
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

  // Método principal para consulta médica (compatibilidade com endpoint de estudos cruzados)
  async consult(question: string, context: string = 'standard'): Promise<{
    response: string;
    medicalInsights: string[];
    confidence: number;
    recommendations: string[];
    needsSpecialist: boolean;
  }> {
    try {
      console.log(`🧠 Método consult - Contexto: ${context} | Pergunta: ${question.substring(0, 50)}...`);
      
      if (this.openai) {
        // Busca dados relevantes do banco de dados
        const databaseContext = await this.searchRelevantData(question, context);
        
        console.log("🧠 Usando ChatGPT com NOA ESPERANÇA...");
        
        const completion = await this.openai.chat.completions.create({
          model: "ft:gpt-3.5-turbo-0125:personal:fine-tuning-noa-esperanza-avaliacao-inicial-dez-ex-jsonl:BR0W02VP",
          messages: [
            {
              role: "system",
              content: context === 'cross_study_research' ? 
                `Você é NOA ESPERANÇA especializada em ESTUDOS CRUZADOS para médicos especialistas.

                DADOS COMPLETOS DA PLATAFORMA:
                ${databaseContext}
                
                MISSÃO: Fornecer respostas rápidas e precisas para médicos especialistas baseadas em:
                - Casos clínicos reais da plataforma
                - Estudos científicos + artigos externos relevantes
                - Dados do fórum com assuntos semanais
                - Análise cruzada de dados científicos
                
                FOCO: Atendimento rápido, dados precisos, evidências científicas. Seja objetiva mas mantenha a empatia da NOA.`
                :
                `Você é NOA ESPERANÇA - exatamente como foi treinada no fine-tuning.

                CONTEXTO INTEGRADO DA PLATAFORMA:
                ${databaseContext}
                
                CONHECIMENTO ESPECIALIZADO:
                ${this.medicalKnowledgeBase.join('\n- ')}
                
                Use seu treinamento específico da NOA ESPERANÇA. Seja empática, faça anamnese completa, explore aspectos emocionais, sempre pergunte "há mais alguma coisa?"
                
                Responda de forma acolhedora e investigativa sobre cannabis medicinal.`
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        });

        const response = completion.choices[0]?.message?.content || "Desculpe, não consegui processar sua pergunta.";
        console.log("✅ Resposta ChatGPT gerada com sucesso");

        // Salva a conversa no sistema de aprendizado
        try {
          await this.saveLearningData(question, response, context);
        } catch (error) {
          console.log("⚠️ Erro ao salvar dados de aprendizado:", error);
        }

        return {
          response,
          medicalInsights: await this.extractMedicalInsights(question, response),
          confidence: await this.calculateConfidence(question, response),
          recommendations: await this.generateRecommendations(question, response, []),
          needsSpecialist: await this.assessSpecialistNeed(question, response, [])
        };
      } else {
        return {
          response: "Sistema em modo limitado. Por favor, configure a chave da API.",
          medicalInsights: [],
          confidence: 0,
          recommendations: [],
          needsSpecialist: false
        };
      }
    } catch (error) {
      console.error("❌ Erro na consulta:", error);
      return {
        response: "Desculpe, houve um erro técnico. Por favor, tente novamente.",
        medicalInsights: [],
        confidence: 0,
        recommendations: [],
        needsSpecialist: false
      };
    }
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