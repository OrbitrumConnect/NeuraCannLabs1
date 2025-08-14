import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // For now, return a default admin user
    // In a real app, you'd check session/token
    const adminUser = {
      id: 'admin-1',
      email: 'phpg69@gmail.com',
      name: 'Administrador NeuroCann',
      role: 'admin',
      plan: 'admin',
      specialty: 'Administração Geral',
      crm: 'ADMIN-001'
    };
    
    return res.status(200).json(adminUser);
  } catch (error) {
    console.error('User check error:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
