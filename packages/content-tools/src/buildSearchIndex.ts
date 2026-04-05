interface DocItem {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  track: 'system' | 'interview';
}

interface SearchIndexItem {
  title: string;
  slug: string;
  summary: string;
  track: 'system' | 'interview';
  keywords: string[];
}

function tokenizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function buildSearchIndexFromDocs(docs: DocItem[]): SearchIndexItem[] {
  return docs.map((doc) => {
    const normalizedTags = doc.tags.map((tag) => tag.toLowerCase().trim()).filter(Boolean);
    const titleKeywords = tokenizeTitle(doc.title);

    return {
      title: doc.title,
      slug: doc.slug,
      summary: doc.summary,
      track: doc.track,
      keywords: [...new Set([...normalizedTags, ...titleKeywords])]
    };
  });
}
