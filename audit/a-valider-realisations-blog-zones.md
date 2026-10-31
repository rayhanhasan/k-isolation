# À valider par K Isolation : études de cas, articles, pages locales

> Fichier de suivi des contenus rédigés le 31/10/2026 dans `site/src/content/realisations/`, `site/src/content/blog/` et `site/src/content/zones/`.
> Règle appliquée : seuls les faits présents dans les pages actuelles **et** classés utilisables par l'audit (`audit/02-audience-marche.md`, §0 bis et §2.3) ont été repris. Tout ce qui manque est listé ici, pas dans les textes publiés.
> Les 5 études de cas portent `toValidate: true`. Il faut le passer à `false` seulement après la relecture du client.

---

## 0. Points communs à tous les fichiers

| # | À fournir / confirmer | Pourquoi |
|---|---|---|
| G1 | **Date réelle de chaque chantier** (mois et année) | Le champ `date` des 5 études vaut provisoirement 2026-10-31, la date de publication de la refonte. Il sert au tri de la liste et au balisage `datePublished`. Remplacer par la date de fin de chantier si vous préférez cet usage. |
| G2 | **Correspondance photo ↔ chantier** | L'attribution des 22 photos aux 5 chantiers est une hypothèse du chef de projet. Plusieurs incohérences visibles sont listées plus bas (sol, entrepôt, bureaux). |
| G3 | **Autorisation de publier les photos** (accord du client final, aucun logo, visage ou document lisible) | Les photos montrent l'intérieur de sites clients. |
| G4 | **Lieu de chaque chantier** (au moins ville ou département) | 4 études sur 5 affichent « France » faute d'information. Le lieu renforce la preuve et le référencement local. |
| G5 | **Citation du client** (nom, fonction, accord écrit) pour chaque étude | Aucun témoignage n'existe : le champ `testimonial` est volontairement vide. |
| G6 | **Attestation d'assurance décennale** (assureur, n° de police, activités couvertes) | Les textes ne promettent aucune garantie décennale tant que l'attestation n'est pas fournie. |
| G7 | **Délai « première estimation en moins d'un jour ouvré »** : le confirmer comme engagement tenu | Repris dans toutes les études, les articles et les pages locales (seul délai jugé utilisable par l'audit). |
| G8 | **PV de réception et remise des documents** (fiches techniques, DOE) : est-ce systématique ? | Les pages locales décrivent une « réception contradictoire et la remise des documents de l'ouvrage ». |
| G9 | **Visite technique** : gratuite ou non, dans quel rayon ? | Les textes disent seulement « nous convenons d'une visite si elle est nécessaire ». |

---

## 1. Études de cas (`site/src/content/realisations/`)

### `renovation-magasin-carrefour-lambris-pvc.md` (featured)

- **Autorisation écrite de citer Carrefour** et formulation exacte du donneur d'ordre (hypermarché intégré, franchisé, via une entreprise générale ?). Le nom figure dans le titre et la meta description.
- Ville et nom du magasin (ou au minimum le département), date du chantier.
- Confirmer les chiffres : 320 m², 21 h–6 h et week-ends, 3 semaines contractuelles, rayon ouvert en continu, hauteur de protection 1 200 mm, bardage aluminium composite 3 mm et laine minérale 60 mm.
- L'ancienne meta description parlait d'un **« remplacement de porte pivotante »** et de **« plinthes et lisses de protection en polyéthylène »**, absents du texte détaillé. À confirmer pour les ajouter (la photo `magasin-couloir-panneaux` montre une porte et des lisses horizontales).
- Retiré faute de preuve : « lambris classe I, résistance au feu M1 » (fournir le PV de réaction au feu ou l'Euroclasse du lambris), « conformité DGCCRF » (le contrôle relève de la DDPP), garantie décennale (voir G6).
- Photos avant/après du rayon et de la réserve : il n'y a aujourd'hui que 2 photos « après ».
- Citation du directeur de magasin ou du responsable travaux.

### `depose-remplacement-sol-chambre-froide-negative.md` (featured)

- Secteur exact (agroalimentaire, logistique du froid ?), ville, date, nom du client ou formulation anonyme validée.
- Confirmer : −22 °C, 180 m², 2 phases, 50 % de capacité maintenue, jamais au-dessus de −18 °C, 10 jours ouvrés, pente 1,5 %, cunette inox 316L de 200 mm, 3 siphons, résine 3 couches de 4 mm, R11.
- **Méthode de séparation entre la zone en travaux et la zone en stockage** (cloison provisoire, rideau, sas ?) et conditions d'application de la résine (la zone en travaux était-elle remontée en température ?). C'est la question que posera tout responsable qualité.
- **Incohérence photo** : les photos « après » montrent un sol sombre avec des joints visibles et **aucune cunette centrale inox**. La pièce photographiée paraît aussi nettement plus petite que 180 m². Confirmer que ces photos sont bien celles de ce chantier, ou qu'il s'agit d'une seule cellule parmi d'autres.
- Fournir le PV du bureau de contrôle et le résultat du test d'étanchéité à l'eau, si vous acceptez de les montrer.
- Retirés : « durée de vie 20 ans », « conforme EN 13813 », « traction > 3,5 MPa », « rugosité Sa2,5 » (classe de décapage de l'acier, pas du béton), « certification fabricant résine ». À réintégrer seulement avec la fiche technique du produit (nom du fabricant et de la résine).

### `cuisine-professionnelle-min-rungis.md` (featured)

- Nom de l'occupant ou formulation validée (« grossiste du MIN », « atelier de transformation »…), bâtiment ou secteur du MIN, date.
- Confirmer : PU 80 mm, laine de roche pour les séparations coupe-feu, 120 m² de résine époxy, 2 portes battantes isothermes, sas hygiénique, 3 semaines.
- **Classement feu des panneaux laine de roche** (PV ou Euroclasse) : le texte parle de « séparations coupe-feu ».
- Phasage réel du chantier (ordre des travaux, site occupé ou non) : la section « Solution et phasage » ne décrit que l'organisation générale faute d'information.
- Les photos montrent un grand volume avec de nombreux équipements de cuisson et un caniveau linéaire : confirmer qu'il s'agit bien de ce chantier et de la surface de 120 m².
- Retirés : « Uc < 0,25 W/m²·K » (valeur peu plausible pour un panneau PU de 80 mm sans fiche fabricant), « traction > 2,0 MPa », « durabilité 15 ans », « conformité HACCP » (HACCP est une méthode, pas une norme de construction).

### `installation-cloisons-isothermes-haute-performance.md`

- Ville, type d'entrepôt (logisticien, agroalimentaire ?), date, température de la cellule positive.
- **Incohérence photo** : le texte décrit **2 portes sectionnelles isothermes motorisées**, mais les photos `local-technique-porte-isotherme(-2)` montrent une **porte battante simple**. Confirmer les portes posées, ou retirer ces photos de l'étude.
- Préciser « hors exploitation » : travaux de nuit, zone hors activité, période d'arrêt programmé ?
- Retirés : « −35 % de déperditions », « −18 % de temps de descente » (aucune mesure documentée), « normes EN 13000 » (norme des grues mobiles ; la norme des panneaux est la NF EN 14509), « Uc < 0,22 W/m²·K », « garantie constructeur 10 ans », « durabilité 15 ans ». À réintégrer seulement avec mesures avant/après (méthode, dates) et fiches fabricant.
- Fiche technique des panneaux (fabricant, Euroclasse) et des portes.

### `amenagement-bureaux-vestiaires-industriels.md`

- Secteur du site industriel, ville, date.
- **Incohérence photo majeure** : le texte (repris de la page actuelle) décrit des cloisons modulaires 72 mm, un faux plafond en dalles minérales 600 × 600 et un sol en dalles PVC LVT. Les photos montrent des **parois et un plafond en panneaux sandwich**, un **sol carrelé**, des luminaires LED suspendus et une climatisation cassette. Il faut soit corriger le texte (matériaux réellement posés), soit remplacer les photos.
- Confirmer : 280 m², 3 semaines, aucune interruption de production, Rw 42 dB (indice du produit, pas une mesure in situ), αw 0,80, 6 portes de service, menuiseries alu à rupture de pont thermique.
- Retirés : « économie d'énergie estimée 28 % », « certification QUALIMARINE » (label de laquage sans rapport), « durabilité 20 ans », « vitrages feuilletés 4/16/4 » (composition incohérente : un vitrage 4 mm n'est pas feuilleté), « vestiaires conformes R4228-1 à R4228-10 » (conformité qui dépend aussi des équipements, hors lot).

---

## 2. Articles (`site/src/content/blog/`)

Pour les 4 articles : **relecture par un technicien K Isolation** et **auteur réel** à indiquer (le champ `author` reste « Équipe technique K Isolation » par défaut ; l'ancienne signature « Inès Ben Labidi, 8 ans d'expérience, spécialiste EN 13165 » n'a pas été reprise faute de justificatif). Dates : `date` = 2025-08-17 (origine), `updated` = 2026-10-31 (refonte réelle).

### `comment-bien-choisir-sa-chambre-froide-professionnelle.md`

- Confirmer **qui installe le groupe froid** : K Isolation en direct, un frigoriste partenaire ou celui du client ? L'article reste neutre (« vérifiez qui porte ce lot »). Si un partenariat existe, l'article peut le dire.
- Confirmer que K Isolation propose bien la porte avec ouverture intérieure et l'alarme « personne enfermée » de série ou en option.
- Erreurs corrigées par rapport à l'ancienne version : « norme HACCP » (méthode, pas norme), « panneaux à forte densité » (c'est l'épaisseur et l'âme qui isolent), « la négative bloque les bactéries » (elle arrête leur multiplication sans les détruire).

### `chambre-froide-positive-ou-negative-quelle-difference.md`

- Températures réglementaires citées (arrêté du 21 décembre 2009) : +2 °C viandes hachées, +4 °C viandes de volaille, 0 à +2 °C produits de la pêche frais, −18 °C surgelés. Vérifiées sur sources secondaires (DDPP, ministère) : **à recontrôler sur Légifrance** avant publication.
- Retiré : « durée de vie 15 à 20 ans » (non justifié).
- Photo de couverture en format portrait (`sol-chambre-froide-apres.jpg`) recadrée en 2:1 par le gabarit : une photo paysage de chambre froide serait préférable.

### `faut-il-un-permis-ou-une-autorisation-speciale-pour-installer-une-chambre-froide.md`

Points réglementaires à faire relire (juriste, bureau de contrôle ou service urbanisme) avant publication :
- Seuils d'urbanisme : 5 m² / 20 m² / 40 m² en zone urbaine d'un PLU (code de l'urbanisme). Vérifiés sur sources secondaires concordantes.
- ERP : autorisation de travaux au titre du code de la construction et de l'habitation (article L. 122-3 dans la numérotation actuelle). **Un projet de simplification envisageait de remplacer cette autorisation par une déclaration pour certains ERP : vérifier qu'il n'a pas été adopté.**
- ICPE : rubriques 1511 (entrepôts frigorifiques), 4735 (ammoniac) et 1185 (gaz fluorés) citées **sans seuils**, volontairement. Renvoi vers la DREAL ou la DDPP.
- Recours obligatoire à un architecte pour une société qui dépose un permis de construire : à confirmer par le service urbanisme.
- EN 378 : la protection des personnes dans les chambres froides y est traitée (annexe de la partie 1 selon les éditions) ; l'article ne cite pas de clause précise.
- Erreurs corrigées : l'ancienne version présentait HACCP, IFS et BRC comme des « normes à respecter » pour l'installation, et ignorait ERP, ICPE et hygiène.

### `comment-bien-isoler-un-entrepot-ou-un-local-industriel-panneaux-cloisons-et-faux-plafonds.md`

- Confirmer que K Isolation pose aussi des **faux plafonds en dalles** pour bureaux (cité via l'étude bureaux et vestiaires, elle-même à corriger, voir plus haut).
- Erreur corrigée : « panneaux composés de deux plaques métal ou PVC » (les panneaux NF EN 14509 ont des parements métalliques).

---

## 3. Pages locales (`site/src/content/zones/`)

**Règle de l'audit (§6.2) non remplie à ce jour** : une page locale ne devrait exister qu'avec au moins 2 chantiers réels documentés dans la zone.
- Marseille : **aucune** des 5 études de cas n'est localisée dans les Bouches-du-Rhône (`relatedCases` vide). Il faut au moins 2 chantiers locaux documentés (lieu, date, photos, accord client) pour les relier à la page.
- Île-de-France : **1 seule** étude (Rungis). Un 2e chantier francilien documenté est nécessaire.

### `marseille.md`

- Liste des communes desservies (`areas`) : confirmer, et dire si le Var et le Vaucluse doivent apparaître (zone prévue pour la fiche Google Business Profile).
- Confirmer la formulation sur les urgences : « nous vous donnons au téléphone un délai réaliste ». Aucun délai chiffré n'est publié (contradiction 48 h / 10 jours sur l'ancien site).
- Confirmer l'intervention en dépannage pour les occupants du MIN des Arnavaux (portes, joints, panneaux).
- Photo de chantier marseillais pour le visuel d'en-tête (`heroImage` laissé vide faute de photo locale).
- Retirés : « 80 chantiers en 3 ans », « laboratoires à La Ciotat », « salles blanches pharmaceutiques à Aubagne », « normes mistral », « exigences sismiques », « ATEX », « Qualibat », « 10+ ans », « devis sous 48 h », « nous fabriquons les panneaux en atelier ».

### `ile-de-france.md`

- **Existe-t-il une base, un dépôt ou une équipe résidente en Île-de-France ?** La page dit que le siège est à Marseille et que les équipes se déplacent pour la durée du chantier. À corriger si une implantation réelle existe.
- Confirmer l'offre multi-sites : « interlocuteur unique, même méthode d'un site à l'autre ».
- Chiffres du MIN de Rungis (plus de 1 200 entreprises, près de 13 000 salariés, plus de 200 ha) : sources SEMMARIS et DRIAAF citées dans l'audit, à actualiser si besoin.
- Communes et zones listées (`areas`) : confirmer celles où des chantiers ont réellement eu lieu ou sont acceptés.
- Retirés : « 30 chantiers en 3 ans », « 7 départements » suivis de 8, « laboratoires pharma des Hauts-de-Seine », « Qualibat », « 10+ ans ».
