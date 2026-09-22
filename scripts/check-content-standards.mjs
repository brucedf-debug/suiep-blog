#!/usr/bin/env node
/**
 * Content quality gate for src/content/blog.
 *
 * Enforced standard for every published post:
 *   1. A heroImage is set in frontmatter and the file it points to exists.
 *   2. The post body has at least MIN_WORDS words.
 *
 * Runs automatically before every build (see package.json "prebuild").
 * Exits non-zero (failing the build) if any published (non-draft) post
 * violates either rule.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIN_WORDS = 800;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { frontmatter: {}, body: raw };
	const [, fmBlock, body] = match;
	const frontmatter = {};
	for (const line of fmBlock.split(/\r?\n/)) {
		const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
		if (!m) continue;
		let [, key, value] = m;
		value = value.trim().replace(/^['"]|['"]$/g, '');
		frontmatter[key] = value;
	}
	return { frontmatter, body };
}

function countWords(body) {
	const text = body
		.replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> keep link text
		.replace(/<[^>]+>/g, ' ') // html/mdx tags
		.replace(/[#>*_`~-]/g, ' ') // markdown punctuation
		.replace(/\s+/g, ' ')
		.trim();
	if (!text) return 0;
	return text.split(' ').length;
}

function resolveHeroImage(frontmatter, fileDir) {
	if (!frontmatter.heroImage) return { present: false, exists: false };
	const cleaned = frontmatter.heroImage.replace(/^['"]|['"]$/g, '');
	const resolved = path.resolve(fileDir, cleaned);
	return { present: true, exists: fs.existsSync(resolved), resolved };
}

function main() {
	if (!fs.existsSync(blogDir)) {
		console.error(`Content standards check: blog directory not found at ${blogDir}`);
		process.exit(1);
	}

	const files = fs.readdirSync(blogDir).filter((f) => /\.(md|mdx)$/.test(f));
	const failures = [];
	const warnings = [];

	for (const file of files) {
		const fullPath = path.join(blogDir, file);
		const raw = fs.readFileSync(fullPath, 'utf-8');
		const { frontmatter, body } = parseFrontmatter(raw);
		const isDraft = frontmatter.draft === 'true';
		const wordCount = countWords(body);
		const image = resolveHeroImage(frontmatter, blogDir);

		const issues = [];
		if (!image.present) issues.push('missing heroImage in frontmatter');
		else if (!image.exists) issues.push(`heroImage file not found: ${frontmatter.heroImage}`);
		if (wordCount < MIN_WORDS) issues.push(`only ${wordCount} words (minimum ${MIN_WORDS})`);

		if (issues.length > 0) {
			const line = `${file}: ${issues.join('; ')}`;
			if (isDraft) warnings.push(`[draft] ${line}`);
			else failures.push(line);
		}
	}

	if (warnings.length > 0) {
		console.warn('\nContent standards — warnings (draft posts, not blocking build):');
		for (const w of warnings) console.warn(`  - ${w}`);
	}

	if (failures.length > 0) {
		console.error(
			`\nContent standards check FAILED for ${failures.length} post(s). ` +
				`Every published post needs a heroImage and at least ${MIN_WORDS} words:\n`,
		);
		for (const f of failures) console.error(`  ✗ ${f}`);
		console.error('\nFix the post(s) above, or set draft: true while it is a work in progress.\n');
		process.exit(1);
	}

	console.log(`Content standards check passed: ${files.length} post(s), all have a heroImage and ${MIN_WORDS}+ words.`);
}

main();
