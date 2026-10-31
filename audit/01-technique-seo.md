# 01 — Audit technique, SEO et performance : k-isolation.fr (site WordPress actuel)

Audit réalisé le 31/10/2026 sur le site public en HTTPS uniquement (aucun accès FTP, SSH ni back-office).
Pile actuelle : WordPress 6.8.12, Elementor 4.3.5, thème ThemeRex « Fuse » avec trx_addons, Yoast, Site Kit (gtag `GT-W6BZTT35`), plugin maison `k-isolation-local`, hébergement Hostinger (LiteSpeed, cache LiteSpeed actif).

**Ce qui a été mesuré :**
- **Lighthouse 13.6.0** sur Chromium headless, en throttling simulé. Profil mobile par défaut (Moto G Power, 4G lente) et preset desktop. 3 passages pour les 5 URL clés (médiane retenue), 1 passage pour 3 URL complémentaires. Total : 36 rapports.
- **Crawl maison de 87 URL**. Ce sont les 59 URL des sitemaps, les pages hors sitemap déjà connues, et les URL trouvées via l'API REST publique (`/wp-json/wp/v2/*`) et les liens internes. Pour chaque page : balises, JSON-LD, liens, contenu principal et similarité (Jaccard sur 5-grammes de mots).
- **Croisement de `_media.json`** (143 fichiers) avec toutes les références d'images trouvées dans le HTML.
- **Recherches web** et lecture des **DNS publics** (via le résolveur DNS public de Google en HTTPS).

Toute **estimation** est signalée comme telle. Aucune donnée terrain (CrUX / Search Console) n'était disponible.

Rapports bruts : `audit/lighthouse/` (le fichier de la passe médiane pour chaque couple URL × appareil ; les fichiers de plus de 1 Mo sont compressés en `.json.gz`).
Plan de redirections machine : `site/redirects.json`.

---

## 1. Résumé exécutif

1. **Performance mobile insuffisante partout.** Score de 46 à 57 sur les 5 pages clés, LCP de 4,2 à 6,6 s (seuil « mauvais » : plus de 4 s), TBT de 540 à 805 ms, poids de 1,5 à 2,0 Mo et 53 à 86 requêtes. Le desktop est correct (63 à 95).
2. **Un logo PNG de 571 Ko** (1187×1188, issu de l'en-tête du thème, masqué) est téléchargé sur toutes les pages (85 pages). De 39 à 53 ressources bloquent le rendu (gain estimé par Lighthouse : 2,4 à 2,8 s sur mobile). Chaque page embarque 165 Ko de JS et 256 à 270 Ko de CSS inutilisés.
3. **24 pages `/zone/*` générées par gabarit.** 16 d'entre elles n'ont aucune meta description. Les 12 pages régions ne diffèrent que par le nom (similarité 0,87 à 0,91 ; Corse et Bretagne sont identiques à 99 %). Chacune déclare un `LocalBusiness` sans adresse. C'est un schéma typique de pages satellites (« doorway »).
4. **Aucune page « chambres froides », alors que c'est le métier n°1.** Dans le menu, « Chambres froides » et « Cloisons isothermes » pointent tous deux vers `/installation-fourniture/`, qui entre en concurrence avec `/services/installation-fourniture/`. Les 6 pages `/services/*` n'ont pas de H1.
5. **Liens internes cassés.** `/politique-de-confidentialite/` et `/cgv/` renvoient une 404 depuis le pied de page de 71 pages. `/nos-realisations`, `/nos-solutions` et `/shop/` sont aussi en 404, et 2 liens contiennent encore le texte d'exemple « URL-DE-LA-PAGE-EMPLOI ».
6. **Métadonnées.** 35 des 59 URL du sitemap n'ont pas de meta description. La marque est écrite tantôt « K ISOLATION » (65 titles), tantôt « K Isolation » (15).
7. **Crédibilité.** Des textes anglais restent sur 23 pages (« Skip to content », « Published », « 96 Views », « 5 Likes »…). 4 images générées par IA sont en ligne (12 dans la médiathèque, 22 Mo au total). Les articles contiennent les attributs `data-start` laissés par un copier-coller depuis ChatGPT (46 à 118 par article). Des contenus de démo du thème restent publics (`/team/`, témoignage « Linda Moore »).
8. **Médiathèque.** 143 fichiers pour 108 Mo, dont 92 Mo jamais référencés dans les pages explorées. 0 WebP/AVIF. 79 images sur 131 ont pour texte alternatif leur nom de fichier.
9. **Visibilité.** Avec les outils disponibles, la marque n'apparaît que sur une requête très précise. Aucune fiche Google Business Profile n'a été trouvée. Search Console est indispensable avant de migrer pour mesurer réellement l'indexation.
10. **Migration.** 107 URL ont été tranchées : 7 gardées, 86 redirigées en 301 et 14 supprimées en 410. 3 pages zone sur 24 sont conservées. Les emails sont hébergés chez Hostinger (MX, SPF, DKIM, DMARC) : il ne faut toucher qu'aux enregistrements A, AAAA et www.

---

## 2. Tableau de scores Lighthouse

Valeurs **médianes** (3 passages) pour les 5 URL clés ; 1 passage pour les 3 dernières lignes. Les poids sont en Kio transférés.

| Page | Appareil | Perf | FCP | LCP | TBT | CLS | Speed Index | Poids | Req. | JS inutilisé | CSS inutilisé | A11y / BP / SEO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Accueil `/` | mobile | **51** (50–55) | 4,7 s | **4,7 s** | 805 ms | 0,002 | 5,0 s | 1 969 | 86 | 165 | 256 | 79 / 96 / 92 |
| Accueil `/` | desktop | 63 (62–74) | 2,0 s | 3,3 s | 47 ms | **0,166** | 2,2 s | 1 969 | 86 | 165 | 257 | 79 / 96 / 92 |
| `/services/installation-fourniture/` | mobile | **53** (49–60) | 4,3 s | **6,4 s** | 541 ms | 0,020 | 4,3 s | 1 578 | 70 | 165 | 270 | 79 / 100 / 85 |
| `/services/installation-fourniture/` | desktop | 92 | 1,1 s | 1,5 s | 11 ms | 0,000 | 1,4 s | 1 578 | 70 | 165 | 270 | 79 / 100 / 85 |
| `/agroalimentaire/` | mobile | **54** (49–54) | 4,4 s | **4,4 s** | 750 ms | 0,001 | 5,0 s | 1 661 | 77 | 168 | 257 | 82 / 96 / 100 |
| `/agroalimentaire/` | desktop | 82 (81–95) | 1,9 s | 1,9 s | 35 ms | 0,000 | 1,9 s | 1 661 | 77 | 168 | 258 | 82 / 96 / 100 |
| `/chambre-froide-positive-ou-negative-quelle-difference/` | mobile | **46** (44–46) | 4,8 s | **6,6 s** | 721 ms | 0,001 | 5,7 s | 1 913 | 72 | 168 | 270 | 91 / 96 / 100 |
| idem | desktop | 79 (78–91) | 1,9 s | 2,1 s | 0 ms | 0,000 | 2,0 s | 1 914 | 73 | 168 | 270 | 91 / 96 / 100 |
| `/zone/ile-de-france/` | mobile | **57** (57–62) | 4,2 s | **4,2 s** | 644 ms | 0,001 | 4,6 s | 1 518 | 53 | 170 | 272 | 93 / 100 / 100 |
| `/zone/ile-de-france/` | desktop | 95 (79–96) | 1,1 s | 1,1 s | 12 ms | 0,001 | 1,4 s | 1 519 | 53 | 170 | 273 | 93 / 100 / 100 |
| `/about-us/` | mobile | **31** | 4,9 s | **16,2 s** | 934 ms | **0,181** | 6,4 s | 2 586 | 92 | 163 | 254 | 78 / 96 / 92 |
| `/portfolio/cuisine-professionnelle-min-rungis/` | mobile | 42 | 4,0 s | 7,4 s | 1 082 ms | 0,001 | 4,7 s | 1 945 | 63 | 170 | 284 | 90 / 100 / 100 |
| `/contact/` | mobile | 68 | 3,7 s | 3,7 s | 453 ms | 0,016 | 4,6 s | 2 387 | 81 | 170 | 257 | 89 / 96 / 100 |

Objectifs « bons » des Core Web Vitals pour comparaison : LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms. Le TBT de laboratoire sert de substitut à l'INP.

**Composition de l'accueil (mobile) :**
- 28 scripts (480 Kio) et 44 feuilles CSS (349 Kio).
- 8 polices (170 Kio) et 3 images (887 Kio, dont le logo à 571 Kio). Le lazy-load masque les autres images au premier affichage.
- Le temps de traitement du thread principal atteint 4,9 s.

**Plus grosses ressources (toutes pages confondues) :**
- `wp-content/uploads/2024/09/k-isolation.png` : 571 Kio. Lighthouse estime l'économie possible à 570 Kio.
- `googletagmanager.com/gtag/js` : 178 Kio.
- Photo `WhatsApp-Image-…-23.17.11-5.jpeg` : 316 Kio, image LCP de l'accueil sur desktop. Elle est chargée en lazy-load LiteSpeed, ce qui ajoute 1,4 s de « resource load delay ».
- `fontello.woff2` : 93 Kio.
- `__plugins.css` (thème) : 90 Kio.
- `trx_addons/__scripts.js` : 79 Kio.

**TTFB.** Il est bon : 107 à 135 ms côté serveur selon Lighthouse, grâce au cache LiteSpeed. La lenteur vient donc du front et non du serveur.

**Données terrain (CrUX).** Elles n'ont pas été mesurées : le trafic est probablement trop faible pour que CrUX en publie. À vérifier dans Search Console, rapport « Signaux Web essentiels ».

---

## 3. Constats classés par gravité

### 3.1 Critique

**C1. Performance mobile : toutes les pages testées sont « à améliorer » ou « mauvaises ».**
- **Preuve :** voir le tableau du §2. LCP mobile de 4,2 à 16,2 s, TBT de 453 à 1 082 ms. CLS desktop de 0,166 sur l'accueil : le H1 se décale à l'arrivée des polices DM Sans et Poppins depuis `fonts.gstatic.com`.
- **Causes identifiées dans les rapports :**
  - De 39 à 53 ressources bloquent le rendu (CSS du thème, jQuery et jQuery Migrate, CSS Elementor, Google Fonts).
  - Gabarit lourd : médiane de 33 scripts et 26 CSS par page, 131 Ko de HTML (293 Ko pour l'accueil).
  - Logo de 571 Ko sur toutes les pages.
  - gtag de 178 Ko.
  - Bibliothèques jamais utilisées : GSAP, mediaelement, masonry, magnific-popup, « mouse-helper ».
  - Image LCP chargée en lazy-load.
  - Cache navigateur de seulement 7 jours sur les fichiers statiques.
  - **Double en-tête et double pied de page dans le DOM :** le thème Elementor et le plugin `k-isolation-local` en injectent chacun un, sur 25 pages de gabarit thème.
- **Pour le nouveau site :**
  - Budget cible : moins de 500 Ko et moins de 25 requêtes par page.
  - Pas de jQuery. Polices auto-hébergées en woff2 (sous-ensemble latin, préchargées, `font-display: swap` et `size-adjust`).
  - Images AVIF/WebP en `srcset` via `astro:assets`, logo en SVG. Image LCP jamais en lazy-load (`fetchpriority="high"`).
  - GA4 chargé après consentement.

**C2. Pages zones « doorway » et LocalBusiness fictifs (24 URL).**
- **Contenu dupliqué :**
  - Les 12 pages régions (Bretagne, Corse, Grand Est…, Suisse) comptent 214 à 223 mots, essentiellement ceux du gabarit (process en 4 étapes, certifications, CTA). Seul le nom change : similarité Jaccard médiane de 0,87, maximum de 0,91, et 99 % de recouvrement texte entre `/zone/corse/` et `/zone/bretagne/`.
  - Leur H1 se réduit au nom de la région (« Corse »), et 16 pages zone sur 24 n'ont pas de meta description.
  - Les 6 pages villes d'Île-de-France (230 à 238 mots) ont une similarité de 0,82 à 0,85 entre elles.
- **Données structurées :** chacune des 24 pages déclare un `LocalBusiness` « K ISOLATION — Corse », « — Bretagne », etc. Seule la page Marseille en a une adresse. Cela va à l'encontre des consignes Google (une entité locale = un lieu réel) et ressemble à du contenu produit à grande échelle.
- **Maillage :**
  - Les 12 régions sont liées depuis le pied de page des 81 pages.
  - La seule bonne page, **Marseille** (783 mots, FAQ locale, ville du siège), est enterrée à 4 niveaux d'URL et ne reçoit que 2 liens entrants.
  - Les départements et villes d'IDF ne reçoivent eux aussi que 2 liens chacun.
- **Décision (détail au §5) :** garder 3 zones (`/zones/marseille/`, `/zones/provence-alpes-cote-d-azur/`, `/zones/ile-de-france/`). Fusionner les 21 autres :
  - IDF vers `/zones/ile-de-france/` ;
  - Bouches-du-Rhône vers `/zones/marseille/` ;
  - les 12 régions vers `/zones/`.
  - Une page Suisse ne devra être recréée qu'avec des références suisses réelles.
- `LocalBusiness` uniquement sur l'accueil et la page contact (et la page Marseille si elle porte l'adresse du siège). `Service` + `areaServed` ailleurs.

**C3. Architecture « services » cassée : cannibalisation et page chambres froides absente.**
- **Cible commune des menus :** dans le menu de l'en-tête comme dans le pied de page, « Services », « Installation & fourniture », « Chambres froides » et « Cloisons isothermes » pointent tous vers `/installation-fourniture/`. Il n'existe aucune page dédiée aux chambres froides, pourtant le cœur de métier et le sujet de 3 articles sur 4.
- **Deux pages en concurrence :**
  - `/installation-fourniture/` : title « Installation cloisons isothermes & chambres froides — K Isolation », H1 « Installation et fourniture de cloisons isothermes », 396 mots.
  - `/services/installation-fourniture/` : title « Installation & Fourniture » sans marque, pas de H1, pas de description, 187 mots.
  - Les deux sont dans le sitemap. Leur contenu ne se recoupe pas (Jaccard 0,01) mais elles visent les mêmes requêtes.
- **Salle blanche :** `/salle-blanche/` sert à la fois de page service (menu Services) et de page secteur (menu Secteurs).
- **Pages services sans H1 :** les 6 pages `/services/*` (et l'archive `/services/`) n'en ont pas. Leur titre est en H2. 5 d'entre elles n'ont pas de meta description.
- **Recrutement :** `/recrutement/`, `/recrutement-2/` et `/recrutement-3/` sont identiques (ces deux dernières redirigent déjà en 301). `/monteur-de-panneaux-de-chambre-froide-h-f/` est orpheline : 0 lien entrant, hors sitemap.
- **Secteurs :** `/domaine-dactivites/` (15 mots, pas de H1) et `/activtites/` (coquille, déjà en 301) font doublon.

**C4. Liens internes cassés et chaînes de redirection.**

| Lien cassé (404) | Pages qui le contiennent | Origine |
|---|---|---|
| `/politique-de-confidentialite/` | 71 | Pied de page du plugin `k-isolation-local` |
| `/cgv/` | 71 | Idem. Il n'existe aucune page CGV. |
| `/nos-realisations`, `/nos-solutions` | 2 | CTA de `/services/installation-fourniture/` et `/services/remorques/` |
| `/shop/` | 2 | Pages démo `/services/` et `/team/` |
| `/monteur-…/URL-DE-LA-PAGE-EMPLOI-2` et `-3` | 1 | Texte d'exemple jamais remplacé |

- **Liens passant par une 301 :** `/contact` sans barre finale (72 liens), `/portfolio` (29), `/mentions/` (23), `/privacy-policy` (22), et les 6 pages secteurs sans barre finale (11 liens chacune). `/remorques`, `/amenagements-sur-mesure/` et `/author/ines/` redirigent aussi.
- **Point légal :** les liens « Confidentialité » et « CGV » du pied de page aboutissent sur une 404 (sujet RGPD et confiance B2B).

### 3.2 Important

**I1. Titles et meta descriptions.**
- **Meta descriptions :** absentes sur **35 des 59 URL du sitemap** (58 des 82 pages en 200). Cela concerne 5 secteurs sur 6, 5 services sur 6, 3 articles sur 4, 16 zones, `/portfolio/` et `/mentions-legales/`. Une seule est trop longue (201 caractères sur `/services/amenagements-professionnels-specifiques/`). Aucun doublon.
- **Titles :**
  - Marque incohérente : « K ISOLATION » sur 65 pages, « K Isolation » sur 15.
  - Marque en double : « À propos de K ISOLATION - K ISOLATION », « Mentions légales – K ISOLATION - K ISOLATION ».
  - Sans marque : « Installation & Fourniture », « Chambre froide positive ou négative : la différence ».
  - Trop génériques ou trop courts (20 titles de moins de 30 caractères) : « Logistique - K ISOLATION », « Industrie - K ISOLATION », « Corse - K ISOLATION ».
  - Restes anglais : « Portfolio Archive », « Services Archive », « Team Archive ».
  - 4 titles dépassent 60 caractères (65 à 106, tous des articles sauf `/installation-fourniture/`).
  - 2 paires de doublons : `/portfolio_group/agroalimentaire/` et `/category/agroalimentaire/` ; `/portfolio_group/logistique/` et `/category/logistique/`.
- **À faire :** gabarit unique « {Sujet précis} à Marseille / en France | K Isolation », 50 à 60 caractères. Une description unique de 140 à 155 caractères sur chaque page indexable.

**I2. H1 absents ou peu pertinents.**
- **19 pages sans H1**, dont les 6 pages services, `/domaine-dactivites/` et `/privacy-policy/`.
- **H1 peu ciblés :**
  - Accueil : phrase de 125 caractères (« Depuis plus de 10 ans, K Isolation accompagne… ») qui ne contient ni « chambre froide » ni « Marseille ».
  - `/faqs/` : « Découvrez nos questions pratiques FAQs ».
  - `/contact/` : « Parlons de votre projet. »
  - `/recrutement/` : le titre d'une offre (« Monteur / Monteuse de chambres froides H/F »).
  - Pages zones : le nom de la région seul.
- Aucune page n'a plusieurs H1.

**I3. Hygiène d'indexation.**
- **13 URL indexables hors sitemap :** `/portfolio_group/*` (5), `/category/{agroalimentaire, logistique, reglementation, salle-blanche, uncategorized}/` (5), `/team/` (démo), `/privacy-policy/` et `/monteur-…/`.
- **Écart avec le brief :** `/services/remorques/` **figure bien** dans le sitemap `cpt_services`.
- **Pages sans aucun lien entrant :** `/monteur-…/`, `/team/`, `/services/`, `/category/uncategorized/`, `/2025/` et `/2025/08/`.
- **Archives en noindex sans canonical :** dates `/2025/` et `/2025/08/`, tags `/tag/*`, `/services_group/*` et les 3 items démo `/services/{demande-envoi-de-devis, validation-du-devis, execution-des-travaux}/`.
- **Sitemap :** pas de `lastmod` exploitable sur les zones (toutes au 2026-05-17).
- **Canonicals :** toutes les pages indexables ont une canonical auto-référente correcte et la langue `fr-FR`. Pas de hreflang, ce qui est normal pour un site FR seul.

**I4. Données structurées incohérentes.**
- **Accueil et contact :** deux nœuds portent le même `@id` `https://k-isolation.fr/#organization`, celui de Yoast (`Organization`) et celui du plugin (`ProfessionalService` + `LocalBusiness`). Ils risquent de fusionner de façon imprévisible.
- **Adresse :** même adresse (61 rue Marx Dormoy, 13004 Marseille) avec **deux géolocalisations** : 43.30631 / 5.40267 sur l'accueil, 43.2965 / 5.3698 (centre de Marseille) sur la page Marseille.
- **Téléphone :** deux formats, `+33635298057` et « 06 35 29 80 57 ».
- **Article `/chambre-froide-positive-ou-negative-quelle-difference/` :** **2 blocs `FAQPage`**, dont un avec du HTML brut et des attributs `data-start` dans les réponses.
- **FAQPage ailleurs :** présent sur les 5 réalisations et la page Marseille. Google ne l'affiche plus en résultat enrichi pour les sites commerciaux depuis août 2023, et il n'en faut qu'un par page.
- **Délai de devis :** « 48 h » dans le JSON-LD de Marseille, « 24 h » partout ailleurs.
- **Ce qui est correct :** `Article` + `Person` (Inès Ben Labidi) sur les articles, `BreadcrumbList` partout, `CreativeWork` sur les réalisations.

**I5. Images (performance et crédibilité).**
- **Médiathèque :** 143 fichiers, 108 Mo.
  - 53 PNG pour 37 Mo (19 PNG de plus de 500 Ko), 28 fichiers de plus de 1 Mo, 0 WebP/AVIF.
  - **110 fichiers (92 Mo) ne sont référencés dans aucune des 87 pages explorées** (ni dans le CSS Elementor récupéré).
  - Parmi eux : 11 vidéos ou audios pour environ 50 Mo (`0817.mp4` 15,5 Mo, `pb.mov` 14,7 Mo, `installation.mov` 10,6 Mo, `FS-video-factory/metalworking/furniture-new.mp4` 5 Mo de vidéos démo du thème, `sample-melody.mp3`), `woocommerce-placeholder.png`, et des visuels démo `f-*-deco-*`, `*-copyright.*`, `revslider/*`.
- **Images générées par IA :**
  - 12 fichiers dans la médiathèque (10 « ChatGPT-Image… », 1 « Gemini_Generated… », 1 UUID), 22,4 Mo de PNG.
  - **4 sont en ligne :**
    - `/about-us/` : ChatGPT-Image-16-nov.-2025 ;
    - `/services/service-apres-vente-sav/` : Gemini_Generated_Image ;
    - `/services/amenagements-professionnels-specifiques/` : ChatGPT-Image-25-avr.-2026-13_28_48 ;
    - `/services/installation-fourniture/` : ChatGPT-Image-25-avr.-2026-14_04_41 (aussi sur `/services/`).
  - Leur alt est le nom du fichier (« ChatGPT Image 25 avr. 2026, 13 28 48 »). C'est visible par Google Images et par les lecteurs d'écran : impact direct sur la crédibilité d'un artisan B2B.
- **Textes alternatifs :**
  - 79 images sur 131 ont pour alt le nom de leur fichier.
  - 30 partagent le même alt générique « K Isolation — chantier d'isolation industrielle ».
  - 9 ont un alt de banque d'images en anglais (« Young man using pliers in repair workshop », « Car seat metal steel structure… »).
  - Côté pages : **1 494 balises `<img>` sur 2 880 sans attribut alt (52 %)**, au moins 24 par page, venant du gabarit commun.
- **Photos authentiques :** 27 photos de chantier (WhatsApp ou téléphone) sont un vrai atout de crédibilité. Elles sont servies en 1920×2560, de 400 à 800 Ko, et sont à recadrer et compresser.
- **Logos clients :** les logos Burger King, KFC, Carrefour, Quick, Grand Frais et Marie s'affichent dans « Ils nous ont fait confiance ». Il faut s'assurer d'avoir l'accord écrit de chaque marque.

**I6. Résidus anglais, démo du thème et traces d'IA.**
- **Textes anglais :**
  - « Skip to content », « Skip to footer », « Close » sur 23 pages (gabarit thème).
  - « Published: », « Updated: », « 96 Views », « 5 Likes », « 0 Comments », « By », « Share », « Read more », « Copy URL to clipboard » dans le bloc articles de `/agroalimentaire/` et `/about-us/` (6 occurrences par page). Ces compteurs faibles desservent l'image.
- **Contenus de démo encore publics :**
  - `/team/` (« Team Archive », indexable) ;
  - 2 témoignages démo (« Linda Moore », « Un exemple », en 301 vers l'accueil) ;
  - 3 items « process » ;
  - les taxonomies `services_group` ;
  - le brouillon `/elementor-21160/` (410).
- **Traces de copier-coller ChatGPT :** attributs `data-start` / `data-end` présents dans le HTML des 4 articles (112, 46, 79 et 118 occurrences) et de `/faqs/` (7). Ils trahissent un copier-coller depuis l'interface ChatGPT. Le nouveau site doit être nettoyé et relu.

**I7. Polices chargées depuis le domaine de pré-production Hostinger.**
- `wp-content/uploads/elementor/google-fonts/css/roboto.css` déclare ses fichiers `woff2` sur `https://mediumspringgreen-narwhal-464896.hostingersite.com/…`.
- Ces requêtes **échouent** (`ERR_HTTP2_PROTOCOL_ERROR`) et provoquent des erreurs console sur l'accueil, `/agroalimentaire/`, l'article testé et `/about-us/`.
- Le domaine temporaire reste référencé publiquement. Son robots.txt interdit Googlebot, donc il n'y a pas de risque de contenu dupliqué constaté. Sa page d'accueil n'a pas répondu.

**I8. Accessibilité (77 à 93).**
- Contrastes insuffisants, liens sans nom accessible (`link-name`) et éléments masqués mais focusables (`aria-hidden-focus`).
- Ordre des titres incorrect, pas de repère `<main>` sur l'accueil, et des liens `<a>` sans `href` (`search_close`, `menu_mobile_close`) que Lighthouse signale aussi en SEO (`crawlable-anchors`).
- Cibles tactiles trop petites (9 sur `/agroalimentaire/`).

### 3.3 Mineur

- **robots.txt :**
  - Correct pour Google (bloque `/wp-admin/`, `/?s=`, `/feed/`… et déclare le sitemap).
  - Il bloque aussi SemrushBot, AhrefsBot et MJ12bot, ce qui empêche l'équipe d'auditer les backlinks avec ces outils. À ne pas reprendre.
  - Pour le site statique : `User-agent: *` + `Allow: /` + `Sitemap: https://k-isolation.fr/sitemap-index.xml`.
- **Open Graph :** `og:image` absente sur 29 des 59 URL du sitemap, dont toutes les zones et `/installation-fourniture/`.
- **Nom de fichier avec emoji :** `❄️-Chambre-froide-positive-ou-negative-quelle-difference--scaled.jpg` donne une URL encodée `%E2%9D%84%EF%B8%8F`. À proscrire.
- **Incohérences factuelles à corriger dans les contenus repris :**
  - `/zone/ile-de-france/` annonce « 7 départements desservis (75, 77, 78, 91, 92, 93, 94, 95) », mais la liste en compte 8.
  - « Qualibat » est revendiqué sur les 24 pages zone : fournir le numéro de qualification ou retirer la mention.
  - Les mentions légales donnent comme email RGPD `Kisolation07@gmail.com`, alors que `contact@k-isolation.fr` sert partout ailleurs.
  - « Est. 2014 / +10 ans » est à mettre en regard de la date d'immatriculation de la SARL (SIREN 984 177 501). Cette cohérence n'a pas pu être vérifiée : l'API annuaire-entreprises était inaccessible depuis l'environnement d'audit.
- **Pop-up newsletter** (Mailchimp for WP) injectée dans le DOM de chaque page.
- **En-têtes de sécurité :** déjà bons (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). Les reproduire chez le nouvel hébergeur.
- **Redirections d'hôte :** `www` → apex et `http` → `https` fonctionnent (301). À conserver.

---

## 4. Indexation et visibilité (recherches web)

Le moteur de recherche disponible dans l'environnement n'est pas Google et ne gère pas l'opérateur `site:`. **Aucune des observations ci-dessous n'est une mesure d'indexation Google.**

| Requête | Résultat observé |
|---|---|
| `site:k-isolation.fr` (outil de recherche) | Aucun résultat du domaine. L'opérateur n'est pas supporté. |
| `site:k-isolation.fr` (Bing, récupération automatisée) | « Aucun résultat pour site:k-isolation.fr ». La réponse servie à un robot peut être filtrée : non concluant. |
| `site:k-isolation.fr` (DuckDuckGo) | Captcha anti-robot : non mesuré. |
| `"K ISOLATION" cloisons isothermes salles blanches` (recherche étendue) | **2 pages du site ressortent :** `/salle-blanche/` et `/comment-bien-isoler-un-entrepot-…/`, au milieu de concurrents (Isogal, Chabrié Isolation, CIAA, Mecalux). |
| `"K Isolation" Marseille chambre froide` | Aucun résultat k-isolation.fr. Seuls des annuaires et des concurrents ressortent. |
| `K Isolation k-isolation.fr` / `"K Isolation" avis Google Marseille isolation industrielle` | Aucun résultat du site. Des homonymes ressortent (Kiisol, KS Isolation, Kbane). |
| `K Isolation chambre froide positive ou négative quelle différence` | L'article du site n'apparaît pas dans le top 9 (colddistribution.fr, isogal.fr, socomab.com…). |

- **Google Business Profile :** aucune fiche ni avis n'est apparu dans les résultats. Ce n'est pas une preuve d'absence, mais aucun signal n'a été trouvé.
- **Adresse du siège :** l'adresse du JSON-LD et des mentions légales (61 rue Marx Dormoy, 13004) apparaît dans un résultat associée à une autre structure (« Eclosion 13 »). S'il s'agit d'une adresse de domiciliation, la fiche GBP doit être créée en **zone de service avec adresse masquée** : Google refuse les adresses sans personnel sur place.
- **Conclusion :** la marque est jeune et peu visible. Avant la bascule, il faut exporter depuis Search Console :
  - la liste des pages indexées ;
  - les requêtes et pages avec clics et impressions sur 16 mois ;
  - les liens externes.

  Ce sont les seules données capables de pondérer le plan de redirections. Aucune donnée GSC n'a été fournie pour cet audit.

Sources des recherches :
- [k-isolation.fr/salle-blanche/](https://k-isolation.fr/salle-blanche/)
- [k-isolation.fr/comment-bien-isoler-un-entrepot-…](https://k-isolation.fr/comment-bien-isoler-un-entrepot-ou-un-local-industriel-panneaux-cloisons-et-faux-plafonds/)
- [isogal.fr](https://www.isogal.fr/fr/)
- [chabrie-isolation.fr](https://www.chabrie-isolation.fr/)
- [construction-isotherme-ciaa.com](https://www.construction-isotherme-ciaa.com/)
- [colddistribution.fr](https://colddistribution.fr/content/188-chambre-froide-positive-ou-negative-differences)
- [Eclosion 13 (marseille-tourisme.com)](https://www.marseille-tourisme.com/zh/offers/eclosion-13-marseille-4eme-zh-3382746/)

---

## 5. Plan de redirections

### 5.1 Arborescence cible (imposée par l'équipe)

```
/                                         accueil
/chambres-froides/                        (nouvelle page — aucune ancienne URL dédiée)
/cloisons-isothermes/                     ← installation-fourniture ×2, aménagements
/salles-blanches/                         ← /salle-blanche/
/renovation-chambre-froide/               ← rénovation & mise en conformité
/sav-maintenance/                         ← SAV
/secteurs/agroalimentaire/
/secteurs/logistique-entreposage/         ← + remorques (section dédiée à prévoir)
/secteurs/restauration-cuisines-professionnelles/   ← /laboratoire-cuisine/
/secteurs/grande-distribution/            ← /distribution/
/secteurs/pharmacie-laboratoires/         (nouvelle page)
/secteurs/industrie/
/realisations/  +  /realisations/<slug>/  (5 slugs actuels conservés)
/blog/          +  /blog/<slug>/          (4 slugs actuels conservés)
/zones/         +  /zones/marseille/, /zones/provence-alpes-cote-d-azur/, /zones/ile-de-france/
/partenaires/                             (nouvelle page — frigoristes / cuisinistes)
/a-propos/  /devis/  /contact/  /faq/  /recrutement/  /mentions-legales/  /confidentialite/
```

**Zones conservées : 3 sur 24.**
- **Marseille :** contenu propre et siège social.
- **PACA :** région du siège.
- **Île-de-France :** 400 mots spécifiques (Rungis, 92, 93) et une réalisation au MIN de Rungis.

Les 21 autres pages sont des gabarits quasi identiques. Une nouvelle page zone ne devra être créée que si elle apporte au moins 400 mots propres : réalisations locales, contraintes du territoire, délais, FAQ locale. La Suisse est à recréer seulement avec de vraies références.

**Aménagements et remorques (pas de page dédiée prévue) :**
- Aménagements → `/cloisons-isothermes/`. La page actuelle décrit panneaux sandwich, cloisons, plafonds, laboratoires et zones de production.
- Remorques → `/secteurs/logistique-entreposage/`, avec une section « Remorques frigorifiques & isothermes » pour garder le mot-clé.

**Hubs absents de la cible :** `/domaine-dactivites/` et `/services/` sont redirigés vers l'accueil, faute de hub `/secteurs/` ou `/services/`. Si un hub `/secteurs/` est ajouté, y pointer `/domaine-dactivites/` et `/activtites/`.

### 5.2 Règles d'implémentation

- **Format :** `site/redirects.json` contient 100 entrées `{from, to, status}` : 86 en 301 et 14 en 410 avec `to: null`. Les URL gardées à l'identique n'y figurent pas.
- **Aucune chaîne :** vérifié par script, aucun `to` n'est aussi un `from`. Les anciennes redirections WordPress sont réécrites vers la cible finale (`/activtites/`, `/amenagements-sur-mesure/`, `/renovation-conformite/`, `/recrutement-2/`…).
- **Barre finale :** la couche de redirection doit accepter chaque `from` **avec et sans** barre finale (`/remorques` et `/contact` sont liés sans), en ignorant la query string. Astro est configuré en `trailingSlash: 'always'`.
- **Règles génériques à ajouter côté hébergeur (non listées une à une) :**
  - `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*`, `/wp-includes/*`, `/wp-content/plugins/*`, `/wp-content/themes/*` → 410.
  - `/wp-content/uploads/*` → 410 par défaut. Mettre en 301 vers la nouvelle image les seuls médias réutilisés et repérés dans GSC ou Google Images (par exemple les photos de chantier des réalisations).
  - `/?s=*`, `/page/*`, `/*/feed/` → 410 (`/feed/` lui-même est redirigé vers `/rss.xml`).
  - `/?p=<id>` : laisser en 404.
- **Hors redirections :** `/cgv/` et `/shop/` n'ont jamais existé. Il faut soit créer une page `/cgv/` (recommandé en B2B), soit retirer le lien.

### 5.3 Tableau complet (107 URL)

| Ancienne URL | Décision | Nouvelle URL | Raison |
|---|---|---|---|
| `/` | GARDER | `/` | Accueil, même URL. |
| `/installation-fourniture/` | FUSIONNER | `/cloisons-isothermes/` | H1 « Installation et fourniture de cloisons isothermes » ; le menu « Chambres froides » ET « Cloisons isothermes » pointe ici ; cannibalise /services/installation-fourniture/. |
| `/services/installation-fourniture/` | FUSIONNER | `/cloisons-isothermes/` | Doublon du précédent : 187 mots, pas de H1, pas de meta description, title sans marque. |
| `/salle-blanche/` | REDIRIGER | `/salles-blanches/` | Page service salles blanches (pluriel = requête principale). |
| `/services/amenagements-professionnels-specifiques/` | FUSIONNER | `/cloisons-isothermes/` | Pas de page « aménagements » prévue ; périmètre décrit = panneaux sandwich, cloisons, plafonds isothermes, zones de production/stockage. |
| `/amenagements-sur-mesure/` | FUSIONNER | `/cloisons-isothermes/` | Ancienne page déjà 301 → /services/amenagements-…/ : pointer directement sur la cible finale (pas de chaîne). |
| `/services/remorques/` | FUSIONNER | `/secteurs/logistique-entreposage/` | Pas de page remorques prévue ; sujet = transport sous température dirigée → page logistique (ajouter une section « Remorques frigorifiques & isothermes »). |
| `/remorques/` | FUSIONNER | `/secteurs/logistique-entreposage/` | Raccourci existant (301 actuel, lien du pied de page thème). |
| `/services/renovation-mise-en-conformite/` | REDIRIGER | `/renovation-chambre-froide/` | Nouvelle page rénovation. |
| `/renovation-conformite/` | REDIRIGER | `/renovation-chambre-froide/` | Ancienne page déjà 301 → /services/renovation-… : éviter la chaîne. |
| `/services/service-apres-vente-sav/` | REDIRIGER | `/sav-maintenance/` | Nouvelle page SAV. |
| `/sav-maintenance/` | GARDER | `/sav-maintenance/` | Devient la page réelle (aujourd'hui 301 vers /services/service-apres-vente-sav/ : la règle disparaît avec WordPress). |
| `/services/` | REDIRIGER | `/` | Archive CPT « Services Archive » : 0 lien entrant, pas de H1, pas de description ; pas de hub services dans la cible. |
| `/services/demande-envoi-de-devis/` | REDIRIGER | `/devis/` | Item démo du thème (CPT « process »), noindex, 4 mots ; correspondance sémantique avec /devis/. |
| `/services/validation-du-devis/` | SUPPRIMER (410) | — | Item démo du thème, noindex, 3 mots. |
| `/services/execution-des-travaux/` | SUPPRIMER (410) | — | Item démo du thème, noindex, 3 mots. |
| `/services_group/nos-services/` | SUPPRIMER (410) | — | Taxonomie du thème, noindex. |
| `/services_group/process/` | SUPPRIMER (410) | — | Taxonomie du thème, noindex. |
| `/domaine-dactivites/` | REDIRIGER | `/` | 15 mots de contenu, pas de H1 ni de description ; pas de hub /secteurs/ dans la cible → accueil (section secteurs). Si un hub /secteurs/ est créé, pointer dessus. |
| `/activtites/` | REDIRIGER | `/` | Coquille (« activtites ») déjà 301 → /domaine-dactivites/ : cible finale directe. |
| `/agroalimentaire/` | REDIRIGER | `/secteurs/agroalimentaire/` | Page secteur. |
| `/logistique/` | REDIRIGER | `/secteurs/logistique-entreposage/` | Page secteur. |
| `/laboratoire-cuisine/` | REDIRIGER | `/secteurs/restauration-cuisines-professionnelles/` | H1 « Cloisonnement et aménagement de cuisines professionnelles ». |
| `/industrie/` | REDIRIGER | `/secteurs/industrie/` | Page secteur. |
| `/distribution/` | REDIRIGER | `/secteurs/grande-distribution/` | Page secteur. |
| `/portfolio/` | REDIRIGER | `/realisations/` | Archive « Portfolio Archive » (title anglais). |
| `/portfolio/installation-cloisons-isothermes-haute-performance/` | REDIRIGER | `/realisations/installation-cloisons-isothermes-haute-performance/` | Même slug, nouveau préfixe. |
| `/portfolio/renovation-magasin-carrefour-lambris-pvc/` | REDIRIGER | `/realisations/renovation-magasin-carrefour-lambris-pvc/` | Même slug, nouveau préfixe. |
| `/portfolio/depose-remplacement-sol-chambre-froide-negative/` | REDIRIGER | `/realisations/depose-remplacement-sol-chambre-froide-negative/` | Même slug, nouveau préfixe. |
| `/portfolio/amenagement-bureaux-vestiaires-industriels/` | REDIRIGER | `/realisations/amenagement-bureaux-vestiaires-industriels/` | Même slug, nouveau préfixe. |
| `/portfolio/cuisine-professionnelle-min-rungis/` | REDIRIGER | `/realisations/cuisine-professionnelle-min-rungis/` | Même slug, nouveau préfixe. |
| `/portfolio_group/agroalimentaire/` | REDIRIGER | `/realisations/` | Taxonomie du thème indexable hors sitemap, title « Archives des … », H1 « Nos réalisations » identique. |
| `/portfolio_group/logistique/` | REDIRIGER | `/realisations/` | Taxonomie du thème indexable hors sitemap, title « Archives des … », H1 « Nos réalisations » identique. |
| `/portfolio_group/distribution/` | REDIRIGER | `/realisations/` | Taxonomie du thème indexable hors sitemap, title « Archives des … », H1 « Nos réalisations » identique. |
| `/portfolio_group/industrie/` | REDIRIGER | `/realisations/` | Taxonomie du thème indexable hors sitemap, title « Archives des … », H1 « Nos réalisations » identique. |
| `/portfolio_group/cuisine-professionnelle/` | REDIRIGER | `/realisations/` | Taxonomie du thème indexable hors sitemap, title « Archives des … », H1 « Nos réalisations » identique. |
| `/category/realisations-projets/` | REDIRIGER | `/realisations/` | Catégorie d’articles « Réalisations / Projets ». |
| `/blog/` | GARDER | `/blog/` | Liste des articles. |
| `/comment-bien-choisir-sa-chambre-froide-professionnelle/` | REDIRIGER | `/blog/comment-bien-choisir-sa-chambre-froide-professionnelle/` | Article à la racine → sous /blog/, slug conservé. |
| `/faut-il-un-permis-ou-une-autorisation-speciale-pour-installer-une-chambre-froide/` | REDIRIGER | `/blog/faut-il-un-permis-ou-une-autorisation-speciale-pour-installer-une-chambre-froide/` | Article à la racine → sous /blog/, slug conservé. |
| `/comment-bien-isoler-un-entrepot-ou-un-local-industriel-panneaux-cloisons-et-faux-plafonds/` | REDIRIGER | `/blog/comment-bien-isoler-un-entrepot-ou-un-local-industriel-panneaux-cloisons-et-faux-plafonds/` | Article à la racine → sous /blog/, slug conservé. |
| `/chambre-froide-positive-ou-negative-quelle-difference/` | REDIRIGER | `/blog/chambre-froide-positive-ou-negative-quelle-difference/` | Article à la racine → sous /blog/, slug conservé. |
| `/category/blog-actualites/` | REDIRIGER | `/blog/` | Archive de catégorie (86–187 mots, sans description) ; 4 articles seulement → pas de catégories. |
| `/category/chambre-froide/` | REDIRIGER | `/blog/` | Archive de catégorie (86–187 mots, sans description) ; 4 articles seulement → pas de catégories. |
| `/category/agroalimentaire/` | REDIRIGER | `/blog/` | Archive de catégorie (86–187 mots, sans description) ; 4 articles seulement → pas de catégories. |
| `/category/logistique/` | REDIRIGER | `/blog/` | Archive de catégorie (86–187 mots, sans description) ; 4 articles seulement → pas de catégories. |
| `/category/reglementation/` | REDIRIGER | `/blog/` | Archive de catégorie (86–187 mots, sans description) ; 4 articles seulement → pas de catégories. |
| `/category/salle-blanche/` | REDIRIGER | `/blog/` | Archive de catégorie (86–187 mots, sans description) ; 4 articles seulement → pas de catégories. |
| `/category/uncategorized/` | REDIRIGER | `/blog/` | Archive de catégorie (86–187 mots, sans description) ; 4 articles seulement → pas de catégories. |
| `/tag/cloisons/` | SUPPRIMER (410) | — | Archive d’étiquette noindex, liée seulement depuis des pages démo. |
| `/tag/entrepot/` | SUPPRIMER (410) | — | Archive d’étiquette noindex, liée seulement depuis des pages démo. |
| `/tag/local-industriel/` | SUPPRIMER (410) | — | Archive d’étiquette noindex, liée seulement depuis des pages démo. |
| `/2025/` | SUPPRIMER (410) | — | Archive de dates noindex. |
| `/2025/08/` | SUPPRIMER (410) | — | Archive de dates noindex. |
| `/author/ines/` | REDIRIGER | `/a-propos/` | Page auteur (aujourd'hui 301 → /) ; l'auteure est citée en Person JSON-LD sur les articles. |
| `/feed/` | REDIRIGER | `/rss.xml` | Flux RSS WordPress → flux RSS du nouveau site (src/pages/rss.xml.ts). |
| `/comments/feed/` | SUPPRIMER (410) | — | Flux des commentaires (commentaires inutilisés). |
| `/zones/` | GARDER | `/zones/` | Hub des zones. |
| `/zone/provence-alpes-cote-d-azur/bouches-du-rhone/marseille/` | REDIRIGER | `/zones/marseille/` | Seule page zone avec du contenu propre (783 mots, FAQ locale) ; ville du siège. Aujourd’hui à 4 clics, 2 liens entrants. |
| `/zone/provence-alpes-cote-d-azur/` | REDIRIGER | `/zones/provence-alpes-cote-d-azur/` | Région du siège. |
| `/zone/provence-alpes-cote-d-azur/bouches-du-rhone/` | FUSIONNER | `/zones/marseille/` | Gabarit (240 mots) ; la page Marseille couvre le 13. |
| `/zone/ile-de-france/` | REDIRIGER | `/zones/ile-de-france/` | 2e page zone avec du contenu propre (400 mots, Rungis, 92/93). |
| `/zone/ile-de-france/seine-saint-denis/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/ile-de-france/seine-saint-denis/aulnay-sous-bois/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/ile-de-france/seine-saint-denis/saint-denis/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/ile-de-france/seine-saint-denis/bobigny/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/ile-de-france/hauts-de-seine/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/ile-de-france/hauts-de-seine/gennevilliers/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/ile-de-france/hauts-de-seine/nanterre/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/ile-de-france/hauts-de-seine/courbevoie/` | FUSIONNER | `/zones/ile-de-france/` | Gabarit (230–245 mots), quasi-doublon (Jaccard 0,82–0,85 entre villes), 2 liens entrants. |
| `/zone/auvergne-rhone-alpes/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/bourgogne-franche-comte/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/bretagne/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/centre-val-de-loire/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/corse/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/grand-est/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/hauts-de-france/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/normandie/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/nouvelle-aquitaine/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/occitanie/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/pays-de-la-loire/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/zone/suisse/` | FUSIONNER | `/zones/` | Gabarit (214–223 mots) où seul le nom de région change (similarité 0,87–0,91), sans description. Page « doorway » : à ne recréer qu’avec des références réelles dans la zone. |
| `/about-us/` | REDIRIGER | `/a-propos/` | URL anglaise → français. |
| `/contact/` | GARDER | `/contact/` | Même URL. |
| `/faqs/` | REDIRIGER | `/faq/` | Nouvelle URL. |
| `/recrutement/` | GARDER | `/recrutement/` | Même URL. |
| `/recrutement-2/` | REDIRIGER | `/recrutement/` | Doublon (déjà 301 aujourd’hui). |
| `/recrutement-3/` | REDIRIGER | `/recrutement/` | Doublon (déjà 301 aujourd’hui). |
| `/monteur-de-panneaux-de-chambre-froide-h-f/` | FUSIONNER | `/recrutement/` | Offre orpheline (0 lien entrant), hors sitemap, 2 liens « URL-DE-LA-PAGE-EMPLOI » cassés ; l’offre devient une section de /recrutement/ (JobPosting si l’offre est ouverte). |
| `/mentions-legales/` | GARDER | `/mentions-legales/` | Même URL. |
| `/mentions/` | REDIRIGER | `/mentions-legales/` | Raccourci existant (301 actuel, lien du pied de page thème). |
| `/privacy-policy/` | REDIRIGER | `/confidentialite/` | URL anglaise, indexable hors sitemap, pas de H1. |
| `/politique-de-confidentialite/` | REDIRIGER | `/confidentialite/` | 404 actuel lié depuis 71 pages (pied de page) : la redirection récupère ces liens. |
| `/nos-realisations/` | REDIRIGER | `/realisations/` | 404 actuel lié depuis 2 pages services. |
| `/nos-solutions/` | REDIRIGER | `/` | 404 actuel lié depuis 2 pages services. |
| `/team/` | SUPPRIMER (410) | — | Archive démo du thème (« Team Archive », 56 mots), indexable, 0 lien entrant. |
| `/testimonials/linda-moore-3/` | SUPPRIMER (410) | — | Témoignage de démo (« Linda Moore »), aujourd’hui 301 → /. |
| `/testimonials/ici-des-temoignages-de-vos-clients-ou-collaborateurs-partenaires/` | SUPPRIMER (410) | — | Témoignage de démo (« Un exemple »), aujourd’hui 301 → /. |
| `/elementor-21160/` | SUPPRIMER (410) | — | Brouillon Elementor, déjà 410. |
| `/home/` | REDIRIGER | `/` | Redirection WordPress existante. |
| `/sitemap_index.xml` | REDIRIGER | `/sitemap-index.xml` | Index Yoast soumis dans Search Console → index généré par @astrojs/sitemap. |
| `/post-sitemap.xml` | REDIRIGER | `/sitemap-index.xml` | Sous-sitemap Yoast. |
| `/page-sitemap.xml` | REDIRIGER | `/sitemap-index.xml` | Sous-sitemap Yoast. |
| `/zone-sitemap.xml` | REDIRIGER | `/sitemap-index.xml` | Sous-sitemap Yoast. |
| `/cpt_portfolio-sitemap.xml` | REDIRIGER | `/sitemap-index.xml` | Sous-sitemap Yoast. |
| `/cpt_services-sitemap.xml` | REDIRIGER | `/sitemap-index.xml` | Sous-sitemap Yoast. |
| `/category-sitemap.xml` | REDIRIGER | `/sitemap-index.xml` | Sous-sitemap Yoast. |

**Récapitulatif :** 7 gardées, 58 redirigées, 28 fusionnées et 14 supprimées (410). `/chambres-froides/`, `/secteurs/pharmacie-laboratoires/`, `/partenaires/`, `/devis/` (hors l'ancien item démo) et `/contact/` ne reçoivent aucune ancienne URL dédiée. Ces pages sont à créer avec du contenu neuf.

---

## 6. Checklist de migration SEO

### J-15 à J-1 (préparation)

- [ ] **Search Console :**
  - Ajouter une propriété **Domaine** vérifiée par **enregistrement TXT DNS**. Aucune balise `google-site-verification` n'est présente dans le HTML et aucun TXT Google dans le DNS : la vérification actuelle passe probablement par Site Kit ou Analytics et **disparaîtra avec WordPress**.
  - Exporter les rapports Performance (16 mois : requêtes et pages), Pages (indexées et non indexées) et Liens (pages les plus liées de l'extérieur).
  - Affiner `redirects.json` si une URL fusionnée génère du trafic : elle mérite alors une section dédiée sur la page cible.
- [ ] **Analytics :** noter l'ID GA4 associé à `GT-W6BZTT35` et réutiliser **la même propriété** dans Astro, derrière un bandeau de consentement CNIL. Ajouter un événement de conversion sur la soumission du devis et le clic sur le téléphone.
- [ ] **Positions de référence :** suivre 20 à 30 mots-clés avant la bascule, par exemple :
  - « chambre froide Marseille », « installation chambre froide professionnelle », « cloison isotherme » ;
  - « panneau sandwich chambre froide », « salle blanche ISO 7 », « rénovation chambre froide » ;
  - « isolation frigorifique Marseille », la marque…

  Utiliser un outil de suivi ou, à défaut, un relevé manuel en navigation privée géolocalisée Marseille.
- [ ] **Sauvegardes :** export complet WordPress (XML et base), médiathèque (`wp-content/uploads`, 108 Mo) et ce crawl (`audit/source/`).
- [ ] **Email et DNS, à ne pas casser.** Le DNS est chez Hostinger (`ns1/ns2.dns-parking.com`). Relevé public du 31/10/2026 :
  - MX : `mx1.hostinger.com` (5) et `mx2.hostinger.com` (10).
  - SPF : `v=spf1 include:_spf.mail.hostinger.com ~all`.
  - DKIM : CNAME `hostingermail-a/b/c._domainkey` → `*.dkim.mail.hostinger.com`.
  - DMARC : `v=DMARC1; p=none`.
  - `autodiscover` et `autoconfig` en CNAME vers `mail.hostinger.com`.
  - Web : A `46.202.172.2`, AAAA `2a02:4780:27:1890:0:227e:fa92:d`, `www` en CNAME vers l'apex.

  **Règles :**
  - Ne modifier que A, AAAA et `www`. Ne pas changer les NS sans recopier d'abord **tous** les enregistrements ci-dessus.
  - Vérifier dans hPanel si la boîte `contact@k-isolation.fr` dépend de l'offre d'hébergement web. Si oui, résilier l'hébergement supprime les emails : basculer sur une offre email seule avant toute résiliation.
  - Vérifier aussi l'échéance du nom de domaine.
  - Baisser le TTL des enregistrements A, AAAA et `www` à 300 s 48 h avant la bascule.
- [ ] **Formulaires :** si le service de formulaires du site statique envoie depuis `@k-isolation.fr`, ajouter son `include:` SPF et sa clé DKIM. Tester la réception sur `contact@` et éviter le spam (DMARC est en `p=none`, à durcir plus tard).
- [ ] **Préproduction :**
  - Protégée (mot de passe ou en-tête `X-Robots-Tag: noindex`), jamais indexable.
  - Vérifier que **la production ne porte ni `noindex`, ni `Disallow: /`**.
  - Recetter `redirects.json` sur la préproduction avec un script qui parcourt chaque `from` et contrôle le statut 301 ou 410, l'en-tête `Location` égal au `to`, l'absence de chaîne et un 200 sur la cible.
- [ ] **Contenu :**
  - Reprendre et réécrire (pas de copier-coller) les contenus de valeur : les 4 articles, les 5 réalisations, Marseille, Île-de-France, `/installation-fourniture/`, les 6 secteurs et la FAQ.
  - Supprimer les attributs `data-start`, les textes anglais et les images IA. Écrire des alts descriptifs en français.
  - Un H1 unique par page. Une meta description sur chaque page indexable.
- [ ] **Technique Astro :**
  - Canonical absolue `https://k-isolation.fr/…/` sur chaque page.
  - `sitemap-index.xml` qui exclut `/merci/` et `/404/`. `robots.txt` simple.
  - Une vraie page 404 renvoyant le statut 404.
  - JSON-LD : `Organization`/`LocalBusiness` unique (accueil et contact, avec une seule géolocalisation), `Service`, `BreadcrumbList`, `Article` + `Person`.
  - Open Graph sur toutes les pages. En-têtes de sécurité identiques à l'existant.
  - Cache `immutable` d'un an sur les fichiers statiques hashés.

### Jour J

- [ ] Déployer en production, puis basculer A, AAAA et `www`. Contrôler `http` → `https` et `www` → apex en une seule 301.
- [ ] Lancer le script de recette sur la **production** (100 entrées) et un crawl complet du nouveau site. Objectif : 0 lien interne en 404 ou en 301, 0 page orpheline, 1 H1 par page, aucune description manquante.
- [ ] **Search Console :**
  - Soumettre `https://k-isolation.fr/sitemap-index.xml`.
  - Garder l'ancien `sitemap_index.xml` soumis, qui redirige désormais vers le nouveau.
  - Publier un fichier `sitemap-legacy.xml` listant les **anciennes** URL redirigées, et le soumettre **30 à 60 jours** pour accélérer la découverte des 301.
  - Inspecter et demander l'indexation des 10 pages prioritaires : accueil, `/chambres-froides/`, `/cloisons-isothermes/`, `/salles-blanches/`, `/zones/marseille/`, `/devis/`, etc.
- [ ] Vérifier que GA4 reçoit des données et que les formulaires devis et contact livrent bien les emails. Envoyer et recevoir un email de test sur `contact@`.
- [ ] Mettre à jour les liens que l'on maîtrise : LinkedIn, signatures email, annuaires, et la fiche Google Business Profile si elle existe (sinon la créer, cf. §4).

### J+1 à J+7

- [ ] **Search Console, chaque jour :** rapports Pages (pics de « Introuvable (404) » ou d'« Erreur de redirection »), Statistiques d'exploration et Améliorations (données structurées).
- [ ] Surveiller les 404 réelles dans les logs ou analytics de l'hébergeur. Toute ancienne URL qui reçoit des visites et tombe en 404 doit être ajoutée à `redirects.json`.
- [ ] Relancer Lighthouse mobile sur les mêmes URL. Objectifs : Perf ≥ 90, LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 200 ms.

### J+30

- [ ] Comparer clics, impressions et positions avec la référence du J-1. Une baisse de 10 à 20 % pendant 2 à 4 semaines est courante après une refonte d'URL ; au-delà, examiner page par page.
- [ ] Vérifier que les anciennes URL sortent de l'index et que les nouvelles y entrent (rapport Pages, inspection d'URL).
- [ ] Contrôler les Signaux Web essentiels si des données terrain apparaissent.
- [ ] Retirer `sitemap-legacy.xml` après 60 jours. **Garder les 301 au moins un an**, idéalement sans limite.
- [ ] Ne résilier l'hébergement web Hostinger qu'après ces 30 jours, une fois les emails sécurisés et les sauvegardes vérifiées.
