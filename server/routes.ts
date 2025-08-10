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
        role: 'admin'
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

  // AI Search endpoint
  app.post("/api/ai-search", async (req, res) => {
    try {
      const { query } = req.body;
      
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
      
      // Analyze query and generate response
      const result = MedicalAISearch.analyzeQuery(query, studies, cases, alerts);
      
      res.json(result);
    } catch (error) {
      console.error('AI search error:', error);
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
