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

  // GET - Buscar estudos científicos
  if (req.method === 'GET') {
    try {
      const { data: studies, error } = await supabase
        .from('scientific_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ message: "Erro ao buscar estudos" });
      }

      return res.status(200).json({ 
        studies: studies || [],
        total: studies?.length || 0
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  // POST - Criar novo estudo
  if (req.method === 'POST') {
    const { title, content, topic, keywords, userId } = req.body;

    try {
      const { data, error } = await supabase
        .from('scientific_studies')
        .insert({
          title,
          content,
          topic,
          keywords: keywords || [],
          user_id: userId,
          status: 'published'
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ message: "Erro ao criar estudo" });
      }

      return res.status(201).json({ 
        message: "Estudo criado com sucesso",
        study: data 
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
