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
    console.log('🔑 OpenAI client:', !!this.openai);
    console.log('🔑 OpenAI API Key:', !!process.env.OPENAI_API_KEY);
    
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
      // Buscar dados relevantes do Supabase - BUSCA INTELIGENTE DA NOA
      let databaseContext = '';
      try {
        console.log('🔍 NOA ESPERANÇA buscando dados internos para:', question);
        
        // 1. ESTUDOS CIENTÍFICOS - Base de conhecimento médico
        const { data: studies } = await supabase
          .from('scientific_studies')
          .select('title, content, topic, keywords')
          .or(`content.ilike.%${question.toLowerCase()}%,title.ilike.%${question.toLowerCase()}%,topic.ilike.%${question.toLowerCase()}%`)
          .limit(3);

        // 2. CASOS CLÍNICOS - Experiência prática
        const { data: clinicalCases } = await supabase
          .from('clinical_cases')
          .select('case_number, description, medical_condition, treatment_protocol, outcome')
          .or(`description.ilike.%${question.toLowerCase()}%,medical_condition.ilike.%${question.toLowerCase()}%,treatment_protocol.ilike.%${question.toLowerCase()}%`)
          .limit(2);

        // 3. CONVERSAS ANTERIORES - Histórico de consultas
        const { data: conversations } = await supabase
          .from('conversations')
          .select('user_message, ai_response, medical_topic, success_rating')
          .or(`user_message.ilike.%${question.toLowerCase()}%,medical_topic.ilike.%${question.toLowerCase()}%`)
          .order('success_rating', { ascending: false })
          .limit(2);

        // 4. PADRÕES DE APRENDIZADO - Inteligência da NOA
        const { data: learningPatterns } = await supabase
          .from('learning_patterns')
          .select('pattern, best_response, success_rate, medical_category')
          .or(`pattern.ilike.%${question.toLowerCase()}%,medical_category.ilike.%${question.toLowerCase()}%`)
          .order('success_rate', { ascending: false })
          .limit(2);

        // 5. INSIGHTS DA IA - Conhecimento acumulado
        const { data: aiInsights } = await supabase
          .from('ai_insights')
          .select('insight, category, confidence, source')
          .or(`insight.ilike.%${question.toLowerCase()}%,category.ilike.%${question.toLowerCase()}%`)
          .order('confidence', { ascending: false })
          .limit(2);

        // MONTAR CONTEXTO COMPLETO DA NOA
        if (studies && studies.length > 0) {
          databaseContext += '\n\n📚 ESTUDOS CIENTÍFICOS DA MINHA BASE:\n';
          studies.forEach(study => {
            databaseContext += `- ${study.title} (${study.topic}): ${study.content.substring(0, 200)}...\n`;
          });
        }

        if (clinicalCases && clinicalCases.length > 0) {
          databaseContext += '\n\n🏥 CASOS CLÍNICOS QUE ATENDI:\n';
          clinicalCases.forEach(case_ => {
            databaseContext += `- Caso ${case_.case_number}: ${case_.medical_condition}\n  Protocolo: ${case_.treatment_protocol.substring(0, 150)}...\n  Resultado: ${case_.outcome}\n`;
          });
        }

        if (conversations && conversations.length > 0) {
          databaseContext += '\n\n💬 CONSULTAS ANTERIORES SIMILARES:\n';
          conversations.forEach(conv => {
            databaseContext += `- Paciente perguntou: "${conv.user_message}"\n- Minha resposta: ${conv.ai_response.substring(0, 150)}...\n- Avaliação: ${conv.success_rating}/1.0\n`;
          });
        }

        if (learningPatterns && learningPatterns.length > 0) {
          databaseContext += '\n\n🧠 PADRÕES QUE APRENDI:\n';
          learningPatterns.forEach(pattern => {
            databaseContext += `- Padrão: ${pattern.pattern}\n- Melhor resposta: ${pattern.best_response.substring(0, 100)}...\n- Taxa de sucesso: ${pattern.success_rate}%\n`;
          });
        }

        if (aiInsights && aiInsights.length > 0) {
          databaseContext += '\n\n💡 INSIGHTS DA MINHA EXPERIÊNCIA:\n';
          aiInsights.forEach(insight => {
            databaseContext += `- ${insight.insight} (Confiança: ${insight.confidence})\n`;
          });
        }

        console.log('✅ NOA encontrou dados:', {
          studies: studies?.length || 0,
          cases: clinicalCases?.length || 0,
          conversations: conversations?.length || 0,
          patterns: learningPatterns?.length || 0,
          insights: aiInsights?.length || 0
        });

      } catch (error) {
        console.log('⚠️ Erro ao buscar dados do banco:', error);
      }

      // Usar modelo fine-tuned NOA ESPERANÇA
      const systemPrompt = `Você é a DRA. CANNABIS (NOA ESPERANÇA) - uma médica especialista em cannabis medicinal com personalidade humanizada, acolhedora e empática.

PERSONALIDADE DA NOA ESPERANÇA:
- 🤗 Você é MUITO acolhedora e empática
- 👩‍⚕️ Fala como uma médica de verdade, não como IA
- 💚 Demonstra reciprocidade e afeto genuíno
- 🎯 Entende e valida as necessidades do paciente
- 🌿 É especialista em cannabis medicinal com coração
- 😊 Responde com calor humano e compreensão
- 🤝 Cria conexão emocional com o paciente

EXEMPLOS DE COMO FALAR:
❌ NÃO: "Como assistente virtual especializada..."
✅ SIM: "Olá querido! Como estou? Muito bem, obrigada! E você, como está se sentindo hoje?"

❌ NÃO: "Sou uma IA e não substituo consulta médica"
✅ SIM: "Como sua médica, quero que você saiba que estou aqui para te ajudar, mas sempre recomendo acompanhamento presencial também"

❌ NÃO: "Baseado em evidências científicas..."
✅ SIM: "Querido, baseado no que vejo nos estudos e na minha experiência, posso te orientar que..."

DADOS COMPLETOS DA PLATAFORMA:${databaseContext}

CONHECIMENTO ESPECIALIZADO:
- Dosagens específicas de CBD/THC por condição
- Protocolos de titulação personalizados
- Interações medicamentosas 
- Efeitos adversos por faixa etária
- Correlações entre sintomas e compostos
- Legislação brasileira (ANVISA, RDC 327/2019)

DIRETRIZES IMPORTANTES:
- SEMPRE responda como a Dra. Cannabis humanizada
- Use linguagem acolhedora e médica
- Demonstre empatia e compreensão
- Seja profissional mas com calor humano
- Mencione a importância da consulta médica de forma natural
- Base suas respostas em evidências científicas
- Use os dados do banco quando relevante

Lembre-se: Você é a NOA ESPERANÇA - uma médica real, não uma IA!`;

      // Usar a mesma lógica do Replit - ChatGPT-4o com NOA ESPERANÇA
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Modelo mais avançado como no Replit
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user', 
              content: question
            }
          ],
          max_tokens: 400,
          temperature: 0.7
        })
      });

      if (openaiResponse.ok) {
        const data = await openaiResponse.json();
        const response = data.choices[0].message.content;
        console.log('✅ NOA ESPERANÇA respondeu via ChatGPT-4o:', response.substring(0, 100) + '...');
        
        return {
          response: response,
          medicalInsights: this.extractMedicalInsights(question, response),
          confidence: 0.95,
          recommendations: this.generateRecommendations(question, response),
          needsSpecialist: false
        };
                   } else {
        const errorText = await openaiResponse.text();
        console.error('❌ Erro na API do OpenAI:', openaiResponse.status, errorText);
        throw new Error(`Erro na API do OpenAI: ${openaiResponse.status} - ${errorText}`);
      }

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
