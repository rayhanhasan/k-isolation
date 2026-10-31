// Génère la configuration de redirections pour l'hébergeur à partir de redirects.json
// (source unique). Usage : node scripts/build-redirects.mjs
//  - vercel.json        → Vercel (301 explicites ; les 410 tombent sur la page 404)
//  - public/_redirects  → Netlify / Cloudflare Pages
import { readFileSync, writeFileSync } from 'node:fs';

const list = JSON.parse(readFileSync(new URL('../redirects.json', import.meta.url), 'utf8'));
const moved = list.filter((r) => r.status === 301 && r.to);

const vercel = JSON.parse(readFileSync(new URL('../vercel.base.json', import.meta.url), 'utf8'));
vercel.redirects = moved.map((r) => ({ source: r.from, destination: r.to, statusCode: 301 }));
writeFileSync(new URL('../vercel.json', import.meta.url), JSON.stringify(vercel, null, 2) + '\n');

const lines = moved.map((r) => `${r.from} ${r.to} 301`);
lines.push(...list.filter((r) => r.status === 410).map((r) => `${r.from} /404/ 410`));
writeFileSync(new URL('../public/_redirects', import.meta.url), lines.join('\n') + '\n');
// Sitemap des anciennes URL (à soumettre 30 à 60 jours dans Search Console pour accélérer la prise en compte des 301)
const legacy = list
  .filter((r) => r.status === 301 && r.from.endsWith('/') && !r.from.includes('sitemap') && !r.from.includes('feed'))
  .map((r) => `  <url><loc>https://k-isolation.fr${r.from}</loc></url>`);
writeFileSync(
  new URL('../public/sitemap-legacy.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${legacy.join('\n')}\n</urlset>\n`,
);
console.log(`${moved.length} redirections 301 écrites (vercel.json + public/_redirects), ${legacy.length} URL dans sitemap-legacy.xml`);
