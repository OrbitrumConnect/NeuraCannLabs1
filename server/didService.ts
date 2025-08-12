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
    this.apiKey = process.env.DID_API_KEY || '';
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

  // Método para criar avatar médico falando
  async createMedicalAssistantTalk(text: string, imageUrl?: string): Promise<DIDTalkResponse> {
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

    return this.createTalk(request);
  }
}