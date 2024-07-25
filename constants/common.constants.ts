export const appConstants = {
  NOTES: ["- Your Note at location ", "- Your Note on page "],
  BOOKMARKS: ["- Your Bookmark at location ", "- Your Bookmark on page "],
  STARTS_OF_HIGHLIGHT: [
    "- Your Highlight at location ",
    "- Your Highlight on page ",
  ],
  END_OF_HIGHLIGHT: "==========",
  HIGHLIGHT_HEADER: "## Highlight #",
  SKIPPABLE_PHRASES: [] as Array<string>,
};

appConstants.SKIPPABLE_PHRASES = [
  ...appConstants.BOOKMARKS,
  ...appConstants.STARTS_OF_HIGHLIGHT,
];

Object.freeze(appConstants);
