# Guide de migration : WordPress (Hostinger) → nouveau site statique

Objectif : basculer k-isolation.fr vers le nouveau site **sans perdre le référencement ni les e-mails**. Durée active : une demi-journée, étalée sur 30 jours de suivi.

> ⚠️ **Règle n° 1 : les e-mails `contact@k-isolation.fr` sont hébergés chez Hostinger.**
> On ne modifie QUE les enregistrements DNS du site web (A, AAAA, `www`). On ne touche ni aux MX, ni à SPF / DKIM / DMARC, ni aux serveurs de noms. On ne résilie pas l'hébergement Hostinger avant d'avoir vérifié que la boîte mail n'en dépend pas.

---

## 0. Choisir l'hébergeur

| | **Vercel** (recommandé) | **Netlify** (alternative) |
|---|---|---|
| Offre à prendre | **Pro (≈ 20 $/mois)** : l'offre gratuite « Hobby » interdit l'usage commercial | **Gratuite** (usage commercial autorisé), Pro si besoin |
| Configuration fournie | `site/vercel.json` (86 redirections 301, en-têtes, cache) | `site/netlify.toml` + `site/public/_redirects` |
| Formulaire de devis | `site/api/lead.ts` (fonction automatique) | `site/netlify/functions/lead.ts` (même logique) |
| Dossier racine du projet | `site` | `site` (Base directory) |

Les deux reconstruisent et publient le site automatiquement à chaque modification sur la branche principale (y compris les articles du blog).

---

## 1. J-15 → J-1 : préparation

1. **Sauvegarde complète de WordPress** depuis hPanel (fichiers + base). Garder aussi `audit/source/` (texte de toutes les pages).
2. **Google Search Console** : créer une propriété **Domaine** `k-isolation.fr`, vérifiée par un enregistrement TXT dans le DNS Hostinger (la vérification actuelle passe par le plugin WordPress et disparaîtra). Exporter Performance (16 mois), Pages et Liens.
3. **Relever les positions** de 20 à 30 requêtes (liste dans `audit/01-technique-seo.md` §6) pour comparer à J+30.
4. **E-mails** : dans hPanel, vérifier si la boîte `contact@k-isolation.fr` dépend de l'offre d'hébergement web. Si oui, passer sur une offre e-mail seule **avant** toute résiliation. Vérifier la date d'échéance du nom de domaine.
5. **DNS** : 48 h avant la bascule, baisser le TTL des enregistrements A, AAAA et `www` à 300 s.
6. **Envoi des e-mails du formulaire** : créer un compte [Resend](https://resend.com) (gratuit jusqu'à 3 000 e-mails/mois), ajouter le domaine `k-isolation.fr` et copier dans le DNS Hostinger les enregistrements qu'il fournit (DKIM et SPF d'envoi, souvent sur un sous-domaine `send.`). Ces ajouts ne touchent pas aux e-mails existants.

## 2. Mise en ligne en préproduction

1. Hébergeur → « Importer un dépôt Git » → `rayhanhasan/k-isolation` → **Root / Base directory : `site`**. Framework détecté : Astro.
2. Variables d'environnement :

| Variable | Obligatoire | Valeur |
|---|---|---|
| `RESEND_API_KEY` | oui (ou webhook) | clé API Resend |
| `LEAD_TO_EMAIL` | non | destinataire des demandes (défaut `contact@k-isolation.fr`) |
| `LEAD_FROM_EMAIL` | oui avec Resend | ex. `K Isolation <devis@k-isolation.fr>` (domaine vérifié chez Resend) |
| `LEAD_WEBHOOK_URL` | non | copie de chaque demande vers un CRM, Google Sheets, Make, Zapier ou n8n |
| `PUBLIC_PLAUSIBLE_DOMAIN` | non | `k-isolation.fr` si vous prenez Plausible (mesure d'audience sans cookie, donc sans bandeau) |

3. Sur l'URL de préproduction fournie par l'hébergeur :
   - parcourir le site sur mobile et sur ordinateur ;
   - **envoyer une vraie demande de devis** : vérifier la réception interne (objet `[Lead A/B/C] …`) et l'accusé de réception côté prospect ;
   - lancer la recette des redirections :
     ```bash
     cd site && node scripts/check-redirects.mjs https://<url-de-preproduction>
     ```
     Résultat attendu : `100/100 conformes` (86 redirections 301 et 14 pages supprimées qui renvoient vers la 404).

## 3. Jour J : bascule

1. Dans l'hébergeur : ajouter les domaines `k-isolation.fr` et `www.k-isolation.fr` (`www` redirigé vers le domaine nu).
2. Dans le **DNS Hostinger** (hPanel → Domaines → DNS), et **uniquement** :
   - enregistrement **A** `@` → la valeur affichée par l'hébergeur (Vercel : en général `76.76.21.21`) ;
   - **supprimer l'AAAA** `@` qui pointe vers Hostinger (sinon les visiteurs en IPv6 continueraient d'arriver sur l'ancien site) ;
   - **CNAME** `www` → la cible indiquée (Vercel : `cname.vercel-dns.com` ; Netlify : `<site>.netlify.app`).
   - Ne rien toucher d'autre : MX `mx1/mx2.hostinger.com`, TXT SPF, CNAME DKIM `hostingermail-*`, DMARC, `autodiscover`, `autoconfig` restent tels quels.
3. Attendre le certificat HTTPS (quelques minutes), puis :
   ```bash
   cd site && node scripts/check-redirects.mjs https://k-isolation.fr
   ```
4. **Search Console** : soumettre `https://k-isolation.fr/sitemap-index.xml` **et** `https://k-isolation.fr/sitemap-legacy.xml` (anciennes URL, pour que Google découvre vite les redirections). Demander l'indexation de l'accueil, `/chambres-froides/`, `/renovation-chambre-froide/`, `/cloisons-isothermes/`, `/sav-maintenance/`, `/zones/marseille/`, `/devis/`.
5. Envoyer un e-mail de test vers `contact@` et en recevoir un : la messagerie doit fonctionner comme avant.
6. Mettre à jour les liens maîtrisés : LinkedIn, signatures e-mail, annuaires, Google Business Profile.

## 4. J+1 → J+30 : suivi

- **Chaque jour pendant une semaine** : Search Console → Pages (pics de 404 ou d'erreurs de redirection). Toute ancienne URL qui reçoit des visites et tombe en 404 s'ajoute dans `site/redirects.json`, puis `npm run redirects` régénère la configuration.
- **J+7** : Lighthouse mobile sur l'accueil et une page solution. Objectif : performance ≥ 90, LCP ≤ 2,5 s.
- **J+30** : comparer clics, impressions et positions avec J-1. Une baisse de 10 à 20 % pendant 2 à 4 semaines est normale après un changement d'URL ; au-delà, analyser page par page.
- **J+60** : retirer `sitemap-legacy.xml` de Search Console. **Garder les redirections 301 au moins un an** (idéalement toujours).
- Résilier l'hébergement web Hostinger seulement après J+30, e-mails sécurisés et sauvegardes vérifiées.

---

## 5. Activer le blog automatique

1. Créer une clé API sur [platform.claude.com](https://platform.claude.com) (compte du client ou de l'agence). Coût : de l'ordre de quelques dizaines de centimes par article, à vérifier sur la console après les premiers articles.
2. GitHub → dépôt → **Settings → Secrets and variables → Actions** :
   - secret `ANTHROPIC_API_KEY` ;
   - variable `ARTICLE_MODE` = `revue` (par défaut : chaque article arrive en Pull Request à relire) ou `direct` (publication sans relecture, déconseillée les premiers mois).
3. **Settings → Actions → General** : cocher « Allow GitHub Actions to create and approve pull requests ».
4. Le workflow `.github/workflows/article-hebdo.yml` doit se trouver sur la **branche par défaut** pour que la planification (mardi matin) fonctionne. Premier test : onglet **Actions → Article hebdomadaire → Run workflow**.
5. Chaque mardi : une Pull Request « 📝 Article à relire » contient l'article, les points à vérifier et un post LinkedIn prêt à copier. Relire (15 min), compléter si possible avec un détail de chantier réel, puis **Merge** : le site se met à jour tout seul.

Le calendrier (`site/content-plan/calendrier-editorial.json`, 24 sujets priorisés) et la ligne éditoriale (`site/content-plan/ligne-editoriale.md`) se modifient librement. Commande locale : `npm run article` (ou `npm run article:test` pour voir le brief sans appeler l'API).
