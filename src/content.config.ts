import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const screenshotSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const pricingTierSchema = z.object({
  label: z.string(),
  price: z.string(),
  note: z.string().optional(),
});

const appThemeSchema = z.object({
  accent: z.string(),
  surfaceFrom: z.string(),
  surfaceTo: z.string(),
  borderTint: z.string(),
  shadowTint: z.string(),
  badgeBg: z.string(),
  badgeText: z.string(),
  backdropTone: z.string(),
});

const appLocaleSchema = z.object({
  tagline: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  priceBadge: z.string(),
  pricingSummary: z.string(),
  pricingTiers: z.array(pricingTierSchema).min(1),
  requirements: z.array(z.string()).min(1),
  features: z.array(z.string()).min(1),
  privacyHighlights: z.array(z.string()).min(1),
  cardImage: z.string(),
  cardImageAlt: z.string(),
  heroImage: z.string(),
  heroAlt: z.string(),
  screenshots: z.array(screenshotSchema).min(1),
  faqs: z.array(faqItemSchema).min(1),
  mediaCredit: z.string().optional(),
});

const apps = defineCollection({
  loader: glob({ pattern: '**/app.json', base: './src/content/apps' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    order: z.number().int().positive(),
    featured: z.boolean().optional(),
    version: z.string(),
    releaseDate: z.string(),
    storeId: z.string(),
    storeUrl: z.string().url(),
    githubUrl: z.string().url(),
    issuesUrl: z.string().url(),
    supportUrl: z.string().url().optional(),
    sourceModel: z.enum(['open-source', 'closed-source-open-docs']),
    licenseLabel: z.string(),
    networkModel: z.enum(['offline', 'local-first']),
    icon: z.string(),
    theme: appThemeSchema,
    tr: appLocaleSchema,
    en: appLocaleSchema,
  }),
});

const appDocs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: z.object({
    appSlug: z.string().regex(/^[a-z0-9-]+$/),
    docType: z.enum(['privacy', 'support', 'changelog']),
    lang: z.enum(['tr', 'en']),
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
  }),
});

const projectLocaleSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  summary: z.string(),
  highlights: z.array(z.string()).min(1),
  badge: z.string().optional(),
  previewImage: z.string().optional(),
  previewAlt: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    order: z.number().int().positive(),
    category: z.enum(['engineering', 'ai']),
    repoUrl: z.string().url(),
    license: z.string(),
    version: z.string().optional(),
    tags: z.array(z.string()).min(1),
    paper: z
      .object({
        title: z.string(),
        authors: z.string(),
        journal: z.string(),
        year: z.string(),
        volumeIssuePages: z.string(),
        doi: z.string(),
        doiUrl: z.string().url(),
      })
      .optional(),
    tr: projectLocaleSchema,
    en: projectLocaleSchema,
  }),
});

export const collections = {
  apps,
  appDocs,
  projects,
};
