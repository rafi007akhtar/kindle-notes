import { useAtom } from "jotai";
import {
  bookHighlightsAtom,
  bookTitlesAtom,
  currentlyParsingAtom,
  fileContentsAtom,
} from "../data/fileData";
import { appConstants } from "../constants/common.constants";
import { arrayStartsWith, cleanLine } from "../utils/formatting.util";
import { BookHighlights, HighlightTypes } from "../models/common.model";
import { Card, Text, Button } from "react-native-paper";
import { useEffect } from "react";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { kindleNotesDB, schema } from "../utils/db.util";
import { convertHighlightsToArray } from "../utils/highlights.util";

export default function FileParser() {
  const [fileContents] = useAtom(fileContentsAtom);
  const [_, setBookTitles] = useAtom(bookTitlesAtom);
  const [bh, setBookHighlights] = useAtom(bookHighlightsAtom);
  const [___, setCurrentlyParsing] = useAtom(currentlyParsingAtom);

  let bookTitles: string[] = [],
    bookHighlights: BookHighlights = {};

  let higlightBegins = true;
  let highlightType: HighlightTypes = "HIGHLIGHT";
  let currentTitle = "";
  let brandNewHighlight = false; // will be used for new notes

  useEffect(() => {
    (async () => {
      const drizzleDB = drizzle(kindleNotesDB);
      const highlightArray = convertHighlightsToArray(bh);
      // console.log({ highlightArray });
      if (!highlightArray?.length) {
        return;
      }

      try {
        await drizzleDB.delete(schema.bookHighlights);
        const postHighlightInsert = await drizzleDB
          .insert(schema.bookHighlights)
          .values(highlightArray);
        console.log({ postHighlightInsert });
      } catch (e) {
        console.error(
          "An error occured while inserting highlights in the DB:",
          e
        );
      }
    })();
  }, [kindleNotesDB, bh]);

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
      <Card>
        <Card.Title title="Make Notes" titleVariant="titleLarge" />
        <Card.Content>
          <Text>
            File is successfully uploaded! Now click on the below button to
            create notes from your file.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => {
              parseFile(fileContents);
            }}
            icon="note-plus"
          >
            Create Notes
          </Button>
        </Card.Actions>
      </Card>
    </>
  );
}
