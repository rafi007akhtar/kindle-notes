import { useAtom } from "jotai";
import { bookHighlightsAtom } from "../data/fileData";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Note from "./Note";

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
    ind3 = 0;
  for (let title in bookHighlights) {
    const highlightsInfo = bookHighlights[title];
    const notes = [];
    for (let highlightInfo of highlightsInfo) {
      const note = <Note {...highlightInfo} key={ind1++} />;
      notes.push(note);
    }
    const bookHighlight = (
      <View key={ind2++}>
        <Text style={styles.title}>{title}</Text>
        {notes}
      </View>
    );
    bookHighlightsJSX.push(bookHighlight);
    bookHighlightsJSX.push(<Separator key={`sep-${ind3++}`} />);
  }

  return <ScrollView style={styles.container}>{bookHighlightsJSX}</ScrollView>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  container: {
    marginLeft: 10,
    marginRight: 20,
    textAlign: "justify",
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
