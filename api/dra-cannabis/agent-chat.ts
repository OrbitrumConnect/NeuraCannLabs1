import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    console.log('🎭 Consultando agente D-ID NOA ESPERANÇA completo:', message.substring(0, 30));
    
    // Verificar se temos API key
    if (!process.env.DID_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "D-ID API não configurada"
      });
    }

    // Criar conversa com o agente D-ID
    const conversationResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.DID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: message,
          provider: {
            type: 'microsoft',
            voice_id: 'pt-BR-FranciscaNeural'
          }
        },
        config: {
          fluent: true,
          pad_audio: 0.0
        },
        source_url: 'https://create-images-results.d-id.com/google-oauth2|101218376087780649774/upl_C3ha4xZC1dc1diswoqZOH/image.jpeg'
      })
    });

    if (conversationResponse.ok) {
      const conversationData = await conversationResponse.json();
      console.log('✅ Agente D-ID NOA completo - Resposta + Vídeo + Movimento labial:', conversationData.id);
      
      res.json({
        success: true,
        videoUrl: `https://d-id-talks-prod.s3.us-west-2.amazonaws.com/${conversationData.id}/video.mp4`,
        conversationId: conversationData.id,
        message: "Resposta da Dra. Cannabis via D-ID"
      });
    } else {
      console.error('❌ Erro ao criar conversa D-ID:', conversationResponse.status);
      res.status(500).json({
        success: false,
        message: "Erro ao conectar com agente D-ID"
      });
    }
    
  } catch (error: any) {
    console.error('❌ Erro no chat com agente D-ID:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Erro interno no chat com agente D-ID"
    });
  }
}
