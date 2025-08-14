import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rfjshppjhjtwtbqhlaio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634';
const openaiApiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

// Simulação do SuperMedicalAI para Vercel
class VercelSuperMedicalAI {
  private openai: OpenAI | null;
  private medicalKnowledgeBase: string[];

  constructor() {
    this.openai = openai;
    this.medicalKnowledgeBase = [
      "Cannabis medicinal para tratamento de epilepsia refratária",
      "Dosagem de CBD para ansiedade em idosos",
      "Interações medicamentosas entre THC e anticoagulantes",
      "Protocolos de titulação para dor crônica neuropática",
      "Efeitos adversos de cannabinoides em pediatria"
    ];
  }

  async processConsultation(userId: string, question: string, userContext: any = {}) {
    console.log('🧠 SuperMedicalAI - Processando consulta...');
    
    if (!this.openai) {
      console.log('⚠️ OpenAI não disponível, usando resposta limitada');
      return {
        response: this.generateLimitedResponse(question),
        medicalInsights: ['Consulta médica recomendada'],
        confidence: 0.3,
        recommendations: ['Busque orientação médica especializada'],
        needsSpecialist: true
      };
    }

    try {
      // Buscar dados relevantes do Supabase
      let databaseContext = '';
      try {
        const { data: studies } = await supabase
          .from('scientific_studies')
          .select('title, content, topic')
          .ilike('content', `%${question.toLowerCase()}%`)
          .limit(3);

        const { data: conversations } = await supabase
          .from('conversations')
          .select('user_message, ai_response, medical_topic')
          .ilike('user_message', `%${question.toLowerCase()}%`)
          .limit(2);

        if (studies && studies.length > 0) {
          databaseContext += '\n\nESTUDOS CIENTÍFICOS RELEVANTES:\n';
          studies.forEach(study => {
            databaseContext += `- ${study.title}: ${study.content.substring(0, 200)}...\n`;
          });
        }

        if (conversations && conversations.length > 0) {
          databaseContext += '\n\nCONSULTAS ANTERIORES SIMILARES:\n';
          conversations.forEach(conv => {
            databaseContext += `- Pergunta: ${conv.user_message}\n- Resposta: ${conv.ai_response.substring(0, 150)}...\n`;
          });
        }
      } catch (error) {
        console.log('⚠️ Erro ao buscar dados do banco:', error);
      }

      // Usar modelo fine-tuned NOA ESPERANÇA
      const systemPrompt = `Você é NOA ESPERANÇA - Dra. Cannabis IA especializada em cannabis medicinal.

DADOS COMPLETOS DA PLATAFORMA:${databaseContext}

CONHECIMENTO ESPECIALIZADO:
- Dosagens específicas de CBD/THC por condição
- Protocolos de titulação personalizados
- Interações medicamentosas 
- Efeitos adversos por faixa etária
- Correlações entre sintomas e compostos
- Legislação brasileira (ANVISA, RDC 327/2019)

RESPONDA COMO MÉDICA ESPECIALISTA EM CANNABIS MEDICINAL.
Seja empática, profissional e sempre mencione a importância da consulta médica.
Base suas respostas em evidências científicas.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4", // Usando GPT-4 padrão por enquanto, mas preparado para fine-tuned
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_tokens: 600,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content || 'Desculpe, não consegui processar sua consulta.';
      
      console.log('✅ NOA ESPERANÇA respondeu:', response.substring(0, 100) + '...');

      return {
        response: response,
        medicalInsights: this.extractMedicalInsights(question, response),
        confidence: 0.95,
        recommendations: this.generateRecommendations(question, response),
        needsSpecialist: false
      };

    } catch (error) {
      console.error('❌ Erro no SuperMedicalAI:', error);
      return {
        response: this.generateLimitedResponse(question),
        medicalInsights: ['Erro técnico detectado'],
        confidence: 0.2,
        recommendations: ['Tente novamente ou busque orientação médica'],
        needsSpecialist: true
      };
    }
  }

  private generateLimitedResponse(question: string): string {
    return `Olá! Sou a Dra. Cannabis, sua especialista em cannabis medicinal. 

${question ? `Sobre sua pergunta: "${question}"` : ''}

Como posso ajudá-lo hoje? Posso fornecer informações sobre:
• Efeitos terapêuticos da cannabis
• Dosagens e protocolos
• Interações medicamentosas
• Legislação brasileira

Qual aspecto específico você gostaria de explorar?`;
  }

  private extractMedicalInsights(question: string, response: string): string[] {
    const insights = [];
    if (response.toLowerCase().includes('dosagem')) insights.push('Dosagem específica mencionada');
    if (response.toLowerCase().includes('interação')) insights.push('Interação medicamentosa identificada');
    if (response.toLowerCase().includes('efeito')) insights.push('Efeitos terapêuticos discutidos');
    return insights.length > 0 ? insights : ['Consulta médica especializada recomendada'];
  }

  private generateRecommendations(question: string, response: string): string[] {
    return [
      'Sempre consulte um médico antes de iniciar tratamento',
      'Mantenha acompanhamento médico regular',
      'Informe todos os medicamentos em uso'
    ];
  }
}

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
    // Usar SuperMedicalAI
    const superAI = new VercelSuperMedicalAI();
    const consultation = await superAI.processConsultation(
      sessionId || 'user-1', 
      message || 'Consulta inicial', 
      { context }
    );

    const aiResponse = {
      response: consultation.response,
      message: consultation.response,
      confidence: consultation.confidence,
      sources: ['NOA ESPERANÇA - SuperMedicalAI', 'Supabase Database'],
      suggestions: consultation.recommendations,
      medicalInsights: consultation.medicalInsights,
      needsSpecialist: consultation.needsSpecialist
    };

    // Salvar conversa no Supabase
    try {
      if (sessionId && message) {
        await supabase.from('conversations').insert({
          session_id: sessionId,
          user_message: message,
          ai_response: consultation.response,
          context: context || 'medical',
          medical_topic: 'cannabis_medicinal',
          success_rating: consultation.confidence
        });
        console.log('💾 Conversa salva no Supabase');
      }
    } catch (error) {
      console.log('⚠️ Erro ao salvar no Supabase:', error);
    }

    console.log('🎯 Retornando resposta da NOA ESPERANÇA:', consultation.response.substring(0, 50) + '...');
    return res.status(200).json(aiResponse);

  } catch (error) {
    console.error('❌ Erro na consulta:', error);
    
    return res.status(500).json({ 
      response: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
      message: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
      confidence: 0.1,
      sources: ['Sistema'],
      suggestions: ['Tente novamente', 'Verifique sua conexão']
    });
  }
}
