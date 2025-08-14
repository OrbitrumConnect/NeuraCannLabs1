import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Buscar perfil
  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      // Se tem userId, busca no Supabase
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json({ user: data });
      }

      // Se não tem userId, retorna perfil padrão (como no servidor original)
      const defaultProfile = {
        id: "admin-default",
        name: "Passos",
        email: "phpg69@gmail.com",
        role: "admin",
        plan: "enterprise",
        isAdmin: true,
        preferences: {
          theme: 'dark',
          language: 'pt-BR',
          notifications: true
        }
      };

      return res.status(200).json(defaultProfile);

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  // PUT - Atualizar perfil
  if (req.method === 'PUT') {
    const { userId, ...updates } = req.body;

    try {
      // Se tem userId, atualiza no Supabase
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          return res.status(500).json({ message: "Erro ao atualizar perfil" });
        }

        return res.status(200).json({ 
          message: "Perfil atualizado com sucesso",
          user: data 
        });
      }

      // Se não tem userId, retorna perfil atualizado (como no servidor original)
      const updatedProfile = {
        id: "admin-default",
        name: "Passos",
        email: "phpg69@gmail.com",
        role: "admin",
        plan: "enterprise",
        isAdmin: true,
        ...updates
      };

      return res.status(200).json({ 
        message: "Perfil atualizado com sucesso",
        user: updatedProfile 
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
