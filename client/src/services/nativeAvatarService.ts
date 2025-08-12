// Serviço nativo de avatar falante usando Web APIs
export interface SpeechConfig {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface MouthAnimationConfig {
  duration: number;
  intensity: 'light' | 'medium' | 'strong';
  pattern: 'medical' | 'friendly' | 'professional';
}

export class NativeAvatarService {
  private speechSynthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private animationCallback: ((isActive: boolean, intensity: number) => void) | null = null;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
  }

  // Configura callback para animação da boca
  setAnimationCallback(callback: (isActive: boolean, intensity: number) => void) {
    this.animationCallback = callback;
  }

  // Obtém vozes femininas disponíveis em português
  getPortugueseVoices(): SpeechSynthesisVoice[] {
    const voices = this.speechSynthesis.getVoices();
    return voices.filter(voice => 
      voice.lang.startsWith('pt') && voice.name.toLowerCase().includes('female')
    );
  }

  // Calcula intensidade da animação baseada no texto
  private calculateAnimationIntensity(text: string, timestamp: number): number {
    // Análise simples da intensidade baseada no conteúdo
    const vowels = (text.match(/[aeiouáéíóúâêîôûãõ]/gi) || []).length;
    const consonants = (text.match(/[bcdfghjklmnpqrstvwxyzçñ]/gi) || []).length;
    
    // Simula variação natural da fala
    const baseIntensity = Math.min(1, (vowels + consonants * 0.7) / text.length);
    const variation = Math.sin(timestamp * 0.01) * 0.3;
    
    return Math.max(0.1, Math.min(1, baseIntensity + variation));
  }

  // Cria fala com animação da boca sincronizada
  async createSpeechWithAnimation(config: SpeechConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Para a fala atual se existir
        this.stopSpeech();

        // Cria nova utterance
        this.currentUtterance = new SpeechSynthesisUtterance(config.text);
        
        // Configura voz
        const voices = this.getPortugueseVoices();
        if (voices.length > 0) {
          // Prefere voz feminina profissional
          const professionalVoice = voices.find(v => 
            v.name.toLowerCase().includes('helena') || 
            v.name.toLowerCase().includes('luciana') ||
            v.name.toLowerCase().includes('maria')
          ) || voices[0];
          
          this.currentUtterance.voice = professionalVoice;
        }

        // Configura parâmetros de voz
        this.currentUtterance.rate = config.rate || 0.9; // Levemente mais lenta para clareza médica
        this.currentUtterance.pitch = config.pitch || 1.1; // Tom levemente mais agudo
        this.currentUtterance.volume = config.volume || 0.8;

        // Controla animação da boca durante a fala
        let animationFrame: number;
        let startTime = Date.now();

        const animatemouth = () => {
          if (this.animationCallback && this.currentUtterance) {
            const elapsed = Date.now() - startTime;
            const intensity = this.calculateAnimationIntensity(config.text, elapsed);
            this.animationCallback(true, intensity);
            animationFrame = requestAnimationFrame(animatemouth);
          }
        };

        // Eventos da fala
        this.currentUtterance.onstart = () => {
          console.log('🗣️ Dra. Cannabis começou a falar');
          animatemouth();
        };

        this.currentUtterance.onend = () => {
          console.log('✅ Dra. Cannabis terminou de falar');
          if (this.animationCallback) {
            this.animationCallback(false, 0);
          }
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
          }
          resolve();
        };

        this.currentUtterance.onerror = (event) => {
          console.error('❌ Erro na síntese de voz:', event.error);
          if (this.animationCallback) {
            this.animationCallback(false, 0);
          }
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
          }
          reject(new Error(`Erro na síntese de voz: ${event.error}`));
        };

        // Inicia a fala
        this.speechSynthesis.speak(this.currentUtterance);

      } catch (error) {
        console.error('Erro ao criar fala com animação:', error);
        reject(error);
      }
    });
  }

  // Para a fala atual
  stopSpeech() {
    if (this.currentUtterance) {
      this.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
    if (this.animationCallback) {
      this.animationCallback(false, 0);
    }
  }

  // Verifica se está falando
  isSpeaking(): boolean {
    return this.speechSynthesis.speaking;
  }

  // Método principal para fazer a Dra. Cannabis falar
  async makeAvatarSpeak(text: string, pattern: 'medical' | 'friendly' | 'professional' = 'medical'): Promise<void> {
    const config: SpeechConfig = {
      text,
      rate: pattern === 'medical' ? 0.85 : 0.9,
      pitch: pattern === 'professional' ? 1.0 : 1.1,
      volume: 0.8
    };

    return this.createSpeechWithAnimation(config);
  }

  // Resposta padrão da Dra. Cannabis
  async speakDefaultGreeting(): Promise<void> {
    const greetings = [
      "Olá! Sou a Dra. Cannabis, sua assistente médica especializada em cannabis medicinal.",
      "Bem-vindo ao NeuroCann Lab. Como posso ajudá-lo hoje?",
      "Estou aqui para auxiliar com informações médicas sobre cannabis terapêutica."
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    return this.makeAvatarSpeak(randomGreeting, 'professional');
  }
}

// Instância global do serviço
export const nativeAvatarService = new NativeAvatarService();