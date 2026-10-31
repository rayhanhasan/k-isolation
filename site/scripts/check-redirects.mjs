#!/usr/bin/env node
// Recette des redirections sur un environnement déployé.
// Usage : node scripts/check-redirects.mjs https://k-isolation.fr
// Contrôle pour chaque entrée de redirects.json : statut 301 (ou 404/410 pour les suppressions),
// en-tête Location = cible attendue, et cible finale en 200 (pas de chaîne).
import { readFileSync } from 'node:fs';

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) {
  console.error('Usage : node scripts/check-redirects.mjs <URL de base>');
  process.exit(1);
}
const list = JSON.parse(readFileSync(new URL('../redirects.json', import.meta.url), 'utf8'));
let ko = 0;
for (const r of list) {
  const res = await fetch(base + r.from, { redirect: 'manual' });
  let ok;
  let detail = String(res.status);
  if (r.status === 301) {
    const loc = res.headers.get('location') || '';
    const target = new URL(loc, base);
    ok = [301, 308].includes(res.status) && target.pathname === r.to;
    detail += ` → ${target.pathname}`;
    if (ok) {
      const final = await fetch(target, { redirect: 'manual' });
      ok = final.status === 200;
      detail += ` (${final.status})`;
    }
  } else {
    ok = [404, 410].includes(res.status);
  }
  if (!ok) ko++;
  console.log(`${ok ? '✓' : '✗'} ${r.from}  ${detail}${ok ? '' : `  attendu : ${r.status} ${r.to ?? ''}`}`);
}
console.log(`\n${list.length - ko}/${list.length} conformes`);
process.exit(ko ? 1 : 0);
