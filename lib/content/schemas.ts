import { z } from 'zod';

export const localeFrontmatterSchema = z.object({
  contentId: z.string().min(1),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  sourceRevision: z.string().min(1),
  translationOf: z.string().min(1).nullable(),
  translationStatus: z.enum(['source', 'draft', 'review', 'current', 'stale']),
});

export const publicationStatusSchema = z.enum(['published', 'draft', 'planned']);

const sharedContentSchema = localeFrontmatterSchema.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  publicationStatus: publicationStatusSchema,
});

export const bookFrontmatterSchema = sharedContentSchema.extend({
  chapter: z.string().min(1),
  part: z.string().min(1),
  prerequisites: z.array(z.string().min(1)).default([]),
});

export const blogFrontmatterSchema = sharedContentSchema.extend({
  category: z.enum(['essay', 'field-note', 'post-mortem']),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  relatedBookChapter: z.string().min(1).nullable(),
});

export type BookFrontmatter = z.infer<typeof bookFrontmatterSchema>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
export type PublicationStatus = z.infer<typeof publicationStatusSchema>;
