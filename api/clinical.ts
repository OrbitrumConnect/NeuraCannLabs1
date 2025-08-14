import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Buscar casos clínicos
  if (req.method === 'GET') {
    try {
      const { data: cases, error } = await supabase
        .from('clinical_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ message: "Erro ao buscar casos clínicos" });
      }

      return res.status(200).json({ 
        cases: cases || [],
        total: cases?.length || 0
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  // POST - Criar novo caso clínico
  if (req.method === 'POST') {
    const { caseNumber, description, medicalCondition, treatmentProtocol, outcome, userId } = req.body;

    try {
      const { data, error } = await supabase
        .from('clinical_cases')
        .insert({
          case_number: caseNumber,
          description,
          medical_condition: medicalCondition,
          treatment_protocol: treatmentProtocol,
          outcome,
          user_id: userId,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: "Erro ao criar caso clínico" });
      }

      return res.status(201).json({ 
        message: "Caso clínico criado com sucesso",
        case: data 
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
