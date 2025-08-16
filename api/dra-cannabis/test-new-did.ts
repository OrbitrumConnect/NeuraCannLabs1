import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.setHeader('Content-Type', 'application/json');
    
    // Testar se conseguimos acessar a API D-ID
    const agentId = 'v2_agt_mzs8kQcn';
    const response = await fetch(`https://api.d-id.com/agents/${agentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${process.env.DID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const isConnected = response.ok;
    
    res.json({
      success: true,
      message: isConnected ? 'D-ID API conectada' : 'Falha na conexão D-ID',
      agent: agentId,
      apiAvailable: true
    });
    
  } catch (error: any) {
    console.error('❌ Erro testando novo agente D-ID:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: "Erro ao conectar com novo agente D-ID"
    });
  }
}
