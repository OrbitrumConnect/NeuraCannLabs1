import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - com fallback para desenvolvimento
const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';

console.log('🔧 Configurando Supabase:', { url: supabaseUrl ? 'OK' : 'MISSING', key: supabaseKey ? 'OK' : 'MISSING' });

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para as tabelas do Supabase
export interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'medico' | 'paciente';
  plan: 'free' | 'premium' | 'admin';
  created_at: string;
  updated_at: string;
  profile_data?: any;
}

export interface SupabaseConversation {
  id: string;
  session_id: string;
  user_id?: string;
  user_message: string;
  ai_response: string;
  context: string;
  medical_topic?: string;
  success_rating?: number;
  created_at: string;
}

export interface SupabaseScientificStudy {
  id: string;
  title: string;
  content: string;
  topic: string;
  keywords: string[];
  study_type: string;
  word_count: number;
  confidence?: number;
  user_id?: string;
  status: 'draft' | 'review' | 'published';
  created_at: string;
  updated_at: string;
}

export interface SupabaseClinicalCase {
  id: string;
  case_number: string;
  description: string;
  medical_condition: string;
  treatment_protocol: string;
  dosage_info: string;
  outcome: string;
  patient_age?: number;
  patient_gender?: string;
  duration_days?: number;
  follow_up_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseLearningPattern {
  id: string;
  pattern: string;
  frequency: number;
  success_rate: number;
  best_response?: string;
  context_type?: string;
  medical_category?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAiInsight {
  id: string;
  insight: string;
  category: string;
  confidence: number;
  source: string;
  implemented: number;
  impact?: string;
  created_at: string;
  updated_at: string;
}

// Funções auxiliares para criação das tabelas
export async function initializeSupabaseTables(): Promise<boolean> {
  console.log('🗄️ Inicializando tabelas do Supabase...');
  
  try {
    // Teste de conexão simples
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (testError && testError.code === 'PGRST116') {
      console.log('⚠️ Tabela users não existe - execute o script SQL no Supabase');
      return false;
    }

    console.log('✅ Supabase conectado com sucesso');
    
    // Criar usuário de teste se não existir
    await createTestUser();
    
    return true;
  } catch (error) {
    console.log('❌ Erro de conexão com Supabase:', error instanceof Error ? error.message : error);
    return false;
  }
}

// Função para verificar usuário admin real
async function createTestUser(): Promise<void> {
  try {
    const adminUser = {
      email: 'phpg69@gmail.com',
      name: 'Administrador NeuroCann',
      role: 'admin',
      plan: 'admin'
    };

    const { data, error } = await supabase
      .from('users')
      .upsert(adminUser)
      .select()
      .single();

    if (error) {
      console.log('⚠️ Erro ao verificar usuário admin:', error.message);
    } else {
      console.log('✅ Usuário admin confirmado:', data.email);
    }
  } catch (error) {
    console.log('⚠️ Falha ao verificar usuário admin:', error instanceof Error ? error.message : error);
  }
}