/**
 * Options du formulaire de devis (partagées entre la page /devis/,
 * l'API de réception des leads et le score de qualification).
 */
export const BESOINS = [
  { value: 'chambre-froide', label: 'Nouvelle chambre froide', hint: 'Positive, négative, sur mesure', icon: 'snowflake' },
  { value: 'cloisons', label: 'Cloisons isothermes / laboratoire', hint: 'Panneaux sandwich, portes, plafonds', icon: 'layers' },
  { value: 'renovation', label: 'Rénovation / mise en conformité', hint: 'Panneaux, portes, sols, HACCP / IFS', icon: 'refresh' },
  { value: 'depannage', label: 'Panne ou réparation urgente', hint: 'Porte, panneau, joint, sol', icon: 'alert' },
  { value: 'maintenance', label: 'Contrat de maintenance', hint: 'Visites, rapports pour vos audits', icon: 'wrench' },
  { value: 'salle-propre', label: 'Salle propre / labo', hint: 'Cloisons, plafonds, portes ISO 7-8', icon: 'flask' },
  { value: 'partenaire', label: 'Je suis frigoriste, cuisiniste ou MOE', hint: 'Sous-traiter le lot enveloppe', icon: 'user' },
] as const;

export const SECTEURS = [
  { value: 'gms', label: 'Grande distribution / magasin' },
  { value: 'restauration', label: 'Restauration rapide / franchise' },
  { value: 'cuisine-pro', label: 'Cuisine pro, traiteur, métiers de bouche' },
  { value: 'agro', label: 'Industrie agroalimentaire' },
  { value: 'logistique', label: 'Logistique / entrepôt frigorifique' },
  { value: 'pharma', label: 'Pharma, cosmétique, laboratoire' },
  { value: 'industrie', label: 'Autre industrie' },
  { value: 'autre', label: 'Autre' },
] as const;

export const SURFACES = ['Moins de 20 m²', '20 à 100 m²', '100 à 500 m²', 'Plus de 500 m²', 'Je ne sais pas encore'] as const;
export const TEMPERATURES = ['Positive (0 à +8 °C)', 'Négative (−18 °C et moins)', 'Les deux', 'Ambiante / sans froid', 'Je ne sais pas'] as const;
export const ECHEANCES = [
  { value: 'urgent', label: 'Urgent (moins d’une semaine)' },
  { value: '1-mois', label: 'Dans le mois' },
  { value: '1-3-mois', label: 'Dans 1 à 3 mois' },
  { value: '3-mois-plus', label: 'Dans plus de 3 mois' },
  { value: 'budget', label: 'Je prépare un budget' },
] as const;
export const SITES = ['1 site', '2 à 5 sites', 'Plus de 5 sites'] as const;
export const CONTACT_PREF = ['Appel téléphonique', 'Visio de 15 min', 'Visite sur site'] as const;

/** Départements des deux bassins d'intervention prioritaires. */
const PRIORITY_DEPTS = ['13', '83', '84', '04', '05', '06', '30', '75', '77', '78', '91', '92', '93', '94', '95'];

/**
 * Score de qualification A/B/C (cf. audit §2.2) : persona × échéance × zone × taille × site occupé.
 * Sert uniquement au tri interne des demandes (objet de l'e-mail, CRM).
 */
export function scoreLead(l: { besoin?: string; secteur?: string; cp?: string; echeance?: string; surface?: string; occupe?: string; sites?: string }) {
  let s = 0;
  if (['gms', 'restauration', 'agro', 'logistique'].includes(l.secteur ?? '')) s += 2;
  else if (['cuisine-pro', 'pharma', 'industrie'].includes(l.secteur ?? '')) s += 1;
  if (['urgent', '1-mois', '1-3-mois'].includes(l.echeance ?? '')) s += 2;
  if (PRIORITY_DEPTS.includes((l.cp ?? '').slice(0, 2))) s += 2;
  if (['100 à 500 m²', 'Plus de 500 m²'].includes(l.surface ?? '')) s += 2;
  else if (l.surface === '20 à 100 m²') s += 1;
  if (l.occupe === 'oui') s += 1;
  if (l.sites && l.sites !== '1 site') s += 2;
  if (l.besoin === 'depannage' || l.besoin === 'partenaire') s += 1;
  return s >= 7 ? 'A' : s >= 4 ? 'B' : 'C';
}
