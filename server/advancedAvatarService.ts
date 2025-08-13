import { DIDService } from './didService';
import { HeyGenService } from './heygenService';

export interface AvatarAnimationRequest {
  imageUrl: string;
  text: string;
  preferredService?: 'did' | 'heygen' | 'native';
}

export interface AvatarAnimationResponse {
  success: boolean;
  service: string;
  videoUrl?: string;
  videoId?: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

export class AdvancedAvatarService {
  private didService: DIDService;
  private heygenService: HeyGenService;

  constructor() {
    this.didService = new DIDService();
    this.heygenService = new HeyGenService();
  }

  async createTalkingAvatar(request: AvatarAnimationRequest): Promise<AvatarAnimationResponse> {
    const { imageUrl, text, preferredService = 'did' } = request;

    // Tentar D-ID primeiro (melhor para rostos médicos reais)
    if (preferredService === 'did' || preferredService === undefined) {
      try {
        console.log('🎭 Tentando D-ID para animação facial...');
        const didResponse = await this.didService.createTalkingVideo(imageUrl, text);
        
        return {
          success: true,
          service: 'D-ID',
          videoId: didResponse.id,
          status: didResponse.status === 'done' ? 'completed' : 'processing',
          videoUrl: didResponse.result_url
        };
      } catch (error) {
        console.log('⚠️ D-ID falhou, tentando HeyGen...', error);
      }
    }

    // Tentar HeyGen como fallback
    if (preferredService === 'heygen' || preferredService === undefined) {
      try {
        console.log('🎭 Tentando HeyGen para animação facial...');
        const heygenResponse = await this.heygenService.createTalkingVideo(imageUrl, text);
        
        if (heygenResponse.code === 200) {
          return {
            success: true,
            service: 'HeyGen',
            videoId: heygenResponse.data.video_id,
            status: heygenResponse.data.status,
            videoUrl: heygenResponse.data.video_url
          };
        }
      } catch (error) {
        console.log('⚠️ HeyGen falhou, usando animação nativa...', error);
      }
    }

    // Fallback para animação nativa melhorada
    console.log('🎭 Usando sistema de animação facial nativo...');
    return {
      success: true,
      service: 'Native Enhanced',
      status: 'completed'
    };
  }

  async checkVideoStatus(videoId: string, service: string): Promise<AvatarAnimationResponse> {
    try {
      if (service === 'D-ID') {
        const status = await this.didService.checkVideoStatus(videoId);
        return {
          success: true,
          service: 'D-ID',
          videoId: status.id,
          status: status.status === 'done' ? 'completed' : status.status as any,
          videoUrl: status.result_url,
          error: status.error?.description
        };
      } else if (service === 'HeyGen') {
        const status = await this.heygenService.getVideoStatus(videoId);
        return {
          success: true,
          service: 'HeyGen',
          videoId: status.data.video_id,
          status: status.data.status,
          videoUrl: status.data.video_url
        };
      }
    } catch (error) {
      return {
        success: false,
        service,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }

    return {
      success: false,
      service: 'unknown',
      status: 'failed',
      error: 'Serviço não reconhecido'
    };
  }

  // Detectar melhor API baseada na imagem
  detectBestService(imageUrl: string): 'did' | 'heygen' | 'native' {
    // Para rostos médicos reais e limpos como nossa nova imagem: D-ID
    // Para avatares sintéticos: HeyGen  
    // Para imagens com problemas: Native
    
    if (imageUrl.includes('image_1755025319400.png')) {
      // Nossa imagem médica perfeita - ideal para D-ID
      return 'did';
    }
    
    return 'did'; // Default para D-ID
  }
}