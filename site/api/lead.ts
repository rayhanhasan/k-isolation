/**
 * Réception des demandes de devis (fonction serverless Vercel : /api/lead).
 *
 * Variables d'environnement (Vercel > Project > Settings > Environment Variables) :
 *   RESEND_API_KEY     clé API Resend (envoi des e-mails)            — recommandé
 *   LEAD_TO_EMAIL      destinataire interne (défaut : contact@k-isolation.fr)
 *   LEAD_FROM_EMAIL    expéditeur vérifié chez Resend (ex. « K Isolation <devis@k-isolation.fr> »)
 *   LEAD_WEBHOOK_URL   facultatif : transfert JSON vers un CRM / Make / Zapier / n8n / Google Sheets
 *
 * Fonctionne avec un envoi JSON (formulaire JavaScript) ou un envoi classique
 * (formulaire sans JavaScript → redirection vers /merci/).
 */
import { scoreLead, BESOINS, SECTEURS, ECHEANCES } from '../src/data/devis';

type Lead = Record<string, string>;

const MAX = 3000;
const clean = (v: unknown, n = 300) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const labelOf = (list: readonly { value: string; label: string }[], v: string) => list.find((x) => x.value === v)?.label ?? v;

async function readBody(req: Request): Promise<Lead> {
  const type = req.headers.get('content-type') || '';
  if (type.includes('application/json')) return (await req.json()) as Lead;
  const fd = await req.formData();
  return Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
}

function validate(l: Lead): string | null {
  if (l.website) return 'spam';
  const t0 = Number(l.t0);
  if (t0 && Date.now() - t0 < 3000) return 'spam';
  if (!l.besoin || !l.secteur) return 'besoin';
  if (!/^\d{4,5}$/.test(l.cp)) return 'cp';
  if (!l.nom || !l.societe) return 'identite';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(l.email)) return 'email';
  if (l.tel.replace(/\D/g, '').length < 9) return 'tel';
  return null;
}

async function sendEmail(payload: { to: string; from: string; subject: string; html: string; reply_to?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

function internalHtml(l: Lead, score: string, attribution: Record<string, string>) {
  const rows: [string, string][] = [
    ['Score', score],
    ['Besoin', labelOf(BESOINS, l.besoin)],
    ['Secteur', labelOf(SECTEURS, l.secteur)],
    ['Nombre de sites', l.sites],
    ['Code postal', l.cp],
    ['Surface', l.surface],
    ['Température', l.temperature],
    ['Site en activité', l.occupe],
    ['Échéance', labelOf(ECHEANCES, l.echeance)],
    ['Date clé', [l.date_cle, l.date_type].filter(Boolean).join(' — ')],
    ['Nom', l.nom],
    ['Société', l.societe],
    ['Fonction', l.fonction],
    ['Téléphone', l.tel],
    ['E-mail', l.email],
    ['Préférence', l.preference],
    ['Source', [attribution.utm_source, attribution.utm_medium, attribution.utm_campaign].filter(Boolean).join(' / ') || attribution.referrer || 'directe / organique'],
    ['Page d’entrée', attribution.landing_page ?? ''],
  ];
  return `<h2 style="font-family:sans-serif">Nouvelle demande de devis — lead ${score}</h2>
<table style="font-family:sans-serif;border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;color:#64748b">${esc(k)}</td><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0"><strong>${esc(v)}</strong></td></tr>`)
    .join('')}</table>
<h3 style="font-family:sans-serif">Message</h3><p style="font-family:sans-serif;white-space:pre-wrap">${esc(l.message || '—')}</p>
<p style="font-family:sans-serif;color:#64748b">Engagement public : première estimation en moins d’un jour ouvré.</p>`;
}

function confirmationHtml(l: Lead) {
  const prenom = esc(l.nom.split(' ')[0] || '');
  return `<div style="font-family:sans-serif;max-width:560px;color:#0a1422;line-height:1.6">
<p>Bonjour ${prenom},</p>
<p>Nous avons bien reçu votre demande concernant : <strong>${esc(labelOf(BESOINS, l.besoin))}</strong>.</p>
<p><strong>Ce qui se passe maintenant :</strong></p>
<ol><li>Un technicien K Isolation étudie votre demande et vous rappelle.</li>
<li>Vous recevez une première estimation technique et budgétaire en moins d’un jour ouvré.</li>
<li>Si nécessaire, nous organisons une visite technique pour établir le devis détaillé et le planning.</li></ol>
<p>Vous avez des <strong>photos ou des plans</strong> ? Répondez simplement à cet e-mail en les joignant : cela nous aide à affiner l’estimation.</p>
<p>Une urgence ? Appelez-nous directement au <a href="tel:+33635298057">06 35 29 80 57</a>.</p>
<p>À très vite,<br>L’équipe K Isolation<br>61 rue Marx Dormoy, 13004 Marseille</p></div>`;
}

export async function POST(req: Request): Promise<Response> {
  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  let raw: Lead;
  try {
    raw = await readBody(req);
  } catch {
    return new Response('Requête invalide', { status: 400 });
  }
  const l: Lead = {};
  for (const k of ['besoin', 'secteur', 'sites', 'cp', 'surface', 'temperature', 'occupe', 'echeance', 'date_cle', 'date_type', 'nom', 'societe', 'fonction', 'tel', 'email', 'preference', 'website', 't0']) {
    l[k] = clean(raw[k]);
  }
  l.message = clean(raw.message, MAX);
  let attribution: Record<string, string> = {};
  try {
    attribution = JSON.parse(String(raw.attribution || '{}'));
  } catch {
    /* ignore */
  }

  const problem = validate(l);
  if (problem === 'spam') {
    // On répond « OK » aux robots pour ne pas les renseigner.
    return wantsJson ? Response.json({ ok: true }) : Response.redirect(new URL('/merci/', req.url), 303);
  }
  if (problem) {
    return wantsJson ? Response.json({ ok: false, error: problem }, { status: 422 }) : Response.redirect(new URL(`/devis/?erreur=${problem}`, req.url), 303);
  }

  const score = scoreLead(l);
  const to = process.env.LEAD_TO_EMAIL || 'contact@k-isolation.fr';
  const from = process.env.LEAD_FROM_EMAIL || 'K Isolation <devis@k-isolation.fr>';
  const urgent = l.besoin === 'depannage' || l.echeance === 'urgent';
  const subject = `${urgent ? '🚨 URGENT · ' : ''}[Lead ${score}] ${labelOf(BESOINS, l.besoin)} · ${labelOf(SECTEURS, l.secteur)} · ${l.cp} · ${l.societe}`;

  const tasks: Promise<unknown>[] = [
    sendEmail({ to, from, subject, html: internalHtml(l, score, attribution), reply_to: l.email }),
    sendEmail({ to: l.email, from, subject: 'Votre demande d’estimation K Isolation est bien reçue', html: confirmationHtml(l), reply_to: to }),
  ];
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    tasks.push(
      fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...l, website: undefined, t0: undefined, score, urgent, attribution, received_at: new Date().toISOString() }),
      }),
    );
  }
  const results = await Promise.allSettled(tasks);
  const delivered = results[0].status === 'fulfilled' && results[0].value === true;
  const hooked = hook ? results[2]?.status === 'fulfilled' : false;
  if (!delivered && !hooked) {
    console.error('Lead non transmis : configurez RESEND_API_KEY et/ou LEAD_WEBHOOK_URL', { score, besoin: l.besoin, cp: l.cp });
    return wantsJson ? Response.json({ ok: false, error: 'transport' }, { status: 502 }) : Response.redirect(new URL('/devis/?erreur=envoi', req.url), 303);
  }
  return wantsJson ? Response.json({ ok: true, score }) : Response.redirect(new URL(`/merci/?besoin=${encodeURIComponent(l.besoin)}`, req.url), 303);
}
