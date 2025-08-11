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
    if (!user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    try {
      // Return default profile since storage method not implemented yet
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
    if (!user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    try {
      // Return updated profile with merged data (storage method not implemented yet)
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
      
      const filteredStudies = studies.filter(study => 
        study.title.toLowerCase().includes(searchTerm) ||
        (study.description?.toLowerCase() || '').includes(searchTerm) ||
        (study.compound?.toLowerCase() || '').includes(searchTerm) ||
        (study.indication?.toLowerCase() || '').includes(searchTerm)
      );

      const filteredCases = cases.filter(case_ => 
        case_.description.toLowerCase().includes(searchTerm) ||
        (case_.indication?.toLowerCase() || '').includes(searchTerm) ||
        (case_.outcome?.toLowerCase() || '').includes(searchTerm)
      );

      const filteredAlerts = alerts.filter(alert => 
        alert.message.toLowerCase().includes(searchTerm) ||
        alert.type.toLowerCase().includes(searchTerm)
      );

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

  // Critical modules endpoints
  console.log("✅ Módulos críticos inicializados: Encaminhamentos, Anamnese Digital, Labs, Equipe, Compliance");

  const httpServer = createServer(app);

  return httpServer;
}