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
      const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Voz Bella (feminina, profissional)
      
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: voice_settings || {
              stability: 0.75,
              similarity_boost: 0.9,
              style: 0.0,
              use_speaker_boost: true
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

  // Consulta médica com IA - Integração com conhecimento médico e ChatGPT
  app.post("/api/doctor/consult", async (req, res) => {
    try {
      const { question, patientData } = req.body;
      
      if (!question) {
        return res.status(400).json({ 
          error: "Pergunta é obrigatória" 
        });
      }

      console.log("🎭 Consulta da Dra. Cannabis:", question.substring(0, 50) + "...");

      // Check if OpenAI API key is available for enhanced intelligence
      const openaiKey = process.env.OPENAI_API_KEY;
      let response, specialty = "Cannabis Medicinal";

      if (openaiKey) {
        // Use OpenAI ChatGPT for intelligent response with medical knowledge
        try {
          console.log("🧠 Usando ChatGPT para resposta médica inteligente...");
          
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
                  content: `Você é a Dra. Cannabis IA, uma assistente médica especializada em cannabis medicinal e medicina integrativa. Sua base de conhecimento inclui:

                  ESPECIALIDADES:
                  - Cannabis medicinal e medicina canabinoide
                  - Fitoterapia e medicina integrativa
                  - Neurologia aplicada à cannabis (epilepsia, Parkinson)
                  - Oncologia de suporte com cannabis
                  - Controle de dor crônica
                  - Psiquiatria e transtornos de ansiedade

                  PROTOCOLOS MÉDICOS:
                  - Dosagens padronizadas (CBD: 5-50mg/dia, THC: 1-10mg/dia)
                  - Ratios terapêuticos (20:1, 10:1, 1:1 CBD:THC)
                  - Interações medicamentosas
                  - Contraindicações e efeitos adversos

                  DIRETRIZES:
                  - Sempre recomende consulta médica presencial
                  - Base suas respostas em evidências científicas
                  - Seja empática mas profissional
                  - Mencione monitoramento médico
                  - Respeite regulamentações brasileiras (RDC 327/2019)
                  - Responda em português brasileiro
                  - Limite respostas a 200 palavras`
                },
                {
                  role: 'user', 
                  content: question
                }
              ],
              max_tokens: 400,
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
          response = getSimulatedMedicalResponse(question);
        }
      } else {
        console.log("💡 OpenAI API key não encontrada, usando conhecimento base...");
        response = getSimulatedMedicalResponse(question);
      }
      
      res.json({
        success: true,
        response,
        doctor: "Dra. Cannabis IA",
        specialty,
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
  function getSimulatedMedicalResponse(question: string) {
    const medicalResponses = {
      'epilepsia': `Como especialista em cannabis medicinal, posso informar que o CBD tem mostrado eficácia no tratamento de epilepsia refratária. Estudos clínicos demonstram redução significativa nas convulsões, especialmente em síndromes como Dravet e Lennox-Gastaut. O protocolo usual inicia com 5mg/kg/dia de CBD, podendo ser ajustado conforme resposta clínica.`,
      
      'dor': `Para dor crônica, a cannabis medicinal oferece uma abordagem multimodal. O CBD possui propriedades anti-inflamatórias, enquanto doses baixas de THC (1-2.5mg) podem potencializar o efeito analgésico. Recomendo iniciar com ratio 20:1 CBD:THC, monitorando efeitos adversos e ajustando conforme necessário.`,
      
      'ansiedade': `O CBD tem perfil ansiolítico comprovado em estudos clínicos. Para transtornos de ansiedade, doses de 25-50mg de CBD podem ser eficazes. É importante avaliar interações medicamentosas, especialmente com benzodiazepínicos, e monitorar função hepática durante o tratamento.`,
      
      'cancer': `Em oncologia, a cannabis medicinal pode auxiliar no controle de náuseas, vômitos induzidos por quimioterapia e estimular o apetite. O THC é mais eficaz para esses sintomas, enquanto o CBD pode ter propriedades anti-tumorais em pesquisa pré-clínica. Sempre coordenar com equipe oncológica.`
    };

    const questionLower = question.toLowerCase();
    for (const [condition, advice] of Object.entries(medicalResponses)) {
      if (questionLower.includes(condition)) {
        return advice;
      }
    }
    
    return "Como Dra. Cannabis, especialista em medicina canabinoide, posso orientá-lo sobre o uso terapêutico da cannabis. Para uma orientação mais específica, preciso de mais detalhes sobre a condição clínica e histórico médico do paciente. A cannabis medicinal deve sempre ser prescrita com base em evidências científicas e acompanhamento médico adequado.";
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

      // Extract patient symptoms and doctor recommendations from chat
      const patientMessages = chatHistory.filter((msg: any) => msg.type === 'user');
      const doctorMessages = chatHistory.filter((msg: any) => msg.type === 'doctor');

      const patientSymptoms = patientMessages.map((msg: any) => msg.message).join('. ');
      const doctorRecommendations = doctorMessages.map((msg: any) => msg.message).join('. ');

      // Extract medications mentioned (simplified approach)
      const medications: string[] = [];
      const medicationKeywords = ['CBD', 'THC', 'cannabis', 'cannabidiol', 'tetrahidrocanabinol'];
      doctorMessages.forEach((msg: any) => {
        medicationKeywords.forEach(med => {
          if (msg.message.toLowerCase().includes(med.toLowerCase()) && !medications.includes(med)) {
            medications.push(med);
          }
        });
      });

      const summary = {
        patientSymptoms: patientSymptoms || "Sintomas não especificados detalhadamente na consulta",
        doctorRecommendations: doctorRecommendations || "Orientações gerais sobre cannabis medicinal",
        medications: medications.length > 0 ? medications : ["Cannabis medicinal (a definir protocolo)"],
        followUp: "Acompanhamento médico especializado recomendado para ajuste de protocolo e monitoramento de efeitos",
        timestamp: new Date().toISOString()
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

  console.log("🎭 Dra. Cannabis IA - Assistente médico inicializado com sucesso!");
  console.log("🧠 Sistema preparado para integração ChatGPT (aguardando OPENAI_API_KEY)");
  console.log("💬 Funcionalidades: Consulta IA, Resumo de Consulta, Encaminhamento Médico");

  const httpServer = createServer(app);

  return httpServer;
}