// Adaptateur Netlify Functions (v2) : même logique que la fonction Vercel /api/lead.
import { POST } from '../../api/lead';

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Méthode non autorisée', { status: 405, headers: { Allow: 'POST' } });
  return POST(req);
};

export const config = { path: '/api/lead' };
