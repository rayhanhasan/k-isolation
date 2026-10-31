/**
 * Mini-convertisseur Markdown pour les champs courts (FAQ, textes de cartes) :
 * paragraphes, **gras**, *italique*, [liens](/url) et listes à puces.
 * Le contenu provient uniquement des fichiers du dépôt (pas de saisie utilisateur).
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s: string) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, u) => `<a href="${u.replace(/"/g, '')}">${t}</a>`);
}

export function marked(src: string): string {
  const blocks = src.trim().split(/\n{2,}/);
  return blocks
    .map((b) => {
      const lines = b.split('\n');
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('');
}

export function inlineMd(src: string): string {
  return inline(src);
}
