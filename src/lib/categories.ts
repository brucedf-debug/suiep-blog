export type CategorySlug =
  | 'gardening'
  | 'diy-projects'
  | 'home-improvement'
  | 'tools-reviews'
  | 'indoor-plants'
  | 'outdoor-living';

export const categories: Record<CategorySlug, { name: string; description: string }> = {
  gardening: {
    name: 'Gardening',
    description: 'Growing guides, plant care tips, and backyard garden projects.',
  },
  'diy-projects': {
    name: 'DIY Projects',
    description: 'Step-by-step weekend builds and creative home projects.',
  },
  'home-improvement': {
    name: 'Home Improvement',
    description: 'Renovation advice, repairs, and upgrades for every room.',
  },
  'tools-reviews': {
    name: 'Tools & Reviews',
    description: 'Honest reviews and buying guides for tools and equipment.',
  },
  'indoor-plants': {
    name: 'Indoor Plants',
    description: 'Houseplant care, styling ideas, and troubleshooting.',
  },
  'outdoor-living': {
    name: 'Outdoor Living',
    description: 'Patios, decks, landscaping, and outdoor entertaining.',
  },
};
