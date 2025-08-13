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
    // Para Supabase, vamos usar apenas email por enquanto (password será implementado com hash depois)
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

  async createUser(userData: InsertUser): Promise<User> {
    const supabaseUser = {
      id: randomUUID(),
      email: userData.email,
      name: userData.name,
      role: 'paciente' as const,
      plan: 'free' as const
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

  // Implementação mínima dos métodos obrigatórios da interface IStorage
  async getScientificStudies(): Promise<ScientificStudy[]> { return []; }
  async getScientificStudy(id: string): Promise<ScientificStudy | undefined> { return undefined; }
  async createScientificStudy(study: InsertScientificStudy): Promise<ScientificStudy> { 
    throw new Error('Not implemented in Supabase yet'); 
  }

  async getClinicalCases(): Promise<ClinicalCase[]> { return []; }
  async getClinicalCase(id: string): Promise<ClinicalCase | undefined> { return undefined; }
  async createClinicalCase(caseData: InsertClinicalCase): Promise<ClinicalCase> {
    throw new Error('Not implemented in Supabase yet');
  }

  async getAlerts(): Promise<Alert[]> { return []; }
  async getAlert(id: string): Promise<Alert | undefined> { return undefined; }
  async createAlert(alertData: InsertAlert): Promise<Alert> {
    throw new Error('Not implemented in Supabase yet');
  }
  async markAlertAsRead(id: string): Promise<void> {}

  // Stubs para outros métodos da interface IStorage
  async getStudySubmissions(): Promise<any[]> { return []; }
  async getAllStudySubmissions(): Promise<any[]> { return []; }
  async getStudySubmission(): Promise<any> { return undefined; }
  async createStudySubmission(): Promise<any> { throw new Error('Not implemented'); }
  async updateStudySubmission(): Promise<any> { throw new Error('Not implemented'); }
  async deleteStudySubmission(): Promise<void> {}
  async getPatientData(): Promise<any[]> { return []; }
  async getPatientDataById(): Promise<any> { return undefined; }
  async createPatientData(): Promise<any> { throw new Error('Not implemented'); }
  async updatePatientData(): Promise<any> { throw new Error('Not implemented'); }
  async deletePatientData(): Promise<void> {}
  async getPatientEvolutions(): Promise<any[]> { return []; }
  async createPatientEvolution(): Promise<any> { throw new Error('Not implemented'); }
  async getPatientReferrals(): Promise<any[]> { return []; }
  async upsertPatientReferral(): Promise<any> { throw new Error('Not implemented'); }
  async getDigitalAnamneses(): Promise<any[]> { return []; }
  async upsertDigitalAnamnesis(): Promise<any> { throw new Error('Not implemented'); }
  async getLabIntegrations(): Promise<any[]> { return []; }
  async getLabResults(): Promise<any[]> { return []; }
  async getMedicalTeamMembers(): Promise<any[]> { return []; }
  async getComplianceAudits(): Promise<any[]> { return []; }
  async createComplianceAudit(): Promise<any> { throw new Error('Not implemented'); }
  async getLearningPatterns(): Promise<LearningPattern[]> { return []; }
  async createLearningPattern(): Promise<LearningPattern> { throw new Error('Not implemented'); }
  async updateLearningPattern(): Promise<LearningPattern | undefined> { return undefined; }
  async getAiInsights(): Promise<AiInsight[]> { return []; }
  async createAiInsight(): Promise<AiInsight> { throw new Error('Not implemented'); }
}