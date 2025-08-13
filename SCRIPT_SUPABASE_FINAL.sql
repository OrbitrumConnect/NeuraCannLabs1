-- SCRIPT SQL FINAL PARA SUPABASE
-- Execute este script completo no SQL Editor do Supabase
-- Credenciais Admin: phpg69@gmail.com / n6n7n8N9!horus

-- Tabela de usuários (comum e profissional da saúde)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'paciente' CHECK (role IN ('admin', 'medico', 'paciente')),
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'admin')),
  
  -- Campos específicos para profissionais da saúde
  crm VARCHAR(20), -- Registro profissional (CRM, CRF, etc.)
  crm_state VARCHAR(2), -- Estado do CRM
  specialty VARCHAR(100), -- Especialidade médica
  phone VARCHAR(20), -- Telefone profissional
  
  -- Campos comuns
  cpf VARCHAR(14), -- CPF para brasileiros
  birth_date DATE, -- Data de nascimento
  gender VARCHAR(20), -- Gênero
  address_data JSONB, -- Endereço completo em JSON
  
  -- Dados médicos (para pacientes)
  medical_conditions TEXT[], -- Condições médicas atuais
  medications TEXT[], -- Medicações em uso
  allergies TEXT[], -- Alergias conhecidas
  
  -- Configurações de conta
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  terms_accepted BOOLEAN DEFAULT false,
  privacy_accepted BOOLEAN DEFAULT false,
  
  -- Dados extras em JSON flexível
  profile_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conversações (sistema de aprendizado NOA)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context VARCHAR(255),
  medical_topic VARCHAR(255),
  success_rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de estudos científicos
CREATE TABLE IF NOT EXISTS scientific_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  topic VARCHAR(255) NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  study_type VARCHAR(100) DEFAULT 'observacional',
  word_count INTEGER DEFAULT 0,
  confidence DECIMAL(3,2),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de casos clínicos
CREATE TABLE IF NOT EXISTS clinical_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  medical_condition VARCHAR(255) NOT NULL,
  treatment_protocol TEXT NOT NULL,
  dosage_info TEXT,
  outcome TEXT,
  patient_age INTEGER,
  patient_gender VARCHAR(20),
  duration_days INTEGER,
  follow_up_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de padrões de aprendizado (IA NOA)
CREATE TABLE IF NOT EXISTS learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern VARCHAR(500) NOT NULL,
  frequency INTEGER DEFAULT 1,
  success_rate DECIMAL(5,2) DEFAULT 0,
  best_response TEXT,
  context_type VARCHAR(100),
  medical_category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de insights da IA NOA
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  confidence INTEGER DEFAULT 0,
  source VARCHAR(100) NOT NULL,
  implemented INTEGER DEFAULT 0,
  impact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance otimizada
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_medical_topic ON conversations(medical_topic);
CREATE INDEX IF NOT EXISTS idx_scientific_studies_topic ON scientific_studies(topic);
CREATE INDEX IF NOT EXISTS idx_scientific_studies_user_id ON scientific_studies(user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_cases_medical_condition ON clinical_cases(medical_condition);
CREATE INDEX IF NOT EXISTS idx_learning_patterns_pattern ON learning_patterns(pattern);
CREATE INDEX IF NOT EXISTS idx_ai_insights_category ON ai_insights(category);

-- Triggers para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scientific_studies_updated_at BEFORE UPDATE ON scientific_studies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinical_cases_updated_at BEFORE UPDATE ON clinical_cases
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_patterns_updated_at BEFORE UPDATE ON learning_patterns
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON ai_insights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scientific_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (para desenvolvimento)
CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON scientific_studies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON clinical_cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON learning_patterns FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ai_insights FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON scientific_studies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON clinical_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON learning_patterns FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON ai_insights FOR INSERT WITH CHECK (true);

-- Inserir usuário admin principal (ÚNICO USUÁRIO REAL)
INSERT INTO users (email, name, role, plan) 
VALUES (
  'phpg69@gmail.com', 
  'Administrador NeuroCann', 
  'admin', 
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Confirmação final
SELECT 'Supabase NeuroCann Lab configurado com sucesso!' as status,
       'Admin Real: phpg69@gmail.com' as admin_user,
       'Sistema funcionando apenas com usuários reais' as modo;