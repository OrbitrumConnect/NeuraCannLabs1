import { nativeAvatarService } from './nativeAvatarService';

interface WelcomeStatus {
  userId: string;
  lastWelcome: string;
  hasWelcomedToday: boolean;
}

class WelcomeService {
  private readonly STORAGE_KEY = 'neurocann-welcome-status';

  private getWelcomeStatus(): WelcomeStatus {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return {
        userId: 'free-user',
        lastWelcome: '',
        hasWelcomedToday: false
      };
    }
    return JSON.parse(stored);
  }

  private saveWelcomeStatus(status: WelcomeStatus): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status));
  }

  public shouldPlayWelcome(): boolean {
    const status = this.getWelcomeStatus();
    const today = new Date().toDateString();
    
    console.log('🎤 Verificando boas-vindas:', {
      lastWelcome: status.lastWelcome,
      today: today,
      hasWelcomedToday: status.hasWelcomedToday
    });

    return status.lastWelcome !== today;
  }

  public async playWelcomeMessage(): Promise<void> {
    if (!this.shouldPlayWelcome()) {
      console.log('🎤 Saudação já executada hoje');
      return;
    }

    const welcomeMessage = "Olá! Bem-vindo ao NeuroCann Lab! Eu sou a Dra. Cannabis IA, sua assistente médica especializada em cannabis medicinal. Como posso ajudá-lo hoje?";
    
    try {
      // Reproduzir saudação
      await nativeAvatarService.makeAvatarSpeak(welcomeMessage, 'professional');
      
      // Marcar como executada
      this.markWelcomePlayed();
      
      console.log('✅ Saudação reproduzida com sucesso');
    } catch (error) {
      console.error('❌ Erro na saudação automática:', error);
    }
  }

  public markWelcomePlayed(): void {
    const today = new Date().toDateString();
    const status: WelcomeStatus = {
      userId: 'free-user',
      lastWelcome: today,
      hasWelcomedToday: true
    };
    
    this.saveWelcomeStatus(status);
    
    console.log('🎤 Saudação marcada como executada:', {
      today: today,
      hasWelcomedToday: true
    });
  }

  public resetWelcomeForToday(): void {
    const status = this.getWelcomeStatus();
    status.lastWelcome = '';
    status.hasWelcomedToday = false;
    this.saveWelcomeStatus(status);
  }
}

export const welcomeService = new WelcomeService();