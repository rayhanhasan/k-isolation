# À valider par K Isolation : pages solutions et secteurs

> Fichiers concernés : `site/src/content/services/*.md` (5 pages) et `site/src/content/secteurs/*.md` (6 pages).
> Règle appliquée : seuls les faits de l’audit §0 bis figurent dans les pages. Tout ce qui suit est **absent des pages** ou y figure sous une forme prudente, à confirmer avant la mise en ligne.
> Délais publiés : uniquement « première estimation technique et budgétaire en moins d’un jour ouvré ». Aucun « 48 h », « sans surcoût », « Est. 2014 », chiffre d’économie d’énergie ni certification n’a été repris.

---

## 1. Points communs à toutes les pages (bloquants avant mise en ligne)

| # | À confirmer ou fournir | Où c’est utilisé | Pourquoi |
|---|---|---|---|
| G1 | **Attestation d’assurance décennale** : assureur, n° de police, activités couvertes (isolation frigorifique, panneaux sandwich, portes, sols résine, lambris PVC) | Toutes les pages (« attestation transmise sur demande ») | La décennale est citée partout ; les activités couvertes doivent correspondre aux travaux décrits (notamment les **sols résine**) |
| G2 | **Dossier fournisseur** : Kbis, attestation de vigilance URSSAF, attestation RC Pro | `chambres-froides` (FAQ), `grande-distribution` (FAQ), `agroalimentaire` (FAQ), `industrie` (FAQ) | Les pages disent que ces pièces sont transmises sur demande |
| G3 | **Engagement « moins d’un jour ouvré »** réellement tenu et mesuré (horodatage CRM) | CTA de presque toutes les pages | Seul délai publié |
| G4 | **Documents remis à chaque chantier** : planning écrit validé avant signature, PV de réception, fiches techniques, rapport de travaux avec photos avant/après (rénovation), DOE (contenu ?) | Sections « Ce que vous recevez » | Promesses de méthode : à confirmer comme pratique systématique, sinon reformuler |
| G5 | **Visite technique** : gratuite ou non, rayon d’intervention | Mentionnée sans précision de gratuité | Ajouter la condition réelle une fois connue |
| G6 | **Frigoristes partenaires** : existence d’accords, noms, zones ; K Isolation ne détient pas l’attestation de capacité fluides (à confirmer) | `chambres-froides`, `sav-maintenance`, `renovation-chambre-froide` | Les pages disent clairement que le groupe froid relève d’un frigoriste, « le vôtre ou un partenaire » |
| G7 | **Couverture géographique** : « Basées à Marseille, nos équipes de pose se déplacent dans toute la France » ; existe-t-il une base réelle en Île-de-France ? | `grande-distribution`, `restauration-cuisines-professionnelles` | Formulation volontairement minimale (cf. pages recrutement) |
| G8 | **Marques** de panneaux, portes, résines et lambris posées | Non citées | À ajouter pour l’autorité (levier 3 de l’audit) |
| G9 | **Repères techniques** à relire par un technicien K Isolation : températures usuelles (0/+8 °C, −18/−25 °C), épaisseurs courantes (60–100 mm positif, 100–150 mm négatif, 40–60 mm cloison tempérée), mise hors gel sous dalle en négatif, cadre chauffant, soupape d’équilibrage, « ouverture intérieure de sécurité sur chaque porte », PIR vs laine de roche | `chambres-froides`, `cloisons-isothermes`, `logistique-entreposage` | Fourchettes usuelles du marché, présentées comme repères ; à valider |
| G10 | **Fourchettes de prix** par type de projet | Aucune page (seulement les facteurs de prix) | Angle libre identifié par l’audit (§4.3, point 6) ; à publier quand le client les fournit |
| G11 | **Récit « société créée en 2024 »** : accord du dirigeant pour l’assumer publiquement | `agroalimentaire` (FAQ « Vous êtes une jeune société ») | Réponse honnête à l’objection ; aucune ancienneté « depuis 2014 » n’a été écrite |

---

## 2. Photos utilisées : chantier d’origine et autorisation

Les textes alternatifs décrivent uniquement ce qu’on voit, sans attribuer la photo à un client. Pour chaque image : **quel chantier, quel client, autorisation de publier ?** Si la photo vient d’un chantier documenté, on pourra préciser l’alt ou ajouter une légende.

| Page | Image | Question |
|---|---|---|
| `chambres-froides` | `sol-chambre-froide-apres.jpg` | Chantier du sol à −22 °C ? |
| `cloisons-isothermes` | `entrepot-pose-cloisons-isothermes.jpg` | Chantier de l’entrepôt (PU 100 mm) ? Monteur reconnaissable : accord ? |
| `renovation-chambre-froide` | `sol-chambre-froide-demolition.jpg` | Chantier à −22 °C ? Les rideaux de film plastique sont-ils la protection de phasage (si oui, à valoriser en légende) ? |
| `sav-maintenance` | `local-technique-porte-isotherme.jpg` | Porte isotherme ou porte de service ? Quel chantier ? |
| `salles-blanches` | `salle-panneaux-climatisation.jpg` | Nature du local (bureau, labo ?) ; aucune allusion à une salle blanche n’est faite |
| `grande-distribution` | `magasin-couloir-panneaux.jpg` | Est-ce le chantier Carrefour (après travaux) ? Si oui, l’indiquer en légende avec accord |
| `restauration-cuisines-professionnelles` | `cuisine-pro-cloisons-inox.jpg` | Chantier de Rungis ? Fours et cellule de cuisson visibles : quel occupant ? |
| `agroalimentaire` | `sol-chambre-froide-nivellement-laser.jpg` | Chantier à −22 °C ? |
| `logistique-entreposage` | `entrepot-cloisons-allee.jpg` | Chantier de l’entrepôt ? Personnes visibles au fond : accord ou floutage |
| `pharmacie-laboratoires` | `salle-panneaux-sandwich-livree.jpg` | Nature et lieu du local |
| `industrie` | `bureaux-vestiaires-plafond-led.jpg` | Chantier bureaux et vestiaires (280 m²) ? |

Doublons dans `src/assets/chantiers/` : `sol-chambre-froide-apres.jpg` = `sol-chambre-froide-apres-2.jpg`, et `local-technique-porte-isotherme.jpg` = `local-technique-porte-isotherme-2.jpg` (fichiers identiques).

**Photos manquantes à demander :** porte de chambre froide avant/après réparation (SAV), joint arraché, panneau enfoncé ; chambre froide de restaurant (positive + négative) ; chantier de nuit en magasin (équipe en EPI, zone balisée) ; équipe au travail en EPI ; avant/après du chantier Carrefour.

---

## 3. Page par page

### Solutions

**`chambres-froides`**
- Aucune étude de cas de chambre froide complète (restaurant, magasin) : les cas liés sont une cuisine (Rungis), un sol (−22 °C) et une cellule d’entrepôt. **Fournir un chantier de chambre froide neuve documenté** (idéalement un restaurant d’enseigne).
- Confirmer que K Isolation propose la sous-traitance du lot panneaux aux cuisinistes et frigoristes.
- Confirmer la coordination du frigoriste (devis séparé du frigoriste, comme écrit dans la page) ou proposer une offre clés en main via un partenaire.
- Délais : fabrication des panneaux et durée de pose type (la FAQ distingue « date de démarrage » et « durée de pose » sans chiffre).

**`cloisons-isothermes`**
- Classements Euroclasses des panneaux habituellement posés (PIR et laine de roche).
- Capacité à fournir des cloisons avec **résistance au feu (EI)** sous PV d’essai : la page dit seulement « nous le vérifions avec le fabricant ».
- Rungis : confirmer la formulation « panneaux en laine de roche pour les séparations soumises à une exigence feu » (le site actuel dit « coupe-feu »).
- Entrepôt : « 2 semaines, sans arrêt d’activité » repris du site ; l’audit note « hors exploitation » : préciser (de nuit ? zone neutralisée ?).
- Sous-traitance : « Vous restez l’interlocuteur de votre client final » = engagement de non-sollicitation ; à confirmer.

**`renovation-chambre-froide`**
- Carrefour : ville ou magasin, date, accord écrit pour citer l’enseigne, photos avant/après, citation du directeur, rôle du bureau de contrôle.
- Sol à −22 °C : secteur et ville du client, date, PV du bureau de contrôle (« validé par un bureau de contrôle » est écrit).
- Confirmer les prestations citées : reprise locale de parement, doublage de paroi, remplacement panneau par panneau, lambris PVC, sols résine (en propre ou sous-traités ?).
- Confirmer la remise d’un **diagnostic écrit avec photos et priorités** après visite.

**`sav-maintenance`**
- **Point le plus sensible :** l’ancien site parlait de « maintenance d’équipements frigorifiques » et de contrats couvrant les « installations frigorifiques ». La nouvelle page dit clairement que K Isolation **n’intervient pas sur le groupe froid**. Confirmer ce périmètre.
- Délai d’intervention réellement tenu, zones et horaires : aucun délai n’est publié (les « 48 h » et « 10 jours » contradictoires ont été écartés).
- Contrats : existence réelle, contenu, fréquences, prix ou formules (l’audit propose 3 formules), regroupement multi-sites des rapports.
- **Modèle de rapport d’intervention** (anonymisé) à publier en visuel : preuve clé pour l’argument « utile en audit ».
- Contrôle du cadre chauffant de porte négative : compétence électrique interne ?
- Ligne téléphonique citée dans le texte (06 35 29 80 57) : horaires de réponse.

**`salles-blanches`**
- Positionnement « enveloppe seulement, avec un intégrateur » : à valider par le dirigeant. Existe-t-il un intégrateur partenaire ?
- `relatedCases` laissé **vide volontairement** : aucune référence de salle propre. Fournir la première dès qu’elle existe (classe, surface, intégrateur, photos).
- Confirmer la capacité de fourniture : angles à gorge, portes à oculus, châssis vitrés, plafonds avec réservations pour filtres.
- Retirés de l’ancien site (non prouvés) : ISO 5, BPF, filtration HEPA, qualification, requalifications.

### Secteurs

**`grande-distribution`**
- Autorisation écrite pour **Carrefour** (champ `clientsCited` + logo).
- Netto et Grand Frais figurent dans `site.ts` (CLIENTS) mais ne sont pas cités : à ajouter seulement avec accord et nature du chantier.
- Confirmer le « point de contrôle en fin de nuit » avec le responsable du magasin (FAQ).
- Un second cas GMS (labo boucherie, chambre de réserve) renforcerait la page.

**`restauration-cuisines-professionnelles`**
- Autorisation pour **Burger King, KFC, Quick** et nature exacte des chantiers (restaurants franchisés ? quels travaux ? combien ?). La page reprend seulement « des enseignes avec lesquelles nous travaillons ».
- Rungis : nom de l’occupant ou « grossiste du MIN », date, photos, accord.
- Rétroplanning type avec durées réelles (fabrication, pose, mise en froid) pour remplacer la liste d’étapes sans durée.
- Étude de cas d’ouverture de restaurant d’enseigne : manque principal de la page.

**`agroalimentaire`**
- Sol à −22 °C : secteur réel du client (agroalimentaire ou logistique ?), ville, date.
- Disponibilité des **déclarations de performance** des panneaux auprès des fournisseurs (FAQ).
- Un cas de levée de non-conformité IFS (avant/après, témoignage du responsable qualité) serait la meilleure preuve.

**`logistique-entreposage`**
- **STEF** : autorisation de citer, relation directe ou en sous-traitance, nature et lieu des travaux. La page dit seulement « STEF figure parmi nos clients ».
- Portes sectionnelles motorisées et portes rapides : fourniture et pose en propre ? (motorisation, mise en service CE).
- Entrepôt PU 100 mm : client, ville, signification de « hors exploitation ».

**`pharmacie-laboratoires`**
- Aucune référence : `relatedCases` **vide volontairement**, et la page le dit honnêtement.
- Intégrateur partenaire éventuel.
- Capacité à réaliser l’enveloppe de chambres froides +2/+8 °C pour produits de santé.

**`industrie`**
- Bureaux et vestiaires (280 m²) : client, ville, date, photos. Le Rw 42 dB est présenté comme l’indice des cloisons posées : vérifier sur la fiche fabricant. Retirés : « économie d’énergie 28 % », « QUALIMARINE », « durabilité 20 ans », articles du Code du travail.
- Confirmer la pratique du plan de prévention (documents fournis au service HSE).

---

## 4. Notes techniques pour le chef de projet

- `npx astro sync` dans `site/` échoue actuellement sur **un article de blog écrit par un autre agent** (`blog/comment-bien-isoler-un-entrepot-…md` : description de plus de 165 caractères). Les collections `services` et `secteurs` ont été validées dans une copie isolée du projet (blog et zones vidés) : **0 erreur**, références `relatedCases` résolues et images trouvées. Un faux slug injecté pour test est bien détecté.
- Valeurs `devisPreset` utilisées : `chambre-froide`, `cloisons`, `renovation`, `depannage`, `salle-propre`, `gms`, `restauration`, `agro`, `logistique`, `pharma`, `industrie`.
- Icônes : snowflake, layers, refresh, wrench, sparkles, store, chefHat, factory, truck, flask, building.
- Une solution sans `href` (« Coordination des lots » et « Coordination avec vos spécialistes ») : le gabarit doit gérer l’absence de lien.
- Liens internes utilisés en dehors des solutions, secteurs et réalisations : `/devis/`, `/contact/`, `/realisations/`. Aucun lien vers des pages non prévues (`/garanties-assurances/`, `/urgence-sav/`, blog).
- Le numéro de téléphone est écrit en dur dans le corps de `sav-maintenance.md` : à garder aligné sur `SITE.phone`.
- `metaTitle` ≤ 51 caractères partout, car le gabarit ajoute « | K Isolation ».
