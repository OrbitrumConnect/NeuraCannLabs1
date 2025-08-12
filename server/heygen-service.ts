export interface HeyGenConfig {
  avatarName?: string;
  quality?: string;
  voiceId?: string;
  language?: string;
}

export class HeyGenService {
  private sessionId: string | null = null;
  private isConnected: boolean = false;
  private accessToken: string;
  private streamingToken: string | null = null;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async createAccessToken(): Promise<string> {
    try {
      // Decode base64 token if needed
      const decodedToken = Buffer.from(this.accessToken, 'base64').toString('utf-8');
      
      // Create streaming token using the API key
      const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
        method: 'POST',
        headers: {
          'x-api-key': decodedToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to create token: ${response.statusText}`);
      }

      const data = await response.json();
      this.streamingToken = data.data.token;
      return this.streamingToken;
    } catch (error) {
      console.error('Error creating access token:', error);
      throw error;
    }
  }

  async startSession(config: HeyGenConfig = {}): Promise<{ sessionId: string; success: boolean }> {
    try {
      // Get streaming token
      if (!this.streamingToken) {
        await this.createAccessToken();
      }
      
      // Create avatar session using REST API
      const response = await fetch('https://api.heygen.com/v1/streaming.new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.streamingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quality: config.quality || 'low',
          avatar_name: config.avatarName || 'angela_public_3_20240108',
          voice: {
            voice_id: config.voiceId || 'pt-BR-AntonioNeural',
            rate: 1.0,
            emotion: 'friendly'
          },
          language: config.language || 'pt'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to start session: ${response.statusText}`);
      }

      const data = await response.json();
      this.sessionId = data.data.session_id;
      this.isConnected = true;

      console.log('🎬 HeyGen Avatar Session Started:', this.sessionId);

      return {
        sessionId: this.sessionId,
        success: true
      };
    } catch (error) {
      console.error('❌ Error starting HeyGen session:', error);
      throw error;
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.sessionId || !this.isConnected) {
      throw new Error('Avatar session not active');
    }

    try {
      const response = await fetch('https://api.heygen.com/v1/streaming.task', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.streamingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          text: text,
          task_type: 'talk'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to make avatar speak: ${response.statusText}`);
      }
      
      console.log(`🎤 Avatar speaking: "${text}"`);
    } catch (error) {
      console.error('❌ Error making avatar speak:', error);
      throw error;
    }
  }

  async startVoiceChat(): Promise<void> {
    if (!this.sessionId) {
      throw new Error('Avatar session not active');
    }

    try {
      const response = await fetch('https://api.heygen.com/v1/streaming.start_voice_chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.streamingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to start voice chat: ${response.statusText}`);
      }
      
      console.log('🎙️ Voice chat started');
    } catch (error) {
      console.error('❌ Error starting voice chat:', error);
      throw error;
    }
  }

  async closeVoiceChat(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const response = await fetch('https://api.heygen.com/v1/streaming.stop_voice_chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.streamingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        console.warn('Failed to close voice chat:', response.statusText);
      }
      
      console.log('🎙️ Voice chat closed');
    } catch (error) {
      console.error('❌ Error closing voice chat:', error);
    }
  }

  async interrupt(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const response = await fetch('https://api.heygen.com/v1/streaming.interrupt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.streamingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        console.warn('Failed to interrupt avatar:', response.statusText);
      }
      
      console.log('⏹️ Avatar interrupted');
    } catch (error) {
      console.error('❌ Error interrupting avatar:', error);
    }
  }

  async keepAlive(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const response = await fetch('https://api.heygen.com/v1/streaming.ice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.streamingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        console.warn('Failed to send keep alive:', response.statusText);
      }
      
      console.log('💓 Keep alive sent');
    } catch (error) {
      console.error('❌ Error keeping alive:', error);
    }
  }

  async stopSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const response = await fetch('https://api.heygen.com/v1/streaming.stop', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.streamingToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        console.warn('Failed to stop session:', response.statusText);
      }

      this.sessionId = null;
      this.isConnected = false;
      this.streamingToken = null;
      
      console.log('🛑 Avatar session stopped');
    } catch (error) {
      console.error('❌ Error stopping avatar:', error);
    }
  }

  getSessionInfo(): { sessionId: string | null; isConnected: boolean } {
    return {
      sessionId: this.sessionId,
      isConnected: this.isConnected
    };
  }
}

// Singleton instance
let heygenService: HeyGenService | null = null;

export function createHeyGenService(accessToken: string): HeyGenService {
  if (!heygenService) {
    heygenService = new HeyGenService(accessToken);
  }
  return heygenService;
}

export function getHeyGenService(): HeyGenService | null {
  return heygenService;
}