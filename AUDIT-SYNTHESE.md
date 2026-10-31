# K Isolation : audit, refonte et stratégie d'acquisition

**Synthèse pour le client.** Les analyses détaillées se trouvent dans `audit/` :
- `01-technique-seo.md` : performance, SEO, plan de redirections ;
- `02-audience-marche.md` : clients, psychologie d'achat, concurrence, mots-clés ;
- `03-ux-conversion.md` : parcours, crédibilité, conversion, avec 16 captures du site actuel.

---

## 1. Le diagnostic en une phrase

Le site actuel est **lent, peu crédible pour un acheteur professionnel et ne transforme pas** ses visiteurs. Il est lent parce qu'il est construit avec WordPress, Elementor et un thème lourd. Il est peu crédible à cause de chiffres invérifiables, d'images générées par IA et de textes de démonstration oubliés. Enfin, il ne propose aucun parcours de devis, de bouton d'appel visible sur mobile ou de preuve structurée.

## 2. Ce qu'on a mesuré sur le site actuel

| Domaine | Constat | Gravité |
|---|---|---|
| Vitesse (mobile) | Score Lighthouse de 31 à 57. Contenu principal affiché en 4,2 à 6,6 s (16 s sur « À propos »). Jusqu'à 2 Mo et 86 requêtes par page. Un logo de 571 Ko chargé sur 85 pages | Critique |
| Crédibilité | « Est. 2014 » et « 10+ ans » alors que la société a été immatriculée en 2024 (visible sur Pappers en 30 s). « 20 000 m² », « 50+ partenaires », Qualibat et ATEX sans preuve. Une norme fausse (« EN 13000 » est la norme des grues). E-mail Gmail dans les mentions légales | Critique |
| Visuels | Images générées par IA et photos de banque d'images (billets de banque, poignée de main), vidéos de démonstration du thème. Pendant ce temps, environ 25 **vraies photos de chantier** dormaient dans la médiathèque | Critique |
| Conversion | Sur mobile, le bouton devis apparaît après environ 1 150 px de défilement. Formulaire générique sans qualification, pas de page de remerciement, popup newsletter à 27 s qui couvre 45 % de l'écran mobile, aucun parcours « panne / urgence » | Critique |
| Architecture | Pas de page « Chambres froides » (le métier n° 1) : deux entrées du menu mènent à la même page. 3 pages recrutement en doublon, 24 pages « zones » quasi identiques (risque de pages satellites pour Google) | Important |
| SEO technique | 35 pages sur 59 sans meta description. Les pages services n'ont pas de H1. Liens vers la confidentialité et les CGV en 404 sur 71 pages. Textes anglais résiduels (« Skip to content », « 96 Views ») | Important |
| Visibilité | Marque peu visible, aucune fiche Google Business Profile trouvée | Important |

## 3. Qui achète, et ce qui le fait signer

Les trois clients les plus rentables partagent **la même peur : arrêter leur activité** pendant les travaux.

1. **Le gardien du magasin (GMS)** : directeur de magasin, adhérent ou responsable travaux d'enseigne. Sa peur : fermer un rayon, ou obtenir un résultat Alim'confiance « à améliorer » affiché publiquement pendant un an.
2. **Le franchisé contre la montre (restauration rapide)** : sa peur : ouvrir en retard alors que le loyer court.
3. **Le directeur de site sous audit (agroalimentaire, logistique du froid)** : sa peur : perdre sa certification IFS ou rompre la chaîne du froid.

➜ **Promesse retenue : « Chambres froides & cloisons isothermes, posées sans arrêter votre activité. »**
Elle est prouvée par deux chantiers réels : une rénovation d'hypermarché menée de 21 h à 6 h, rayon ouvert chaque matin, et un sol refait à −22 °C en 2 phases avec 50 % du stockage maintenu. **Aucun concurrent observé n'occupe cet angle.**

Deuxième angle libre : **la réparation et la rénovation de l'« enveloppe »** (panneaux, portes, joints, sols). Les frigoristes occupent les recherches « réparation chambre froide » mais ne traitent que le groupe froid. Formule retenue : *« Le frigoriste répare le froid, nous réparons la chambre. »* Les frigoristes deviennent ainsi des **prescripteurs**, d'où la nouvelle page `/partenaires/`.

## 4. Ce que le nouveau site change

**Technologie :** site statique Astro, hébergé sur Vercel ou Netlify. Pas de base de données, pas de plugin, rien à mettre à jour ni à pirater. Pages HTML légères, images converties automatiquement en WebP au bon format, polices auto-hébergées.

**Architecture (de 87 URL à environ 35 pages utiles) :**

| Avant | Après |
|---|---|
| Installation & fourniture (2 pages concurrentes) | `/chambres-froides/` + `/cloisons-isothermes/` |
| Rénovation & conformité, SAV | `/renovation-chambre-froide/` (angle « enveloppe ») + `/sav-maintenance/` (dépannage + contrats) |
| Salle blanche | `/salles-blanches/`, repositionnée honnêtement sur l'enveloppe des salles propres (aucune référence pour l'instant) |
| 6 secteurs à la racine | `/secteurs/…` : grande distribution, restauration & cuisines pro, agroalimentaire, logistique, pharma & labos, industrie |
| 5 réalisations (une photo chacune, chiffres douteux) | 5 **études de cas** au format contexte → contraintes → phasage → résultat, avec vraies photos et curseur **avant / après** |
| 4 articles (traces de copier-coller ChatGPT) | 4 articles refondus et corrigés, sous `/blog/` |
| 24 pages zones génériques | `/zones/marseille/` et `/zones/ile-de-france/` (règle : une page locale = des chantiers réels) |
| Contact + popup newsletter | `/devis/` : formulaire en 4 étapes (1 clic pour commencer, coordonnées à la fin, parcours urgence) + `/merci/` + `/contact/` orienté par besoin |
| — | `/partenaires/` (frigoristes, cuisinistes, maîtres d'œuvre), `/faq/`, `/plan-du-site/`, 404 utile |
| 3 pages recrutement | `/recrutement/` (offres balisées pour Google Emploi) |

Les 107 anciennes URL sont toutes traitées : 86 redirections 301, 14 suppressions, les autres conservées (`site/redirects.json`).

**Page d'accueil, section par section :**
1. **Promesse et preuve immédiate** : titre « posées sans arrêter votre activité », CTA « Mon estimation sous 24 h » accompagné de « 2 minutes · Sans engagement · Aucun démarchage », téléphone visible, et deux cartes de preuve chiffrées sur une vraie photo de chantier.
2. **Logos clients** : STEF, Carrefour, Netto, Grand Frais, Burger King, KFC, Quick.
3. **Choix guidé par situation** : « J'ouvre un site », « Un audit approche », « Mon installation vieillit », « J'ai un problème maintenant ». Le visiteur se reconnaît et arrive sur la bonne page.
4. **Coût de l'inaction** : rayon fermé, contrôle publié, rupture de froid, ouverture qui glisse.
5. **Trois preuves plutôt que trois promesses**, avec le curseur avant / après du sol à −22 °C et des chiffres vérifiables uniquement.
6. Solutions → méthode en 5 étapes avec délais → secteurs → réalisations.
7. **Engagements écrits** : décennale, planning signé avant travaux, interlocuteur unique, dossier fournisseur prêt pour les achats, site propre, PV de réception.
8. **FAQ des objections** : « vous êtes petits », « vous réparez le groupe froid ? », etc. Puis un appel final.

Sur mobile, une barre fixe « Appeler | Devis gratuit sous 24 h » est présente partout, sauf sur la page devis.

**Mesure :** chaque demande est envoyée avec sa **source** (Google, campagne, LinkedIn, page d'entrée) et un **score A / B / C** : secteur cible, zone PACA ou IDF, échéance, taille, site en activité, multi-sites. Les clics sur le téléphone, les étapes du formulaire et les envois sont suivis comme événements. L'outil de mesure proposé fonctionne sans cookie : aucun bandeau RGPD n'est nécessaire.

## 5. Machine d'acquisition « quasi autonome »

| Levier | Mise en place | Effort humain |
|---|---|---|
| **Blog automatique** | Chaque mardi, Claude rédige le prochain des 24 sujets priorisés (prix, rénovation, sols négatifs, contrôle DDPP, audit IFS, ouverture de franchise…). Des garde-fous automatiques rejettent tout article sans maillage, contenant une norme fausse ou un chiffre inventé. Le site est reconstruit pour validation, puis une Pull Request arrive avec le post LinkedIn prêt à publier | 15 min par semaine de relecture, puis « Merge ». Possibilité de publier sans relecture plus tard |
| **SEO local** | Créer la fiche Google Business Profile (siège de Marseille), 10 photos réelles, une publication « chantier de la semaine », avis demandés par QR code sur le PV de réception et par SMS à J+3 | 30 min par semaine |
| **Prescripteurs** | Page `/partenaires/` + démarchage de frigoristes et cuisinistes en PACA et IDF (prescription croisée, charte de non-sollicitation) | 2 h par semaine le premier mois |
| **LinkedIn** | Post de l'article (fourni) + « chantier de la semaine » avec photos avant / après | 20 min par semaine |
| **Google Ads (accélérateur)** | Test de 4 à 6 semaines, limité à PACA et IDF, sur « rénovation / réparation chambre froide », avec renvoi vers les pages existantes | Budget à définir |

**Indicateur principal :** nombre de **demandes qualifiées A ou B par mois**. Les objectifs chiffrés seront fixés après 8 semaines de mesure réelle, et non sur des moyennes génériques.

## 6. Ce que le client doit fournir (bloquant pour la mise en ligne)

La liste complète, page par page, est dans **`CONTENU-A-VALIDER.md`**. Les essentiels :
1. **Attestation d'assurance décennale** : assureur, numéro de police, activités couvertes.
2. **Autorisation d'afficher les logos** de ses clients, et la nature exacte de chaque chantier.
3. **Validation des 5 études de cas** : lieu, date, chiffres, attribution des photos (faite par hypothèse).
4. **Nom complet du directeur de la publication** (obligation légale) et horaires d'ouverture.
5. Délais réellement tenus pour l'urgence ou le SAV, si l'on souhaite en afficher un.
6. Fourchettes de prix indicatives par type de projet, si le client accepte de les publier. Aucun concurrent ne le fait : c'est un levier fort.
