import { useAtom } from "jotai";
import { bookHighlightsAtom } from "../data/fileData";
import { FlatList, StyleSheet, View } from "react-native";
import Note from "./Note";
import { List, Text } from "react-native-paper";

function Separator() {
  return (
    <View style={styles.separator}>
      <Text>&nbsp;</Text>
    </View>
  );
}

export default function NotesViewer() {
  const [bookHighlights] = useAtom(bookHighlightsAtom);
  const bookHighlightsJSX = [];
  let ind1 = 0,
    ind2 = 0,
    ind3 = 0,
    ind4 = 0;
  for (let title in bookHighlights) {
    const highlightsInfo = bookHighlights[title];
    const notes = [];
    for (let highlightInfo of highlightsInfo) {
      const n = <Note {...highlightInfo} key={ind1++} />;
      const note = <List.Item title="" description={() => n} />;
      notes.push(note);
    }
    const bookHighlight = (
      <List.Section key={ind2++}>
        {/* <Text>{title}</Text>
        {notes} */}
        <List.Accordion title={title}>{notes}</List.Accordion>
      </List.Section>
    );
    bookHighlight.key = `${ind4++}`;
    bookHighlightsJSX.push(bookHighlight);
    bookHighlightsJSX.push(<Separator key={`sep-${ind3++}`} />);
  }

  let content = (
    <View style={styles.placeholderText}>
      <Text variant="bodyLarge">Notes created will show up here.</Text>
    </View>
  );
  if (bookHighlightsJSX.length) {
    content = (
      <View style={styles.container}>
        <Text variant="headlineMedium">Extracted Notes & Highlights</Text>
        <Text style={styles.subtitle}>
          The following notes, grouped by their containing books, were extracted
          from the Kindle notes file.
        </Text>
        <FlatList
          style={styles.list}
          data={bookHighlightsJSX}
          renderItem={(item) => item.item}
          keyExtractor={(item, ind) => `${ind}`}
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
  subtitle: {
    marginVertical: 10,
  },
  container: {
    // marginLeft: 10,
    // marginRight: 20,
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
});
