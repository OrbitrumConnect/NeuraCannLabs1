import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, name, userType, credentialType, credentialNumber, specialty, workArea } = req.body;

  console.log('📝 Registro de usuário:', { email, name, userType });

  try {
    // Validação básica
    if (!email || !password || !name || !userType) {
      return res.status(400).json({ message: "Dados obrigatórios não fornecidos" });
    }

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: "Usuário já existe com este email" });
    }

    // Criar novo usuário
    const newUser = {
      email,
      name,
      role: userType === 'medico' ? 'medico' : 'paciente',
      plan: 'free',
      crm: credentialType === 'crm' ? credentialNumber : null,
      specialty: userType === 'medico' ? specialty : null,
      phone: null,
      is_active: true,
      email_verified: false,
      terms_accepted: true,
      privacy_accepted: true
    };

    const { data: user, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar usuário:', error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }

    console.log('✅ Usuário criado com sucesso:', user.id);

    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    return res.status(500).json({ 
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
