// HeyGen Streaming Avatar Service using official SDK
import StreamingAvatar, { AvatarQuality, VoiceEmotion } from '@heygen/streaming-avatar';

export interface HeyGenStreamingConfig {
  quality?: AvatarQuality;
  avatarName?: string;
  voiceId?: string;
  language?: string;
}

export class HeyGenStreamingService {
  private avatar: StreamingAvatar | null = null;
  private sessionToken: string | null = null;
  private sessionId: string | null = null;
  private isConnected: boolean = false;

  constructor() {}

  async createSessionToken(): Promise<string> {
    try {
      const apiKey = process.env.HEYGEN_API_KEY;
      if (!apiKey) {
        throw new Error('HEYGEN_API_KEY not found in environment');
      }
      
      const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.log('🔍 Token Error Response:', errorBody);
        throw new Error(`Failed to create token: ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      this.sessionToken = data.data.token;
      console.log('✅ HeyGen session token created successfully');
      return this.sessionToken;
    } catch (error) {
      console.error('❌ Error creating session token:', error);
      throw error;
    }
  }

  async startSession(config: HeyGenStreamingConfig = {}): Promise<{ sessionId: string; success: boolean; url?: string }> {
    try {
      // Create session token first
      if (!this.sessionToken) {
        await this.createSessionToken();
      }

      // Initialize StreamingAvatar with token
      if (!this.sessionToken) {
        throw new Error('Session token is required');
      }
      
      this.avatar = new StreamingAvatar({ 
        token: this.sessionToken 
      });

      // Configure avatar session
      const startRequest = {
        quality: config.quality || AvatarQuality.Low,
        avatarName: config.avatarName || 'default',
        voice: {
          voiceId: config.voiceId || 'default',
          rate: 1.0,
          emotion: VoiceEmotion.FRIENDLY
        },
        language: config.language || 'pt'
      };

      console.log('🔍 Starting HeyGen session with config:', JSON.stringify(startRequest, null, 2));

      // Start the avatar session
      const response = await this.avatar.createStartAvatar(startRequest);
      
      this.sessionId = response.session_id;
      this.isConnected = true;

      console.log('✅ HeyGen Avatar Session Started:', {
        sessionId: this.sessionId,
        url: response.url,
        isPaid: response.is_paid
      });

      return {
        sessionId: this.sessionId,
        success: true,
        url: response.url
      };
    } catch (error) {
      console.error('❌ Error starting HeyGen session:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.avatar || !this.isConnected) {
      throw new Error('Avatar session not active');
    }

    try {
      await this.avatar.speak({
        text: text
      });
      console.log('🎤 Avatar speaking:', text.substring(0, 50) + '...');
    } catch (error) {
      console.error('❌ Error making avatar speak:', error);
      throw error;
    }
  }

  async stopSession(): Promise<void> {
    if (this.avatar) {
      try {
        await this.avatar.stopAvatar();
        console.log('🛑 Avatar session stopped');
      } catch (error) {
        console.error('❌ Error stopping avatar:', error);
      }
    }
    
    this.avatar = null;
    this.sessionId = null;
    this.isConnected = false;
  }

  getStatus() {
    return {
      sessionId: this.sessionId,
      isConnected: this.isConnected,
      hasToken: !!this.sessionToken,
      message: this.isConnected ? "Conectado" : "Desconectado"
    };
  }

  private mapQuality(quality: string): AvatarQuality {
    switch (quality) {
      case 'high': return AvatarQuality.High;
      case 'medium': return AvatarQuality.Medium;
      case 'low': 
      default: return AvatarQuality.Low;
    }
  }
}

// Singleton instance
let heygenStreamingService: HeyGenStreamingService | null = null;

export function getHeyGenStreamingService(): HeyGenStreamingService | null {
  return heygenStreamingService;
}

export function createHeyGenStreamingService(): HeyGenStreamingService {
  heygenStreamingService = new HeyGenStreamingService();
  return heygenStreamingService;
}