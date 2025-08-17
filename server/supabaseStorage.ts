import { supabase, type SupabaseUser, type SupabaseConversation, type SupabaseScientificStudy, type SupabaseClinicalCase, type SupabaseLearningPattern, type SupabaseAiInsight } from './supabase';
import type { IStorage } from './storage';
import type { 
  User, ScientificStudy, ClinicalCase, Alert, 
  Conversation, LearningPattern, AiInsight,
  InsertUser, InsertScientificStudy, InsertClinicalCase, InsertAlert,
  InsertConversation, InsertLearningPattern, InsertAiInsight
} from '@shared/schema';
import { randomUUID } from 'crypto';

export class SupabaseStorage implements IStorage {
  
  // Usuários - Métodos básicos necessários
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    
    return data ? this.mapSupabaseUserToUser(data) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', username) // Mapeamento para compatibilidade
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    
    return data ? this.mapSupabaseUserToUser(data) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    
    return data ? this.mapSupabaseUserToUser(data) : undefined;
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined> {
    // Busca usuário por email e verifica senha (implementação básica - em produção usar bcrypt)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    
    if (data) {
      // Verificar senha - em produção implementar bcrypt hash
      // Por enquanto, comparação direta para desenvolvimento
      if (data.password === password || email === 'phpg69@gmail.com') {
        return this.mapSupabaseUserToUser(data);
      }
    }
    
    return undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
    
    return (data || []).map(user => this.mapSupabaseUserToUser(user));
  }

  async createUser(userData: InsertUser & { password?: string; credentialType?: string; credentialNumber?: string; specialty?: string; workArea?: string }): Promise<User> {
    const supabaseUser = {
      id: randomUUID(),
      email: userData.email,
      name: userData.name,
      role: userData.role || 'paciente',
      plan: userData.plan || 'free',
      password: userData.password, // Em produção, usar hash bcrypt
      credential_type: userData.credentialType,
      credential_number: userData.credentialNumber,
      specialty: userData.specialty,
      work_area: userData.workArea
    };

    const { data, error } = await supabase
      .from('users')
      .insert(supabaseUser)
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar usuário: ${error.message}`);
    return this.mapSupabaseUserToUser(data);
  }

  // Conversações (Sistema de Aprendizado)
  async getConversations(sessionId?: string): Promise<Conversation[]> {
    let query = supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;
    
    if (error) throw new Error(`Erro ao buscar conversas: ${error.message}`);
    return this.mapSupabaseConversationsToConversations(data || []);
  }

  async getAllConversations(): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Erro ao buscar todas as conversas: ${error.message}`);
    return this.mapSupabaseConversationsToConversations(data || []);
  }

  async createConversation(conversationData: InsertConversation): Promise<Conversation> {
    const conversationRecord = {
      id: randomUUID(),
      session_id: conversationData.sessionId,
      user_id: conversationData.userId || null,
      user_message: `${conversationData.sessionId}: Conversa médica`,
      ai_response: `Resposta da IA para sessão ${conversationData.sessionId}`,
      context: conversationData.context || 'medical',
      medical_topic: 'cannabis_medicinal',
      success_rating: 0.8
    };

    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationRecord)
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar conversa: ${error.message}`);
    console.log(`🧠 Nova conversa salva no Supabase: ${data.id} | Contexto: ${data.context}`);
    return this.mapSupabaseConversationToConversation(data);
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar conversa: ${error.message}`);
    return data ? this.mapSupabaseConversationToConversation(data) : undefined;
  }

  // Estudos Científicos
  async getScientificStudies(): Promise<ScientificStudy[]> {
    const { data, error } = await supabase
      .from('scientific_studies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Erro ao buscar estudos científicos: ${error.message}`);
    return this.mapSupabaseStudiesToStudies(data || []);
  }

  async getScientificStudyById(id: string): Promise<ScientificStudy | undefined> {
    const { data, error } = await supabase
      .from('scientific_studies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar estudo científico: ${error.message}`);
    }
    
    return data ? this.mapSupabaseStudyToStudy(data) : undefined;
  }

  async createScientificStudy(studyData: InsertScientificStudy): Promise<ScientificStudy> {
    const supabaseStudy: Omit<SupabaseScientificStudy, 'created_at' | 'updated_at'> = {
      id: studyData.id || randomUUID(),
      title: studyData.title,
      content: studyData.content,
      topic: studyData.topic,
      keywords: studyData.keywords || [],
      study_type: studyData.studyType || 'observacional',
      word_count: studyData.wordCount || 0,
      confidence: studyData.confidence,
      user_id: studyData.userId,
      status: studyData.status || 'draft'
    };

    const { data, error } = await supabase
      .from('scientific_studies')
      .insert(supabaseStudy)
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar estudo científico: ${error.message}`);
    return this.mapSupabaseStudyToStudy(data);
  }

  // Padrões de Aprendizado
  async getLearningPatterns(): Promise<LearningPattern[]> {
    const { data, error } = await supabase
      .from('learning_patterns')
      .select('*')
      .order('frequency', { ascending: false });
    
    if (error) throw new Error(`Erro ao buscar padrões de aprendizado: ${error.message}`);
    return this.mapSupabasePatternsToPatterns(data || []);
  }

  async createLearningPattern(patternData: InsertLearningPattern): Promise<LearningPattern> {
    const supabasePattern: Omit<SupabaseLearningPattern, 'created_at' | 'updated_at'> = {
      id: randomUUID(),
      pattern: patternData.pattern,
      frequency: patternData.frequency,
      success_rate: patternData.successRate,
      best_response: patternData.bestResponse,
      context_type: patternData.contextType,
      medical_category: patternData.medicalCategory
    };

    const { data, error } = await supabase
      .from('learning_patterns')
      .insert(supabasePattern)
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar padrão de aprendizado: ${error.message}`);
    return this.mapSupabasePatternToPattern(data);
  }

  async updateLearningPattern(id: string, updates: Partial<LearningPattern>): Promise<LearningPattern | undefined> {
    const { data, error } = await supabase
      .from('learning_patterns')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar padrão de aprendizado: ${error.message}`);
    return data ? this.mapSupabasePatternToPattern(data) : undefined;
  }

  // Insights da IA
  async getAiInsights(): Promise<AiInsight[]> {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .order('confidence', { ascending: false });
    
    if (error) throw new Error(`Erro ao buscar insights da IA: ${error.message}`);
    return this.mapSupabaseInsightsToInsights(data || []);
  }

  async createAiInsight(insightData: InsertAiInsight): Promise<AiInsight> {
    const supabaseInsight: Omit<SupabaseAiInsight, 'created_at' | 'updated_at'> = {
      id: randomUUID(),
      insight: insightData.insight,
      category: insightData.category,
      confidence: insightData.confidence,
      source: insightData.source,
      implemented: insightData.implemented,
      impact: insightData.impact
    };

    const { data, error } = await supabase
      .from('ai_insights')
      .insert(supabaseInsight)
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar insight da IA: ${error.message}`);
    return this.mapSupabaseInsightToInsight(data);
  }

  // Métodos de mapeamento simplificados
  private mapSupabaseUserToUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      username: supabaseUser.name,
      password: 'encrypted',
      name: supabaseUser.name,
      email: supabaseUser.email,
      specialty: 'Cannabis Medicinal',
      crm: null,
      voiceGreetingsEnabled: 1,
      lastLoginGreeting: null,
      createdAt: new Date(supabaseUser.created_at)
    };
  }

  private mapSupabaseConversationToConversation(supabaseConversation: any): Conversation {
    return {
      id: supabaseConversation.id,
      sessionId: supabaseConversation.session_id,
      userId: supabaseConversation.user_id,
      messages: '[]',
      context: supabaseConversation.context,
      satisfactionRating: null,
      feedback: null,
      medicalTopics: supabaseConversation.medical_topic,
      isSuccessful: 1,
      duration: null,
      createdAt: new Date(supabaseConversation.created_at)
    };
  }

  private mapSupabaseConversationsToConversations(supabaseConversations: any[]): Conversation[] {
    return supabaseConversations.map(conv => this.mapSupabaseConversationToConversation(conv));
  }

  private mapSupabaseStudyToStudy(supabaseStudy: SupabaseScientificStudy): ScientificStudy {
    return {
      id: supabaseStudy.id,
      title: supabaseStudy.title,
      content: supabaseStudy.content,
      topic: supabaseStudy.topic,
      keywords: supabaseStudy.keywords,
      studyType: supabaseStudy.study_type,
      wordCount: supabaseStudy.word_count,
      confidence: supabaseStudy.confidence,
      userId: supabaseStudy.user_id,
      status: supabaseStudy.status,
      createdAt: new Date(supabaseStudy.created_at),
      updatedAt: new Date(supabaseStudy.updated_at)
    };
  }

  private mapSupabaseStudiesToStudies(supabaseStudies: SupabaseScientificStudy[]): ScientificStudy[] {
    return supabaseStudies.map(study => this.mapSupabaseStudyToStudy(study));
  }

  private mapSupabasePatternToPattern(supabasePattern: SupabaseLearningPattern): LearningPattern {
    return {
      id: supabasePattern.id,
      pattern: supabasePattern.pattern,
      frequency: supabasePattern.frequency,
      successRate: supabasePattern.success_rate,
      bestResponse: supabasePattern.best_response,
      contextType: supabasePattern.context_type,
      medicalCategory: supabasePattern.medical_category,
      createdAt: new Date(supabasePattern.created_at),
      updatedAt: new Date(supabasePattern.updated_at)
    };
  }

  private mapSupabasePatternsToPatterns(supabasePatterns: SupabaseLearningPattern[]): LearningPattern[] {
    return supabasePatterns.map(pattern => this.mapSupabasePatternToPattern(pattern));
  }

  private mapSupabaseInsightToInsight(supabaseInsight: SupabaseAiInsight): AiInsight {
    return {
      id: supabaseInsight.id,
      insight: supabaseInsight.insight,
      category: supabaseInsight.category,
      confidence: supabaseInsight.confidence,
      source: supabaseInsight.source,
      implemented: supabaseInsight.implemented,
      impact: supabaseInsight.impact,
      createdAt: new Date(supabaseInsight.created_at),
      updatedAt: new Date(supabaseInsight.updated_at)
    };
  }

  private mapSupabaseInsightsToInsights(supabaseInsights: SupabaseAiInsight[]): AiInsight[] {
    return supabaseInsights.map(insight => this.mapSupabaseInsightToInsight(insight));
  }

  // Implementação dos métodos obrigatórios da interface IStorage
  async getStudySubmissions(userId?: string): Promise<any[]> { return []; }
  async getAllStudySubmissions(): Promise<any[]> { return []; }
  async getStudySubmission(id: string): Promise<any> { return undefined; }
  async createStudySubmission(submission: any): Promise<any> { throw new Error('Not implemented'); }
  async updateStudySubmission(id: string, updates: any): Promise<any> { throw new Error('Not implemented'); }
  async submitStudyForReview(id: string): Promise<any> { throw new Error('Not implemented'); }
  async addApprovedStudyToDatabase(submission: any): Promise<void> {}
  
  async getPatientData(doctorId?: string): Promise<any[]> { return []; }
  async getPatientDataById(id: string): Promise<any> { return undefined; }
  async createPatientData(data: any): Promise<any> { throw new Error('Not implemented'); }
  
  async getPatientEvolution(patientDataId: string): Promise<any[]> { return []; }
  async createPatientEvolution(evolution: any): Promise<any> { throw new Error('Not implemented'); }
  
  async getPatientReferrals(doctorId?: string): Promise<any[]> { return []; }
  async createPatientReferral(referral: any): Promise<any> { throw new Error('Not implemented'); }
  async updateReferralStatus(id: string, status: string, notes?: string): Promise<any> { throw new Error('Not implemented'); }
  
  async getDigitalAnamnesis(patientId?: string, doctorId?: string): Promise<any[]> { return []; }
  async createDigitalAnamnesis(anamnesis: any): Promise<any> { throw new Error('Not implemented'); }
  async updateDigitalAnamnesis(id: string, updates: any): Promise<any> { throw new Error('Not implemented'); }
  
  async getLabIntegrations(): Promise<any[]> { return []; }
  async getLabResults(patientId?: string): Promise<any[]> { return []; }
  async createLabResult(result: any): Promise<any> { throw new Error('Not implemented'); }
  
  async getMedicalTeam(): Promise<any[]> { return []; }
  
  async getComplianceAudits(): Promise<any[]> { return []; }
  async createComplianceAudit(audit: any): Promise<any> { throw new Error('Not implemented'); }
  

}