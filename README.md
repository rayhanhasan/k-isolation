# k-isolation.fr

> **Statut (31/10/2026) : refonte en pause, non validée.** Priorité : export complet du site WordPress actuel et migration vers un nouvel hébergeur.
> - [`MIGRATION-WORDPRESS.md`](MIGRATION-WORDPRESS.md) : déplacer le site actuel tel quel, sans couper le site ni les e-mails.
> - [`export-site-actuel/`](export-site-actuel/LISEZMOI.md) : copie complète du site, médiathèque originale, données WordPress, relevé DNS, scripts d'export et d'import.
>
> Le dossier `site/` (prototype de refonte) et les documents `AUDIT-SYNTHESE.md`, `MIGRATION.md` et `CONTENU-A-VALIDER.md` concernent la refonte en pause. Les audits de `audit/` restent valables pour le site actuel.

---

## Refonte (en pause)

Nouveau site de **K Isolation** (chambres froides, cloisons isothermes, rénovation et dépannage de l'enveloppe du froid, Marseille et Île-de-France), avec l'audit complet de l'ancien site WordPress et l'automatisation du blog.

| Document | Contenu |
|---|---|
| [`AUDIT-SYNTHESE.md`](AUDIT-SYNTHESE.md) | **À lire en premier.** Diagnostic, stratégie, ce qui change et pourquoi |
| [`CONTENU-A-VALIDER.md`](CONTENU-A-VALIDER.md) | Ce que le client doit confirmer ou fournir avant la mise en ligne |
| [`MIGRATION.md`](MIGRATION.md) | Bascule pas à pas (hébergeur, DNS sans casser les e-mails, Search Console, blog automatique) |
| `audit/` | Audits détaillés (technique et SEO, audience et marché, UX et conversion), rapports Lighthouse, captures, contenu extrait de l'ancien site |

## Le site (`site/`)

- **Astro 7** (site statique) + **Tailwind CSS 4**. Aucun plugin, aucune base de données. Lighthouse mobile : 97 à 100 en performance, 100 en SEO.
- Contenus en Markdown dans `site/src/content/` :

| Dossier | URL | Contenu |
|---|---|---|
| `services/` | `/<slug>/` | 5 pages solutions (pages « argent ») |
| `secteurs/` | `/secteurs/<slug>/` | 6 pages secteurs |
| `realisations/` | `/realisations/<slug>/` | études de cas (contexte, contraintes, phasage, résultat, avant/après) |
| `blog/` | `/blog/<slug>/` | articles de conseil (écrits à la main ou par le générateur) |
| `zones/` | `/zones/<slug>/` | pages locales (seulement avec des chantiers réels dans la zone) |

- Coordonnées, chiffres clés, logos clients, menus : `site/src/data/site.ts` (source unique).
- Formulaire de devis : `site/src/pages/devis.astro` → fonction `site/api/lead.ts` (Vercel) ou `site/netlify/functions/lead.ts` (Netlify). Elle envoie l'e-mail interne (score A/B/C et source du lead) et l'accusé de réception au prospect, et peut copier la demande vers un webhook (CRM, Sheets…).
- Redirections des anciennes URL : `site/redirects.json` (source unique) → `npm run redirects` génère `vercel.json`, `public/_redirects` et `public/sitemap-legacy.xml`.

### Commandes (dans `site/`)

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run article:test
```

```bash
node scripts/check-redirects.mjs https://k-isolation.fr
```

- `npm run dev` : site local sur http://localhost:4321.
- `npm run build` : construit le site et valide tous les contenus (le build échoue si un champ obligatoire manque).
- `npm run article:test` : affiche le brief du prochain article sans appeler l'API.
- `check-redirects.mjs` : recette des 100 redirections sur un environnement déployé.

### Ajouter une réalisation

1. Déposer les photos dans `site/src/assets/chantiers/` (JPEG, 2 000 px de large maximum).
2. Copier un fichier de `site/src/content/realisations/`, puis adapter le texte, les chiffres et les photos.
3. Pousser sur la branche principale : le site se republie automatiquement.

## Blog automatique

`.github/workflows/article-hebdo.yml`. Chaque mardi, Claude rédige le prochain sujet de `site/content-plan/calendrier-editorial.json` en suivant `site/content-plan/ligne-editoriale.md`. Des garde-fous automatiques vérifient chaque article : longueur, maillage interne, formulations interdites, encadré terrain. Le site est ensuite reconstruit, puis une Pull Request de relecture est ouverte avec le post LinkedIn prêt à publier. Configuration : voir `MIGRATION.md` §5.
