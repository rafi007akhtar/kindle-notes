export function arrayStartsWith(elems: Array<string>, line: string) {
  for (let elem of elems) {
    if (line.startsWith(elem)) {
      return true;
    }
  }
  return false;
}

export function cleanLine(line: string) {
  line = line.trim().replaceAll("\ufeff", "");
  line = line
    .replaceAll("\u2019", "\u0027")
    .replaceAll("\u201C", "\u0022")
    .replaceAll("\u201D", "\u0022")
    .replaceAll("\u2014", "--");
  return line;
}

export function remedyFilename(currentFilename: string) {
  const REPLACEMENT_CHARS: any = {
    "<": "",
    ">": "",
    ":": " - ",
    '"': "'",
    "/": "-",
    "\\": "",
    "?": "",
    "*": "",
  };
  for (let char in REPLACEMENT_CHARS) {
    currentFilename = currentFilename.replaceAll(char, REPLACEMENT_CHARS[char]);
  }
  return currentFilename;
}
