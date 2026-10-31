/**
 * Attribution des demandes de devis : on mémorise la source de la visite
 * (UTM, référent, page d'entrée) pour savoir quel canal apporte des clients.
 * Stocké en sessionStorage (pas de cookie, pas de donnée personnelle).
 */
const KEY = 'ki_attr';

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
  first_seen?: string;
};

export function initAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const p = new URLSearchParams(location.search);
    const data: Attribution = {
      landing_page: location.pathname,
      referrer: document.referrer && !document.referrer.includes(location.host) ? document.referrer : '',
      first_seen: new Date().toISOString(),
    };
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const) {
      const v = p.get(k);
      if (v) data[k] = v.slice(0, 120);
    }
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* navigation privée : on ignore */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
    dataLayer?: unknown[];
  }
}

/** Envoie un évènement de conversion aux outils de mesure configurés. */
export function track(event: string, props: Record<string, string> = {}) {
  try {
    window.plausible?.(event, { props });
    (window.dataLayer = window.dataLayer || []).push({ event, ...props });
  } catch {
    /* noop */
  }
}
