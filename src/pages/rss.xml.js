import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { siteName, siteTagline } from '../lib/site';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: siteName,
    description: siteTagline,
    site: context.site,
    items: posts
      .sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
      .map((post) => ({
        ...post.data,
        link: `/blog/${post.id}/`,
      })),
  });
}
