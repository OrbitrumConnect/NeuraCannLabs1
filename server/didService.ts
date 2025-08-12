// Usando fetch nativo do Node.js 18+

export interface DIDTalkRequest {
  source_url: string;
  script: {
    type: 'text' | 'audio';
    input: string;
    provider?: {
      type: string;
      voice_id?: string;
    };
  };
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    result_format?: string;
    face?: {
      mask_confidence?: number;
      crop_type?: string;
      expression?: string;
      animation_instructions?: any[];
    };
  };
}

export interface DIDTalkResponse {
  id: string;
  status: 'created' | 'done' | 'error';
  result_url?: string;
  error?: string;
}

export class DIDService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.d-id.com';

  constructor() {
    // Usando a chave API fornecida
    this.apiKey = process.env.DID_API_KEY || 'cGhwZzY5QGdtYWlsLmNvbQ:jt6E9r8R8sWdtaFBE0_rB';
    if (!this.apiKey) {
      throw new Error('DID_API_KEY not configured');
    }
  }

  async createTalk(request: DIDTalkRequest): Promise<DIDTalkResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/talks`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`D-ID API error: ${response.status} - ${errorText}`);
      }

      return await response.json() as DIDTalkResponse;
    } catch (error) {
      console.error('Error creating D-ID talk:', error);
      throw error;
    }
  }

  async getTalkStatus(talkId: string): Promise<DIDTalkResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/talks/${talkId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`D-ID API error: ${response.status} - ${errorText}`);
      }

      return await response.json() as DIDTalkResponse;
    } catch (error) {
      console.error('Error getting D-ID talk status:', error);
      throw error;
    }
  }

  async uploadImage(imageBuffer: Buffer): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
      formData.append('image', blob, 'doctor.jpg');

      const response = await fetch(`${this.baseUrl}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`D-ID upload error: ${response.status} - ${errorText}`);
      }

      const result = await response.json() as { url: string };
      return result;
    } catch (error) {
      console.error('Error uploading image to D-ID:', error);
      throw error;
    }
  }

  // Método para criar avatar médico falando com movimentação da boca otimizada
  async createMedicalAssistantTalk(text: string, imageUrl?: string, mouthMovements?: any): Promise<DIDTalkResponse> {
    const defaultImageUrl = imageUrl || 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg';
    
    const request: DIDTalkRequest = {
      source_url: defaultImageUrl,
      script: {
        type: 'text',
        input: text,
        provider: {
          type: 'elevenlabs',
          voice_id: 'EXAVITQu4vr4xnSDxMaL', // Voz feminina profissional
        },
      },
      config: {
        fluent: true,
        pad_audio: 0,
      },
    };

    // Add mouth movement configuration if provided
    if (mouthMovements) {
      request.config = {
        ...request.config,
        // Enhanced configuration for better mouth synchronization
        result_format: 'mp4',
        face: {
          mask_confidence: 0.8,
          crop_type: 'rectangle',
          expression: mouthMovements.expression || 'friendly',
        }
      };

      // If ChatGPT provides specific mouth movement commands, add them
      if (mouthMovements.commands && request.config?.face) {
        request.config.face.animation_instructions = mouthMovements.commands;
      }

      console.log('🗣️ Aplicando movimentação da boca personalizada');
    }

    return this.createTalk(request);
  }

  // Enhanced method for ChatGPT integration with intelligent mouth movement
  async createIntelligentTalk(text: string, chatGptResponse?: any, imageUrl?: string): Promise<DIDTalkResponse> {
    console.log('🧠 Criando talk inteligente com ChatGPT integration...');
    
    let mouthMovements = null;
    
    // Extract mouth movement instructions from ChatGPT response if available
    if (chatGptResponse?.mouthCommands) {
      mouthMovements = {
        expression: chatGptResponse.mouthCommands.expression || 'friendly',
        commands: chatGptResponse.mouthCommands.movements || [],
      };
      console.log('🤖 Comandos de movimentação da boca detectados do ChatGPT');
    } else {
      // Default intelligent mouth movements for medical assistant
      mouthMovements = {
        expression: 'professional',
        commands: [
          { time: 0, action: 'smile_slight' },
          { time: 0.5, action: 'mouth_open_medical' },
          { time: 1.0, action: 'nod_understanding' }
        ]
      };
      console.log('💊 Aplicando movimentação médica padrão');
    }

    try {
      return await this.createMedicalAssistantTalk(text, imageUrl, mouthMovements);
    } catch (error) {
      console.error('Erro ao criar talk inteligente, usando método padrão:', error);
      // Fallback to regular talk creation
      return await this.createMedicalAssistantTalk(text, imageUrl);
    }
  }
}