import { z } from 'zod';

export const localeFrontmatterSchema = z.object({
  contentId: z.string().min(1),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  sourceRevision: z.string().min(1),
  translationOf: z.string().min(1).nullable(),
  translationStatus: z.enum(['source', 'in-progress', 'review', 'current', 'stale']),
}).strict();

export const publicationStatusSchema = z.enum(['published', 'draft', 'planned']);

const sharedContentSchema = localeFrontmatterSchema.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  publicationStatus: publicationStatusSchema,
}).strict();

export const bookFrontmatterSchema = sharedContentSchema.extend({
  chapter: z.string().min(1),
  part: z.string().min(1),
  prerequisites: z.array(z.string().min(1)).default([]),
}).strict();

const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}, 'publishedAt must be a real calendar date.');

const essayFields = {
  category: z.enum(['essay', 'field-note', 'post-mortem']),
  relatedBookChapter: z.string().min(1).nullable(),
};

export const essayFrontmatterSchema = z.discriminatedUnion('publicationStatus', [
  sharedContentSchema.extend({
    ...essayFields,
    publicationStatus: z.literal('published'),
    publishedAt: calendarDateSchema,
  }).strict(),
  sharedContentSchema.extend({
    ...essayFields,
    publicationStatus: z.literal('draft'),
    publishedAt: calendarDateSchema.optional(),
  }).strict(),
  sharedContentSchema.extend({
    ...essayFields,
    publicationStatus: z.literal('planned'),
    publishedAt: calendarDateSchema.optional(),
  }).strict(),
]);

export type BookFrontmatter = z.infer<typeof bookFrontmatterSchema>;
export type EssayFrontmatter = z.infer<typeof essayFrontmatterSchema>;
export type PublicationStatus = z.infer<typeof publicationStatusSchema>;
