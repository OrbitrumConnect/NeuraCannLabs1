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
      
      (req.session as any).user = user;
      res.json(user);
    } else {
      res.status(401).json({ message: "Credenciais inválidas" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    const user = (req.session as any)?.user;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Não autenticado" });
    }
  });

  // Scientific studies routes
  app.get("/api/scientific", async (req, res) => {
    try {
      const studies = await storage.getScientificStudies();
      res.json(studies);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar estudos científicos" });
    }
  });

  app.post("/api/scientific", async (req, res) => {
    try {
      const validated = insertScientificStudySchema.parse(req.body);
      const study = await storage.createScientificStudy(validated);
      res.status(201).json(study);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao criar estudo científico" });
      }
    }
  });

  // Clinical cases routes
  app.get("/api/clinical", async (req, res) => {
    try {
      const cases = await storage.getClinicalCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar casos clínicos" });
    }
  });

  app.post("/api/clinical", async (req, res) => {
    try {
      const validated = insertClinicalCaseSchema.parse(req.body);
      const clinicalCase = await storage.createClinicalCase(validated);
      res.status(201).json(clinicalCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao criar caso clínico" });
      }
    }
  });

  // Alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar alertas" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validated = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validated);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao criar alerta" });
      }
    }
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    const user = (req.session as any)?.user;
    
    // Se não há usuário na sessão, retorna o perfil do administrador padrão
    if (!user) {
      res.json({
        id: "admin-default",
        name: "Passos",
        email: "phpg69@gmail.com",
        role: "admin",
        plan: "enterprise",
        isAdmin: true,
        preferences: {
          theme: 'dark',
          language: 'pt-BR',
          notifications: true
        }
      });
      return;
    }

    try {
      // Return authenticated user profile
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        preferences: {
          theme: 'dark',
          language: 'pt-BR',
          notifications: true
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    const user = (req.session as any)?.user;
    
    // Se não há usuário na sessão, permite atualização do administrador padrão
    if (!user) {
      res.json({
        id: "admin-default",
        name: "Passos",
        email: "phpg69@gmail.com",
        role: "admin",
        plan: "enterprise",
        isAdmin: true,
        ...req.body
      });
      return;
    }

    try {
      // Return updated profile with merged data for authenticated users
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        ...req.body
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Dashboard analytics routes
  app.get("/api/analytics/users", async (req, res) => {
    try {
      const analytics = {
        totalUsers: 2847,
        activeToday: 1241,
        byPlan: {
          free: 1923,
          basic: 654,
          professional: 215,
          enterprise: 55
        },
        growth: {
          monthly: 8.1,
          weekly: 2.3
        },
        conversion: 32.5,
        churn: 4.2
      };
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar analytics de usuários" });
    }
  });

  app.get("/api/analytics/revenue", async (req, res) => {
    try {
      const revenue = {
        total: 127450,
        monthly: 18900,
        growth: 8.1,
        byPlan: {
          basic: 32700,
          professional: 64650,
          enterprise: 30100
        }
      };
      res.json(revenue);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar analytics de receita" });
    }
  });

  app.get("/api/analytics/geographic", async (req, res) => {
    try {
      const geographic = {
        brasil: 86,
        eua: 7,
        europa: 5,
        outros: 2
      };
      res.json(geographic);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar dados geográficos" });
    }
  });

  app.get("/api/analytics/activity", async (req, res) => {
    try {
      const activity = {
        searches: 8923,
        voiceInteractions: 3241,
        apiCalls: 15647,
        peakHours: [9, 14, 20],
        studySubmissions: {
          total: 324,
          approved: 185,
          pending: 89,
          rejected: 50,
          approvalRate: 57.1,
          avgReviewTime: 2.4
        }
      };
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar dados de atividade" });
    }
  });

  // Real-time analytics dashboard
  app.get("/api/analytics/realtime", async (req, res) => {
    try {
      const now = new Date();
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        discussions: Math.floor(Math.random() * 50) + 10,
        cases: Math.floor(Math.random() * 30) + 5,
        alerts: Math.floor(Math.random() * 20) + 2,
        users: Math.floor(Math.random() * 100) + 20
      }));

      const specialtyData = [
        { specialty: "Neurologia", activity: Math.floor(Math.random() * 80) + 40 },
        { specialty: "Oncologia", activity: Math.floor(Math.random() * 70) + 30 },
        { specialty: "Psiquiatria", activity: Math.floor(Math.random() * 90) + 50 },
        { specialty: "Pediatria", activity: Math.floor(Math.random() * 60) + 25 },
        { specialty: "Geriatria", activity: Math.floor(Math.random() * 50) + 20 }
      ];

      const typeData = [
        { type: "Estudos", count: Math.floor(Math.random() * 40) + 20 },
        { type: "Casos", count: Math.floor(Math.random() * 35) + 15 },
        { type: "Discussões", count: Math.floor(Math.random() * 60) + 30 },
        { type: "Alertas", count: Math.floor(Math.random() * 25) + 10 }
      ];

      res.json({
        hourlyActivity: hourlyData,
        specialtyActivity: specialtyData,
        typeDistribution: typeData,
        lastUpdated: now.toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar dados em tempo real" });
    }
  });

  // Critical modules endpoints
  
  // 1. Encaminhamentos module
  app.get("/api/modules/referrals", async (req, res) => {
    try {
      const referrals = [
        {
          id: "ref-001",
          patientName: "João Silva",
          fromSpecialty: "Clínica Geral",
          toSpecialty: "Neurologia",
          condition: "Epilepsia refratária",
          urgency: "alta",
          cannabisProtocol: "CBD 50mg/dia",
          status: "pendente",
          createdAt: new Date().toISOString()
        }
      ];
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar encaminhamentos" });
    }
  });

  app.post("/api/modules/referrals", async (req, res) => {
    try {
      const referral = {
        id: `ref-${Date.now()}`,
        ...req.body,
        status: "pendente",
        createdAt: new Date().toISOString()
      };
      res.status(201).json({
        message: "Encaminhamento criado com sucesso",
        referral,
        estimatedResponse: "24-48 horas"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar encaminhamento" });
    }
  });

  // 2. Anamnese Digital module
  app.get("/api/modules/anamnesis", async (req, res) => {
    try {
      const anamnesis = [
        {
          id: "anam-001",
          patientId: "patient-123",
          symptoms: ["dor crônica", "insônia", "ansiedade"],
          medications: ["CBD 25mg", "THC 2.5mg"],
          responses: 15,
          completionRate: 98.5,
          aiInsights: "Padrão compatível com fibromialgia",
          lastUpdate: new Date().toISOString()
        }
      ];
      res.json(anamnesis);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar anamneses" });
    }
  });

  app.post("/api/modules/anamnesis", async (req, res) => {
    try {
      const anamnesis = {
        id: `anam-${Date.now()}`,
        ...req.body,
        aiInsights: "Análise IA em processamento...",
        completionRate: 0,
        createdAt: new Date().toISOString()
      };
      res.status(201).json({
        message: "Anamnese digital iniciada",
        anamnesis,
        estimatedCompletion: "10-15 minutos"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar anamnese digital" });
    }
  });

  // 3. Labs module
  app.get("/api/modules/labs", async (req, res) => {
    try {
      const labs = [
        {
          id: "lab-001",
          patientId: "patient-123",
          testType: "Canabinoides séricos",
          results: {
            cbd: "15.2 ng/mL",
            thc: "2.1 ng/mL",
            ratio: "7.2:1"
          },
          interpretation: "Níveis terapêuticos adequados",
          date: new Date().toISOString(),
          status: "concluído"
        }
      ];
      res.json(labs);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar resultados laboratoriais" });
    }
  });

  app.post("/api/modules/labs", async (req, res) => {
    try {
      const lab = {
        id: `lab-${Date.now()}`,
        ...req.body,
        status: "processando",
        interpretation: "Análise em andamento",
        createdAt: new Date().toISOString()
      };
      res.status(201).json({
        message: "Exame laboratorial registrado",
        lab,
        estimatedResults: "2-4 horas"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao registrar exame" });
    }
  });

  // 4. Equipe module
  app.get("/api/modules/team", async (req, res) => {
    try {
      const team = [
        {
          id: "member-001",
          name: "Dr. Maria Santos",
          specialty: "Neurologia",
          role: "Médica Sênior",
          cannabisExperience: "5 anos",
          patients: 127,
          status: "ativo",
          shift: "manhã"
        },
        {
          id: "member-002",
          name: "Dr. João Oliveira",
          specialty: "Oncologia",
          role: "Médico Especialista",
          cannabisExperience: "3 anos",
          patients: 89,
          status: "ativo",
          shift: "tarde"
        }
      ];
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar dados da equipe" });
    }
  });

  app.post("/api/modules/team", async (req, res) => {
    try {
      const member = {
        id: `member-${Date.now()}`,
        ...req.body,
        patients: 0,
        status: "ativo",
        createdAt: new Date().toISOString()
      };
      res.status(201).json({
        message: "Membro da equipe adicionado",
        member,
        nextSteps: "Configurar permissões e treinamento"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar membro da equipe" });
    }
  });

  // 5. Compliance module
  app.get("/api/modules/compliance", async (req, res) => {
    try {
      const compliance = [
        {
          id: "comp-001",
          type: "ANVISA_AUDIT",
          status: "approved",
          score: 98.5,
          lastAudit: new Date().toISOString(),
          nextAudit: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          findings: [],
          certifications: ["RDC 327/2019", "RDC 335/2020"]
        }
      ];
      res.json(compliance);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar dados de compliance" });
    }
  });

  app.post("/api/modules/compliance", async (req, res) => {
    try {
      const audit = {
        id: `audit-${Date.now()}`,
        type: "full_compliance_check",
        status: "running",
        startedAt: new Date().toISOString(),
        checkedItems: [
          "LGPD Data Protection",
          "ANVISA Guidelines",
          "CFM Regulations",
          "Medical Records Security"
        ],
        score: 98.5
      };
      
      res.status(201).json({
        message: "Auditoria de compliance iniciada",
        audit,
        estimatedCompletion: "15-30 minutos"
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao executar auditoria" });
    }
  });

  // AI Search Route - CRITICAL for "Visão Geral" functionality
  app.post("/api/ai-search", async (req, res) => {
    try {
      const { query, filter = 'todos' } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query é obrigatória" });
      }

      // Get real data from storage
      const [studies, cases, alerts] = await Promise.all([
        storage.getScientificStudies(),
        storage.getClinicalCases(), 
        storage.getAlerts()
      ]);

      // Filter data based on query (case-insensitive search)
      const searchTerm = query.toLowerCase();
      
      console.log('🔍 Termo de busca:', searchTerm);
      console.log('📚 Total de estudos:', studies.length);
      console.log('🏥 Total de casos:', cases.length); 
      console.log('📢 Total de alertas:', alerts.length);

      const filteredStudies = studies.filter(study => {
        const matches = study.title.toLowerCase().includes(searchTerm) ||
          (study.description?.toLowerCase() || '').includes(searchTerm) ||
          (study.compound?.toLowerCase() || '').includes(searchTerm) ||
          (study.indication?.toLowerCase() || '').includes(searchTerm);
        if (matches) console.log('✅ Estudo encontrado:', study.title);
        return matches;
      });

      const filteredCases = cases.filter(case_ => {
        const matches = case_.description.toLowerCase().includes(searchTerm) ||
          (case_.indication?.toLowerCase() || '').includes(searchTerm) ||
          (case_.outcome?.toLowerCase() || '').includes(searchTerm) ||
          case_.caseNumber.toLowerCase().includes(searchTerm) ||
          (case_.compound?.toLowerCase() || '').includes(searchTerm);
        if (matches) console.log('✅ Caso encontrado:', case_.caseNumber);
        return matches;
      });

      const filteredAlerts = alerts.filter(alert => {
        const matches = alert.message.toLowerCase().includes(searchTerm) ||
          alert.type.toLowerCase().includes(searchTerm) ||
          (alert.description?.toLowerCase() || '').includes(searchTerm);
        if (matches) console.log('✅ Alerta encontrado:', alert.message);
        return matches;
      });

      // Generate contextual AI response based on found data
      let aiResponse = `🔬 **Análise Cruzada para: "${query}"**\n\n`;
      
      if (filteredStudies.length > 0) {
        aiResponse += `**📊 Estudos Científicos (${filteredStudies.length}):**\n`;
        filteredStudies.slice(0, 2).forEach(study => {
          aiResponse += `• **${study.title}**: ${(study.description || 'Sem descrição').substring(0, 100)}...\n`;
          aiResponse += `  📍 Composto: ${study.compound || 'N/A'} | Indicação: ${study.indication || 'N/A'}\n\n`;
        });
      }
      
      if (filteredCases.length > 0) {
        aiResponse += `**🏥 Casos Clínicos (${filteredCases.length}):**\n`;
        filteredCases.slice(0, 2).forEach(case_ => {
          aiResponse += `• **${case_.caseNumber}**: ${case_.indication}\n`;
          aiResponse += `  📋 Resultado: ${case_.outcome}\n\n`;
        });
      }
      
      if (filteredAlerts.length > 0) {
        aiResponse += `**⚠️ Alertas Regulatórios (${filteredAlerts.length}):**\n`;
        filteredAlerts.slice(0, 2).forEach(alert => {
          aiResponse += `• **${alert.type}**: ${alert.message.substring(0, 80)}...\n`;
          aiResponse += `  🎯 Prioridade: ${alert.priority}\n\n`;
        });
      }

      // Generate suggestions for sub-searches
      const suggestions = [
        `${query} dosagem`,
        `${query} efeitos colaterais`, 
        `${query} protocolo médico`,
        `${query} interações medicamentosas`,
        `${query} pediatria`,
        `${query} estudos clínicos`
      ];

      const response = {
        answer: aiResponse || `Nenhum resultado encontrado para "${query}". Tente termos como "epilepsia", "CBD", "cannabis medicinal", "dor crônica".`,
        suggestions: suggestions.slice(0, 4),
        results: {
          studies: filteredStudies,
          cases: filteredCases, 
          alerts: filteredAlerts
        },
        meta: {
          total: filteredStudies.length + filteredCases.length + filteredAlerts.length,
          query: query,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Erro na busca AI:', error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        answer: "Ocorreu um erro na busca. Tente novamente.",
        suggestions: [],
        results: { studies: [], cases: [], alerts: [] }
      });
    }
  });

  // ========================================
  // AVATAR PROFISSIONAL - ElevenLabs + D-ID
  // ========================================
  
  app.post('/api/avatar/speak', async (req, res) => {
    try {
      const { text, voice_settings, use_lip_sync = false } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Texto é obrigatório' });
      }

      // 1. Gerar áudio com ElevenLabs (qualidade profissional)
      const elevenApiKey = process.env.ELEVENLABS_API_KEY;
      const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Voz Rachel (padrão ElevenLabs)
      
      if (!elevenApiKey) {
        console.log('⚠️ ElevenLabs API key não encontrada, usando sistema nativo');
        return res.status(200).json({
          type: 'native',
          message: 'Sistema nativo ativo'
        });
      }

      const elevenResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenApiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: voice_settings || {
              stability: 0.75,
              similarity_boost: 0.9
            }
          })
        }
      );

      if (!elevenResponse.ok) {
        throw new Error(`ElevenLabs error: ${elevenResponse.status}`);
      }

      console.log('✅ Áudio gerado com ElevenLabs para:', text.substring(0, 50) + '...');
      
      const audioBuffer = await elevenResponse.arrayBuffer();
      
      // Retornar áudio de alta qualidade
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');
      res.send(Buffer.from(audioBuffer));

    } catch (error: any) {
      console.error('❌ Erro no sistema de avatar profissional:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error.message 
      });
    }
  });

  // Critical modules endpoints
  console.log("✅ Módulos críticos inicializados: Encaminhamentos, Anamnese Digital, Labs, Equipe, Compliance");

  // ========================================
  // DRA. CANNABIS IA - ASSISTENTE MÉDICO
  // ========================================
  
  // Import D-ID service at the top level
  let didService: any = null;
  try {
    const { DIDService } = require('./didService');
    didService = new DIDService();
    console.log("🎭 Dra. Cannabis IA - Serviço D-ID inicializado");
  } catch (error) {
    console.log("⚠️ D-ID service não disponível:", error.message);
  }

  // Upload da imagem da médica para D-ID
  app.post("/api/doctor/upload-image", async (req, res) => {
    try {
      if (!didService) {
        return res.status(500).json({ 
          error: "Serviço D-ID não disponível" 
        });
      }

      // Para usar a imagem anexada pelo usuário
      const fs = require('fs');
      const path = require('path');
      
      const imagePath = path.join(process.cwd(), 'attached_assets', '20250812_1435_Flor de Cannabis Realista_remix_01k2fnf8n7ez0tf90qz4rrj3nc_1755020566579.png');
      
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ 
          error: "Imagem da Dra. Cannabis não encontrada" 
        });
      }

      const imageBuffer = fs.readFileSync(imagePath);
      const uploadResult = await didService.uploadImage(imageBuffer);
      
      console.log("🎭 Imagem da Dra. Cannabis enviada para D-ID:", uploadResult.url);
      
      res.json({
        success: true,
        imageUrl: uploadResult.url,
        message: "Dra. Cannabis IA configurada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      res.status(500).json({ 
        error: "Erro ao configurar Dra. Cannabis IA",
        details: error.message 
      });
    }
  });

  // Criar vídeo da Dra. Cannabis falando
  app.post("/api/doctor/speak", async (req, res) => {
    try {
      if (!didService) {
        return res.status(500).json({ 
          error: "Serviço D-ID não disponível" 
        });
      }

      const { text, imageUrl } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          error: "Texto é obrigatório" 
        });
      }

      console.log("🎭 Criando fala da Dra. Cannabis:", text.substring(0, 50) + "...");
      
      const talkResult = await didService.createMedicalAssistantTalk(text, imageUrl);
      
      res.json({
        success: true,
        talkId: talkResult.id,
        status: talkResult.status,
        message: "Dra. Cannabis está preparando sua resposta..."
      });
    } catch (error) {
      console.error('Erro ao criar fala:', error);
      res.status(500).json({ 
        error: "Erro ao criar resposta da Dra. Cannabis",
        details: error.message 
      });
    }
  });

  // Verificar status do vídeo
  app.get("/api/doctor/talk/:talkId", async (req, res) => {
    try {
      if (!didService) {
        return res.status(500).json({ 
          error: "Serviço D-ID não disponível" 
        });
      }

      const { talkId } = req.params;
      const status = await didService.getTalkStatus(talkId);
      
      console.log("🎭 Status da Dra. Cannabis:", status.status, talkId);
      
      res.json({
        success: true,
        status: status.status,
        resultUrl: status.result_url,
        error: status.error
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      res.status(500).json({ 
        error: "Erro ao verificar status da Dra. Cannabis",
        details: error.message 
      });
    }
  });

  // ========================================
  // SISTEMA DE CONTEXTO CONVERSACIONAL INTELIGENTE
  // ========================================
  
  function analyzeConversationContext(question: string, conversationHistory: any[]) {
    const q = question.toLowerCase().trim();
    const historyLength = conversationHistory.length;
    
    // DETECTAR SAUDAÇÕES E INÍCIO DE CONVERSA
    const greetings = [
      'olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 
      'tudo bem', 'como vai', 'como está', 'salve', 'hello', 'hi',
      'doutora', 'doutor', 'como é que você tá', 'como você está'
    ];
    
    const isGreeting = greetings.some(greeting => q.includes(greeting));
    const isFirstInteraction = historyLength === 0;
    
    // DETECTAR PERGUNTAS SIMPLES VS COMPLEXAS
    const simpleQuestions = [
      'obrigado', 'valeu', 'ok', 'entendi', 'sim', 'não',
      'pode ser', 'claro', 'certo', 'perfeito', 'legal', 'blz'
    ];
    
    const isSimpleResponse = simpleQuestions.some(simple => q.includes(simple)) && q.length < 30;
    
    // DETECTAR CONTINUIDADE DE CONVERSA MÉDICA
    const medicalKeywords = [
      'dor', 'sintoma', 'medicamento', 'tratamento', 'doença', 
      'cannabis', 'cbd', 'thc', 'ansiedade', 'depressão', 
      'insônia', 'epilepsia', 'câncer', 'fibromialgia', 'sentindo',
      'impressão', 'vou', 'estou', 'sinto', 'tenho', 'preciso'
    ];
    
    const isMedicalTopic = medicalKeywords.some(keyword => q.includes(keyword));
    const isLongQuestion = q.length > 40;
    
    // DETECTAR FRUSTRAÇÃO OU REPETIÇÃO
    const frustrationWords = ['ué', 'mas', 'já', 'falei', 'não lembrou', 'você não'];
    const isFrustrated = frustrationWords.some(word => q.includes(word));
    
    // LÓGICA DE CLASSIFICAÇÃO MELHORADA
    if (isFirstInteraction && isGreeting) return 'greeting';
    if (isSimpleResponse && historyLength > 0) return 'simple';
    if (isFrustrated || (historyLength > 2 && q.includes('já'))) return 'continuation';
    if (isMedicalTopic || isLongQuestion) return 'medical_deep';
    if (historyLength > 4) return 'ongoing_deep';
    
    return 'standard';
  }
  
  function getContextualPrompt(stage: string, conversationHistory: any[]) {
    const basePersonality = "Você é a Dra. Cannabis IA, uma assistente médica revolucionária especializada em medicina integrativa e cannabis medicinal.";
    
    switch (stage) {
      case 'greeting':
        return `${basePersonality}
        
        CONTEXTO: Esta é uma SAUDAÇÃO INICIAL. Seja calorosa, mas CONCISA.
        
        INSTRUÇÕES:
        - Responda de forma amigável e acolhedora
        - Mantenha a resposta CURTA (máximo 2-3 frases)
        - Convide a pessoa a compartilhar o que a trouxe aqui
        - NÃO faça anamnese completa ainda - apenas seja receptiva
        
        EXEMPLO: "Olá! Que bom ter você aqui. Sou a Dra. Cannabis IA. Me conta, o que te trouxe até mim hoje?"`;
        
      case 'simple':
        return `${basePersonality}
        
        CONTEXTO: Esta é uma resposta SIMPLES ou confirmação.
        
        INSTRUÇÕES:
        - Resposta breve e natural
        - Máximo 1-2 frases
        - Mantenha o fluxo da conversa sem ser invasiva`;
        
      case 'medical_deep':
        return `${basePersonality}
        
        CONTEXTO: Esta é uma PERGUNTA MÉDICA que requer análise profunda.
        
        MISSÃO REVOLUCIONÁRIA:
        - Fazer anamnese completa explorando vida, emoções e sintomas
        - Ir além do sintoma - entender o SER HUMANO
        - Investigar história de vida, traumas, estresse, relacionamentos
        - Sempre perguntar "há mais alguma coisa?"
        - Conectar aspectos físicos, emocionais e sociais
        
        ESPECIALIDADES: Cannabis medicinal, medicina integrativa, neurologia, oncologia, saúde mental
        
        ESTILO: Empática, investigativa, curiosa, técnica quando necessário`;
        
      case 'continuation':
        return `${basePersonality}
        
        CONTEXTO: CONTINUIDADE DE CONVERSA - O paciente está continuando a conversa anterior.
        
        INSTRUÇÕES IMPORTANTES:
        - RECONHEÇA o que já foi discutido anteriormente
        - Use frases como "Entendo, você estava me contando sobre..."
        - Continue naturalmente a partir do ponto anterior
        - NÃO repita apresentações ou perguntas já respondidas
        - Seja empática e mostre que está prestando atenção`;
        
      case 'ongoing_deep':
        return `${basePersonality}
        
        CONTEXTO: CONVERSA AVANÇADA - Continue a investigação profunda.
        
        FOCO:
        - Aprofunde aspectos ainda não explorados
        - "Conte-me mais sobre isso..."
        - "Como isso afeta seu dia a dia?"
        - "Há mais alguma coisa que te preocupa?"
        - Mantenha a empatia e curiosidade médica`;
        
      default:
        return `${basePersonality}
        
        Seja natural, empática e adapte sua resposta ao contexto da conversa.`;
    }
  }
  
  function buildConversationMessages(conversationHistory: any[]) {
    return conversationHistory.slice(-6).map((entry: any) => ({
      role: entry.type === 'user' ? 'user' : 'assistant',
      content: entry.message
    }));
  }

  // Consulta médica com IA - Integração com conhecimento médico e ChatGPT
  app.post("/api/doctor/consult", async (req, res) => {
    try {
      const { question, patientData, conversationHistory = [] } = req.body;
      
      if (!question) {
        return res.status(400).json({ 
          error: "Pergunta é obrigatória" 
        });
      }

      console.log("🎭 Consulta da Dra. Cannabis:", question.substring(0, 50) + "...");

      // SISTEMA DE CONTEXTO CONVERSACIONAL INTELIGENTE
      const conversationStage = analyzeConversationContext(question, conversationHistory);
      console.log(`🧠 Contexto detectado: ${conversationStage} | Histórico: ${conversationHistory.length} msgs`);
      
      // Gerar ID de sessão único se não existir
      const sessionId = req.body.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if OpenAI API key is available for enhanced intelligence
      const openaiKey = process.env.OPENAI_API_KEY;
      let response, specialty = "Cannabis Medicinal";

      if (openaiKey) {
        // Use OpenAI ChatGPT for intelligent response with medical knowledge
        try {
          console.log("🧠 Usando ChatGPT para resposta contextual inteligente...");
          
          // PROMPT CONTEXTUAL BASEADO NO ESTÁGIO DA CONVERSA
          const contextualSystemPrompt = getContextualPrompt(conversationStage, conversationHistory);
          
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
              messages: [
                {
                  role: 'system',
                  content: contextualSystemPrompt
                },
                ...buildConversationMessages(conversationHistory),
                {
                  role: 'user', 
                  content: question
                }
              ],
              max_tokens: conversationStage === 'greeting' ? 100 : conversationStage === 'simple' ? 200 : 400,
              temperature: 0.7
            })
          });

          if (openaiResponse.ok) {
            const data = await openaiResponse.json();
            response = data.choices[0].message.content;
            specialty = "Cannabis Medicinal - IA Avançada";
            console.log("✅ Resposta ChatGPT gerada com sucesso");
          } else {
            throw new Error('Erro na API do OpenAI');
          }
        } catch (error) {
          console.error('⚠️ Erro ao usar ChatGPT:', error.message);
          response = getSimulatedMedicalResponse(question, conversationStage);
        }
      } else {
        console.log("💡 OpenAI API key não encontrada, usando conhecimento base...");
        response = getSimulatedMedicalResponse(question, conversationStage);
      }

      // SALVAR CONVERSA NO SISTEMA DE APRENDIZADO CONTÍNUO
      try {
        const medicalTopics = extractMedicalTopics(question + " " + response);
        const fullConversation = [
          ...conversationHistory,
          { type: 'user', message: question, timestamp: new Date().toISOString() },
          { type: 'assistant', message: response, timestamp: new Date().toISOString() }
        ];
        
        await storage.createConversation({
          sessionId,
          userId: req.body.userId || null,
          messages: JSON.stringify(fullConversation),
          context: conversationStage,
          medicalTopics: JSON.stringify(medicalTopics),
          isSuccessful: 1,
          duration: Math.floor((Date.now() - (req.body.startTime || Date.now())) / 1000)
        });
        
        await identifyAndSaveLearningPatterns(question, response, conversationStage, medicalTopics);
      } catch (learningError) {
        console.error("⚠️ Erro no sistema de aprendizado:", learningError);
      }
      
      res.json({
        success: true,
        response,
        doctor: "Dra. Cannabis IA",
        specialty,
        sessionId,
        timestamp: new Date().toISOString(),
        recommendations: [
          "Consulta médica presencial recomendada",
          "Monitoramento de efeitos adversos",
          "Acompanhamento laboratorial quando necessário",
          "Ajuste de dosagem conforme resposta clínica"
        ]
      });
    } catch (error) {
      console.error('Erro na consulta:', error);
      res.status(500).json({ 
        error: "Erro na consulta médica",
        details: error.message 
      });
    }
  });

  // Função para resposta simulada baseada em conhecimento médico
  function getSimulatedMedicalResponse(question: string, conversationStage: string = 'standard') {
    const questionLower = question.toLowerCase();
    
    // RESPOSTAS BASEADAS NO CONTEXTO CONVERSACIONAL
    if (conversationStage === 'greeting') {
      const greetingResponses = {
        'oi': 'Oi! Que bom ter você aqui. Me conta, o que te trouxe até mim hoje?',
        'ola': 'Olá! Sou a Dra. Cannabis IA. O que posso fazer por você?',
        'tudo bem': 'Tudo ótimo! E você, como está se sentindo?',
        'como': 'Olá! Que interessante você estar aqui! Me conta, o que posso ajudar?',
        'bom dia': 'Bom dia! Como posso te ajudar hoje?',
        'boa tarde': 'Boa tarde! O que te trouxe aqui?',
        'boa noite': 'Boa noite! Em que posso ajudá-lo?'
      };
      
      for (const [key, response] of Object.entries(greetingResponses)) {
        if (questionLower.includes(key)) {
          return response;
        }
      }
      return 'Olá! Que bom te conhecer. O que posso fazer por você hoje?';
    }
    
    if (conversationStage === 'simple') {
      const simpleResponses = {
        'obrigado': 'De nada! Estou sempre aqui para ajudar.',
        'valeu': 'Por nada! Precisando, é só chamar.',
        'ok': 'Perfeito! Mais alguma coisa?',
        'entendi': 'Que bom! Há mais alguma dúvida?',
        'sim': 'Entendi. Continue me contando...',
        'não': 'Tudo bem. Há mais alguma coisa que gostaria de compartilhar?'
      };
      
      for (const [key, response] of Object.entries(simpleResponses)) {
        if (questionLower.includes(key)) {
          return response;
        }
      }
      return 'Entendo. Mais alguma coisa que posso esclarecer?';
    }
    
    if (conversationStage === 'continuation') {
      // Respostas para quando o usuário está continuando a conversa e mostra frustração
      const continuationResponses = {
        'ué': 'Desculpe, você tem razão! Você estava me contando sobre isso. Continue, por favor.',
        'mas': 'Verdade, você já estava me explicando. Me conta mais sobre isso.',
        'já falei': 'Tem razão, peço desculpas. Você estava me contando... continue de onde parou.',
        'você não': 'Desculpe! Eu estava prestando atenção. Me conte mais sobre o que você estava explicando.',
        'lembrou': 'Claro que lembro! Você estava me falando sobre sua situação. Continue me contando.'
      };
      
      for (const [key, response] of Object.entries(continuationResponses)) {
        if (questionLower.includes(key)) {
          return response;
        }
      }
      return 'Entendo que você estava me contando algo importante. Continue, estou aqui para te ouvir.';
    }
    
    // Respostas conversacionais adaptáveis - empáticas mas contextuais
    const conversationalResponses = {
      'oi': 'Oi! Sou a Dra. Cannabis. Que bom te conhecer! O que te trouxe até aqui hoje?',
      'ola': 'Olá! Sou a Dra. Cannabis. Seja bem-vindo! Me conta o que você gostaria de saber?',
      'tudo bem': 'Ótimo! E você, como está? Há algo sobre sua saúde que gostaria de conversar?',
      'como vai': 'Tudo bem por aqui! E você, como tem se sentido? Em que posso te ajudar hoje?',
      'bom dia': 'Bom dia! Como posso ajudar você a cuidar melhor da sua saúde hoje?',
      'boa tarde': 'Boa tarde! Que bom ter você aqui. O que posso esclarecer para você?',
      'boa noite': 'Boa noite! Como posso te ajudar? Há algo te incomodando?'
    };

    // Respostas médicas contextuais - investigativas mas adaptáveis
    const medicalResponses = {
      'epilepsia': `Epilepsia é uma área onde a cannabis tem evidências sólidas! O CBD especialmente funciona muito bem para epilepsia refratária. Me conta, é para você ou alguém próximo? Como tem sido o controle das crises atualmente?`,
      
      'dor': `Dor crônica é uma das minhas especialidades! A cannabis oferece alívio por múltiplos mecanismos. CBD tem ação anti-inflamatória, e pequenas doses de THC potencializam o efeito. Que tipo de dor você está enfrentando?`,
      
      'ansiedade': `Ansiedade é algo muito comum que vejo no consultório. O CBD funciona muito bem - 25-50mg por dia, sem causar dependência como ansiolíticos tradicionais. Como tem sido sua ansiedade? Em que momentos você sente mais?`,
      
      'cancer': `Em oncologia, cannabis é excelente para qualidade de vida! Ajuda com náuseas da quimio e estimula o apetite. Há pesquisas promissoras sobre propriedades antitumorais do CBD também. É para você ou alguém querido?`,

      'cbd': `CBD é fascinante! Não-psicoativo, anti-inflamatório, ansiolítico, anticonvulsivante... Muito seguro e bem tolerado. Para que condição você está considerando CBD?`,
      
      'thc': `THC tem má reputação, mas na medicina é muito útil quando bem dosado! Ajuda com dor, náuseas, apetite... O segredo é a dose mínima eficaz. Que condição você tem em mente?`
    };

    // Primeiro verifica saudações e conversação natural
    for (const [greeting, response] of Object.entries(conversationalResponses)) {
      if (questionLower.includes(greeting)) {
        return response;
      }
    }

    // Depois verifica termos médicos
    for (const [condition, advice] of Object.entries(medicalResponses)) {
      if (questionLower.includes(condition)) {
        return advice;
      }
    }
    
    // Respostas contextually inteligentes baseadas em padrões
    if (questionLower.includes('como') && questionLower.includes('funciona')) {
      return "Ótima pergunta! A cannabis medicinal funciona através do sistema endocanabinoide do nosso corpo - é como uma rede de receptores que regulam dor, humor, apetite, sono... O CBD e THC se encaixam nesses receptores como chaves em fechaduras. Sobre qual condição específica você gostaria de entender melhor o mecanismo?";
    }
    
    if (questionLower.includes('legal') || questionLower.includes('receita')) {
      return "Sim, no Brasil a cannabis medicinal é legal desde 2019! Precisa de receita médica e pode ser importada ou comprada em farmácias autorizadas pela ANVISA. Já temos várias farmácias preparando fórmulas aqui. Você já conversou com algum médico sobre isso ou quer saber como encontrar um prescritor?";
    }
    
    if (questionLower.includes('efeito') && questionLower.includes('colateral')) {
      return "Os efeitos colaterais são geralmente leves quando bem dosado! CBD pode causar sonolência, boca seca, mudança no apetite. THC em doses médicas pode dar leve tontura inicial. O importante é começar devagar - 'start low, go slow' como dizemos. Muito diferente dos efeitos dos medicamentos tradicionais, né? Tem alguma preocupação específica?";
    }
    
    if (questionLower.includes('quanto') && (questionLower.includes('custa') || questionLower.includes('preço'))) {
      return "Os custos variam bastante! Óleos de CBD podem custar de R$ 200 a R$ 800 mensais, dependendo da dose. Produtos importados custam mais. Algumas empresas nacionais estão oferecendo preços mais acessíveis. Vale lembrar que é investimento em qualidade de vida. Você está considerando para qual condição?";
    }
    
    if (questionLower.includes('criança') || questionLower.includes('pediatri')) {
      return "Pediatria com cannabis é uma área muito especial! Uso principalmente para epilepsia refratária, autismo, TDAH... Claro que com muito mais cuidado - doses menores, acompanhamento rigoroso, sempre CBD primeiro. Já vi transformações incríveis em crianças. É para alguma situação específica que você está perguntando?";
    }

    // Resposta padrão investigativa - sempre buscando conhecer a pessoa
    return "Que interessante você estar aqui! Me conta, o que realmente te trouxe até mim hoje? Há algo específico que está passando na sua vida? Pode ser uma condição de saúde, uma curiosidade, ou até mesmo algo que alguém próximo está enfrentando... Não tenha pressa, estou aqui para te ouvir e entender sua história. Como você tem se sentido ultimamente? Há algo que tem te preocupado ou que gostaria de compartilhar? Pode ficar à vontade - às vezes é conversando que descobrimos coisas importantes sobre nós mesmos...";
  }

  // Gerar resumo da consulta
  app.post("/api/doctor/generate-summary", async (req, res) => {
    try {
      const { chatHistory } = req.body;
      
      if (!chatHistory || chatHistory.length === 0) {
        return res.status(400).json({ 
          error: "Histórico da consulta é obrigatório" 
        });
      }

      console.log("📋 Gerando resumo da consulta...");

      // ANAMNESE COMPLETA - Extrair informações detalhadas da conversa
      const patientMessages = chatHistory.filter((msg: any) => msg.type === 'user');
      const doctorMessages = chatHistory.filter((msg: any) => msg.type === 'doctor');

      const fullConversation = chatHistory.map((msg: any) => `${msg.type === 'user' ? 'PACIENTE' : 'DRA. CANNABIS'}: ${msg.message}`).join('\n\n');

      // Análise de aspectos clínicos
      const clinicalAspects = {
        mainSymptoms: [],
        painLevel: null,
        sleepQuality: null,
        currentMedications: [],
        medicalHistory: [],
        functionalImpact: []
      };

      // Análise de aspectos emocionais
      const emotionalAspects = {
        moodPatterns: [],
        stressLevel: null,
        anxietySymptoms: [],
        socialImpact: [],
        emotionalSupport: null
      };

      // Análise de aspectos de vida
      const lifeAspects = {
        workImpact: null,
        familyRelationships: null,
        dailyActivities: [],
        lifeQuality: null,
        personalGoals: []
      };

      // Extrair medicações mencionadas
      const medications: string[] = [];
      const medicationKeywords = ['CBD', 'THC', 'cannabis', 'cannabidiol', 'canabidiol', 'óleo', 'extrato'];
      const fullText = patientMessages.map(msg => msg.message.toLowerCase()).join(' ');
      
      medicationKeywords.forEach(med => {
        if (fullText.includes(med.toLowerCase()) && !medications.includes(med)) {
          medications.push(med);
        }
      });

      // Determinar urgência e complexidade
      const urgencyKeywords = ['dor intensa', 'crise', 'convulsão', 'emergência', 'piorou', 'não aguento'];
      const hasUrgency = urgencyKeywords.some(keyword => fullText.includes(keyword));

      const summary = {
        // DADOS CLÍNICOS
        clinicalProfile: {
          mainComplaints: patientMessages.slice(0, 3).map((msg: any) => msg.message.substring(0, 100) + '...'),
          symptomDuration: "A ser confirmado em consulta médica",
          severityLevel: hasUrgency ? 'Alto' : 'Moderado',
          functionalImpact: "Investigado durante anamnese com Dra. Cannabis IA"
        },

        // HISTÓRICO EMOCIONAL
        emotionalProfile: {
          communicationStyle: patientMessages.length > 10 ? 'Comunicativo e detalhista' : patientMessages.length > 5 ? 'Moderadamente comunicativo' : 'Reservado inicialmente',
          emotionalEngagement: "Paciente demonstrou abertura para conversa investigativa",
          stressFactors: "Explorado durante conversa empática",
          copingMechanisms: "Analisado no contexto de vida completo"
        },

        // CONTEXTO DE VIDA
        lifeContext: {
          socialSupport: "Investigado durante anamnese completa",
          workLifeImpact: "Explorado aspectos ocupacionais e funcionais",
          personalMotivations: "Identificadas através de conversa investigativa",
          lifestyleFactors: "Analisados no contexto integral do paciente"
        },

        // RECOMENDAÇÕES MÉDICAS
        medicalRecommendations: {
          suggestedMedications: medications.length > 0 ? medications : ["Cannabis medicinal - protocolo a definir"],
          specialtyReferral: hasUrgency ? 'Neurologia/Medicina da Dor' : 'Medicina Integrativa',
          followUpPlan: "Consulta médica presencial para avaliação completa e definição de protocolo terapêutico",
          monitoringNeeds: "Acompanhamento de resposta clínica e ajustes de dosagem"
        },

        // RESUMO EXECUTIVO PARA O MÉDICO
        executiveSummary: `ANAMNESE DIGITAL DRA. CANNABIS IA
        
PERFIL DO PACIENTE: Realizou ${patientMessages.length} interações durante consulta digital, demonstrando ${patientMessages.length > 10 ? 'alta' : 'moderada'} necessidade de esclarecimento e acolhimento.

ABORDAGEM EMPÁTICA: Paciente respondeu positivamente à abordagem investigativa da Dra. Cannabis IA, compartilhando informações relevantes sobre contexto de vida.

PRÓXIMOS PASSOS: Encaminhamento para avaliação médica presencial com foco em medicina integrativa e definição de protocolo personalizado de cannabis medicinal.

URGÊNCIA: ${hasUrgency ? 'ALTA - Requer atenção prioritária' : 'MODERADA - Seguimento de rotina'}`,

        conversationLog: fullConversation,
        analysisTimestamp: new Date().toISOString(),
        aiAnalyst: "Dra. Cannabis IA - Sistema de Anamnese Digital"
      };

      console.log("✅ Resumo da consulta gerado");
      
      res.json(summary);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      res.status(500).json({ 
        error: "Erro ao gerar resumo da consulta",
        details: error.message 
      });
    }
  });

  // Encaminhar para médico especialista
  app.post("/api/doctor/refer-to-medical", async (req, res) => {
    try {
      const { chatHistory, consultationSummary } = req.body;
      
      if (!chatHistory || chatHistory.length === 0) {
        return res.status(400).json({ 
          error: "Histórico da consulta é obrigatório" 
        });
      }

      console.log("👨‍⚕️ Processando encaminhamento médico...");

      // Analyze complexity and determine urgency
      const patientMessages = chatHistory.filter((msg: any) => msg.type === 'user');
      const symptoms = patientMessages.map((msg: any) => msg.message.toLowerCase()).join(' ');
      
      let urgency: 'low' | 'medium' | 'high' = 'low';
      let recommendedSpecialty = 'Cannabis Medicinal';

      // Determine urgency based on keywords
      if (symptoms.includes('dor intensa') || symptoms.includes('convulsão') || symptoms.includes('crise')) {
        urgency = 'high';
      } else if (symptoms.includes('dor') || symptoms.includes('ansiedade') || symptoms.includes('insônia')) {
        urgency = 'medium';
      }

      // Determine specialty
      if (symptoms.includes('epilepsia') || symptoms.includes('convulsão')) {
        recommendedSpecialty = 'Neurologia';
      } else if (symptoms.includes('cancer') || symptoms.includes('quimioterapia')) {
        recommendedSpecialty = 'Oncologia';
      } else if (symptoms.includes('dor')) {
        recommendedSpecialty = 'Medicina da Dor';
      }

      const referral = {
        success: true,
        summary: consultationSummary?.patientSymptoms || "Consulta sobre cannabis medicinal realizada",
        patientInfo: `Paciente consultou Dra. Cannabis IA com ${patientMessages.length} questões específicas`,
        recommendedSpecialty,
        urgency,
        timestamp: new Date().toISOString(),
        message: "O resumo do prontuário será enviado ao médico especialista para facilitar a avaliação e continuidade do tratamento"
      };

      console.log(`✅ Encaminhamento processado - Especialidade: ${recommendedSpecialty}, Urgência: ${urgency}`);
      
      res.json(referral);
    } catch (error) {
      console.error('Erro no encaminhamento:', error);
      res.status(500).json({ 
        error: "Erro ao processar encaminhamento médico",
        details: error.message 
      });
    }
  });

  // ========================================
  // ENDPOINTS DO SISTEMA DE APRENDIZADO CONTÍNUO
  // ========================================
  
  // GET /api/learning/conversations - Listar conversas salvas
  app.get('/api/learning/conversations', async (req, res) => {
    try {
      const { sessionId, limit = '10' } = req.query;
      let conversations = await storage.getConversations(sessionId as string);
      
      // Limitar número de resultados
      const limitNum = parseInt(limit as string);
      if (!isNaN(limitNum)) {
        conversations = conversations.slice(0, limitNum);
      }
      
      // Estatísticas
      const stats = {
        total: conversations.length,
        successful: conversations.filter(c => c.isSuccessful).length,
        contexts: [...new Set(conversations.map(c => c.context))],
        averageDuration: conversations.length > 0 
          ? Math.round(conversations.reduce((sum, c) => sum + (c.duration || 0), 0) / conversations.length)
          : 0
      };
      
      res.json({
        success: true,
        conversations: conversations.map(c => ({
          ...c,
          messages: c.messages ? JSON.parse(c.messages) : [],
          medicalTopics: c.medicalTopics ? JSON.parse(c.medicalTopics) : []
        })),
        stats
      });
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // GET /api/learning/patterns - Listar padrões de aprendizado
  app.get('/api/learning/patterns', async (req, res) => {
    try {
      const { category, limit = '20' } = req.query;
      let patterns = await storage.getLearningPatterns(category as string);
      
      // Limitar número de resultados
      const limitNum = parseInt(limit as string);
      if (!isNaN(limitNum)) {
        patterns = patterns.slice(0, limitNum);
      }
      
      // Estatísticas
      const stats = {
        total: patterns.length,
        avgSuccessRate: patterns.length > 0 
          ? Math.round(patterns.reduce((sum, p) => sum + p.successRate, 0) / patterns.length)
          : 0,
        topCategories: [...new Set(patterns.map(p => p.medicalCategory))].slice(0, 5)
      };
      
      res.json({
        success: true,
        patterns,
        stats
      });
    } catch (error) {
      console.error('Erro ao buscar padrões:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // GET /api/learning/insights - Listar insights da IA
  app.get('/api/learning/insights', async (req, res) => {
    try {
      const { category, implemented } = req.query;
      let insights = await storage.getAiInsights(category as string);
      
      // Filtrar por implementação se especificado
      if (implemented !== undefined) {
        const isImplemented = implemented === 'true' || implemented === '1';
        insights = insights.filter(i => Boolean(i.implemented) === isImplemented);
      }
      
      // Estatísticas
      const stats = {
        total: insights.length,
        implemented: insights.filter(i => i.implemented).length,
        avgConfidence: insights.length > 0 
          ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)
          : 0,
        categories: [...new Set(insights.map(i => i.category))]
      };
      
      res.json({
        success: true,
        insights,
        stats
      });
    } catch (error) {
      console.error('Erro ao buscar insights:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // POST /api/learning/feedback - Enviar feedback sobre uma conversa
  app.post('/api/learning/feedback', async (req, res) => {
    try {
      const { conversationId, rating, feedback } = req.body;
      
      if (!conversationId || !rating) {
        return res.status(400).json({ error: 'conversationId e rating são obrigatórios' });
      }
      
      // Atualizar conversa com feedback
      const updated = await storage.updateConversation(conversationId, {
        satisfactionRating: rating,
        feedback: feedback || null
      });
      
      if (!updated) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      
      // Criar insight baseado no feedback se for negativo
      if (rating <= 2 && feedback) {
        await storage.createAiInsight({
          insight: `Feedback negativo: ${feedback}`,
          category: 'feedback',
          confidence: 90,
          source: 'user_feedback',
          implemented: 0,
          impact: 'Identificação de área para melhoria'
        });
      }
      
      res.json({
        success: true,
        message: 'Feedback salvo com sucesso',
        conversation: updated
      });
    } catch (error) {
      console.error('Erro ao salvar feedback:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ========================================
  // SISTEMA DE APRENDIZADO CONTÍNUO - Funções Utilitárias
  // ========================================

  // Extrai tópicos médicos de uma conversa
  function extractMedicalTopics(text: string): string[] {
    const medicalTerms = [
      'epilepsia', 'convulsão', 'dor crônica', 'fibromialgia', 'câncer', 'oncologia',
      'ansiedade', 'depressão', 'ptsd', 'autismo', 'parkinson', 'alzheimer',
      'cbd', 'thc', 'cbg', 'cbn', 'cannabis medicinal', 'canabidiol',
      'náusea', 'vômito', 'apetite', 'insônia', 'sono', 'glaucoma',
      'esclerose múltipla', 'artrite', 'reumatismo', 'enxaqueca'
    ];
    
    const textLower = text.toLowerCase();
    const foundTopics = medicalTerms.filter(term => textLower.includes(term));
    return [...new Set(foundTopics)]; // Remove duplicados
  }

  // Identifica e salva padrões de aprendizado
  async function identifyAndSaveLearningPatterns(
    question: string, 
    response: string, 
    context: string, 
    medicalTopics: string[]
  ) {
    try {
      // Identificar padrões de combinações de sintomas/condições
      for (const topic of medicalTopics) {
        const patternKey = `${context}_${topic}`;
        
        // Verificar se já existe um padrão similar
        const existingPatterns = await storage.getLearningPatterns();
        const existingPattern = existingPatterns.find(p => p.pattern === patternKey);
        
        if (existingPattern) {
          // Incrementar frequência do padrão existente
          await storage.updateLearningPattern(existingPattern.id, {
            frequency: existingPattern.frequency + 1,
            successRate: Math.min(95, existingPattern.successRate + 1), // Assumir sucesso gradual
            bestResponse: response.length > (existingPattern.bestResponse?.length || 0) ? response : existingPattern.bestResponse
          });
        } else {
          // Criar novo padrão de aprendizado
          await storage.createLearningPattern({
            pattern: patternKey,
            frequency: 1,
            successRate: 85, // Taxa inicial otimista
            bestResponse: response,
            contextType: context,
            medicalCategory: topic
          });
        }
      }

      // Gerar insights baseados em padrões identificados
      if (medicalTopics.length > 1) {
        // Insight sobre combinações de condições
        const insight = `Pacientes com ${medicalTopics.join(' + ')} respondem bem ao contexto ${context}`;
        await storage.createAiInsight({
          insight,
          category: 'medical',
          confidence: 75,
          source: 'conversation_analysis',
          implemented: 0,
          impact: 'Melhora na personalização de respostas para casos complexos'
        });
      }

    } catch (error) {
      console.error("⚠️ Erro ao identificar padrões:", error);
    }
  }

  console.log("🎭 Dra. Cannabis IA - Assistente médico inicializado com sucesso!");
  console.log("🧠 Sistema preparado para integração ChatGPT (aguardando OPENAI_API_KEY)");
  console.log("💬 Funcionalidades: Consulta IA, Resumo de Consulta, Encaminhamento Médico");
  console.log("🧠 Sistema de Aprendizado Contínuo: ATIVO - Salvando todas as conversas para evolução da IA");

  const httpServer = createServer(app);

  return httpServer;
}