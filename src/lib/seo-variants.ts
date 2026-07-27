// ──────────────────────────────────────────────────────────
// Programmatic SEO variant registry
// Each variant targets a specific long-tail search query with
// unique title, meta description, content, and FAQ.
// ──────────────────────────────────────────────────────────

export interface SEOSection {
  heading: string
  body: string
}

export interface SEOVariant {
  /** URL segment, e.g. "javascript" */
  slug: string
  /** Parent tool slug, e.g. "code-formatter" */
  toolSlug: string
  /** Canonical tool name for display */
  toolName: string
  meta: { title: string; description: string }
  h1: string
  intro: string
  sections: SEOSection[]
  faq: Array<{ question: string; answer: string }>
  /** Slugs of related tools to link to */
  relatedToolSlugs?: string[]
}

export const SEO_VARIANTS: SEOVariant[] = []
