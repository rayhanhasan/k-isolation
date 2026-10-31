import { SITE } from '../data/site';

/** Données structurées schema.org réutilisables (JSON-LD). */

export const ORG_ID = `${SITE.url}/#organisation`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'GeneralContractor'],
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url + '/',
    logo: `${SITE.url}/logo-k-isolation.png`,
    image: `${SITE.url}/og-default.jpg`,
    description:
      "Conception, installation, rénovation et maintenance de chambres froides, cloisons isothermes en panneaux sandwich et salles blanches pour les professionnels de l'agroalimentaire, de la logistique, de la restauration, de la distribution et de la santé.",
    telephone: SITE.phoneIntl.replace(/\s/g, ''),
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: [
      { '@type': 'AdministrativeArea', name: "Provence-Alpes-Côte d'Azur" },
      { '@type': 'AdministrativeArea', name: 'Île-de-France' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Suisse' },
    ],
    identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: SITE.siren.replace(/\s/g, '') },
    sameAs: [SITE.linkedin],
    knowsAbout: [
      'Chambre froide positive',
      'Chambre froide négative',
      'Panneaux sandwich isothermes',
      'Cloisons isothermes',
      'Salle blanche',
      'Sol de chambre froide',
      'HACCP',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#site`,
    url: SITE.url + '/',
    name: SITE.name,
    inLanguage: 'fr-FR',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.href, SITE.url).href,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string; serviceType?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType ?? opts.name,
    description: opts.description,
    url: new URL(opts.path, SITE.url).href,
    provider: { '@id': ORG_ID },
    areaServed: [
      { '@type': 'AdministrativeArea', name: "Provence-Alpes-Côte d'Azur" },
      { '@type': 'AdministrativeArea', name: 'Île-de-France' },
      { '@type': 'Country', name: 'France' },
    ],
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: new URL(opts.path, SITE.url).href,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: opts.image ? new URL(opts.image, SITE.url).href : `${SITE.url}/og-default.jpg`,
    author: { '@type': 'Organization', name: opts.author ?? 'Équipe technique K Isolation', url: SITE.url + '/a-propos/' },
    publisher: { '@id': ORG_ID },
    inLanguage: 'fr-FR',
  };
}
