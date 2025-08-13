// HeyGen API - Melhor alternativa para animação facial médica
export interface HeyGenVideoRequest {
  video_inputs: [{
    character: {
      type: 'avatar';
      avatar_id?: string;
      avatar_url?: string; // URL da nossa imagem médica
    };
    voice: {
      type: 'text';
      input_text: string;
      voice_id: 'PT-BR-Wavenet-A'; // Voz feminina brasileira
    };
  }];
}

export interface HeyGenVideoResponse {
  code: number;
  data: {
    video_id: string;
    status: 'processing' | 'completed' | 'failed';
    video_url?: string;
  };
  message: string;
}

export class HeyGenService {
  private apiKey: string;
  private baseUrl = 'https://api.heygen.com/v2';
  
  constructor() {
    this.apiKey = process.env.HEYGEN_API_KEY || '';
  }

  async createTalkingVideo(imageUrl: string, text: string): Promise<HeyGenVideoResponse> {
    if (!this.apiKey) {
      throw new Error('HEYGEN_API_KEY não encontrada');
    }

    const requestData: HeyGenVideoRequest = {
      video_inputs: [{
        character: {
          type: 'avatar',
          avatar_url: imageUrl
        },
        voice: {
          type: 'text',
          input_text: text,
          voice_id: 'PT-BR-Wavenet-A'
        }
      }]
    };

    const response = await fetch(`${this.baseUrl}/video/generate`, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HeyGen error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  async getVideoStatus(videoId: string): Promise<HeyGenVideoResponse> {
    const response = await fetch(`${this.baseUrl}/video/${videoId}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': this.apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HeyGen status error: ${response.status}`);
    }

    return await response.json();
  }
}