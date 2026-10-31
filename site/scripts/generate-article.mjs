#!/usr/bin/env node
/**
 * Générateur d'articles de blog K Isolation.
 *
 * Prend le prochain sujet non publié de content-plan/calendrier-editorial.json,
 * le fait rédiger par Claude selon content-plan/ligne-editoriale.md, vérifie
 * le résultat (garde-fous) puis écrit src/content/blog/<slug>.md.
 *
 * Usage :
 *   node scripts/generate-article.mjs                 # prochain sujet du calendrier
 *   node scripts/generate-article.mjs --slug <slug>   # sujet précis
 *   node scripts/generate-article.mjs --dry-run       # affiche le brief, n'appelle pas l'API
 *
 * Variables d'environnement :
 *   ANTHROPIC_API_KEY   (obligatoire hors --dry-run)
 *   ARTICLE_DRAFT=true  écrit l'article en brouillon (draft: true) — non publié
 *   GITHUB_OUTPUT       (fourni par GitHub Actions) : expose slug/titre/notes au workflow
 */
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, readdirSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const PHOTOS_DIR = path.join(ROOT, 'src/assets/chantiers');
const MODEL = 'claude-opus-5-5';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const slugArg = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;

// ───────────────────────── 1. Choix du sujet ─────────────────────────
const calendar = JSON.parse(readFileSync(path.join(ROOT, 'content-plan/calendrier-editorial.json'), 'utf8'));
const existing = new Set(readdirSync(BLOG_DIR).map((f) => f.replace(/\.mdx?$/, '')));
const topic = slugArg ? calendar.find((t) => t.slug === slugArg) : calendar.find((t) => !existing.has(t.slug));
if (!topic) {
  console.log(slugArg ? `Sujet introuvable : ${slugArg}` : 'Calendrier épuisé : ajoutez des sujets dans content-plan/calendrier-editorial.json');
  process.exit(slugArg ? 1 : 0);
}
if (existing.has(topic.slug) && !args.includes('--force')) {
  console.error(`L'article ${topic.slug} existe déjà (utilisez --force pour le régénérer).`);
  process.exit(1);
}

const guidelines = readFileSync(path.join(ROOT, 'content-plan/ligne-editoriale.md'), 'utf8');
const photos = readdirSync(PHOTOS_DIR).filter((f) => f.endsWith('.jpg')).sort();
const published = [...existing].sort();
const CATEGORIES = ['Chambres froides', 'Cloisons & panneaux', 'Salles blanches', 'Normes & HACCP', 'Maintenance & SAV', 'Budget & projet'];
const SERVICES = ['/chambres-froides/', '/cloisons-isothermes/', '/renovation-chambre-froide/', '/sav-maintenance/', '/salles-blanches/'];
const ALLOWED_LINKS = [...guidelines.matchAll(/\| `(\/[^`]+)` \|/g)].map((m) => m[1]).concat(published.map((s) => `/blog/${s}/`));

// ───────────────────────── 2. Prompt ─────────────────────────
// Le prompt système est 100 % statique (ligne éditoriale + liste de photos) :
// il est mis en cache entre deux exécutions rapprochées et ne varie pas d'un sujet à l'autre.
const system = [
  {
    type: 'text',
    text: `Tu es le rédacteur technique de K Isolation. Tu écris des articles de conseil en français pour des professionnels, en respectant strictement la ligne éditoriale ci-dessous. Tu rends uniquement l'objet JSON demandé.

${guidelines}

## Photos de chantiers disponibles pour l'image de couverture
Choisis la plus pertinente pour le sujet (nom de fichier exact) et décris honnêtement ce qu'elle montre dans coverAlt :
${photos.map((p) => `- ${p}`).join('\n')}`,
    cache_control: { type: 'ephemeral' },
  },
];

const userPrompt = `Rédige l'article suivant.

Titre de travail : ${topic.titre}
Slug (ne pas modifier) : ${topic.slug}
Mot-clé principal : ${topic.mot_cle}
Mots-clés secondaires : ${(topic.mots_cles_secondaires || []).join(', ')}
Intention de recherche : ${topic.intention}
Lecteur visé : ${topic.persona}
Pilier / cluster : ${topic.cluster}
Angle attendu : ${topic.angle}
CTA de fin : ${topic.cta}
Pages à lier en priorité : ${(topic.pages_a_lier || []).join(', ')}

Articles déjà publiés (tu peux y faire 1 lien si c'est vraiment utile, chemin /blog/<slug>/) : ${published.join(', ') || 'aucun'}.

Rappels : pas de H1, 1 300 à 1 900 mots, encadré « Sur le terrain » fondé sur un fait listé, au moins un tableau si pertinent, 3 à 6 liens internes, aucun marqueur entre crochets, aucun chiffre K Isolation inventé. Si l'angle mentionne une donnée « à fournir par le client », reste général sur ce point et liste-la dans notes_editeur.`;

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'metaTitle', 'description', 'category', 'tags', 'cover', 'coverAlt', 'ctaService', 'body', 'faqs', 'notes_editeur', 'linkedin_post'],
  properties: {
    title: { type: 'string', description: "Titre H1 de l'article (60-90 caractères), contient le mot-clé principal" },
    metaTitle: { type: 'string', description: 'Balise title SEO, 45 à 62 caractères, sans le nom de la marque' },
    description: { type: 'string', description: 'Meta description de 130 à 160 caractères, incitative, avec le mot-clé' },
    category: { type: 'string', enum: CATEGORIES },
    tags: { type: 'array', items: { type: 'string' }, description: '3 à 6 tags courts en minuscules' },
    cover: { type: 'string', enum: photos },
    coverAlt: { type: 'string', description: "Description factuelle de la photo choisie" },
    ctaService: { type: 'string', enum: SERVICES, description: 'Page solution la plus liée au sujet' },
    body: { type: 'string', description: "Corps de l'article en Markdown (sans H1, sans frontmatter)" },
    faqs: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['q', 'a'], properties: { q: { type: 'string' }, a: { type: 'string' } } },
    },
    notes_editeur: { type: 'array', items: { type: 'string' }, description: 'Points à vérifier ou données à fournir par K Isolation avant publication (peut être vide)' },
    linkedin_post: { type: 'string', description: "Post LinkedIn de 600 à 900 caractères pour annoncer l'article, ton expert, sans hashtags excessifs (3 max), terminé par [LIEN]" },
  },
};

if (dryRun) {
  console.log(`Sujet : ${topic.slug}\n\n${userPrompt}\n\n(prompt système : ${system[0].text.length} caractères)`);
  process.exit(0);
}

// ───────────────────────── 3. Appel à Claude ─────────────────────────
const client = new Anthropic();
let message;
try {
  message = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    // Repli automatique côté serveur si le modèle décline la requête.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'high', format: { type: 'json_schema', schema } },
    system,
    messages: [{ role: 'user', content: userPrompt }],
  });
} catch (err) {
  if (err instanceof Anthropic.AuthenticationError) console.error('Clé API invalide ou absente (ANTHROPIC_API_KEY).');
  else if (err instanceof Anthropic.RateLimitError) console.error('Limite de débit atteinte : relancez plus tard.');
  else if (err instanceof Anthropic.APIError) console.error(`Erreur API ${err.status} : ${err.message}`);
  else console.error(err);
  process.exit(1);
}

if (message.stop_reason === 'refusal') {
  console.error(`Requête déclinée (${message.stop_details?.category ?? 'sans catégorie'}). Sujet à reformuler : ${topic.slug}`);
  process.exit(1);
}
if (message.stop_reason === 'max_tokens') {
  console.error('Réponse tronquée (max_tokens atteint) : relancez ou raccourcissez le brief.');
  process.exit(1);
}
const text = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
const a = JSON.parse(text);
console.log(`Modèle : ${message.model} — jetons entrée ${message.usage.input_tokens} (cache lu ${message.usage.cache_read_input_tokens ?? 0}), sortie ${message.usage.output_tokens}`);

// ───────────────────────── 4. Garde-fous ─────────────────────────
const problems = [];
const words = a.body.split(/\s+/).filter(Boolean).length;
if (words < 1100) problems.push(`article trop court (${words} mots)`);
if (/^#\s/m.test(a.body)) problems.push('le corps contient un H1');
if (a.description.length < 110 || a.description.length > 165) problems.push(`meta description hors limites (${a.description.length} car.)`);
if (a.metaTitle.length > 65) problems.push(`metaTitle trop long (${a.metaTitle.length} car.)`);
if (a.faqs.length < 3) problems.push('FAQ insuffisante');
const forbidden = [/\[\s*(À|A) (FOURNIR|CONFIRMER|JUSTIFIER)/i, /\[(TODO|source)\]/i, /EN\s?13000/i, /qualibat/i, /\bATEX\b/, /depuis (2014|plus de 10 ans)/i, /20[\s ]?000\s?m²/i, /50\s?\+?\s?partenaires/i, /entreprise familiale/i, /sous 48\s?h/i, /sans surco[uû]t/i, /normes? mistral/i, /sismique/i];
for (const re of [...forbidden]) if (re.test(a.body) || a.faqs.some((f) => re.test(f.a))) problems.push(`formulation interdite : ${re}`);
const links = [...a.body.matchAll(/\]\((\/[^)\s#]*)\)/g)].map((m) => m[1]);
const internal = links.filter((l) => ALLOWED_LINKS.includes(l));
const unknown = links.filter((l) => !ALLOWED_LINKS.includes(l));
if (internal.length < 3) problems.push(`maillage interne insuffisant (${internal.length} lien(s) valides)`);
if (unknown.length) problems.push(`liens internes inconnus : ${unknown.join(', ')}`);
if (!/^>\s*\*\*Sur le terrain\*\*/m.test(a.body)) problems.push('encadré « Sur le terrain » manquant');

if (problems.length) {
  console.error(`Article rejeté par les garde-fous :\n- ${problems.join('\n- ')}`);
  writeFileSync(path.join(ROOT, `.rejected-${topic.slug}.json`), JSON.stringify(a, null, 2));
  process.exit(2);
}

// ───────────────────────── 5. Écriture ─────────────────────────
const q = (s) => JSON.stringify(s); // chaîne YAML sûre (le JSON est un sous-ensemble de YAML)
const today = new Date().toISOString().slice(0, 10);
const draft = process.env.ARTICLE_DRAFT === 'true';
const fm = [
  '---',
  `title: ${q(a.title)}`,
  `metaTitle: ${q(a.metaTitle)}`,
  `description: ${q(a.description)}`,
  `date: ${today}`,
  `category: ${q(a.category)}`,
  `tags: [${a.tags.map(q).join(', ')}]`,
  `cover: ${q('../../assets/chantiers/' + a.cover)}`,
  `coverAlt: ${q(a.coverAlt)}`,
  `ctaService: ${q(a.ctaService)}`,
  'faqs:',
  ...a.faqs.flatMap((f) => [`  - q: ${q(f.q)}`, `    a: ${q(f.a)}`]),
  `draft: ${draft}`,
  'generated: true',
  '---',
  '',
].join('\n');
const file = path.join(BLOG_DIR, `${topic.slug}.md`);
writeFileSync(file, fm + a.body.trim() + '\n');
console.log(`✓ ${path.relative(ROOT, file)} (${words} mots, ${internal.length} liens internes${draft ? ', brouillon' : ''})`);

if (process.env.GITHUB_OUTPUT) {
  const notes = a.notes_editeur.length ? a.notes_editeur.map((n) => `- [ ] ${n}`).join('\n') : '- Aucune donnée client manquante signalée.';
  const out = [`slug=${topic.slug}`, `title=${a.title.replace(/\n/g, ' ')}`, `words=${words}`, `notes<<EOF_NOTES\n${notes}\nEOF_NOTES`, `linkedin<<EOF_LI\n${a.linkedin_post}\nEOF_LI`];
  appendFileSync(process.env.GITHUB_OUTPUT, out.join('\n') + '\n');
}
