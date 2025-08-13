import { type User, type InsertUser, type ScientificStudy, type InsertScientificStudy, type ClinicalCase, type InsertClinicalCase, type Alert, type InsertAlert, type StudySubmission, type InsertStudySubmission, type PatientData, type InsertPatientData, type PatientEvolution, type InsertPatientEvolution, type PatientReferral, type UpsertPatientReferral, type DigitalAnamnesis, type UpsertDigitalAnamnesis, type LabIntegration, type LabResult, type MedicalTeamMember, type ComplianceAudit, type Conversation, type InsertConversation, type LearningPattern, type InsertLearningPattern, type AiInsight, type InsertAiInsight } from "@shared/schema";
import { comprehensiveStudies, comprehensiveClinicalCases, comprehensiveAlerts } from './comprehensive-medical-database';
import { SupabaseStorage } from './supabaseStorage';
import { initializeSupabaseTables } from './supabase';
import { randomUUID } from "crypto";

// ⚠️ AVISO CRÍTICO: Todos os dados científicos são baseados em estudos REAIS e VERIFICADOS
// Fontes: PubMed (PMID verificados), ClinicalTrials.gov (NCT verificados), ANVISA, NEJM
// Nenhum dado fictício ou inventado é permitido nesta plataforma médica

// Instância global do storage - alternar entre MemStorage e SupabaseStorage
let globalStorage: IStorage | null = null;

export async function getStorage(): Promise<IStorage> {
  if (!globalStorage) {
    try {
      // Tentar conectar ao Supabase
      console.log('🗄️ Tentando conectar ao Supabase...');
      const isSupabaseReady = await initializeSupabaseTables();
      if (isSupabaseReady) {
        console.log('✅ Supabase conectado - Usando para persistência de dados');
        globalStorage = new SupabaseStorage();
      } else {
        throw new Error('Supabase não disponível');
      }
    } catch (error) {
      console.log('⚠️ Supabase indisponível, usando MemStorage:', error.message);
      globalStorage = new MemStorage();
    }
  }
  return globalStorage;
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser & { password?: string }): Promise<User>;
  
  // Scientific Studies
  getScientificStudies(): Promise<ScientificStudy[]>;
  getScientificStudy(id: string): Promise<ScientificStudy | undefined>;
  createScientificStudy(study: InsertScientificStudy): Promise<ScientificStudy>;
  
  // Clinical Cases
  getClinicalCases(): Promise<ClinicalCase[]>;
  getClinicalCase(id: string): Promise<ClinicalCase | undefined>;
  createClinicalCase(clinicalCase: InsertClinicalCase): Promise<ClinicalCase>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<void>;
  
  // Study Submissions
  getStudySubmissions(userId?: string): Promise<StudySubmission[]>;
  getAllStudySubmissions(): Promise<StudySubmission[]>;
  getStudySubmission(id: string): Promise<StudySubmission | undefined>;
  createStudySubmission(submission: InsertStudySubmission): Promise<StudySubmission>;
  updateStudySubmission(id: string, updates: Partial<StudySubmission>): Promise<StudySubmission | undefined>;
  submitStudyForReview(id: string): Promise<StudySubmission | undefined>;
  addApprovedStudyToDatabase(submission: StudySubmission): Promise<void>;
  
  // Patient Data - POTÊNCIA DE DADOS
  getPatientData(doctorId?: string): Promise<PatientData[]>;
  getPatientDataById(id: string): Promise<PatientData | undefined>;
  createPatientData(data: InsertPatientData): Promise<PatientData>;
  
  // Patient Evolution
  getPatientEvolution(patientDataId: string): Promise<PatientEvolution[]>;
  createPatientEvolution(evolution: InsertPatientEvolution): Promise<PatientEvolution>;
  
  // Patient Referrals - Encaminhamento entre Especialistas
  getPatientReferrals(doctorId?: string): Promise<PatientReferral[]>;
  createPatientReferral(referral: UpsertPatientReferral): Promise<PatientReferral>;
  updateReferralStatus(id: string, status: string, notes?: string): Promise<PatientReferral | undefined>;
  
  // Digital Anamnesis - Anamnese Digital em Tempo Real
  getDigitalAnamnesis(patientId?: string, doctorId?: string): Promise<DigitalAnamnesis[]>;
  createDigitalAnamnesis(anamnesis: UpsertDigitalAnamnesis): Promise<DigitalAnamnesis>;
  updateDigitalAnamnesis(id: string, updates: Partial<DigitalAnamnesis>): Promise<DigitalAnamnesis | undefined>;
  
  // Lab Integrations - Integração com Laboratórios
  getLabIntegrations(): Promise<LabIntegration[]>;
  getLabResults(patientId?: string): Promise<LabResult[]>;
  createLabResult(result: Omit<LabResult, 'id' | 'receivedAt'>): Promise<LabResult>;
  
  // Medical Team - Equipe Multidisciplinar
  getMedicalTeam(): Promise<MedicalTeamMember[]>;
  
  // Compliance Audits - Auditoria e Compliance
  getComplianceAudits(): Promise<ComplianceAudit[]>;
  createComplianceAudit(audit: Omit<ComplianceAudit, 'id' | 'createdAt'>): Promise<ComplianceAudit>;
  
  // Sistema de Aprendizado Contínuo
  getConversations(sessionId?: string): Promise<Conversation[]>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  
  // Padrões de Aprendizado
  getLearningPatterns(category?: string): Promise<LearningPattern[]>;
  createLearningPattern(pattern: InsertLearningPattern): Promise<LearningPattern>;
  updateLearningPattern(id: string, updates: Partial<LearningPattern>): Promise<LearningPattern | undefined>;
  
  // AI Insights
  getAiInsights(category?: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scientificStudies: Map<string, ScientificStudy>;
  private clinicalCases: Map<string, ClinicalCase>;
  private alerts: Map<string, Alert>;
  private studySubmissions: Map<string, StudySubmission>;
  private patientData: Map<string, PatientData>;
  private patientEvolution: Map<string, PatientEvolution>;
  private patientReferrals: Map<string, PatientReferral>;
  private digitalAnamnesis: Map<string, DigitalAnamnesis>;
  private labIntegrations: Map<string, LabIntegration>;
  private labResults: Map<string, LabResult>;
  private medicalTeam: Map<string, MedicalTeamMember>;
  private complianceAudits: Map<string, ComplianceAudit>;
  // Sistema de Aprendizado Contínuo
  private conversations: Map<string, Conversation>;
  private learningPatterns: Map<string, LearningPattern>;
  private aiInsights: Map<string, AiInsight>;

  constructor() {
    this.users = new Map();
    this.scientificStudies = new Map();
    this.clinicalCases = new Map();
    this.alerts = new Map();
    this.studySubmissions = new Map();
    this.patientData = new Map();
    this.patientEvolution = new Map();
    this.patientReferrals = new Map();
    this.digitalAnamnesis = new Map();
    this.labIntegrations = new Map();
    this.labResults = new Map();
    this.medicalTeam = new Map();
    this.complianceAudits = new Map();
    // Inicializar Sistema de Aprendizado Contínuo
    this.conversations = new Map();
    this.learningPatterns = new Map();
    this.aiInsights = new Map();
    
    // PRODUÇÃO: Sem dados de teste - apenas dados reais do Supabase
    // Apenas inicializar módulos críticos necessários
    this.initializeCriticalModules();
  }

  private initializeSampleData() {
    // PRODUÇÃO: Sistema completamente limpo - apenas dados reais do Supabase
    console.log('🏭 PRODUÇÃO: Storage inicializado sem dados de teste');
  }
  
  private loadComprehensiveData() {
    // PRODUÇÃO: Sistema completamente limpo - apenas dados reais do Supabase
    console.log('🏭 PRODUÇÃO: Sistema carregado sem dados de teste');
  }

  private createSampleStudySubmissions() {
    // PRODUÇÃO: Sistema completamente limpo - apenas dados reais do Supabase
    console.log('🏭 PRODUÇÃO: Sistema pronto para submissões reais');
  }

  // ========================================
  // MÉTODOS CRUD PARA PRODUÇÃO
  // ========================================
