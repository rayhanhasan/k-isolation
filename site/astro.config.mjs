// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Pages exclues du sitemap (utilitaires, non destinées au référencement)
const NOINDEX = ['/merci/', '/404/'];

export default defineConfig({
  site: 'https://k-isolation.fr',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)),
      changefreq: 'weekly',
      i18n: undefined,
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
