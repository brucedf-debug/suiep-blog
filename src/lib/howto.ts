export interface HowToStep {
  name: string;
  text: string;
}

/**
 * Pulls "## Step N: ..." sections out of a post's raw markdown body so they
 * can be surfaced as schema.org HowTo steps for rich results.
 */
export function extractHowToSteps(body?: string): HowToStep[] {
  if (!body) return [];

  const sections = body.split(/\n(?=##\s)/g);
  const steps: HowToStep[] = [];

  for (const section of sections) {
    const headingMatch = section.match(/^##\s+Step\s+\d+:?\s*(.+)/i);
    if (!headingMatch) continue;

    const name = headingMatch[1].trim();
    const text = section
      .slice(headingMatch[0].length)
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);

    if (text) steps.push({ name, text });
  }

  return steps;
}
