/**
 * Source unique de vérité pour les informations de l'entreprise.
 * Toute valeur marquée TODO_CLIENT doit être confirmée par K Isolation
 * avant la mise en ligne (voir CONTENU-A-VALIDER.md à la racine du dépôt).
 */
export const SITE = {
  name: 'K Isolation',
  legalName: 'KISOLATION',
  url: 'https://k-isolation.fr',
  tagline: 'Chambres froides, cloisons isothermes et salles blanches pour les professionnels',
  phone: '06 35 29 80 57',
  phoneHref: 'tel:+33635298057',
  phoneIntl: '+33 6 35 29 80 57',
  email: 'contact@k-isolation.fr',
  address: {
    street: '61 rue Marx Dormoy',
    postalCode: '13004',
    city: 'Marseille',
    region: "Provence-Alpes-Côte d'Azur",
    country: 'FR',
  },
  geo: { lat: 43.3087, lng: 5.3962 },
  siren: '984 177 501',
  siret: '984 177 501 00025',
  rcs: 'RCS Marseille',
  legalForm: 'Société à responsabilité limitée (SARL)',
  vat: 'FR52 984 177 501',
  designer: { name: 'Harbor Digital', url: 'https://harbor-digital.fr' },
  /** Hébergeur à mettre à jour selon la plateforme retenue lors de la migration. */
  host: { name: 'Vercel Inc.', address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis', url: 'https://vercel.com' },
  publicationDirector: 'Anicet', // TODO_CLIENT : nom complet du directeur de la publication
  linkedin: 'https://www.linkedin.com/company/k-isolation/', // TODO_CLIENT : vérifier l'URL exacte
  openingHours: 'Lun–Ven 7h30–18h30', // TODO_CLIENT
  /** Délai de réponse affiché partout : un seul chiffre, tenu. */
  responseTime: '24 h ouvrées',
  /** Zones d'intervention prioritaires (bases d'équipes) */
  hubs: ['Marseille & PACA', 'Île-de-France'],
  coverage: 'France entière, Suisse et projets européens sur étude',
} as const;

/**
 * Chiffres clés : uniquement des faits de chantiers publiés par le client
 * (cf. audit/02-audience-marche.md §0 bis). Pas de « Est. 2014 », pas de
 * « 20 000 m² » ni « 50+ partenaires » tant qu'ils ne sont pas documentés.
 */
export const STATS = [
  { value: '21h–6h', label: 'chantiers de nuit : votre magasin rouvre propre le matin' },
  { value: '−22 °C', label: 'chaîne du froid maintenue pendant la réfection d’un sol' },
  { value: '< 24 h', label: 'première estimation technique et budgétaire (jour ouvré)' },
  { value: '10 ans', label: 'garantie décennale sur les travaux d’enveloppe' },
] as const;

/** Références clientes citées sur le site actuel (logos à autoriser — TODO_CLIENT). */
export const CLIENTS = [
  { name: 'STEF', logo: 'stef.svg', sector: 'Logistique du froid' },
  { name: 'Carrefour', logo: 'carrefour.png', sector: 'Grande distribution' },
  { name: 'Netto', logo: 'netto.svg', sector: 'Grande distribution' },
  { name: 'Grand Frais', logo: 'grand-frais.png', sector: 'Distribution alimentaire' },
  { name: 'Burger King', logo: 'burger-king.png', sector: 'Restauration rapide' },
  { name: 'KFC', logo: 'kfc.png', sector: 'Restauration rapide' },
  { name: 'Quick', logo: 'quick.png', sector: 'Restauration rapide' },
] as const;

export type NavItem = { label: string; href: string; description?: string; children?: NavItem[] };

export const SERVICES_NAV: NavItem[] = [
  { label: 'Chambres froides', href: '/chambres-froides/', description: 'Positives, négatives, sur mesure' },
  { label: 'Cloisons isothermes', href: '/cloisons-isothermes/', description: 'Panneaux sandwich, portes, faux plafonds' },
  { label: 'Salles propres & labos', href: '/salles-blanches/', description: 'Cloisons, plafonds, portes ISO 7-8' },
  { label: 'Rénovation & mise en conformité', href: '/renovation-chambre-froide/', description: 'Panneaux, portes, sols, HACCP / IFS' },
  { label: 'Dépannage & maintenance', href: '/sav-maintenance/', description: 'Enveloppe, portes, joints, contrats' },
];

export const SECTORS_NAV: NavItem[] = [
  { label: 'Agroalimentaire', href: '/secteurs/agroalimentaire/' },
  { label: 'Logistique & entreposage', href: '/secteurs/logistique-entreposage/' },
  { label: 'Restauration & cuisines pro', href: '/secteurs/restauration-cuisines-professionnelles/' },
  { label: 'Grande distribution', href: '/secteurs/grande-distribution/' },
  { label: 'Pharma, labos & santé', href: '/secteurs/pharmacie-laboratoires/' },
  { label: 'Industrie', href: '/secteurs/industrie/' },
];

export const MAIN_NAV: NavItem[] = [
  { label: 'Solutions', href: '/#solutions', children: SERVICES_NAV },
  { label: 'Secteurs', href: '/#secteurs', children: SECTORS_NAV },
  { label: 'Réalisations', href: '/realisations/' },
  { label: 'Conseils', href: '/blog/' },
  { label: 'À propos', href: '/a-propos/' },
];
