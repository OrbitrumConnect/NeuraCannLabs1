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

  // Cria um vídeo usando imagem customizada com movimento labial sincronizado
  async createTalkingVideo(imageUrl: string, text: string): Promise<DIDVideoResponse> {
    try {
      // Usa a imagem customizada da Dra. Cannabis para melhor sincronização
      const requestData = {
        source_url: imageUrl,
        script: {
          type: 'text',
          subtitles: 'false',
          provider: {
            type: 'microsoft',
            voice_id: 'pt-BR-FranciscaNeural'
          },
          ssml: 'false',
          input: text
        },
        config: {
          fluent: 'false',
          pad_audio: '0.0'
        }
      };

      const response = await fetch(`${this.baseUrl}/talks`, {
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
        console.error('❌ D-ID Video Creation Error:', response.status, errorText);
        throw new Error(`D-ID Video Creation Error: ${response.status} - ${errorText}`);
      }

      const videoData = await response.json();
      console.log('🎬 Vídeo D-ID criado:', videoData.id);
      
      return videoData;
      
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