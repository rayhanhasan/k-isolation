import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string() });

/**
 * Pages « argent » : une par solution. URL = /<slug>/
 * Le corps Markdown contient le contenu long (expertise, SEO).
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      navLabel: z.string(),
      metaTitle: z.string().max(65),
      metaDescription: z.string().min(110).max(165),
      eyebrow: z.string(),
      h1: z.string(),
      lead: z.string(),
      heroImage: image(),
      heroAlt: z.string(),
      icon: z.string(),
      /** Résumé carte (accueil, menus) */
      cardTitle: z.string(),
      cardText: z.string(),
      /** Situations déclenchantes : « Vous êtes dans l'un de ces cas ? » */
      triggers: z.array(z.string()).min(3).max(6),
      /** Ce que le client obtient (bénéfices concrets) */
      benefits: z.array(z.object({ title: z.string(), text: z.string() })).min(3).max(6),
      /** Repères techniques affichés en tableau */
      specs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
      faqs: z.array(faq).min(3),
      relatedCases: z.array(reference('realisations')).default([]),
      relatedSectors: z.array(z.string()).default([]),
      ctaTitle: z.string(),
      ctaText: z.string(),
      /** Pré-sélection du besoin dans le formulaire de devis */
      devisPreset: z.string(),
    }),
});

/** Pages secteur : URL = /secteurs/<slug>/ */
const secteurs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/secteurs' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      navLabel: z.string(),
      metaTitle: z.string().max(65),
      metaDescription: z.string().min(110).max(165),
      eyebrow: z.string(),
      h1: z.string(),
      lead: z.string(),
      heroImage: image(),
      heroAlt: z.string(),
      icon: z.string(),
      cardText: z.string(),
      /** Les enjeux / peurs du secteur, formulés comme le client les vit */
      pains: z.array(z.object({ title: z.string(), text: z.string() })).min(3).max(6),
      /** Réponses K Isolation */
      solutions: z.array(z.object({ title: z.string(), text: z.string(), href: z.string().optional() })).min(3).max(6),
      norms: z.array(z.string()).default([]),
      faqs: z.array(faq).min(3),
      relatedCases: z.array(reference('realisations')).default([]),
      clientsCited: z.array(z.string()).default([]),
      devisPreset: z.string(),
    }),
});

/** Études de cas : URL = /realisations/<slug>/ */
const realisations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/realisations' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      metaTitle: z.string().max(65),
      metaDescription: z.string().min(110).max(165),
      date: z.coerce.date(),
      sector: z.string(),
      service: z.string(),
      location: z.string(),
      /** Chiffres clés (surface, température, délai…) — uniquement des faits fournis */
      keyFacts: z.array(z.object({ label: z.string(), value: z.string() })).min(2).max(6),
      challenge: z.string(),
      cover: image(),
      coverAlt: z.string(),
      gallery: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() })).default([]),
      beforeAfter: z
        .object({ before: image(), after: image(), beforeAlt: z.string(), afterAlt: z.string() })
        .optional(),
      testimonial: z.object({ quote: z.string(), author: z.string(), role: z.string() }).optional(),
      featured: z.boolean().default(false),
      /** true tant que le client n'a pas relu les chiffres/infos */
      toValidate: z.boolean().default(true),
    }),
});

/** Articles de conseil : URL = /blog/<slug>/ */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      metaTitle: z.string().max(65).optional(),
      description: z.string().min(110).max(165),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.enum(['Chambres froides', 'Cloisons & panneaux', 'Salles blanches', 'Normes & HACCP', 'Maintenance & SAV', 'Budget & projet']),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      author: z.string().default('Équipe technique K Isolation'),
      readingTime: z.number().optional(),
      /** Service vers lequel l'article oriente (CTA contextuel) */
      ctaService: z.string().optional(),
      faqs: z.array(faq).default([]),
      draft: z.boolean().default(false),
      /** Article généré automatiquement (traçabilité éditoriale) */
      generated: z.boolean().default(false),
    }),
});

/** Pages locales : URL = /zones/<slug>/ */
const zones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zones' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      kind: z.enum(['ville', 'departement', 'region', 'pays']),
      order: z.number().default(100),
      metaTitle: z.string().max(65),
      metaDescription: z.string().min(110).max(165),
      h1: z.string(),
      lead: z.string(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      /** Spécificités locales réelles (tissu économique, MIN, zones logistiques…) */
      localContext: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
      areas: z.array(z.string()).default([]),
      relatedCases: z.array(reference('realisations')).default([]),
      faqs: z.array(faq).default([]),
      parent: z.string().optional(),
    }),
});

export const collections = { services, secteurs, realisations, blog, zones };
