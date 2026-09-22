import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum([
        'gardening',
        'diy-projects',
        'home-improvement',
        'tools-reviews',
        'indoor-plants',
        'outdoor-living',
      ]),
      tags: z.array(z.string()).default([]),
      // Every post needs a hero image and 800+ words — enforced here and by
      // scripts/check-content-standards.mjs, which runs before every build.
      heroImage: image(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
