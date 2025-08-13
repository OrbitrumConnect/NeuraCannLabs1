// Usando fetch nativo do Node.js 18+

export interface DIDVideoRequest {
  source_url: string; // URL da imagem da Dra. Cannabis
  script: {
    type: 'text';
    input: string; // Texto para a Dra. Cannabis falar
    provider: {
      type: 'microsoft';
      voice_id: 'pt-BR-FranciscaNeural'; // Voz feminina brasileira
    };
  };
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    stitch?: boolean;
    result_format?: 'mp4' | 'gif' | 'mov';
  };
}

export interface DIDVideoResponse {
  id: string;
  object: 'talk';
  created_at: string;
  status: 'created' | 'started' | 'done' | 'error';
  result_url?: string;
  error?: {
    kind: string;
    description: string;
  };
}

export class DIDService {
  private apiKey: string;
  private baseUrl = 'https://api.d-id.com';
  
  constructor() {
    this.apiKey = process.env.DID_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('DID_API_KEY não encontrada nas variáveis de ambiente');
    }
  }

  // Cria um vídeo usando o agente D-ID com movimento labial sincronizado (v2_agt_WAM9eh_P)
  async createTalkingVideo(imageUrl: string, text: string): Promise<DIDVideoResponse> {
    try {
      // Usa o agente D-ID com movimento labial sincronizado
      const agentId = 'v2_agt_WAM9eh_P';
      
      const requestData = {
        message: text,
        session_id: `dra-cannabis-${Date.now()}`,
        source_url: "https://neurocann-lab.replit.app"
      };

      const response = await fetch(`${this.baseUrl}/agents/${agentId}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ D-ID Agent Error:', response.status, errorText);
        throw new Error(`D-ID Agent Error: ${response.status} - ${errorText}`);
      }

      const agentData = await response.json();
      console.log('🎬 Resposta do agente D-ID:', agentData);
      
      // Converte resposta do agente para formato DIDVideoResponse
      const result: DIDVideoResponse = {
        id: `agent-${Date.now()}`,
        object: 'talk',
        created_at: new Date().toISOString(),
        status: agentData.video_url ? 'done' : 'created',
        result_url: agentData.video_url || agentData.result_url
      };
      
      return result;
      
    } catch (error) {
      console.error('❌ Erro ao criar vídeo D-ID:', error);
      throw error;
    }
  }

  // Verifica o status de um vídeo
  async checkVideoStatus(videoId: string): Promise<DIDVideoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/talks/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`D-ID API Error: ${response.status} - ${errorText}`);
      }

      return await response.json() as DIDVideoResponse;
      
    } catch (error) {
      console.error('❌ Erro ao verificar status D-ID:', error);
      throw error;
    }
  }

  // Aguarda a conclusão do vídeo (polling)
  async waitForVideoCompletion(videoId: string, maxWaitTime = 60000): Promise<string> {
    const startTime = Date.now();
    const checkInterval = 2000; // 2 segundos
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const status = await this.checkVideoStatus(videoId);
          
          if (status.status === 'done' && status.result_url) {
            console.log('✅ Vídeo D-ID concluído:', status.result_url);
            resolve(status.result_url);
            return;
          }
          
          if (status.status === 'error') {
            console.error('❌ Erro na geração D-ID:', status.error);
            reject(new Error(`Erro D-ID: ${status.error?.description || 'Erro desconhecido'}`));
            return;
          }
          
          // Verificar timeout
          if (Date.now() - startTime > maxWaitTime) {
            reject(new Error('Timeout na geração do vídeo D-ID'));
            return;
          }
          
          // Continuar verificando
          console.log(`⏳ Status D-ID: ${status.status} (${videoId})`);
          setTimeout(checkStatus, checkInterval);
          
        } catch (error) {
          reject(error);
        }
      };
      
      checkStatus();
    });
  }

  // Método completo: criar e aguardar conclusão
  async generateAnimatedSpeech(imageUrl: string, text: string): Promise<string> {
    try {
      console.log('🎬 Iniciando animação D-ID para Dra. Cannabis...');
      
      // Criar o vídeo
      const videoCreation = await this.createTalkingVideo(imageUrl, text);
      
      // Aguardar conclusão
      const resultUrl = await this.waitForVideoCompletion(videoCreation.id);
      
      console.log('✅ Animação D-ID concluída:', resultUrl);
      return resultUrl;
      
    } catch (error) {
      console.error('❌ Erro completo na animação D-ID:', error);
      throw error;
    }
  }
}

// Instância singleton
let didServiceInstance: DIDService | null = null;

export function getDIDService(): DIDService {
  if (!didServiceInstance) {
    try {
      didServiceInstance = new DIDService();
    } catch (error) {
      console.error('⚠️ D-ID service não disponível:', error);
      throw error;
    }
  }
  return didServiceInstance;
}