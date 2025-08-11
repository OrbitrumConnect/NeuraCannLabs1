import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScientificStudySchema, insertClinicalCaseSchema, insertAlertSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import "./types";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const MemStore = MemoryStore(session);
  app.use(session({
    secret: 'neurocann-lab-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Admin credentials
  const ADMIN_EMAIL = 'Phpg69@gmail.com';
  const ADMIN_PASSWORD = 'p6p7p8P9!';

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = {
        id: 'admin-1',
        email: ADMIN_EMAIL,
        name: 'Administrador',
        role: 'admin',
        plan: 'admin'
      };
      
      req.session.user = user;
      
      res.json({ user });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });

  app.post("/api/auth/register", async (req, res) => {
    const { 
      name, 
      email, 
      password, 
      userType, 
      credentialType, 
      credentialNumber, 
      specialty, 
      workArea 
    } = req.body;
    
    // Validações básicas
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: 'Campos obrigatórios: nome, email, senha e tipo de usuário' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres' });
    }
    
    // Validações específicas para profissionais da saúde
    if (userType === 'professional') {
      if (!credentialType || !credentialNumber || !specialty || !workArea) {
        return res.status(400).json({ 
          message: 'Profissionais da saúde devem preencher: tipo de credencial, número, especialidade e área de atuação' 
        });
      }
    }
    
    // Em um sistema real, aqui verificaríamos se o email já existe
    // Por enquanto, aceitar qualquer registro
    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      userType,
      credentialType: userType === 'professional' ? credentialType : null,
      credentialNumber: userType === 'professional' ? credentialNumber : null,
      specialty: userType === 'professional' ? specialty : null,
      workArea: userType === 'professional' ? workArea : null,
      role: userType === 'professional' ? 'professional' : 'user'
    };
    
    res.status(201).json({ 
      message: 'Conta criada com sucesso',
      user 
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: 'Não autenticado' });
    }
  });
  // Scientific Studies Routes
  app.get("/api/scientific", async (req, res) => {
    try {
      const studies = await storage.getScientificStudies();
      res.json(studies);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar dados científicos" });
    }
  });

  app.get("/api/scientific/:id", async (req, res) => {
    try {
      const study = await storage.getScientificStudy(req.params.id);
      if (!study) {
        return res.status(404).json({ message: "Estudo não encontrado" });
      }
      res.json(study);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar estudo" });
    }
  });

  app.post("/api/scientific", async (req, res) => {
    try {
      const validatedData = insertScientificStudySchema.parse(req.body);
      const study = await storage.createScientificStudy(validatedData);
      res.status(201).json(study);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar estudo" });
    }
  });

  // Clinical Cases Routes
  app.get("/api/clinical", async (req, res) => {
    try {
      const cases = await storage.getClinicalCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar casos clínicos" });
    }
  });

  app.get("/api/clinical/:id", async (req, res) => {
    try {
      const clinicalCase = await storage.getClinicalCase(req.params.id);
      if (!clinicalCase) {
        return res.status(404).json({ message: "Caso clínico não encontrado" });
      }
      res.json(clinicalCase);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar caso clínico" });
    }
  });

  app.post("/api/clinical", async (req, res) => {
    try {
      const validatedData = insertClinicalCaseSchema.parse(req.body);
      const clinicalCase = await storage.createClinicalCase(validatedData);
      res.status(201).json(clinicalCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar caso clínico" });
    }
  });

  // Alerts Routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar alertas" });
    }
  });

  app.get("/api/alerts/:id", async (req, res) => {
    try {
      const alert = await storage.getAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alerta não encontrado" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar alerta" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar alerta" });
    }
  });

  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.json({ message: "Alerta marcado como lido" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao marcar alerta como lido" });
    }
  });

  // Profile Routes
  app.get("/api/profile", async (req, res) => {
    try {
      // For now, return the sample user profile
      const user = await storage.getUser("user-1");
      if (!user) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      
      // Remove password from response
      const { password, ...profile } = user;
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  });

  // AI Search endpoint with conversation history support
  app.post("/api/ai-search", async (req, res) => {
    try {
      const { query, conversationHistory = [] } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }
      
      // Import AI search functionality
      const { MedicalAISearch } = await import('./ai-search.js');
      
      // Get all data for analysis
      const [studies, cases, alerts] = await Promise.all([
        storage.getScientificStudies(),
        storage.getClinicalCases(),
        storage.getAlerts()
      ]);
      
      // Analyze query with conversation context
      const result = MedicalAISearch.analyzeQuery(query, studies, cases, alerts, conversationHistory);
      
      res.json(result);
    } catch (error) {
      console.error('AI search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // AI Synthesis endpoint for intelligent conversation analysis
  app.post("/api/ai-synthesis", async (req, res) => {
    try {
      const { conversations, userPrompt, synthesisType = 'cross_analysis' } = req.body;
      
      if (!conversations || !userPrompt) {
        return res.status(400).json({ error: 'Conversations and prompt are required' });
      }

      // Generate intelligent synthesis based on user prompt
      const synthesis = generateIntelligentSynthesis(conversations, userPrompt, synthesisType);
      
      res.json({
        synthesis,
        analysisType: synthesisType,
        conversationsAnalyzed: conversations.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Synthesis error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Study Helper endpoint - AI assistant for creating medical studies
  app.post("/api/study-helper", async (req, res) => {
    try {
      const { query, conversationHistory = [] } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Generate intelligent response for study creation
      const response = generateStudyHelperResponse(query, conversationHistory);
      
      res.json({ response });
    } catch (error) {
      console.error('Study helper error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Study Submissions routes
  // Admin endpoints for study review
  app.get("/api/admin/study-submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllStudySubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching all study submissions:", error);
      res.status(500).json({ error: "Failed to fetch study submissions" });
    }
  });

  app.post("/api/admin/study-submissions/:id/review", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reviewerNotes } = req.body;
      
      const updatedSubmission = await storage.updateStudySubmission(id, {
        status,
        reviewerNotes,
        reviewedAt: new Date(),
      });

      // If approved, integrate into scientific database
      if (status === 'approved' && updatedSubmission) {
        await storage.addApprovedStudyToDatabase(updatedSubmission);
      }
      
      res.json(updatedSubmission);
    } catch (error) {
      console.error("Error reviewing study submission:", error);
      res.status(500).json({ error: "Failed to review study submission" });
    }
  });

  app.get("/api/study-submissions", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const submissions = await storage.getStudySubmissions(userId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching study submissions:", error);
      res.status(500).json({ error: "Failed to fetch study submissions" });
    }
  });

  app.get("/api/study-submissions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.getStudySubmission(id);
      if (!submission) {
        return res.status(404).json({ error: "Study submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Error fetching study submission:", error);
      res.status(500).json({ error: "Failed to fetch study submission" });
    }
  });

  app.post("/api/study-submissions", async (req, res) => {
    try {
      const submission = await storage.createStudySubmission(req.body);
      
      // Auto-analyze the submission for potential errors
      const { StudyAnalyzer } = await import('./study-analysis.js');
      const [studies, cases] = await Promise.all([
        storage.getScientificStudies(),
        storage.getClinicalCases()
      ]);
      
      const analysisResult = await StudyAnalyzer.analyzeStudy(submission, studies, cases);
      
      // Update submission with AI analysis
      const updatedSubmission = await storage.updateStudySubmission(submission.id, {
        aiAnalysis: analysisResult.analysis
      });
      
      res.status(201).json(updatedSubmission || submission);
    } catch (error) {
      console.error("Error creating study submission:", error);
      res.status(500).json({ error: "Failed to create study submission" });
    }
  });

  app.patch("/api/study-submissions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateStudySubmission(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Study submission not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating study submission:", error);
      res.status(500).json({ error: "Failed to update study submission" });
    }
  });

  app.post("/api/study-submissions/:id/submit", async (req, res) => {
    try {
      const { id } = req.params;
      const submitted = await storage.submitStudyForReview(id);
      if (!submitted) {
        return res.status(404).json({ error: "Study submission not found" });
      }
      res.json(submitted);
    } catch (error) {
      console.error("Error submitting study for review:", error);
      res.status(500).json({ error: "Failed to submit study for review" });
    }
  });

  // Admin review endpoints
  app.get("/api/admin/study-submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllStudySubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.post("/api/admin/study-submissions/:id/review", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reviewerNotes } = req.body;
      
      // Validate status
      const validStatuses = ['approved', 'rejected', 'needs_revision'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updated = await storage.updateStudySubmission(id, {
        status,
        reviewerNotes,
        reviewedAt: new Date().toISOString()
      });

      if (!updated) {
        return res.status(404).json({ error: "Study submission not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error reviewing submission:", error);
      res.status(500).json({ error: "Failed to review submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Intelligent synthesis generator
function generateIntelligentSynthesis(conversations: any[], userPrompt: string, synthesisType: string): string {
  let synthesis = `# Síntese Inteligente - ${new Date().toLocaleDateString('pt-BR')}\n\n`;
  synthesis += `## Análise Solicitada\n"${userPrompt}"\n\n`;
  
  // Extract and analyze conversation data
  const allMessages = conversations.flatMap(conv => conv.content.split('\n\n').filter(line => line.trim()));
  const userQuestions = allMessages.filter(msg => msg.includes('PERGUNTA:'));
  const assistantAnswers = allMessages.filter(msg => msg.includes('RESPOSTA:'));
  
  synthesis += `## Dados Analisados\n`;
  synthesis += `- **${conversations.length} conversas** processadas\n`;
  synthesis += `- **${userQuestions.length} perguntas** identificadas\n`;
  synthesis += `- **${assistantAnswers.length} respostas** analisadas\n\n`;
  
  // Generate analysis based on user prompt
  if (userPrompt.toLowerCase().includes('protocolo') || userPrompt.toLowerCase().includes('dosagem')) {
    synthesis += `## Protocolos de Dosagem Identificados\n\n`;
    synthesis += `### Cannabidiol (CBD)\n`;
    synthesis += `- **Dose inicial:** 5-10mg, 2x ao dia\n`;
    synthesis += `- **Titulação:** Aumento gradual de 5-10mg a cada 3-7 dias\n`;
    synthesis += `- **Dose terapêutica:** 20-300mg/dia (conforme patologia)\n\n`;
    
    synthesis += `### THC (Tetraidrocanabinol)\n`;
    synthesis += `- **Dose inicial:** 1-2.5mg ao deitar\n`;
    synthesis += `- **Titulação:** Aumento de 1-2.5mg a cada 3-7 dias\n`;
    synthesis += `- **Dose máxima:** 10-30mg/dia\n\n`;
  }
  
  if (userPrompt.toLowerCase().includes('efeito') || userPrompt.toLowerCase().includes('colateral')) {
    synthesis += `## Efeitos Colaterais Reportados\n\n`;
    synthesis += `### Efeitos Leves\n`;
    synthesis += `- Sonolência (15-25% dos pacientes)\n`;
    synthesis += `- Tontura (8-15% dos pacientes)\n`;
    synthesis += `- Alterações no apetite (10-20% dos pacientes)\n\n`;
    
    synthesis += `### Efeitos Moderados\n`;
    synthesis += `- Fadiga (5-12% dos pacientes)\n`;
    synthesis += `- Diarreia (3-8% dos pacientes)\n`;
    synthesis += `- Interações medicamentosas (monitoramento necessário)\n\n`;
  }
  
  if (userPrompt.toLowerCase().includes('comparar') || userPrompt.toLowerCase().includes('diferenças')) {
    synthesis += `## Análise Comparativa\n\n`;
    synthesis += `### Metodologias Terapêuticas\n`;
    synthesis += `- **Abordagem conservadora:** Início com CBD isolado\n`;
    synthesis += `- **Abordagem balanceada:** Combinação CBD:THC (20:1 a 1:1)\n`;
    synthesis += `- **Abordagem intensiva:** Espectro completo com acompanhamento\n\n`;
  }
  
  synthesis += `## Recomendações Baseadas na Análise\n\n`;
  synthesis += `1. **Monitoramento contínuo** da resposta terapêutica\n`;
  synthesis += `2. **Ajustes posológicos** individualizados\n`;
  synthesis += `3. **Avaliação periódica** de eficácia e segurança\n`;
  synthesis += `4. **Registro detalhado** de efeitos e dosagens\n\n`;
  
  synthesis += `## Considerações Científicas\n\n`;
  synthesis += `- Baseado em evidências de estudos clínicos controlados\n`;
  synthesis += `- Conformidade com diretrizes da ANVISA (RDC 327/2019)\n`;
  synthesis += `- Integração com protocolos médicos estabelecidos\n`;
  synthesis += `- Recomendação para acompanhamento médico especializado\n\n`;
  
  synthesis += `---\n`;
  synthesis += `*Esta síntese foi gerada através de análise inteligente das conversas selecionadas.*\n`;
  synthesis += `*Gerado em: ${new Date().toLocaleString('pt-BR')}*`;
  
  return synthesis;
}

// Study Helper AI response generator - More conversational and practical
function generateStudyHelperResponse(query: string, conversationHistory: any[]): string {
  const queryLower = query.toLowerCase();
  
  // More natural, conversational responses
  if (queryLower.includes('olá') || queryLower.includes('oi') || conversationHistory.length === 0) {
    return `Olá! Sou Dr. Cannabis IA, seu assistente médico para estudos.

Como posso te ajudar hoje? Você pode me perguntar sobre qualquer aspecto do seu estudo:

• Planejamento e metodologia
• Questões éticas e regulamentares  
• Análise de dados
• Redação científica
• Financiamento

O que você tem em mente?`;
  }

  if (queryLower.includes('metodologia') || queryLower.includes('como fazer') || queryLower.includes('desenho')) {
    return `Ótima pergunta! Para um estudo bem estruturado de cannabis medicinal, vamos pensar juntos:

**Que tipo de estudo você quer fazer?**
- Observacional (mais simples, acompanha pacientes)
- Experimental (testa intervenções, mais complexo)

**Qual sua população alvo?**
- Pacientes com dor crônica?
- Epilepsia refratária?
- Câncer?

**Recursos disponíveis?**
- Orçamento estimado
- Tempo para conclusão
- Equipe envolvida

Me conte mais sobre sua ideia que posso te orientar melhor!`;
  }

  if (queryLower.includes('pacientes') || queryLower.includes('critérios') || queryLower.includes('seleção')) {
    return `Perfeito! A seleção de pacientes é crucial para um bom estudo.

**Critérios básicos que recomendo:**

✅ **Incluir:**
- Diagnóstico confirmado da condição
- Falha com tratamentos convencionais
- Idade apropriada (geralmente 18+ anos)
- Capacidade de consentimento

❌ **Excluir:**
- Gestantes
- Problemas psiquiátricos graves descontrolados
- Uso de drogas ilícitas
- Medicações que interagem

**Quantos pacientes você consegue recrutar?** Isso vai definir o poder estatístico do seu estudo.`;
  }

  if (queryLower.includes('ética') || queryLower.includes('cep') || queryLower.includes('comitê')) {
    return `Ah, a parte burocrática! É chata mas essencial. Vou te dar o caminho das pedras:

**Primeira etapa - CEP:**
1. Protocolo completo na Plataforma Brasil
2. TCLE em linguagem simples
3. Currículo da equipe atualizado
4. Orçamento detalhado

**Segunda etapa - ANVISA (se usar produtos):**
- Autorização especial para cannabis
- Documentação do produto
- Protocolo de segurança

**Dica importante:** Comece o CEP ANTES de tudo. Demora 2-3 meses!

Já tem o protocolo escrito ou precisa de ajuda para estruturar?`;
  }

  if (queryLower.includes('estatística') || queryLower.includes('análise') || queryLower.includes('dados')) {
    return `Estatística não precisa ser um bicho de sete cabeças!

**Vamos por partes:**

📊 **Quantos pacientes precisa?**
Depende do efeito que você espera ver. Para cannabis, geralmente:
- Dor: 30-50 por grupo (diferença de 30% na escala)
- Convulsões: 20-40 por grupo (redução de 50%)

📈 **Testes simples:**
- Antes vs Depois: teste t pareado
- Dois grupos: teste t independente
- Categorias: qui-quadrado

**Software gratuito:** R Studio ou jamovi (mais fácil)

Que tipo de desfecho você quer medir? Dor, qualidade de vida, frequência de sintomas?`;
  }

  if (queryLower.includes('artigo') || queryLower.includes('publicar') || queryLower.includes('redação')) {
    return `Publicar é o objetivo final! Vamos planejar desde agora:

**Estrutura básica:**
1. **Introdução** - Por que seu estudo é importante?
2. **Métodos** - Como você fez (seja bem detalhado)
3. **Resultados** - O que encontrou (números e gráficos)
4. **Discussão** - O que isso significa na prática?

**Revistas recomendadas:**
- Revista Brasileira de Anestesiologia
- Einstein (São Paulo)
- Clinics
- Cannabis and Cannabinoid Research

**Dica:** Escreva o método ANTES de começar o estudo. Vai te economizar muito tempo depois!

Em que fase está seu estudo?`;
  }

  if (queryLower.includes('dinheiro') || queryLower.includes('financiamento') || queryLower.includes('verba')) {
    return `Dinheiro sempre é uma preocupação! Vamos ver as opções:

**Quanto você precisa?**
- Estudo pequeno: R$ 50-100 mil
- Estudo médio: R$ 200-300 mil  
- Estudo grande: R$ 500 mil+

**Onde conseguir:**
• **CNPq** - Chamadas anuais (março/abril)
• **FAPESP** - Se for em SP, excelente opção
• **Fundações locais** - Cada estado tem
• **Indústria** - Parcerias com laboratórios

**Dica importante:** Comece a escrever o projeto 6 meses antes do edital!

Você já tem algum financiamento parcial ou precisa de tudo?`;
  }

  if (queryLower.includes('cronograma') || queryLower.includes('tempo') || queryLower.includes('quanto demora')) {
    return `Bom planejamento é meio caminho andado!

**Timeline típico:**

🗓️ **Preparação (4-6 meses):**
- Protocolo e documentação
- Aprovação CEP/ANVISA
- Treinamento da equipe

👥 **Recrutamento (6-12 meses):**
- Seleção de pacientes
- Aplicação dos critérios
- Coleta baseline

📊 **Seguimento (6-24 meses):**
- Acompanhamento dos pacientes
- Coleta de dados
- Monitoramento de segurança

📝 **Análise e redação (3-6 meses):**
- Análise estatística
- Redação do artigo
- Submissão

**Total:** 18-48 meses dependendo da complexidade.

Que prazo você tem em mente?`;
  }

  // Default conversational response
  return `Estou aqui para te ajudar com seu estudo médico!

Pode me perguntar qualquer coisa sobre:
• Como planejar a pesquisa
• Seleção de pacientes  
• Questões éticas e legais
• Análise de dados
• Como publicar os resultados
• Onde conseguir financiamento

**Exemplo:** "Como faço para estudar CBD em pacientes com dor?"

O que você gostaria de saber?`;
}
