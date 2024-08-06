import { useAtom } from "jotai";
import { bookHighlightsAtom } from "../data/fileData";
import { FlatList, StyleSheet, View } from "react-native";
import Note from "./Note";
import { FAB, List, Text, TextInput } from "react-native-paper";
import { useEffect, useRef, useState } from "react";

function Separator() {
  return (
    <View style={styles.separator}>
      <Text>&nbsp;</Text>
    </View>
  );
}

export default function NotesViewer() {
  const [bookHighlights, setBookHighlights] = useAtom(bookHighlightsAtom);
  const [bookHighlightsJSX, setBookHighlightsJSX] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<any>(null);
  const [fabIcon, setFabIcon] = useState<"magnify" | "check">("magnify");
  const [showFab, setShowFab] = useState(true);

  let ind1 = 0,
    ind2 = 0,
    ind3 = 0,
    ind4 = 0;

  useEffect(() => {
    setBookHighlightsJSX([]);
    for (let title in bookHighlights) {
      const highlightsInfo = bookHighlights[title];
      const notes = [];
      for (let highlightInfo of highlightsInfo) {
        if (
          !searchText.length ||
          highlightInfo.highlightedText
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          const n = <Note {...highlightInfo} />;
          const note = (
            <List.Item title="" description={() => n} key={ind1++} />
          );
          notes.push(note);
        }
      }
      const bookHighlight = (
        <List.Section key={ind2++}>
          <List.Accordion title={title}>{notes}</List.Accordion>
        </List.Section>
      );
      bookHighlight.key = `${ind4++}`;
      setBookHighlightsJSX((curr) => [
        ...curr,
        bookHighlight,
        <Separator key={`sep-${ind3++}`} />,
      ]);
    }
  }, [bookHighlights, searchText]);

  function fabToggle() {
    setShowSearch((curr) => !curr);
    if (showSearch) {
      setFabIcon("magnify");
      const interval = setInterval(() => {
        searchRef.current?.forceFocus();
        if (searchRef.current?.isFocused()) {
          clearInterval(interval);
        }
      }, 500);
    } else {
      setFabIcon("check");
    }
  }

  let content = (
    <View style={styles.placeholderText}>
      <Text variant="bodyLarge">Notes created will show up here.</Text>
    </View>
  );

  if (bookHighlightsJSX.length) {
    content = (
      <View style={styles.container}>
        {showFab && (
          <FAB
            icon={fabIcon}
            onPress={fabToggle}
            size="medium"
            variant="secondary"
            style={styles.fab}
          />
        )}
        <Text variant="headlineMedium">Extracted Notes & Highlights</Text>
        <Text style={styles.subtitle}>
          The following notes, grouped by their containing books, were extracted
          from the Kindle notes file.
        </Text>
        {showSearch && (
          <TextInput
            label="Search"
            value={searchText}
            style={styles.search}
            onChangeText={(text) => setSearchText(text)}
            ref={searchRef}
            right={
              <TextInput.Icon
                icon="backspace"
                onPress={() => setSearchText("")}
              />
            }
          />
        )}
        <FlatList
          style={styles.list}
          data={bookHighlightsJSX}
          renderItem={(item) => item.item}
          keyExtractor={(item, ind) => `${ind}`}
          showsVerticalScrollIndicator={true}
          onScrollBeginDrag={() => {
            setShowFab(true);
          }}
          onEndReached={() => {
            setShowFab(false);
          }}
        />
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  placeholderText: {
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
  list: {
    marginBottom: 80,
  },
  badge: {
    paddingLeft: 10,
  },
  subtitle: {
    marginVertical: 10,
  },
  container: {
    margin: 16,
    marginTop: 50,
  },
  separator: {
    borderColor: "black",
    borderWidth: 0.5,
    borderStyle: "solid",
    width: "100%",
    height: 0.5,
    marginVertical: 10,
  },
  search: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    width: "100%",
  },
  fab: {
    position: "absolute",
    borderRadius: 50,
    margin: 16,
    right: 0,
    zIndex: 1,
    top: "72%",
  },
});
