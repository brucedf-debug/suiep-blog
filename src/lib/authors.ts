import type { CategorySlug } from './categories';

export type AuthorSlug = 'emily-hart' | 'claire-bennett' | 'nora-ellis';

export interface Author {
  name: string;
  initials: string;
  role: string;
  categories: CategorySlug[];
  bio: string;
  approach: string;
  topics: string[];
  motto: string;
  // Full class strings (not built dynamically) so Tailwind picks them up.
  avatarClass: string;
}

/**
 * Suiep's editorial personas. Each covers two categories and writes in a
 * distinct voice: Emily explains and reassures, Claire organizes and guides,
 * Nora compares and helps readers decide. They are presented on the site as
 * editorial personas, not as real individuals.
 */
export const authors: Record<AuthorSlug, Author> = {
  'emily-hart': {
    name: 'Emily Hart',
    initials: 'EH',
    role: 'Gardening & Indoor Plants',
    categories: ['gardening', 'indoor-plants'],
    bio: "Emily Hart is Suiep's editorial persona for gardening and indoor plants. Her guides make plant care easier to understand, with practical advice on light, watering, soil, and seasonal routines. Her focus is helping readers choose plants that fit their spaces and troubleshoot problems one step at a time.",
    approach:
      'Patient and observant, Emily explains plant care in plain language with concrete examples, and adapts every recommendation to your light, space and routine instead of handing out one-size-fits-all rules.',
    topics: ['Plants for low-light rooms', 'Watering mistakes', 'Small-space vegetable gardens', 'Seasonal plant care'],
    motto: 'Before adding more water, check what the soil is telling you.',
    avatarClass: 'bg-green-700',
  },
  'claire-bennett': {
    name: 'Claire Bennett',
    initials: 'CB',
    role: 'DIY Projects & Home Improvement',
    categories: ['diy-projects', 'home-improvement'],
    bio: "Claire Bennett is Suiep's editorial persona for DIY projects and home improvement. Her articles break down practical upgrades into clear steps, with material lists, budget considerations, and realistic expectations. She focuses on manageable projects and explains when a task calls for professional help.",
    approach:
      'Practical, organized and realistic, Claire starts every project with the expected result, materials, time and effort involved, then walks through the steps without hiding the tricky parts.',
    topics: ['Storage and organization', 'Painting and wall repairs', 'Shelves and simple builds', 'Small home repairs'],
    motto: 'A good project starts with knowing what you can finish.',
    avatarClass: 'bg-amber-700',
  },
  'nora-ellis': {
    name: 'Nora Ellis',
    initials: 'NE',
    role: 'Tools & Outdoor Living',
    categories: ['tools-reviews', 'outdoor-living'],
    bio: "Nora Ellis is Suiep's editorial persona for tools and outdoor living. Her buying guides and planning articles help readers compare features, understand trade-offs, and choose equipment suited to their projects. Her focus is practical value, useful outdoor spaces, and clear distinctions between product specifications and hands-on testing.",
    approach:
      'Analytical and direct, Nora compares options side by side, spells out strengths and limitations, and ties every purchase to the project it serves and how often you will actually use it.',
    topics: ['Beginner tool kits', 'Yard and garden equipment', 'Tool storage', 'Patio, deck and backyard upgrades'],
    motto: 'The right tool is the one that solves your project and fits your budget.',
    avatarClass: 'bg-sky-700',
  },
};

export const authorSlugs = Object.keys(authors) as AuthorSlug[];

const authorByCategory: Record<CategorySlug, AuthorSlug> = {
  gardening: 'emily-hart',
  'indoor-plants': 'emily-hart',
  'diy-projects': 'claire-bennett',
  'home-improvement': 'claire-bennett',
  'tools-reviews': 'nora-ellis',
  'outdoor-living': 'nora-ellis',
};

/** A post's author: the explicit `author` frontmatter field, else the persona for its category. */
export function authorSlugFor(data: { author?: AuthorSlug; category: CategorySlug }): AuthorSlug {
  return data.author ?? authorByCategory[data.category];
}
