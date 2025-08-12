// Sistema profissional de avatar com ElevenLabs integrado ao nosso backend

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: string;
}

interface SpeakRequest {
  text: string;
  voice_settings?: VoiceSettings;
  use_lip_sync?: boolean;
  driver_image_url?: string;
}

interface SpeakResponse {
  audio_url?: string;
  video_url?: string;
  type: 'audio' | 'video';
}

class ProfessionalAvatarService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentVideo: HTMLVideoElement | null = null;
  private isSpeaking = false;

  // Configurações otimizadas para qualidade profissional
  private defaultVoiceSettings: VoiceSettings = {
    stability: 0.75, // Evita voz robótica
    similarity_boost: 0.9, // Mais fiel à voz original
    style: 'Conversational' // Estilo natural
  };

  public async speak(
    text: string, 
    options: {
      quality?: 'high' | 'standard';
      useVideo?: boolean;
      voiceSettings?: Partial<VoiceSettings>;
    } = {}
  ): Promise<void> {
    try {
      // Para múltiplas falas, parar a anterior
      this.stopCurrentSpeech();
      this.isSpeaking = true;

      const requestData: SpeakRequest = {
        text,
        voice_settings: {
          ...this.defaultVoiceSettings,
          ...options.voiceSettings
        },
        use_lip_sync: options.useVideo || false
      };

      console.log('🎭 Enviando para ElevenLabs + D-ID:', { text: text.substring(0, 50) + '...' });

      // Chamar nosso backend que integra ElevenLabs
      const response = await fetch('/api/avatar/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.type === 'native') {
          console.log('⚠️ Fallback para sistema nativo');
          throw new Error('Sistema nativo deve ser usado');
        }
        throw new Error(`Erro na API: ${response.status}`);
      }

      // Backend retorna áudio diretamente
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await this.playAudio(audioUrl);

      console.log('✅ Avatar profissional falou com sucesso');
      
    } catch (error) {
      console.error('❌ Erro no sistema profissional de avatar:', error);
      this.isSpeaking = false;
      throw error;
    }
  }

  private async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentAudio = new Audio(audioUrl);
      
      this.currentAudio.onloadeddata = () => {
        console.log('🔊 Áudio ElevenLabs carregado, reproduzindo...');
      };

      this.currentAudio.onended = () => {
        this.isSpeaking = false;
        console.log('✅ Áudio ElevenLabs terminou');
        resolve();
      };

      this.currentAudio.onerror = (error) => {
        this.isSpeaking = false;
        console.error('❌ Erro na reprodução do áudio:', error);
        reject(error);
      };

      this.currentAudio.play()
        .catch(error => {
          this.isSpeaking = false;
          reject(error);
        });
    });
  }

  private async playVideo(videoUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Criar elemento de vídeo para avatar com lip-sync
      this.currentVideo = document.createElement('video');
      this.currentVideo.src = videoUrl;
      this.currentVideo.autoplay = true;
      this.currentVideo.muted = false; // Áudio do D-ID
      
      // Substituir avatar estático temporariamente
      const avatarContainer = document.querySelector('[data-avatar-container]');
      if (avatarContainer) {
        avatarContainer.appendChild(this.currentVideo);
      }

      this.currentVideo.onloadeddata = () => {
        console.log('🎬 Vídeo D-ID + ElevenLabs carregado, reproduzindo...');
      };

      this.currentVideo.onended = () => {
        this.isSpeaking = false;
        if (avatarContainer && this.currentVideo) {
          avatarContainer.removeChild(this.currentVideo);
        }
        console.log('✅ Vídeo D-ID terminou');
        resolve();
      };

      this.currentVideo.onerror = (error) => {
        this.isSpeaking = false;
        console.error('❌ Erro na reprodução do vídeo:', error);
        reject(error);
      };
    });
  }

  public stopCurrentSpeech(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    if (this.currentVideo) {
      this.currentVideo.pause();
      const avatarContainer = document.querySelector('[data-avatar-container]');
      if (avatarContainer && avatarContainer.contains(this.currentVideo)) {
        avatarContainer.removeChild(this.currentVideo);
      }
      this.currentVideo = null;
    }
    
    this.isSpeaking = false;
  }

  public get isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  // Método para saudação com máxima qualidade
  public async speakWelcome(): Promise<void> {
    const welcomeText = "Olá! Bem-vindo ao NeuroCann Lab! Eu sou a Dra. Cannabis IA, sua assistente médica especializada em cannabis medicinal. Como posso ajudá-lo hoje?";
    
    await this.speak(welcomeText, {
      quality: 'high',
      useVideo: true, // Usar lip-sync para saudação
      voiceSettings: {
        stability: 0.8, // Máxima estabilidade para saudação
        similarity_boost: 1.0 // Máxima fidelidade
      }
    });
  }

  // Método para consultas médicas com qualidade padrão
  public async speakMedicalResponse(text: string): Promise<void> {
    await this.speak(text, {
      quality: 'standard',
      useVideo: false, // Apenas áudio para respostas rápidas
      voiceSettings: {
        stability: 0.75,
        similarity_boost: 0.85
      }
    });
  }
}

export const professionalAvatarService = new ProfessionalAvatarService();