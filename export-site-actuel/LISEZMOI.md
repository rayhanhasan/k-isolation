# Export du site WordPress actuel k-isolation.fr (31/10/2026)

Export de tout ce qui est accessible publiquement, sans accès au serveur. Pour la base de données et les fichiers du serveur, voir `../MIGRATION-WORDPRESS.md` §3.

| Dossier / fichier | Contenu |
|---|---|
| `miroir/k-isolation.fr/` | **Copie complète du site, consultable hors ligne** : ouvrir `miroir/k-isolation.fr/index.html` dans un navigateur. Pages, styles, scripts, polices et images, avec les liens réécrits pour fonctionner en local |
| `medias/uploads/` | **Médiathèque WordPress en taille originale** (138 fichiers, 105 Mo : photos de chantiers, logos, vidéos), rangée comme dans `wp-content/uploads/` |
| `medias/_inventaire.json` | Pour chaque média : identifiant WordPress, URL d'origine, type, poids, texte alternatif, date, empreinte. Les 5 échecs listés étaient déjà en erreur 404 sur le site |
| `donnees-wordpress/*.json` | Données publiques de l'API WordPress : `pages`, `posts`, `cpt_portfolio` (réalisations), `cpt_services`, `cpt_testimonials`, `cpt_layouts` (gabarits du thème), `categories`, `tags`, `media`, `users`, `types`, `taxonomies`. `_resume.json` donne le nombre d'éléments et ce qui n'est pas public (menus, modèles Elementor) |
| `dns-releve.json` | Relevé complet du DNS : site, e-mails (MX, SPF, DKIM, DMARC), serveurs de noms |
| `scripts/1-export-depuis-hostinger.sh` | Export serveur complet (base + fichiers), limité au dossier du domaine k-isolation.fr, en lecture seule |
| `scripts/2-import-sur-nouvel-hebergeur.sh` | Import sur le nouvel hébergeur (SSH + WP-CLI) |

Également dans le dépôt :
- `audit/source/` : texte et métadonnées de chacune des 57 pages publiques ;
- `audit/screenshots/` : captures ordinateur et mobile du site actuel ;
- `audit/lighthouse/` : mesures de performance du site actuel.
