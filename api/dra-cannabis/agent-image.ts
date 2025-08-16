import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🖼️ Buscando imagem da agente D-ID: v2_agt_mzs8kQcn');
    
    // Verificar se temos API key
    if (!process.env.DID_API_KEY) {
      return res.status(404).json({ 
        error: 'DID_API_KEY não configurada',
        fallbackImage: '/dra-cannabis-nova.png'
      });
    }

    // Buscar informações da agente D-ID
    const response = await fetch(`https://api.d-id.com/agents/v2_agt_mzs8kQcn`, {
      headers: {
        'Authorization': `Basic ${process.env.DID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const agentData = await response.json();
      console.log('✅ Imagem da agente obtida:', agentData.source_url);
      
      res.json({
        success: true,
        imageUrl: agentData.source_url,
        agentId: 'v2_agt_mzs8kQcn',
        agentName: agentData.name || 'Dra. Cannabis IA'
      });
    } else {
      console.log('⚠️ Não foi possível obter imagem da agente, usando fallback');
      res.json({
        success: false,
        fallbackImage: '/dra-cannabis-nova.png',
        message: 'Usando imagem local como fallback'
      });
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar imagem da agente:', error);
    res.json({
      success: false,
      fallbackImage: '/dra-cannabis-nova.png',
      message: 'Erro ao conectar com D-ID, usando imagem local'
    });
  }
}
