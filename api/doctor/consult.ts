import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';
const openaiApiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, context, sessionId } = req.body;

  try {
    let aiResponse;

    if (openai && message) {
      // Buscar dados relevantes do Supabase
      let relevantData = '';
      
      try {
        // Buscar estudos científicos relacionados
        const { data: studies } = await supabase
          .from('scientific_studies')
          .select('title, content, topic')
          .ilike('content', `%${message.toLowerCase()}%`)
          .limit(3);

        // Buscar conversas anteriores similares
        const { data: conversations } = await supabase
          .from('conversations')
          .select('user_message, ai_response, medical_topic')
          .ilike('user_message', `%${message.toLowerCase()}%`)
          .limit(2);

        // Buscar insights da IA
        const { data: insights } = await supabase
          .from('ai_insights')
          .select('insight, category, source')
          .ilike('insight', `%${message.toLowerCase()}%`)
          .limit(2);

        // Montar contexto com dados do banco
        if (studies && studies.length > 0) {
          relevantData += '\n\nESTUDOS CIENTÍFICOS RELEVANTES:\n';
          studies.forEach(study => {
            relevantData += `- ${study.title}: ${study.content.substring(0, 200)}...\n`;
          });
        }

        if (conversations && conversations.length > 0) {
          relevantData += '\n\nCONSULTAS ANTERIORES SIMILARES:\n';
          conversations.forEach(conv => {
            relevantData += `- Pergunta: ${conv.user_message}\n- Resposta: ${conv.ai_response.substring(0, 150)}...\n`;
          });
        }

        if (insights && insights.length > 0) {
          relevantData += '\n\nINSIGHTS DA IA:\n';
          insights.forEach(insight => {
            relevantData += `- ${insight.insight} (Fonte: ${insight.source})\n`;
          });
        }
      } catch (error) {
        console.log('Erro ao buscar dados do banco:', error);
      }

      // Usar ChatGPT com dados do banco
      const systemPrompt = `Você é a Dra. Cannabis, uma especialista em cannabis medicinal com vasto conhecimento científico. 

BASE DE CONHECIMENTO:
- Efeitos terapêuticos da cannabis (CBD, THC, CBG, etc.)
- Dosagens e protocolos para diferentes condições
- Interações medicamentosas
- Legislação brasileira (ANVISA, RDC 327/2019)
- Casos clínicos e estudos científicos
- Contraindicações e efeitos adversos
- Produtos disponíveis no Brasil

DADOS ESPECÍFICOS DO BANCO:${relevantData}

DIRETRIZES:
- Sempre baseie suas respostas em evidências científicas
- Use os dados específicos do banco quando disponíveis
- Cite fontes quando possível (PubMed, ANVISA, etc.)
- Seja clara e acessível, mas mantenha rigor científico
- Foque no contexto brasileiro e regulamentações ANVISA
- Não faça diagnósticos, apenas forneça informações educativas
- Sempre mencione a importância da consulta médica

Responda de forma profissional, mas acolhedora, como uma médica especialista conversando com um colega ou paciente.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      aiResponse = {
        message: completion.choices[0].message.content,
        confidence: 0.95,
        sources: ['PubMed', 'ANVISA', 'Estudos Clínicos', 'OpenAI GPT-4'],
        suggestions: [
          'Dosagem para dor crônica',
          'Interação com outros medicamentos',
          'Protocolos para ansiedade',
          'Legislação atual',
          'Produtos disponíveis no Brasil'
        ]
      };
    } else {
      // Resposta padrão se não houver OpenAI ou mensagem
      aiResponse = {
        message: `Olá! Sou a Dra. Cannabis, sua especialista em cannabis medicinal. 

${message ? `Sobre sua pergunta: "${message}"` : ''}

Como posso ajudá-lo hoje? Posso fornecer informações sobre:
• Efeitos terapêuticos da cannabis
• Dosagens e protocolos
• Interações medicamentosas
• Legislação brasileira
• Casos clínicos

Qual aspecto específico você gostaria de explorar?`,
        confidence: 0.8,
        sources: ['Base de Conhecimento NeuroCann'],
        suggestions: [
          'Dosagem para dor crônica',
          'Interação com outros medicamentos',
          'Protocolos para ansiedade',
          'Legislação atual'
        ]
      };
    }

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
