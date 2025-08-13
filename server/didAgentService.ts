// Serviço para integração com agente D-ID compartilhado
// Conecta o agente D-ID ao sistema NOA ESPERANÇA

export class DIDAgentService {
  private agentId: string;
  private apiKey: string;
  private baseUrl: string = 'https://api.d-id.com';

  constructor() {
    this.agentId = 'v2_agt_GXoEyw-r'; // ID do agente compartilhado
    this.apiKey = process.env.DID_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ DID_API_KEY não encontrada - Agente D-ID em modo limitado');
    } else {
      console.log('🎭 Agente D-ID inicializado:', this.agentId);
    }
  }

  // Conecta NOA ESPERANÇA com o agente D-ID
  async sendMessageToAgent(message: string, sessionId?: string): Promise<{
    response: string;
    videoUrl?: string;
    audioUrl?: string;
  }> {
    try {
      if (!this.apiKey) {
        return {
          response: "Agente D-ID não configurado - aguardando API key"
        };
      }

      // Envia mensagem para o agente D-ID
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

      if (!response.ok) {
        throw new Error(`Erro D-ID Agent: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('🎭 Resposta do agente D-ID:', data.response?.substring(0, 100));

      return {
        response: data.response || "Agente não respondeu",
        videoUrl: data.video_url,
        audioUrl: data.audio_url
      };

    } catch (error) {
      console.error('❌ Erro no agente D-ID:', error);
      return {
        response: "Erro ao conectar com agente D-ID"
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