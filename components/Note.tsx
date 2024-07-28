import { StyleSheet, Text, View } from "react-native";
import { HighlightInfo } from "../models/common.model";

export default function Note(highlightInfo: HighlightInfo) {
  const { highlightedText, highlightedType } = highlightInfo;
  const preSpace = highlightedType === "NOTE" ? "\t" : "";
  const bullet = highlightedType === "NOTE" ? "○" : "";

  return (
    <View style={styles.noteContainer}>
      <Text>{preSpace}</Text>
      <Text>{bullet} </Text>
      <Text selectable={true} style={styles.text}>
        {highlightedText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    flexDirection: "row",
    textAlign: "justify",
    marginVertical: -16,
  },
  text: {
    textAlign: "justify",
    overflow: "visible",
  },
});
