# À valider par K Isolation avant la mise en ligne

Le nouveau site n'affirme **que** des faits déjà publiés par le client. Tout ce qui pouvait être faux ou invérifiable a été retiré : « Est. 2014 », « 20 000 m² », « 50+ partenaires », Qualibat, ATEX, gains d'énergie non mesurés, « EN 13000 »… Pour renforcer les pages, le client doit confirmer ou fournir les éléments ci-dessous.

Détail complet, page par page et photo par photo :
- `audit/a-valider-services-secteurs.md` (solutions et secteurs) ;
- `audit/a-valider-realisations-blog-zones.md` (études de cas, articles, pages locales).

## 🔴 Bloquant (à régler avant la bascule DNS)

| # | Élément | Où | Fichier à modifier |
|---|---|---|---|
| 1 | **Attestation d'assurance décennale** : assureur, n° de police, activités couvertes (panneaux isothermes, portes, **sols résine**, lambris PVC) | Partout (« garantie décennale ») | — (document à joindre aux devis) |
| 2 | **Autorisation écrite d'afficher les logos** STEF, Carrefour, Netto, Grand Frais, Burger King, KFC, Quick, et nature exacte du chantier pour chacun | Bandeau logos, secteurs | `site/src/data/site.ts` (`CLIENTS`) |
| 3 | **Validation des 5 études de cas** : lieu, date, chiffres, et **attribution des photos aux chantiers** (faite par hypothèse). Plusieurs photos contredisent le texte d'origine : carrelage au lieu de dalles PVC (vestiaires), porte battante au lieu de portes sectionnelles (entrepôt), cunette inox absente des photos (sol −22 °C) | `/realisations/…` | `site/src/content/realisations/*.md` (passer `toValidate: false` une fois validé) |
| 4 | **SAV : périmètre réel.** Le nouveau site dit que K Isolation répare l'enveloppe (portes, joints, panneaux, sols) et confie le **groupe froid à un frigoriste partenaire**. L'ancien site promettait la maintenance des installations frigorifiques : laquelle des deux versions est vraie ? | `/sav-maintenance/`, FAQ accueil | `site/src/content/services/sav-maintenance.md` |
| 5 | **Nom complet du directeur de la publication** (obligation légale) | Mentions légales | `site/src/data/site.ts` (`publicationDirector`) |
| 6 | **Horaires d'ouverture** et **URL exacte de la page LinkedIn** | Contact, devis, pied de page | `site/src/data/site.ts` |
| 7 | **Engagements affichés** (section « Des engagements écrits ») : planning écrit avant signature, interlocuteur unique, dossier fournisseur (Kbis, URSSAF, RC Pro) envoyé sur demande, site propre à chaque réouverture, PV de réception. À confirmer comme pratique systématique | Accueil, secteurs, à propos | `site/src/components/sections/Guarantees.astro` |
| 8 | **Récit « société créée en 2024, équipes expérimentées »** : accord du dirigeant pour l'assumer publiquement (c'est ce que les acheteurs voient sur Pappers) | À propos, FAQ | `site/src/pages/a-propos.astro` |
| 9 | **Offres d'emploi** toujours ouvertes ? (monteur, chef d'équipe) | `/recrutement/` | `site/src/pages/recrutement.astro` |

## 🟠 Important (dans le mois qui suit)

- **Délai d'urgence réellement tenu** (ex. « intervention sous X h en PACA ») : aucun n'est affiché pour l'instant, c'est un levier fort une fois confirmé.
- **Visite technique** : gratuite ou non, et dans quel rayon.
- **Fourchettes de prix indicatives** par type de projet (aucun concurrent n'en publie).
- **Marques** de panneaux, portes et résines posées : elles renforcent l'autorité.
- **Photos à produire** : chambre froide de restaurant neuve, chantier de nuit en magasin (équipe en EPI), porte de chambre froide avant/après réparation, avant/après du chantier Carrefour.
- **Un 2e chantier documenté en Île-de-France et à Marseille**, pour justifier les pages locales.
- **Première référence de salle blanche ou de laboratoire** : la page reste prudente tant qu'il n'y en a pas.
- **Points réglementaires** à faire relire (article « permis ») : seuils de l'arrêté de 2009, autorisation de travaux en ERP.

## ✅ Déjà corrigé dans le nouveau site

- E-mail Gmail des mentions légales remplacé par `contact@k-isolation.fr`.
- Dates des articles honnêtes (publication d'origine, puis « mis à jour » à la date de la vraie refonte).
- Photos en double supprimées, images IA et de banque d'images retirées.
- Textes anglais résiduels, compteurs « Views / Likes » et contenus de démonstration du thème supprimés.
