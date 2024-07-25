export type HighlightTypes = "HIGHLIGHT" | "NOTE";

export interface HighlightInfo {
  highlightedText: string;
  highlightedType: HighlightTypes;
  brandNewHighlight: boolean;
}

export type HighlightsInfo = Array<HighlightInfo>;

export interface BookHighlights {
  [key: string]: HighlightsInfo;
}
