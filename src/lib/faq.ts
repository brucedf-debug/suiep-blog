export interface FaqItem {
	question: string;
	answer: string;
}

/**
 * Pulls "**Question?** Answer" pairs out of a post's "## Frequently Asked
 * Questions" section so they can be surfaced as schema.org FAQPage entities
 * for rich results.
 */
export function extractFaqItems(body?: string): FaqItem[] {
	if (!body) return [];

	const sections = body.split(/\n(?=##\s)/g);
	const heading = /^##\s+(Frequently Asked Questions|FAQs?)\s*\n/i;
	const faqSection = sections.find((section) => heading.test(section));
	if (!faqSection) return [];

	const content = faqSection.replace(heading, '');
	const items: FaqItem[] = [];

	// Newer posts use "### Question?" subheadings followed by the answer.
	if (/^###\s/m.test(content)) {
		for (const block of content.split(/\n(?=###\s)/g)) {
			const m = block.match(/^###\s+(.+)\n([\s\S]*)$/);
			if (!m) continue;
			const answer = cleanAnswer(m[2]);
			if (m[1].trim() && answer) items.push({ question: m[1].trim(), answer });
		}
		return items;
	}

	const pattern = /\*\*(.+?)\*\*\s*([^*]*)/g;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(content)) !== null) {
		const question = match[1].trim();
		const answer = cleanAnswer(match[2]);

		if (question && answer) items.push({ question, answer });
	}

	return items;
}

function cleanAnswer(text: string): string {
	return text
		.replace(/!\[.*?\]\(.*?\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[#_`*]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}
