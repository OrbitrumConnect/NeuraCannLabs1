import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';
const openaiApiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

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

  const { message, context, sessionId } = req.body;

  console.log('🎭 Dra. Cannabis - Recebida mensagem:', message);
  console.log('🔑 OpenAI API Key disponível:', !!openaiApiKey);
  console.log('🤖 OpenAI client criado:', !!openai);

  try {
    let aiResponse;

    console.log('🔍 Verificando condições para OpenAI...');
    console.log('  - OpenAI client:', !!openai);
    console.log('  - Mensagem:', !!message);
    console.log('  - Ambos verdadeiros:', !!(openai && message));
    
    if (openai && message) {
      console.log('🧠 Usando OpenAI para resposta...');
      
      // Prompt simplificado
      const systemPrompt = `Você é a Dra. Cannabis, uma especialista em cannabis medicinal. 
      
Responda de forma profissional e acolhedora, sempre mencionando a importância da consulta médica.
Base suas respostas em evidências científicas e legislação brasileira (ANVISA).`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const responseText = completion.choices[0].message.content || 'Desculpe, não consegui processar sua pergunta.';

      aiResponse = {
        response: responseText,
        message: responseText,
        confidence: 0.95,
        sources: ['OpenAI GPT-4'],
        suggestions: [
          'Dosagem para dor crônica',
          'Interação com outros medicamentos',
          'Protocolos para ansiedade',
          'Legislação atual'
        ]
      };

      console.log('✅ Resposta gerada:', responseText.substring(0, 100) + '...');

    } else {
      console.log('📝 Usando resposta padrão...');
      
      // Resposta padrão simples
      const defaultResponse = `Olá! Sou a Dra. Cannabis, sua especialista em cannabis medicinal. 

${message ? `Sobre sua pergunta: "${message}"` : ''}

Como posso ajudá-lo hoje? Posso fornecer informações sobre:
• Efeitos terapêuticos da cannabis
• Dosagens e protocolos
• Interações medicamentosas
• Legislação brasileira

Qual aspecto específico você gostaria de explorar?`;

      aiResponse = {
        response: defaultResponse,
        message: defaultResponse,
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

    // Salvar conversa no Supabase (opcional)
    try {
      if (sessionId && message) {
        await supabase.from('conversations').insert({
          session_id: sessionId,
          user_message: message,
          ai_response: aiResponse.message,
          context: context || 'medical',
          medical_topic: 'cannabis_medicinal',
          success_rating: 0.9
        });
        console.log('💾 Conversa salva no Supabase');
      }
    } catch (error) {
      console.log('⚠️ Erro ao salvar no Supabase:', error);
      // Não falha se não conseguir salvar
    }

    console.log('🎯 Retornando resposta:', aiResponse.message.substring(0, 50) + '...');
    return res.status(200).json(aiResponse);

  } catch (error) {
    console.error('❌ Erro na consulta:', error);
    
    // Resposta de erro amigável
    return res.status(500).json({ 
      response: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
      message: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
      confidence: 0.1,
      sources: ['Sistema'],
      suggestions: ['Tente novamente', 'Verifique sua conexão']
    });
  }
}
