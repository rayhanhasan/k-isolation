# K Isolation : audit UX et conversion (CRO)

> Livrable 03 de l'audit de refonte de https://k-isolation.fr.
> **Base :** 16 captures pleine page réalisées le 31/10/2026 (Playwright, Chromium, desktop 1440 px et mobile 390 px en émulation tactile, chargement `networkidle` + 2 s, popups fermés avant la capture), mesures navigateur (Performance API), lecture du HTML public et des textes extraits (`source/*.md`, `_media.json`).
> **Alignement :** ce document reprend la cible, la promesse, les CTA, le formulaire en étapes et le plan d'URL de `02-audience-marche.md` (§0 bis, §2.2, §2.3, §3, §6.1). Il ne les redéfinit pas : il les traduit en écrans.
> **Règle :** aucun chiffre client inventé. Ce qui manque est marqué `[À FOURNIR PAR LE CLIENT]` ou `[À CONFIRMER]`.
> **Limite :** les temps ont été mesurés depuis un serveur, sans bridage réseau ni processeur. Ce sont des valeurs **optimistes** : sur un smartphone en 4G, elles seront plus longues (voir l'audit technique pour les mesures Lighthouse bridées).

## Captures produites

| Page | Desktop (1440 px) | Mobile (390 px) |
|---|---|---|
| Accueil | `screenshots/home-desktop.jpg` | `screenshots/home-mobile.jpg` |
| Contact / devis | `screenshots/contact-desktop.jpg` | `screenshots/contact-mobile.jpg` |
| Service : installation & fourniture | `screenshots/service-installation-fourniture-desktop.jpg` | `screenshots/service-installation-fourniture-mobile.jpg` |
| Secteur : agroalimentaire | `screenshots/secteur-agroalimentaire-desktop.jpg` | `screenshots/secteur-agroalimentaire-mobile.jpg` |
| Réalisations (liste) | `screenshots/portfolio-desktop.jpg` | `screenshots/portfolio-mobile.jpg` |
| Réalisation : cuisine pro MIN de Rungis | `screenshots/realisation-cuisine-min-rungis-desktop.jpg` | `screenshots/realisation-cuisine-min-rungis-mobile.jpg` |
| Article : chambre froide positive ou négative | `screenshots/blog-chambre-froide-positive-negative-desktop.jpg` | `screenshots/blog-chambre-froide-positive-negative-mobile.jpg` |
| Zone : Île-de-France | `screenshots/zone-ile-de-france-desktop.jpg` | `screenshots/zone-ile-de-france-mobile.jpg` |

---

## 1. Résumé exécutif

1. **Le site ne dit pas en 5 secondes ce qu'il vend, à qui ni où.** Le H1 de l'accueil (26 mots, 7 lignes sur desktop, 9 sur mobile) parle de l'entreprise (« Depuis plus de 10 ans, K Isolation accompagne… ») et non du problème du client. Marseille n'apparaît pas dans le premier écran. L'ancienneté mise en avant contredit l'immatriculation de 2024 (02 §0 bis).
2. **Sur mobile, le premier écran ne contient ni bouton de devis contrasté ni téléphone.** Le bouton « Demander un devis » du hero se trouve vers 1 150 px, soit environ 1,4 écran plus bas. Il n'y a pas de barre d'action collante, et le bloc d'appel final arrive au 17e écran sur 19.
3. **Le seul point de conversion est un formulaire générique.** `/contact/` (Contact Form 7) demande nom, téléphone, e-mail, un « sujet » libre et un message. Il ne demande ni société, ni fonction, ni code postal, ni type de besoin, ni surface, ni échéance. Il n'y a pas de page de remerciement : le message s'affiche en AJAX et le formulaire est déclaré en `lang="en-US"`. Il n'existe aucune autre voie : ni rappel, ni rendez-vous, ni envoi de photos par WhatsApp, ni parcours d'urgence.
4. **La preuve sociale est faible ou invérifiable.** Le bandeau de logos défile en carrousel avec des logos minuscules (le logo Carrefour mesure environ 20 px de large dans sa tuile). Deux logos (STEF, Netto) ont pour seul texte alternatif « Partenaire » et ne sont cités nulle part ailleurs. Il n'y a ni avis ni témoignage nommé. Les chiffres (« 20 000 m² », « 50+ partenaires », « 80 chantiers à Marseille ») ne sont pas documentés.
5. **Les signaux d'amateurisme cassent la confiance au moment où l'acheteur vérifie** : texte de démo du thème (« If you feel tired and stressed after work. »), interface en anglais (« Read more », « Published », « 96 Views · 5 Likes »), e-mail Gmail dans les mentions légales, Qualibat et ATEX sans numéro, délais contradictoires (24 h ou 48 h), même photo utilisée pour deux chantiers différents.
6. **L'architecture disperse l'intention.** « Chambres froides » et « Cloisons isothermes », les deux cœurs de métier, pointent vers la même page générique, `/installation-fourniture/`. Il n'existe aucune page dédiée aux chambres froides, au devis, à l'urgence ni aux garanties. On compte en revanche deux pages « installation & fourniture », trois pages de recrutement identiques et une vingtaine de pages de zones creuses.
7. **Priorité de la refonte :** un hero orienté problème (« posé sans arrêter votre activité », 02 §3.1), une barre d'action collante sur mobile, un formulaire de devis en 5 étapes avec page de remerciement et suivi, un parcours urgence/SAV distinct, des études de cas au format fixe avec photos réelles, et un menu de 6 entrées au plus.

---

## 2. Mesures relevées

### 2.1 Affichage du contenu au-dessus de la ligne de flottaison

Temps en secondes depuis le début de la navigation. FCP = premier rendu de contenu. « H1 visible » = moment où le titre principal devient visible dans le premier écran (opacité > 0,5).

| Page | FCP desktop | H1 visible desktop | LCP desktop | FCP mobile | H1 visible mobile | Poids transféré | Requêtes | Hauteur mobile (en écrans de 844 px) |
|---|---|---|---|---|---|---|---|---|
| Accueil | 2,66 | 3,28 | 4,30 (photo du hero) | 2,75 | 3,20 | ≈ 1,7 Mo | 99 | **18,7** |
| Contact | 2,11 | 3,04 | 2,11 | 1,98 | 2,76 | ≈ 1,3 Mo | 87 | 5,3 |
| Service installation | 1,68 | **pas de H1** | 1,93 | 1,96 | pas de H1 | ≈ 1,3 Mo | 75 | 5,4 |
| Secteur agroalimentaire | 2,50 | 3,04 | 2,50 | 2,09 | 2,80 | ≈ 1,4 Mo | 85 | 12,8 |
| Réalisations | 2,42 | 3,15 | 3,81 | 2,12 | 2,80 | ≈ 1,7 à 1,9 Mo | 71 | 7,3 |
| Réalisation Rungis | 1,90 | 2,61 | 3,46 | 2,04 | 2,74 | ≈ 1,6 Mo | 69 | 11,8 |
| Article de blog | 1,81 | 2,46 | 2,08 | 1,98 | 3,03 | ≈ 1,7 Mo | 80 | 10,2 |
| Zone Île-de-France | 1,91 | 2,45 | 1,91 | 1,96 | 2,55 | ≈ 1,2 Mo | 58 | 9,1 |

**Constat clé :** sur les 14 mesures disposant d'un H1, celui-ci devient visible **exactement à la fin du `DOMContentLoaded`** (écart de 1 à 4 ms), soit 0,5 à 0,9 s après le premier rendu. Le texte du hero reste donc masqué tant que les 30 à 40 scripts n'ont pas été traités. Sur un vrai mobile en 4G, cet écart s'allonge mécaniquement. Pendant ce temps, le visiteur voit un fond marine et une photo, mais pas la promesse.

**Erreur relevée sur toutes les pages :** la police Roboto est appelée depuis un domaine de préproduction Hostinger (`mediumspringgreen-narwhal-464896.hostingersite.com`) et bloquée par CORS (erreur dans la console). C'est un reste de mise en ligne : la police de secours s'affiche.

### 2.2 Popups

- **Pop-in newsletter maison** (`#ki-news-popup`, formulaire MC4WP, « Newsletter mensuelle · Recevez nos vrais conseils d'experts ») présente sur toutes les pages. Elle a été vue **ouverte environ 27 s après le chargement sur `/contact/`**, en desktop comme en mobile, pendant le remplissage du formulaire de devis. Sur mobile, elle couvre 376 px sur 844, soit **45 % de l'écran**. Sur les autres pages, la capture était terminée avant ce délai : le déclencheur semble temporel, à confirmer dans la configuration.
- Aucun bandeau cookies n'a été observé, alors que les mentions légales annoncent « un bandeau vous informe […] et sollicite votre consentement ». À vérifier avec l'audit technique et RGPD.
- Pas de popup Advanced Popups visible pendant les tests.

---

## 3. Constats classés par impact sur la conversion

### 3.1 CRITIQUE (bloque la demande de devis ou la décision)

| # | Constat | Preuves | Recommandation |
|---|---|---|---|
| **C1** | **Promesse du hero auto-centrée, trop longue et fondée sur une ancienneté contestable.** Test des 5 secondes : on comprend « isolation technique », mais pas « chambres froides et cloisons posées sans arrêter votre activité ». Il manque le « où » (Marseille n'est cité qu'en légende de photo), et le « pour qui » mentionne la pharmacie, pour laquelle il n'existe aucune référence. « 10 ans » apparaît **5 fois sur l'accueil** (bandeau « Est. 2014 », H1, compteur, carte « 10 ans d'expérience terrain », pied de page) alors que la société a été immatriculée en 2024 (02 §0 bis). | `screenshots/home-desktop.jpg` (hero, H1 de 7 lignes), `screenshots/home-mobile.jpg` (H1 de 9 lignes, coupé par la ligne de flottaison) | H1 en 8 à 12 mots, variante A de 02 §3.1 : « Chambres froides et cloisons isothermes, posées sans arrêter votre activité ». Sous-titre avec le « où » (Marseille, Île-de-France, France entière). Récit d'ancienneté honnête (02 §3.4) |
| **C2** | **Mobile : aucune action possible dans le premier écran.** En-tête mobile : logo rond illisible, lien texte « Devis gratuit » sans fond de bouton, menu burger. **Pas de téléphone.** Le bouton du hero est vers 1 150 px. Pas de barre collante. Le bloc « Prêt à démarrer votre prochain chantier ? » (devis et téléphone) arrive vers 14 000 px sur 15 900. | `screenshots/home-mobile.jpg` ; mesures DOM : les seuls liens cliquables dans les 844 premiers px sont « Devis gratuit » et la pop-in | Barre collante en bas sur mobile : « Appeler » et « Estimation 24 h » (« Urgence » sur les pages SAV). Icône téléphone dans l'en-tête. Bouton principal visible sans défilement |
| **C3** | **Formulaire unique, non qualifiant, sans suite visible.** `/contact/` utilise Contact Form 7 : Nom complet\*, Téléphone\*, Email professionnel\*, Sujet\* (texte libre), message, 5 pièces jointes, case de consentement, Cloudflare Turnstile. Il manque société, fonction, code postal, type de besoin, secteur, surface, échéance et « site ouvert pendant les travaux ». Pas de page de remerciement (réponse AJAX), donc pas d'URL de conversion à suivre et pas de « prochaines étapes » annoncées. Formulaire déclaré en `lang="en-US"`. Les champs n'ont que des placeholders, pas de libellés. Le bouton « Parcourir mes fichiers » est en texte bleu sur fond bleu, donc illisible. Le bouton d'envoi est à environ 1 470 px sur mobile. `/devis/` et `/merci/` renvoient une 404. | `screenshots/contact-mobile.jpg`, `screenshots/contact-desktop.jpg` ; HTML de `/contact/` (`wpcf7-f1413`) | Formulaire en 5 étapes de 02 §2.2 (détaillé au §6.5 ci-dessous), page `/devis/merci/`, événements GA4 par étape, notation du lead, et `/contact/` réservé aux autres demandes |
| **C4** | **Chiffres, labels et délais contradictoires ou invérifiables, découverts dès que l'acheteur vérifie.** « 20 000+ m² posés », « 50+ partenaires », « 24 h devis garanti » sur l'accueil, `/contact/` et `/portfolio/` ; « 80 chantiers à Marseille en 3 ans », « 30 en Île-de-France » sur les pages zones ; « Devis gratuit en 48 h » sur la page Marseille ; « Qualibat » sans numéro sur toutes les pages zones ; « certifiées ATEX » ; e-mail `Kisolation07@gmail.com` et directeur de publication « Anicet » (prénom seul) dans les mentions légales. | `source/home.md`, `source/zone-*.md`, `source/mentions-legales.md`, `screenshots/zone-ile-de-france-desktop.jpg` ; liste complète dans 02 §2.3 | Ne publier que ce qui est documenté (02 §0 bis). Une seule grille de délais. Mentions légales conformes. Page `/garanties-assurances/` avec attestations téléchargeables `[À FOURNIR PAR LE CLIENT]` |

### 3.2 FORT (fait baisser nettement le taux de conversion ou la qualité des leads)

| # | Constat | Preuves | Recommandation |
|---|---|---|---|
| **F1** | **Preuve sociale illisible et non attribuée.** « Ils nous ont fait confiance » est un carrousel de 18 tuiles blanches (dont 12 doublons sans alt) avec des logos minuscules et des bords en dégradé qui en masquent une partie. Au chargement, les images sont des GIF de 1×1 px en lazy-load. Logos visibles : STEF, Carrefour, Burger King, KFC, Netto, Quick. **STEF et Netto** ont pour alt « Partenaire » et n'apparaissent dans aucune page ni étude de cas. Le bandeau est répété deux fois sur l'accueil et sur `/contact/`. | `screenshots/home-desktop.jpg` (sous le hero et avant le pied de page), `screenshots/contact-mobile.jpg` | Logos **statiques** (5 à 6 au maximum, hauteur ≥ 40 px), uniquement ceux qui sont autorisés et attestés, chacun relié à une étude de cas, avec une formulation exacte (« pour un hypermarché Carrefour… ») `[À FOURNIR PAR LE CLIENT : autorisations, périmètre réel]` |
| **F2** | **Aucun avis, aucun témoignage nommé, aucune note Google.** Rien sur l'accueil, les secteurs ou les réalisations. Les « études de cas » n'ont ni lieu précis, ni date, ni client nommé, ni citation. | Toutes les captures | Processus d'avis Google (02 §6.2), citations nommées avec fonction `[À FOURNIR PAR LE CLIENT]`. La section reste masquée tant qu'elle est vide : aucun faux avis |
| **F3** | **Réalisations peu crédibles visuellement.** Titres des cartes **illisibles** (texte marine foncé sur photo assombrie) sur l'accueil et sur `/portfolio/`. **La même photo** illustre « Cuisine professionnelle au MIN de Rungis » et « Installation de cloisons isothermes haute performance ». La photo du plafond à dalles « ciel » sert à la fois pour « 10 ans d'expérience terrain » et pour « Bureaux et vestiaires ». La fiche Rungis n'a qu'une seule photo, une « fiche chantier » qui répète « Secteur » deux fois, sans date, sans surface ni durée dans la fiche, et sans avant/après. | `screenshots/home-mobile.jpg`, `screenshots/home-desktop.jpg` (section Références), `screenshots/realisation-cuisine-min-rungis-desktop.jpg` | Gabarit d'étude de cas du §6.4. Légendes **sous** l'image. Au moins 6 photos réelles par cas. Les quelque 27 photos réelles (WhatsApp, PHOTO-2026-…) de la médiathèque sont à rattacher à leurs chantiers `[À FOURNIR PAR LE CLIENT : quel chantier pour quelle photo]` |
| **F4** | **Visuels IA, de banque d'images et restes de démo.** Médiathèque : 10 images « ChatGPT-Image… », 1 « Gemini_Generated… », des images de banque d'images hors sujet (alt « Car seat metal steel structure manufacturing facto », « Wine fermenter… », « Young man using pliers in repair workshop ») utilisées notamment dans les vignettes du blog, une **AdobeStock « _Preview »** (aperçu filigrané non licencié : risque juridique), les vidéos de démo du thème `FS-video-furniture-new.mp4`, `FS-video-metalworking.mp4`, `FS-video-factory.mp4`, des pictos de démo (`piggy-bank-copyright.svg`, `gold-ingots-copyright.svg`…), `sample-melody.mp3`, `woocommerce-placeholder.png`, le logo d'une autre agence (`celestedigital-logo.png`) et `f-logo-alternative.png` (logo du thème Fuse) encore présent dans l'en-tête du thème. | `source/_media.json`, `screenshots/home-desktop.jpg` (vignettes du blog), HTML de l'accueil | Purge de la médiathèque. Uniquement des photos réelles (avant, pendant, après, équipes en EPI). Une vidéo accélérée d'un chantier de nuit `[À FOURNIR PAR LE CLIENT]` |
| **F5** | **Pas de parcours urgence/SAV.** La page SAV ne propose que « Demander un devis » et « Voir des réalisations ». Le téléphone n'est indiqué que « Lun. – Ven. · 8h-18h » sur `/contact/`. Délais d'urgence contradictoires (« mobilisation sous 48 h » contre « sous 10 jours » sur la page Marseille). `/urgence/` renvoie une 404. Une porte qui ne ferme plus ou une panne de chambre froide, c'est une demande chaude, à forte valeur, perdue. | `source/services-service-apres-vente-sav.md`, `source/contact.md`, `source/zone-…-marseille.md` | Page `/urgence-sav/` : ligne directe, horaires réels, délai réellement tenu `[À CONFIRMER]`, formulaire de rappel en 3 champs avec photo, fiche « 5 gestes pour protéger votre stock » (02 levier 6) |
| **F6** | **Pop-in newsletter intrusive, y compris pendant la demande de devis.** Voir §2.2. En B2B, sur un cycle long, une newsletter mensuelle n'est pas un objectif prioritaire. Elle promet de plus des « études de cas réels (avec chiffres) » et des « guides téléchargeables » qui n'existent pas (02 §2.3 n° 11). | `source/blog.md`, mesure sur `/contact/` | La supprimer. La remplacer par des aimants à leads contextuels (cahier des charges type, check-list DDPP, 02 levier 9), proposés en fin d'article et en pop-in de sortie **sur desktop uniquement**, jamais sur `/devis/` ni `/contact/` |
| **F7** | **Le cœur de métier n'a pas de page.** Dans le menu, « Chambres froides » **et** « Cloisons isothermes » mènent toutes deux à `/installation-fourniture/`. Sur l'accueil, la carte « Rénovation & mise en conformité → En savoir plus » renvoie vers **`/` (l'accueil lui-même)**. `/chambres-froides/` renvoie une 404. | HTML de l'accueil (liens du menu et des cartes) | Pages piliers `/chambres-froides/`, `/cloisons-isothermes/` et `/renovation-chambre-froide/` (02 §6.1) |
| **F8** | **CTA dispersés et incohérents.** On compte au moins 10 libellés pour la même action : « Devis gratuit », « Devis gratuit sous 24h », « Demander un devis », « Demander un devis gratuit », « Demander un devis sous 24h », « Demander un devis sous 48 h », « Parler à un expert », « Projet similaire ? », « Nous contacter », « Envoyer ma demande ». Le CTA de l'en-tête est du texte blanc sans fond de bouton. « Découvrir nos références », « En savoir plus » et « Voir toutes nos réalisations » sont en gris sur fond marine, avec un contraste visiblement insuffisant (à mesurer, cible WCAG AA de 4,5:1). | `screenshots/home-desktop.jpg` (hero, cartes services, bouton réalisations) | Un seul libellé principal partout : « Obtenir ma première estimation sous 24 h » (02 §3.3), un secondaire (téléphone ou urgence) et un tertiaire (« Voir un chantier comme le mien »). Bouton plein à fort contraste |

### 3.3 MOYEN (gêne, dilue ou affaiblit l'image)

| # | Constat | Preuves | Recommandation |
|---|---|---|---|
| **M1** | **Accueil trop long et redondant** : 13 sections, 10 écrans sur desktop et 18,7 sur mobile. « Notre méthode » en 4 étapes figure à l'identique sur l'accueil, `/about-us/` et chaque page zone. Les garanties apparaissent sur l'accueil (« Ce qui nous différencie »), `/about-us/`, chaque réalisation (« Des engagements concrets ») et chaque zone (« Certifications & engagements »). Les compteurs sont sur l'accueil, `/about-us/` (deux fois sur la même page), `/contact/`, `/portfolio/` (deux fois) et les zones. | `screenshots/home-*.jpg`, `source/about-us.md`, `source/portfolio.md` | Une seule page « Notre méthode en site occupé » et une seule page « Garanties ». Ailleurs, une version courte avec lien. Cible : accueil ≤ 7 écrans sur desktop, ≤ 11 sur mobile |
| **M2** | **Textes en anglais et compteurs sociaux négatifs** : « Skip to content / Skip to footer » (liens d'évitement placés hors écran, c'est le bon modèle, mais en anglais), « Read more », « Published / Updated », « 96 Views · 5 Likes · 0 Comments », « Share-email », « Copy URL to clipboard » (pages `/about-us/` et `/agroalimentaire/`), « Recent Posts », « Tags », titres d'onglet « Services Archive » et « Portfolio Archive ». | `source/about-us.md`, `source/agroalimentaire.md`, `source/services.md`, `source/portfolio.md` | Tout traduire (« Aller au contenu », « Lire l'article »), supprimer les compteurs |
| **M3** | **Texte de démo et pages sans H1** : « If you feel tired and stressed after work. » répété trois fois sur `/services/`. Les six pages `/services/*` n'ont ni H1 ni meta description. Le gabarit des zones produit « chantier à Île-de-France », « chantier à Corse », « Notre savoir-faire à Île-de-France ». | `source/services.md`, `source/zone-ile-de-france.md`, `source/zone-corse.md`, `screenshots/zone-ile-de-france-desktop.jpg` | Relecture intégrale. Les gabarits doivent gérer « en / à / au » |
| **M4** | **Blog : auteur affiché mais non incarné.** « Inès Ben Labidi, Chargée d'affaires, 8 ans d'expérience » : pas de photo ni de lien LinkedIn, et ancienneté à rapprocher de la création de la société `[À CONFIRMER]`. Les 4 articles sont datés du 17/08/2025 et « mis à jour » en mai 2026. Le CTA de fin d'article est générique (« Devis gratuit sous 24 h ») et sans rapport avec le sujet lu. | `screenshots/blog-chambre-froide-positive-negative-desktop.jpg`, `source/chambre-froide-positive-ou-negative-quelle-difference.md` | Bloc auteur réel (photo, rôle, LinkedIn). CTA contextuel (« Positive, négative ou mixte ? Décrivez votre stock, on vous conseille ») et aimant à leads lié au sujet |
| **M5** | **Page secteur peu différenciante** : `/agroalimentaire/` est très longue (12,8 écrans sur mobile) et ne contient **aucune étude de cas agroalimentaire**, alors que trois existent. On y trouve un bloc d'articles avec métadonnées en anglais et une liste « nos domaines » qui renvoie vers les autres secteurs. | `screenshots/secteur-agroalimentaire-mobile.jpg`, `source/agroalimentaire.md` | Gabarit secteur du §6.3 : contraintes du secteur, preuve du secteur, CTA pré-rempli |
| **M6** | **Le téléphone est un 06 sans horaires visibles hors `/contact/`**, avec deux formats de lien (`tel:0635298057` et `tel:06.35.29.80.57`). | `source/home.md` (contacts) | Format `tel:+33…` unique. Envisager une ligne fixe ou un SDA avec suivi des appels (02 §6.2). Horaires affichés à côté du numéro |
| **M7** | **Recrutement en triple et incohérent** : `/recrutement/`, `/recrutement-2/` et `/recrutement-3/` sont identiques (« salaire à négocier »), alors que `/monteur-de-panneaux-de-chambre-froide-h-f/` affiche 11,88 € à 25,68 €/h, avec des postes dans le Rhône et à Lyon. | `source/recrutement*.md`, `source/monteur-…md` | Une seule page `/recrutement/` (balisage JobPosting), dans le pied de page |
| **M8** | **Pages zones creuses** : 14 régions, la Suisse, 2 départements et 6 villes du 92/93 au contenu identique (« Prêt à démarrer votre chantier à Corse ? »). Pour l'humain, effet de façade ; pour Google, risque de pages satellites. | `source/zone-*.md`, pied de page de toutes les captures (pastilles des régions) | `noindex` ou suppression, sauf Marseille et Île-de-France (02 §6.2). Retirer le nuage de pastilles du pied de page |

---

## 4. Parcours de conversion actuel

| Question | Constat |
|---|---|
| Clics jusqu'au formulaire de devis | **1** depuis n'importe quelle page (en-tête « Devis gratuit » → `/contact/`). Ce n'est pas le nombre de clics qui pose problème, mais la **visibilité** (mobile), la **friction** et la **non-qualification** du formulaire. |
| Saisie | 5 champs, dont 4 obligatoires, plus une case de consentement obligatoire et Turnstile. Le « sujet » libre ne permet pas de router le lead. |
| Qualification | Aucune. Impossible de distinguer une enseigne GMS multi-sites d'un particulier, une urgence d'un projet à 6 mois, ou Marseille de Lille. |
| Page de remerciement | Aucune (AJAX CF7). `/merci/` renvoie une 404. Aucune prochaine étape ni délai réel annoncé après l'envoi. |
| Suivi de conversion | Pas d'URL de conversion. Aucun identifiant GTM ou Google Ads repéré dans le HTML de `/contact/` `[À CONFIRMER : configuration analytics actuelle]`. |
| Téléphone | Cliquable (`tel:`) sur desktop dans l'en-tête. Sur mobile, uniquement dans le menu burger et en bas de page. Numéro 06, horaires seulement sur `/contact/`. |
| CTA collant mobile | Absent (seul l'en-tête est fixe). |
| WhatsApp | Absent, alors qu'une grande partie des photos de chantier provient de WhatsApp : le canal est naturel pour « envoyez 3 photos ». |
| Prise de rendez-vous | Absente (ni visite technique ni visio réservable). |
| Urgence | Aucun parcours dédié (voir F5). |
| Popups | Pop-in newsletter vers 27 s, y compris sur `/contact/` (voir §2.2). |
| Page contact | Bonne base (H1 clair, formulaire au-dessus des coordonnées, adresse, horaires). Mais formulaire générique, compteurs invérifiables répétés, bandeau de logos et pop-in. |

---

## 5. Architecture et navigation

### 5.1 Menu actuel (relevé dans le HTML)

`Services ▾` (Installation & fourniture → `/installation-fourniture/` ; Chambres froides → **`/installation-fourniture/`** ; Cloisons isothermes → **`/installation-fourniture/`** ; Salles blanches → `/salle-blanche/` ; Aménagements sur mesure ; Remorques réfrigérées & isothermes ; Rénovation & conformité ; SAV & maintenance) · `Secteurs ▾` (Agroalimentaire, Logistique & Entreposage, Cuisines Pro & Laboratoires, **Salles Blanches** (même page que le service), Industrie, Grande Distribution) · `Réalisations` · `Actualités` · `À propos` · téléphone · `Devis gratuit`.
Le menu de l'ancien thème ThemeRex (« Accueil, Secteurs d'activité, Réalisations, Actualités, Demander un devis, À propos ») est **toujours présent dans le HTML**, en doublon.

### 5.2 Doublons et pages à supprimer ou fusionner

| Page(s) actuelle(s) | Problème | Décision | Justification |
|---|---|---|---|
| `/activtites/` (« Produits », faute dans l'URL) et `/domaine-dactivites/` | Pages-listes sans H1 (118 mots), doublon du menu Secteurs | **Supprimer**, 301 vers `/secteurs/` | Aucune valeur pour l'utilisateur, troisième entrée concurrente pour la même intention |
| `/services/` (archive) | « If you feel tired and stressed after work. », étapes dans le désordre | **Supprimer**, 301 vers `/` | Texte de démo |
| `/installation-fourniture/` et `/services/installation-fourniture/` | Deux pages pour le même sujet, utilisées pour trois entrées du menu | **Scinder** en `/chambres-froides/` et `/cloisons-isothermes/`, avec 301 | Chaque cœur de métier doit avoir sa page argent (02 §6.1) |
| `/services/amenagements-professionnels-specifiques/` | Libellé flou | **Fusionner** dans `/laboratoires-cuisines-professionnelles/` | Correspond à une recherche réelle et à une preuve (Rungis) |
| `/services/renovation-mise-en-conformite/` | Parle de « votre remorque actuelle » (02 §2.3) | **Remplacer** par `/renovation-chambre-froide/` et `/mise-en-conformite-locaux-alimentaires/` | Angle libre identifié en 02 |
| `/services/service-apres-vente-sav/` | Mélange contrat de maintenance et urgence | **Scinder** en `/maintenance-chambre-froide/` (contrats) et `/urgence-sav/` (panne) | Deux intentions, deux CTA différents |
| `/salle-blanche/` (à la fois service et secteur) | Doublon. Aucune référence | **Une page** `/salles-blanches/`, hors menu principal tant qu'il n'y a pas de référence | 02 : P5 en veille |
| `/distribution/`, `/agroalimentaire/`, `/logistique/`, `/laboratoire-cuisine/` | Bonne intention, contenu générique | **Migrer** vers `/secteurs/…`, avec 301 | Plan d'URL de 02 §6.1 |
| `/industrie/` | Une seule preuve (vestiaires) | **Hors menu** : maintenue si elle est enrichie de ce cas, sinon fusionnée dans Agroalimentaire | Éviter une page vide de plus |
| `/recrutement-2/`, `/recrutement-3/`, `/monteur-…/` | Triple doublon, infos contradictoires | **Une page** `/recrutement/` dans le pied de page | Hors parcours client |
| `/zones/`, 14 régions, Suisse, départements et villes du 92/93 | Pages creuses | **Noindex ou supprimer**. Garder `/zones/marseille/` et `/zones/ile-de-france/` | 02 §6.2 |
| `/faqs/` (H1 « Découvrez nos questions pratiques FAQs ») | FAQ générique isolée | **Répartir** les questions dans les pages concernées (balisage FAQPage) | Une objection se traite au moment où elle apparaît |
| `/about-us/`, `/portfolio/`, `/portfolio_group/*` | URL en anglais, archives du thème | `/a-propos/`, `/realisations/` (filtres à la place des taxonomies), avec 301 | Cohérence et lisibilité |
| `/contact/` | Fait office de page de devis | **Scinder** : `/devis/` (formulaire en étapes) et `/contact/` (coordonnées, plan, demandes diverses) | Mesurer et optimiser la conversion principale |

### 5.3 Pages manquantes

| Page | Pourquoi |
|---|---|
| `/devis/` et `/devis/merci/` | Conversion principale mesurable (§6.5) |
| `/urgence-sav/` | Demandes chaudes aujourd'hui perdues (F5) |
| `/chambres-froides/` (pilier, puis `/negative/` et `/positive/`) | Requête principale du métier, absente du site (F7) |
| `/reparation-chambre-froide/` | Angle « enveloppe » libre (02 §0) |
| `/garanties-assurances/` (dossier fournisseur : décennale, RC Pro, Kbis, URSSAF) | Lève l'objection des achats (02 §1.2) `[À FOURNIR PAR LE CLIENT]` |
| `/notre-methode/` (chantier en site occupé : nuit, week-end, phasage) | Preuve de la promesse principale, aujourd'hui éparpillée |
| Études de cas détaillées (5 à refaire, puis 2 par secteur prioritaire) | Matière première de toutes les preuves |
| `/secteurs/restauration-rapide-franchise/` | Persona P2 sans page, alors que les logos BK, KFC et Quick sont affichés |
| `/partenaires-frigoristes-cuisinistes/` | Canal prescripteur P6 (02) |

### 5.4 Nouvelle arborescence proposée

**Menu principal (6 entrées) :**

```
[Logo K Isolation]  Solutions ▾  Secteurs ▾  Réalisations  L'entreprise ▾  Urgence SAV · 06 35 29 80 57   [Obtenir mon estimation]
```

1. **Solutions ▾**
   - Chambres froides (positives, négatives, sur mesure) : `/chambres-froides/`
   - Cloisons isothermes et panneaux sandwich : `/cloisons-isothermes/`
   - Laboratoires et cuisines professionnelles : `/laboratoires-cuisines-professionnelles/`
   - Rénovation et mise en conformité : `/renovation-chambre-froide/` (et `/mise-en-conformite-locaux-alimentaires/`)
   - Réparation (panneaux, portes, sols) : `/reparation-chambre-froide/`
   - Maintenance et contrats : `/maintenance-chambre-froide/`
   - *En pied de menu, en plus petit : Salles propres · Remorques isothermes*
2. **Secteurs ▾** : Grande distribution · Restauration rapide et franchises · Agroalimentaire · Logistique frigorifique · Métiers de bouche et cuisines centrales (`/secteurs/…`)
3. **Réalisations** : `/realisations/` (filtres : secteur, contrainte « site ouvert / nuit / froid négatif », région)
4. **L'entreprise ▾** : À propos · Notre méthode en site occupé · Garanties et dossier fournisseur · Conseils (blog) · Recrutement
5. **Urgence SAV** : lien `tel:` et numéro (vers `/urgence-sav/` sur desktop), avec un code couleur d'alerte sobre
6. **Bouton « Obtenir mon estimation »** : `/devis/`

**Mobile :** en-tête = logo horizontal lisible, icône téléphone, burger. **Barre collante en bas** : `Appeler` | `Estimation 24 h` (et `Urgence` sur les pages SAV et réparation).

**Pied de page :**
- *Solutions* (6 liens), *Secteurs* (5 liens)
- *Zones* : Marseille et PACA · Île-de-France · « Interventions dans toute la France sur projet »
- *Entreprise* : À propos · Réalisations · Garanties et assurances · Conseils · Partenaires frigoristes et cuisinistes · Recrutement · Contact
- *Coordonnées (cohérentes avec la fiche Google)* : adresse, téléphone avec horaires, contact@k-isolation.fr, LinkedIn, note Google (une fois les avis réels obtenus)
- *Légal* : Mentions légales · Confidentialité · Cookies · CGV
- Supprimés : nuage de 15 pastilles de régions, second bandeau de logos, pop-in newsletter

---

## 6. Wireframes

### 6.1 Nouvelle page d'accueil (section par section)

| # | Section | Objectif psychologique | Contenu exact attendu | CTA | Visuel |
|---|---|---|---|---|---|
| 0 | **Barre utilitaire** (desktop) | Rassurer sur la joignabilité | « Panne ou urgence ? 06 35 29 80 57, lun.–ven. 8 h–18 h `[À CONFIRMER : astreinte ?]` · Marseille · Île-de-France · France entière » | Lien `tel:` | Texte seul |
| 1 | **En-tête** | Orientation | Logo horizontal lisible, menu à 6 entrées (§5.4) | « Obtenir mon estimation » (bouton plein) | — |
| 2 | **Hero** | Compréhension en 5 s (quoi, pour qui, où) et première micro-action | Accroche : « Chambres froides · Cloisons isothermes · Rénovation · SAV ». **H1** (02 §3.1 A) : « Chambres froides et cloisons isothermes, posées sans arrêter votre activité ». **Sous-titre** : « Conception, pose, rénovation et SAV pour la grande distribution, la restauration et l'agroalimentaire. Chantiers de nuit, en week-end ou par phases. Marseille, Île-de-France et partout en France. » **À droite (desktop) / sous le H1 (mobile) : étape 1 du formulaire** en 4 tuiles (« Nouvelle chambre froide », « Rénovation / conformité », « Réparation / panne », « Autre besoin »). Un clic ouvre `/devis/` à l'étape 2 | Principal : les tuiles ou « Obtenir ma première estimation sous 24 h », avec la micro-copie « 2 minutes · Sans engagement · Aucun démarchage ». Secondaire : « Panne ou urgence ? 06 35 29 80 57 ». Tertiaire : « Voir un chantier comme le mien » | Photo **réelle** d'un chantier terminé et éclairé, en site occupé (rayon, réserve, chambre froide), avec légende vraie (type, ville, date) `[À FOURNIR PAR LE CLIENT]`, ou boucle vidéo muette de 8 à 10 s d'un chantier de nuit |
| 3 | **Bandeau de preuves** | Preuve sociale immédiate | « Ils nous ont confié leurs sites » : 5 à 6 logos **statiques** autorisés `[À FOURNIR PAR LE CLIENT : autorisations]`, plus 2 engagements vérifiables : « Première estimation en 1 jour ouvré » et « Garantie décennale [assureur, n° de police] » `[À FOURNIR PAR LE CLIENT]`, plus la note Google une fois ≥ 5 avis réels | Aucun (chaque logo renvoie vers son étude de cas) | Logos en gris passant en couleur au survol, hauteur ≥ 40 px |
| 4 | **« Vous êtes… »** (choix guidé, 02 levier 8) | Similarité : « c'est pour moi » | 5 cartes : Enseigne / GMS · Restauration rapide / franchise · Industrie agro et logistique · Métiers de bouche / cuisine centrale · Frigoriste / cuisiniste / MOE | Chaque carte mène à sa page secteur ou partenaires | Icône et une photo réelle du secteur |
| 5 | **Le vrai risque** | Coût de l'inaction et empathie | 3 blocs : « Un rayon fermé », « Une chaîne du froid rompue », « Une non-conformité en audit ». Une phrase chacun, sans statistique inventée. Lien vers le calculateur « Combien vous coûte une journée d'arrêt ? » (phase 2, 02 levier 5) | « Calculer mon coût d'arrêt » (phase 2) | Pictogrammes sobres |
| 6 | **3 preuves « Pourquoi nous »** (02 §3.2) | Autorité par la spécificité | (1) Carrefour : 320 m², nuits 21 h–6 h et week-ends, 3 semaines, rayon ouvert. (2) Sol à −22 °C : 180 m², 2 phases, 50 % du stockage maintenu, 10 jours ouvrés. (3) Un interlocuteur et des engagements écrits (planning avant démarrage, PV, décennale). Chiffres à valider `[À FOURNIR PAR LE CLIENT : lieu, date, photos, citation]` | « Voir l'étude de cas » (par preuve) | Photo réelle avant/après par preuve |
| 7 | **Solutions** | Navigation par besoin | 6 cartes : Chambres froides · Cloisons et panneaux · Laboratoires et cuisines pro · Rénovation et conformité · Réparation · Maintenance. Chaque carte = le problème résolu en une ligne et un lien. Ligne discrète : « Aussi : salles propres, remorques isothermes » | « Découvrir » sur chaque carte (lien entier cliquable) | Photo réelle ou pictogramme |
| 8 | **Notre méthode en site occupé** | Réduction du risque perçu | 5 étapes avec délais **réels** : demande → première estimation (1 jour ouvré) → visite technique (`[À CONFIRMER : gratuite, rayon]`) → planning et phasage écrits **avant signature** → pose (nuit, week-end, phases) → PV de réception et SAV. **Seul exemplaire complet du site**, version courte ailleurs | « Voir la méthode détaillée » | Frise horizontale (verticale sur mobile) |
| 9 | **Réalisations** | Similarité et preuve | 3 cartes (secteurs différents). Titre **sous** l'image, puis ville, année, surface, durée, contrainte (« site ouvert », « −22 °C »). Jamais deux fois la même photo | « Voir toutes les réalisations » | Photos réelles |
| 10 | **Témoignages** | Preuve sociale nommée | 2 ou 3 citations avec prénom, nom, fonction, entreprise et type de chantier `[À FOURNIR PAR LE CLIENT]`, plus le widget d'avis Google. **Section masquée tant qu'elle est vide** | — | Photo de la personne ou logo |
| 11 | **Garanties et dossier fournisseur** | Rassurer le service achats | Décennale (assureur, n°, activités couvertes), RC Pro, Kbis, attestation URSSAF `[À FOURNIR PAR LE CLIENT]`. Remplace « Ce qui nous différencie » | « Recevoir le dossier fournisseur » (e-mail et société) | Vignettes de documents |
| 12 | **Zones** | Proximité honnête | « Basés à Marseille. Équipes mobiles dans toute la France. » Deux liens : Marseille et PACA, Île-de-France | Liens vers les pages zones | Carte simple avec 2 pôles |
| 13 | **FAQ (5 objections)** | Lever les derniers freins | Délai de démarrage et durée de pose (distingués), travail en site ouvert, facteurs de prix, zones, garanties. Balisage FAQPage | — | Accordéon |
| 14 | **CTA final** | Passage à l'action | « Un projet, une rénovation, une panne ? » Répétition des tuiles de l'étape 1, téléphone, « Réserver un échange de 15 min » `[À CONFIRMER : outil de rendez-vous]` | Tuiles, `tel:`, rendez-vous | Fond sombre, bouton contrasté |
| 15 | **Pied de page** | — | Voir §5.4 | — | — |

**Supprimés de l'accueil :** bandeau « Est. 2014 », compteurs invérifiables, second carrousel de logos, section blog (remplacée par un lien vers un guide téléchargeable dans la section 13 ou 14), pop-in newsletter. **Cible :** ≤ 7 écrans sur desktop et ≤ 11 sur mobile, H1 visible dès le premier rendu (sans masquage par JavaScript).

### 6.2 Gabarit de page service (ex. `/chambres-froides/`)

1. **Hero** : H1 centré sur le problème (« Chambre froide sur mesure, posée sans fermer votre établissement »), sous-titre (pour qui, où), **étape 1 du formulaire avec le besoin pré-rempli**, téléphone. Visuel réel.
2. **Bandeau de preuves** (logos liés à ce service, engagement « 1 jour ouvré », décennale).
3. **Situations** : tuiles « Ouverture à date », « Extension », « Remplacement », « Mise aux normes avant audit », chacune avec un lien vers le cas ou la FAQ.
4. **Ce que nous posons** : spécifications validées par un technicien (types de panneaux, épaisseurs, portes, sols, finitions hygiéniques, normes citées avec leur numéro exact, 02 levier 3) `[À FOURNIR PAR LE CLIENT : marques et fiches]`.
5. **Méthode et délais** : délai de démarrage **et** durée de pose, séparés, avec les options nuit, week-end et phasage.
6. **Étude de cas liée** (format résumé et lien).
7. **Facteurs de prix** : volume, température, portes, sol, accès, horaires, avec fourchettes `[À FOURNIR PAR LE CLIENT]`.
8. **FAQ** (5 à 8 objections propres au service).
9. **CTA final** (tuiles et téléphone) et maillage vers les secteurs et articles liés.

### 6.3 Gabarit de page secteur (ex. `/secteurs/grande-distribution/`)

1. **Hero** : H1 propre au persona (« Rénovez réserves, rayons frais et chambres froides sans fermer le magasin »), étape 1 du formulaire **avec le secteur pré-rempli**.
2. **Vos contraintes, nos réponses** : 3 contraintes du secteur (horaires d'ouverture, audits et DDPP, multi-sites) et la réponse concrète à chacune.
3. **La preuve du secteur** : étude de cas mise en avant (Carrefour pour la GMS, sol négatif pour l'agro et la logistique, Rungis pour les cuisines) et citation `[À FOURNIR PAR LE CLIENT]`.
4. **Solutions utiles à ce secteur** (3 à 4 liens vers les pages services).
5. **Process adapté** : coordination avec le directeur de site, nettoyage avant réouverture, documents remis (PV, rapports, DOE).
6. **Multi-sites / contrat cadre** (GMS, franchises) : « Parler à un chargé d'affaires » et prise de rendez-vous.
7. **FAQ du secteur** et **CTA final**.

### 6.4 Gabarit d'étude de cas (ex. `/realisations/renovation-hypermarche-carrefour/`)

1. **Fiche chantier en tête** (encadré) : client ou type de site (nom seulement si autorisé), ville, date, secteur, surface, températures, durée, contrainte clé (« magasin ouvert », « −22 °C maintenu »), prestations `[À FOURNIR PAR LE CLIENT]`.
2. **Contexte et enjeu** (3 à 4 lignes, avec le problème du client dans ses mots).
3. **Contraintes** (horaires, flux, froid, sécurité).
4. **Solution** (matériaux et choix techniques justifiés).
5. **Phasage** : frise avec dates ou phases (nuit, phase 1, phase 2).
6. **Résultats mesurés uniquement** (délai tenu, surfaces, contrôle passé). Aucun pourcentage d'économie sans méthode de mesure (02 §2.3 n° 5).
7. **Galerie avant / pendant / après** : au moins 6 photos réelles légendées.
8. **Citation nommée** (fonction et entreprise) `[À FOURNIR PAR LE CLIENT]`.
9. **CTA contextuel** : « Un chantier comme celui-ci ? », avec le formulaire pré-rempli (secteur et besoin), et **2 cas similaires**.
À retirer du gabarit actuel : le bloc « engagements » générique répété, la FAQ générique et le doublon « Secteur / Secteur ».

### 6.5 Formulaire de devis en étapes (`/devis/`, conforme à 02 §2.2)

**Principes :** une question par écran sur mobile, étapes 1 et 2 en tuiles (passage automatique au clic), barre de progression (« Étape 2 sur 4 »), bouton « Retour », coordonnées **en dernier**, libellés visibles (pas de placeholders seuls), saisie conservée en cas de retour, Turnstile conservé, contexte enregistré dans des champs cachés (page d'origine, UTM, gclid, besoin ou secteur pré-remplis).

| Étape | Question | Champs | Obligatoire | Logique |
|---|---|---|---|---|
| 1. Votre besoin | « De quoi avez-vous besoin ? » | Tuiles : Nouvelle chambre froide · Cloisons / laboratoire / cuisine pro · Rénovation ou mise en conformité · **Panne ou réparation urgente** · Contrat de maintenance · Salle propre · Je suis frigoriste, cuisiniste ou MOE | Oui | « Panne » ouvre l'**écran urgence** : bouton d'appel en grand et rappel en 3 champs (nom, téléphone, code postal), avec photo facultative, traité en priorité. « Partenaire » ouvre un formulaire partenaire court |
| 2. Votre activité | « Votre activité ? » | Tuiles : GMS · Restauration rapide / franchise · Agro-industrie · Logistique · Métiers de bouche / traiteur · Pharma / cosmétique · Autre | Oui | Pré-rempli depuis une page secteur |
| 3. Votre projet | « Parlez-nous du chantier » | Code postal · surface approximative (tranches, avec « je ne sais pas ») · température (positive, négative, ambiante, « je ne sais pas ») · **site en activité pendant les travaux ?** (oui, non, je ne sais pas) · échéance (moins d'une semaine, moins d'un mois, 1 à 3 mois, plus tard) · date clé (audit, ouverture) · photos ou plans · précisions libres | Oui : code postal, surface, site en activité, échéance. Facultatifs : le reste | Une échéance de moins d'une semaine fait apparaître le téléphone direct |
| 4. Vos coordonnées | « Où vous envoyer votre estimation ? » | Nom · société · fonction (direction / gérant, travaux / maintenance, qualité, achats, franchisé / adhérent, autre) · téléphone · e-mail · préférence (appel, visio, visite) | Oui, sauf la préférence | Mention d'information RGPD visible, sans case à cocher bloquante `[à valider par le DPO]` |
| 5. Confirmation : `/devis/merci/` | « Demande reçue » | Récapitulatif, **prochaines étapes avec délais réels**, interlocuteur `[À FOURNIR PAR LE CLIENT : nom, photo]`, lien de prise de rendez-vous pour la visite, téléchargement du cahier des charges type, ligne directe | — | Envoi de l'événement de conversion |

**Qualification (CRM) :** score = persona × échéance × zone (PACA ou Île-de-France = A) × surface × site occupé (02 §2.2). Routage : A = rappel prioritaire `[À CONFIRMER : délai tenu]` ; B = estimation sous 1 jour ouvré ; C = réponse par e-mail et contenu utile. **Mesure :** événements GA4 `form_start`, `form_step` (1 à 4), `generate_lead` (page merci), `click_to_call`, `urgence_callback`. Indicateur principal : taux de passage de l'étape 1 à l'étape 4.

---

## 7. Mobile : problèmes constatés sur les captures

1. **Premier écran sans action ni promesse complète** : photo (≈ 260 px), puis H1 sur 9 lignes coupé par la ligne de flottaison. Bouton du hero vers 1 150 px. Pas de téléphone (`screenshots/home-mobile.jpg`).
2. **En-tête** : logo rond de 40 px au texte illisible, « Devis gratuit » en simple texte. Le bandeau « K ISOLATION · EST. 2014 · FRANCE & SUISSE · SPÉCIALISTE B2B » passe sur 2 lignes en petites capitales espacées.
3. **Longueur** : 18,7 écrans pour l'accueil, 12,8 pour la page agroalimentaire, 11,8 pour une réalisation. Le CTA final de l'accueil arrive au 17e écran. Aucune barre collante.
4. **Compteurs empilés** (4 lignes, environ 250 px) et **carrousel de logos** où l'on voit 2,5 tuiles, avec le logo Carrefour minuscule.
5. **Cartes services** : 6 cartes d'environ 285 px chacune (≈ 1 700 px au total), liens « En savoir plus » gris peu contrastés.
6. **Réalisations** : titres illisibles sur les photos, même photo pour deux chantiers.
7. **Contact** : formulaire bien placé (vers 400 px) mais libellés en placeholder, zone de dépôt facultative très haute (≈ 260 px) avant le bouton d'envoi, « Parcourir mes fichiers » illisible, case de consentement d'environ 16 px (sous la cible tactile de 44 px), bouton d'envoi vers 1 470 px (`screenshots/contact-mobile.jpg`).
8. **Pop-in newsletter** couvrant 45 % de l'écran sur `/contact/`.
9. Points positifs : aucun débordement horizontal (largeur 390 = 390), texte courant en 16 px, menu burger fonctionnel.

---

## 8. Quick wins (faisables sur le site actuel en 1 à 2 semaines, avant la refonte)

| # | Action | Impact | Effort |
|---|---|---|---|
| 1 | Désactiver la pop-in newsletter (au minimum sur `/contact/` et sur mobile) | Fort | Très faible |
| 2 | Ajouter une barre collante mobile « Appeler | Devis » et une icône téléphone dans l'en-tête mobile | Fort | Faible |
| 3 | Réécrire le H1 de l'accueil (02 §3.1 A). Retirer « Est. 2014 », « 10 ans », « 20 000 m² », « 50+ partenaires » tant qu'ils ne sont pas documentés | Critique (confiance) | Faible |
| 4 | Corriger les liens : cartes « Chambres froides » et « Cloisons » (même page), carte « Rénovation » qui renvoie vers `/` | Fort | Très faible |
| 5 | Ajouter au formulaire `/contact/` trois champs (Société, Code postal, Type de besoin en liste), passer CF7 en français, rediriger vers une page `/merci/` et y déclencher l'événement de conversion | Fort | Faible |
| 6 | Unifier les délais (« première estimation en 1 jour ouvré » partout) et retirer les « 48 h » de la page Marseille | Fort | Très faible |
| 7 | Retirer « Qualibat », « ATEX », « équipes certifiées » et « matériaux certifiés » sans justificatif. Passer les mentions légales à contact@k-isolation.fr avec le nom complet du directeur de publication | Critique (confiance) | Très faible |
| 8 | Supprimer « If you feel tired… », les « Read more / Published / Views / Likes », traduire les liens « Skip to… » | Moyen | Très faible |
| 9 | Remplacer le carrousel de logos par 4 à 6 logos statiques autorisés. Retirer STEF et Netto faute de preuve `[À FOURNIR PAR LE CLIENT]` | Fort | Faible |
| 10 | Réalisations : titres sous l'image, une photo différente par chantier, ajout de la date et du lieu | Fort | Faible |
| 11 | Augmenter le contraste des CTA secondaires et du bouton « Parcourir mes fichiers » | Moyen | Très faible |
| 12 | Mettre en `noindex` les pages zones creuses et `/recrutement-2/` et `-3/`, supprimer `/services/` et `/activtites/` (redirections 301) | Moyen | Faible |
| 13 | Rapatrier la police appelée depuis le domaine de préproduction `hostingersite.com` | Moyen (rendu, propreté) | Très faible |
| 14 | Retirer de la médiathèque et des pages l'aperçu AdobeStock filigrané, les images IA et les fichiers de démo du thème | Fort (confiance et risque juridique) | Faible |

**Éléments à obtenir du client avant la refonte** (ils conditionnent les wireframes) : autorisations d'usage des logos et périmètre réel des chantiers ; attestations décennale et RC Pro (assureur, n°, activités) ; Kbis et URSSAF ; photos réelles légendées par chantier ; 2 ou 3 citations clients nommées ; délais réellement tenus (estimation, visite, démarrage, urgence) ; conditions de la visite technique ; horaires ou astreinte SAV ; nom et photo des interlocuteurs ; marques de panneaux, portes et résines posées. Tous sont marqués `[À FOURNIR PAR LE CLIENT]`.
