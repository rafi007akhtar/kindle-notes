import { BookHighlights, NormalizedHighlights } from "../models/common.model";

export function convertHighlightsToArray(highlights: BookHighlights) {
  const highlightArray: NormalizedHighlights = [];
  for (let highlight in highlights) {
    const highlightsInfo = highlights[highlight];
    for (let highlightInfo of highlightsInfo) {
      highlightArray.push({ bookTitle: highlight, ...highlightInfo });
    }
  }
  return highlightArray;
}

export function convertHighlightsArrayToObject(
  highlightArray: NormalizedHighlights
) {
  const bookHighlights: BookHighlights = {};
  for (let highlight of highlightArray) {
    const { bookTitle, ...rest } = highlight;
    if (!(bookTitle in bookHighlights)) {
      bookHighlights[bookTitle] = [];
    }
    bookHighlights[bookTitle].push(rest);
  }
  return bookHighlights;
}
