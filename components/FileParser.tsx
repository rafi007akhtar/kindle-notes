import { useAtom } from "jotai";
import {
  bookHighlightsAtom,
  bookTitlesAtom,
  currentlyParsingAtom,
  fileContentsAtom,
} from "../data/fileData";
import { Button } from "react-native";
import { appConstants } from "../constants/common.constants";
import { arrayStartsWith, cleanLine } from "../utils/formatting.util";
import { BookHighlights, HighlightTypes } from "../models/common.model";

export default function FileParser() {
  const [fileContents] = useAtom(fileContentsAtom);
  const [_, setBookTitles] = useAtom(bookTitlesAtom);
  const [__, setBookHighlights] = useAtom(bookHighlightsAtom);
  const [___, setCurrentlyParsing] = useAtom(currentlyParsingAtom);

  let bookTitles: string[] = [],
    bookHighlights: BookHighlights = {};

  let higlightBegins = true;
  let highlightType: HighlightTypes = "HIGHLIGHT";
  let currentTitle = "";
  let brandNewHighlight = false; // will be used for new notes

  function parseFile(file: string | undefined) {
    if (!file) {
      // setCurrentlyParsing(false);
      return;
    }
    // console.clear();

    const fileInLines = file.split("\n");
    const numberOfLines = fileInLines.length;

    for (let ind = 0; ind < numberOfLines; ind++) {
      let line = fileInLines[ind];
      line = cleanLine(line);
      if (!line.length || line === "\n") {
        continue;
      }

      if (higlightBegins) {
        currentTitle = line;
        if (!bookTitles.includes(currentTitle)) {
          bookTitles.push(currentTitle);
          bookHighlights[currentTitle] = [];
        }
        higlightBegins = false;
      } else if (arrayStartsWith(appConstants.STARTS_OF_HIGHLIGHT, line)) {
        highlightType = "HIGHLIGHT";
      } else if (arrayStartsWith(appConstants.NOTES, line)) {
        highlightType = "NOTE";
      } else if (line.indexOf(appConstants.END_OF_HIGHLIGHT) === 0) {
        higlightBegins = true;
        brandNewHighlight = true;
      } else if (arrayStartsWith(appConstants.BOOKMARKS, line)) {
        continue;
      } else {
        bookHighlights[currentTitle].push({
          highlightedText: line,
          highlightedType: highlightType,
          brandNewHighlight: brandNewHighlight,
        });
        if (brandNewHighlight) {
          brandNewHighlight = false;
        }
      }
    }
    setBookTitles(bookTitles);
    setBookHighlights(bookHighlights);
    setCurrentlyParsing(false);
    // console.log({ bookTitles, bookHighlights });
  }

  return (
    <>
      <Button
        title="Parse File"
        onPress={() => {
          setCurrentlyParsing(true);
          parseFile(fileContents);
        }}
      />
    </>
  );
}
