import {
  articles,
  communityPhotos,
  faqs,
  flightDaySteps,
  packages,
  stories,
} from "@/data/content";
import type { Article, Faq, Package } from "@/data/types";

/**
 * Mock API. Screens should call these functions so a real backend can replace
 * the bodies later without changing the UI.
 */
function load<T>(data: T, ms = 380): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        reject(new Error("You appear to be offline."));
        return;
      }
      resolve(data);
    }, ms);
  });
}

export const api = {
  packages: () => load<Package[]>(packages),
  package: (id: string) => load(packages.find((p) => p.id === id) ?? null),
  faqs: () => load<Faq[]>(faqs, 280),
  stories: () => load(stories, 280),
  flightDay: () => load(flightDaySteps, 280),
  articles: () => load<Article[]>(articles, 240),
  article: (slug: string) => load(articles.find((a) => a.slug === slug) ?? null, 240),
  community: () => load(communityPhotos, 280),
};
