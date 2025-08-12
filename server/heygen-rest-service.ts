// HeyGen REST API Service - Simplified version for reliable operation
// Based on official HeyGen REST API documentation

export interface HeyGenConfig {
  quality?: 'low' | 'medium' | 'high';
  avatarName?: string;
  voiceId?: string;
  language?: string;
}

export interface HeyGenSession {
  sessionId: string;
  url?: string;
  sdp?: string;
  isConnected: boolean;
}

class HeyGenRestService {
  private apiKey: string;
  private baseUrl = 'https://api.heygen.com';
  private currentSession: HeyGenSession | null = null;

  constructor() {
    this.apiKey = process.env.HEYGEN_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('HEYGEN_API_KEY environment variable is required');
    }
  }

  private async makeRequest(endpoint: string, method: string = 'POST', body?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🔍 HeyGen API Request: ${method} ${url}`);
    if (body) {
      console.log('📤 Request Body:', JSON.stringify(body, null, 2));
    }

    const response = await fetch(url, {
      method,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const responseText = await response.text();
    console.log(`📥 HeyGen API Response (${response.status}):`, responseText);

    if (!response.ok) {
      throw new Error(`HeyGen API Error: ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  async createSession(config: HeyGenConfig = {}): Promise<HeyGenSession> {
    try {
      const sessionData = await this.makeRequest('/v1/streaming.create_token');
      const token = sessionData.data?.token;

      if (!token) {
        throw new Error('Failed to get session token from HeyGen');
      }

      // Create new session first - this returns the session_id we need  
      const requestBody: any = {
        quality: config.quality || 'low',
        avatar_id: config.avatarName || 'anna_public_3_20240108'
      };

      // Only add voice if explicitly configured
      if (config.voiceId) {
        requestBody.voice = {
          voice_id: config.voiceId,
          rate: 1.0
        };
      }

      const newSessionData = await this.makeRequest('/v1/streaming.new', 'POST', requestBody);

      // Extract session_id from the new session response
      const sessionId = newSessionData.data?.session_id;
      if (!sessionId) {
        throw new Error('Failed to get session_id from HeyGen new session');
      }

      this.currentSession = {
        sessionId: sessionId,
        url: newSessionData.data?.url,
        sdp: newSessionData.data?.sdp,
        isConnected: true
      };

      console.log('✅ HeyGen session created successfully:', this.currentSession.sessionId);
      return this.currentSession;

    } catch (error) {
      console.error('❌ Error creating HeyGen session:', error);
      throw error;
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.currentSession || !this.currentSession.isConnected) {
      throw new Error('No active HeyGen session');
    }

    try {
      await this.makeRequest('/v1/streaming.task', 'POST', {
        session_id: this.currentSession.sessionId,
        text: text,
        task_type: "talk"
      });

      console.log('🎤 HeyGen avatar speaking:', text.substring(0, 50) + '...');
    } catch (error) {
      console.error('❌ Error making avatar speak:', error);
      throw error;
    }
  }

  async stopSession(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    try {
      await this.makeRequest('/v1/streaming.stop', 'POST', {
        session_id: this.currentSession.sessionId
      });

      console.log('🛑 HeyGen session stopped:', this.currentSession.sessionId);
      this.currentSession = null;
    } catch (error) {
      console.error('❌ Error stopping session:', error);
      // Still reset session even if stop fails
      this.currentSession = null;
      throw error;
    }
  }

  getStatus() {
    return {
      sessionId: this.currentSession?.sessionId || null,
      isConnected: this.currentSession?.isConnected || false,
      url: this.currentSession?.url || null,
      message: this.currentSession ? 'Sessão ativa' : 'Nenhuma sessão ativa'
    };
  }
}

// Global service instance
let heygenService: HeyGenRestService | null = null;

export function createHeyGenRestService(): HeyGenRestService {
  if (!heygenService) {
    heygenService = new HeyGenRestService();
  }
  return heygenService;
}

export function getHeyGenRestService(): HeyGenRestService | null {
  return heygenService;
}

// Initialize service
console.log('🎬 HeyGen REST API Service initialized');