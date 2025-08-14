import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, voice = 'pt-BR-FranciscaNeural' } = req.body;

  try {
    // Simular resposta de síntese de voz
    const audioResponse = {
      audioUrl: `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`,
      duration: text ? text.length * 0.1 : 2.0,
      voice: voice,
      text: text || 'Olá! Sou a Dra. Cannabis, como posso ajudá-lo?'
    };

    return res.status(200).json(audioResponse);

  } catch (error) {
    console.error('Avatar speak error:', error);
    return res.status(500).json({ 
      message: 'Erro na síntese de voz',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
