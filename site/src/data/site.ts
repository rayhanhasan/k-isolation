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
 * Chiffres clés : uniquement ceux qui sont déjà publiés par le client.
 * « 10 ans » = expérience terrain de l'équipe (la société KISOLATION est
 * immatriculée plus récemment : ne jamais écrire « depuis 2014 »).
 */
export const STATS = [
  { value: '20 000', suffix: 'm²', label: 'de panneaux posés par nos équipes' },
  { value: '10', suffix: 'ans', label: "d'expérience terrain en froid & isolation" },
  { value: '24', suffix: 'h', label: 'pour recevoir votre devis détaillé' },
  { value: '10', suffix: 'ans', label: 'de garantie décennale sur nos travaux' },
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
  { label: 'Salles blanches', href: '/salles-blanches/', description: 'Environnements maîtrisés ISO' },
  { label: 'Rénovation & mise en conformité', href: '/renovation-mise-en-conformite/', description: 'Sols, panneaux, HACCP' },
  { label: 'SAV, dépannage & maintenance', href: '/sav-maintenance/', description: 'Intervention rapide, contrats' },
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
