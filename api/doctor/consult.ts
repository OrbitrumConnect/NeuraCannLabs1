import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, context, sessionId } = req.body;

  try {
    // Simular resposta da Dra. Cannabis
    const aiResponse = {
      message: `Olá! Sou a Dra. Cannabis, sua especialista em cannabis medicinal. 

${message ? `Sobre sua pergunta: "${message}"` : ''}

Como posso ajudá-lo hoje? Posso fornecer informações sobre:
• Efeitos terapêuticos da cannabis
• Dosagens e protocolos
• Interações medicamentosas
• Legislação brasileira
• Casos clínicos

Qual aspecto específico você gostaria de explorar?`,
      confidence: 0.95,
      sources: ['PubMed', 'ANVISA', 'Estudos Clínicos'],
      suggestions: [
        'Dosagem para dor crônica',
        'Interação com outros medicamentos',
        'Protocolos para ansiedade',
        'Legislação atual'
      ]
    };

    // Salvar conversa no Supabase
    if (sessionId) {
      await supabase.from('conversations').insert({
        session_id: sessionId,
        user_message: message || 'Consulta inicial',
        ai_response: aiResponse.message,
        context: context || 'medical',
        medical_topic: 'cannabis_medicinal',
        success_rating: 0.9
      });
    }

    return res.status(200).json(aiResponse);

  } catch (error) {
    console.error('Consult error:', error);
    return res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
