## Content standards

Every blog post (existing or new) must have:

- A `heroImage` in frontmatter, pointing to an existing image file (required by the `content.config.ts` schema).
- A body of at least 800 words.

This is enforced automatically: `npm run build` runs `scripts/check-content-standards.mjs` as a `prebuild` step and fails the build if any non-draft post violates either rule. If a post is a genuine work in progress, set `draft: true` in its frontmatter to exempt it (this only silences the build gate — draft posts are also excluded from the site by the content collection query in the pages, so nothing half-finished goes live).

When writing a new post, plan for 800+ words from the start (a solid intro, 4-6 sections, and often a closing FAQ) rather than writing short and padding it after — the check will tell you immediately if you're short.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
