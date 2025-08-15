import type { VercelRequest, VercelResponse } from '@vercel/node';

const DID_API_KEY = process.env.DID_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, background = 'medical' } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Texto é obrigatório' });
  }

  if (!DID_API_KEY) {
    console.log('⚠️ D-ID API Key não configurada, retornando simulação');
    return res.status(200).json({
      id: 'simulated-talk-id',
      status: 'created',
      message: 'Avatar simulado - configure D-ID API Key para funcionalidade completa'
    });
  }

  try {
    console.log('🎭 Criando avatar D-ID para texto:', text.substring(0, 50) + '...');

    // Backgrounds temáticos que combinam com a plataforma
    const backgrounds = {
      medical: {
        type: 'color',
        color: '#0f172a' // Slate-900 - fundo escuro da plataforma
      },
      cannabis: {
        type: 'color', 
        color: '#0f172a' // Mesmo fundo escuro
      },
      cyber: {
        type: 'color',
        color: '#0f172a' // Fundo cyberpunk
      },
      neon: {
        type: 'color',
        color: '#0f172a' // Fundo escuro com neon
      },
      // Backgrounds com gradientes que combinam
      gradient_cyber: {
        type: 'gradient',
        colors: ['#0f172a', '#1e293b'] // Slate-900 para Slate-800
      },
      gradient_neon: {
        type: 'gradient', 
        colors: ['#0f172a', '#1e1b4b'] // Slate-900 para Indigo-900
      }
    };

    const selectedBackground = backgrounds[background as keyof typeof backgrounds] || backgrounds.medical;

    const dIdResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: 'pt-BR-FranciscaNeural'
          }
        },
        config: {
          fluent: true,
          pad_audio: 0.0,
          background: selectedBackground
        },
        source_url: 'https://create-images-results.d-id.com/google-oauth2|101218376087780649774/upl_C3ha4xZC1dc1diswoqZOH/image.jpeg'
      })
    });

    if (!dIdResponse.ok) {
      const errorText = await dIdResponse.text();
      console.error('❌ Erro na API D-ID:', dIdResponse.status, errorText);
      throw new Error(`Erro na API D-ID: ${dIdResponse.status}`);
    }

    const result = await dIdResponse.json();
    console.log('✅ Avatar D-ID criado:', result.id);

    return res.status(200).json({
      id: result.id,
      status: result.status,
      message: 'Avatar D-ID criado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao criar avatar D-ID:', error);
    return res.status(500).json({ 
      message: 'Erro ao criar avatar D-ID',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
