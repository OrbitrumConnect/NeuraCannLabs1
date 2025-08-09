import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScientificStudySchema, insertClinicalCaseSchema, insertAlertSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
