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
	const faqSection = sections.find((section) => /^##\s+Frequently Asked Questions/i.test(section));
	if (!faqSection) return [];

	const content = faqSection.replace(/^##\s+Frequently Asked Questions\s*/i, '');
	const items: FaqItem[] = [];
	const pattern = /\*\*(.+?)\*\*\s*([^*]*)/g;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(content)) !== null) {
		const question = match[1].trim();
		const answer = match[2]
			.replace(/!\[.*?\]\(.*?\)/g, '')
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			.replace(/[#_`]/g, '')
			.replace(/\s+/g, ' ')
			.trim();

		if (question && answer) items.push({ question, answer });
	}

	return items;
}
