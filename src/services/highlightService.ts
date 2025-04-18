
interface Highlight {
  articleId: string;
  lawName: string;
  text: string;
  color: string;
  timestamp: number;
}

const STORAGE_KEY = 'article_highlights';

const saveHighlight = (highlight: Highlight) => {
  const highlights = getHighlights();
  highlights.push(highlight);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
};

const getHighlights = (): Highlight[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getArticleHighlights = (articleId: string, lawName: string): Highlight[] => {
  return getHighlights().filter(h => h.articleId === articleId && h.lawName === lawName);
};

export const highlightService = {
  saveHighlight,
  getHighlights,
  getArticleHighlights
};
