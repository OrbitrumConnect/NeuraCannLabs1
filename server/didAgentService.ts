// Serviço para integração com agente D-ID compartilhado
// Conecta o agente D-ID ao sistema NOA ESPERANÇA

export class DIDAgentService {
  private agentId: string;
  private apiKey: string;
  private baseUrl: string = 'https://api.d-id.com';

  constructor() {
    // Atualizado para o novo avatar da Dra. Cannabis compartilhado
    this.agentId = 'v2_agt_mzs8kQcn'; // Novo ID do agente D-ID compartilhado
    this.apiKey = process.env.DID_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ DID_API_KEY não encontrada - Agente D-ID em modo limitado');
    } else {
      console.log('🎭 Novo agente D-ID da Dra. Cannabis inicializado:', this.agentId);
    }
  }

  // Conecta NOA ESPERANÇA com o agente D-ID (mulher profissional com movimento labial sincronizado)
  async sendMessageToAgent(message: string, sessionId?: string): Promise<{
    response: string;
    videoUrl?: string;
    audioUrl?: string;
  }> {
    try {
      // Usa o agente D-ID pré-configurado com imagem da mulher profissional
      if (this.apiKey) {
        const response = await fetch(`${this.baseUrl}/agents/${this.agentId}/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            session_id: sessionId || `session-${Date.now()}`,
            source_url: "https://neurocann-lab.replit.app"
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('🎭 Dra. Cannabis (agente original) respondeu:', data.response?.substring(0, 100));
          return {
            response: data.response || "Agente não respondeu",
            videoUrl: data.video_url,
            audioUrl: data.audio_url
          };
        }
      }

      // Fallback: Usar ChatGPT como NOA ESPERANÇA
      console.log('🧠 Usando ChatGPT como NOA ESPERANÇA (fallback)');
      
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `Você é NOA ESPERANÇA, a assistente médica especializada em cannabis medicinal criada pelo usuário.

                PERSONALIDADE DA NOA ESPERANÇA:
                - Extremamente empática e acolhedora
                - Especialista em cannabis medicinal
                - Faz anamnese completa e detalhada
                - Explora aspectos emocionais e sociais
                - Sempre pergunta "há mais alguma coisa?"
                - Educativa e baseada em evidências
                - Identifica quando precisa encaminhamento médico
                
                IMPORTANTE: Você É a NOA ESPERANÇA, não a Dra. Cannabis. Responda como NOA.`
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (chatResponse.ok) {
          const chatData = await chatResponse.json();
          const response = chatData.choices[0].message.content;
          console.log('✅ NOA ESPERANÇA (ChatGPT) respondeu:', response.substring(0, 100));
          return { response };
        }
      }

      // Último fallback: resposta fixa
      return {
        response: "Olá! Sou NOA ESPERANÇA. No momento estou com limitações técnicas, mas posso ajudá-lo com questões sobre cannabis medicinal. Me conte sobre sua situação?"
      };

    } catch (error) {
      console.error('❌ Erro na NOA ESPERANÇA:', error);
      return {
        response: "Desculpe, houve um problema técnico. Tente novamente em alguns momentos."
      };
    }
  }

  // Cria nova sessão de chat com o agente
  async createChatSession(): Promise<string> {
    const sessionId = `noa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('🆕 Nova sessão criada com agente D-ID:', sessionId);
    return sessionId;
  }

  // Verifica status do agente D-ID
  async getAgentStatus(): Promise<{
    available: boolean;
    agentId: string;
    status: string;
  }> {
    try {
      if (!this.apiKey) {
        return {
          available: false,
          agentId: this.agentId,
          status: 'API key não configurada'
        };
      }

      const response = await fetch(`${this.baseUrl}/agents/${this.agentId}`, {
        headers: {
          'Authorization': `Basic ${this.apiKey}`
        }
      });

      const available = response.ok;
      
      return {
        available,
        agentId: this.agentId,
        status: available ? 'Ativo' : `Erro: ${response.status}`
      };

    } catch (error) {
      return {
        available: false,
        agentId: this.agentId,
        status: `Erro: ${error.message}`
      };
    }
  }
}

// Instância singleton do serviço
export const didAgentService = new DIDAgentService();