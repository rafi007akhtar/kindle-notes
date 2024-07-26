import { DocumentPickerResult } from "expo-document-picker";
import { useAtom } from "jotai";
import { Alert, GestureResponderEvent, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import {
  fileContentsAtom,
  bookTitlesAtom,
  currentlyParsingAtom,
  bookHighlightsAtom,
} from "../data/fileData";

import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import FileParser from "../components/FileParser";

function UploadCard(props: {
  onPress: ((e: GestureResponderEvent) => void) | undefined;
}) {
  return (
    <Card>
      <Card.Title title="Upload Clippings.txt" titleVariant="titleLarge" />
      <Card.Content>
        <Text>
          At first, you would want to upload the text file that houses all your
          notes and highlights on your Kindle. That file is called
          "Clippings.txt".
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={props.onPress} icon="upload">
          Upload
        </Button>
      </Card.Actions>
    </Card>
  );
}

function DoneCard(props: {
  onPress: ((e: GestureResponderEvent) => void) | undefined;
}) {
  return (
    <Card>
      <Card.Title title="Done!" titleVariant="titleLarge" />
      <Card.Content>
        <Text>
          Your notes are extracted and created. Go to the "View Notes" tab below
          to view your notes. If something went wrong, you may come back here
          and reset everything.
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={props.onPress} icon="delete-sweep">
          Reset
        </Button>
      </Card.Actions>
    </Card>
  );
}

export default function SetupRoute() {
  const [fileContents, setFileContents] = useAtom(fileContentsAtom);
  const [bookTitles, setBookTitles] = useAtom(bookTitlesAtom);
  const [_, setBookHighlights] = useAtom(bookHighlightsAtom);
  const [currentlyParsing] = useAtom(currentlyParsingAtom);

  async function getFileDetails() {
    let file: DocumentPickerResult | undefined, err;
    try {
      file = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "text/*",
      });
    } catch (e) {
      err = e;
    }
    return [file, err];
  }

  async function getFileContents(file: DocumentPickerResult) {
    let fileContents, err;
    if (!file) {
      err = "Error: invalid file.";
      return [fileContents, err];
    }

    try {
      const fileUri = file?.assets ? file.assets[0].uri : "";
      fileContents = await FileSystem.readAsStringAsync(fileUri);
    } catch (e) {
      err = e;
    }

    return [fileContents, err];
  }

  async function selectFile() {
    const [file, err1] = await getFileDetails();
    if (err1) {
      console.log("err1:", err1);
      Alert.alert(
        "Error",
        "File was not uploaded correctly. Please try again."
      );
      return;
    }

    const [contents, err2] = await getFileContents(
      file as DocumentPickerResult
    );
    if (err2) {
      console.log("err2:", err2);
      Alert.alert(
        "Error",
        "File was not uploaded correctly. Please try again."
      );
      return;
    }
    setFileContents(contents as string);
  }

  function resetData() {
    setFileContents("");
    setBookTitles([]);
    setBookHighlights({});
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.header}>
        Welcome to Kindle Notes.
      </Text>

      <View style={styles.cardsContainer}>
        <UploadCard onPress={selectFile} />
        {!!fileContents && <FileParser />}
        {!!bookTitles?.length && <DoneCard onPress={resetData} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 60,
  },
  header: {
    textAlign: "center",
    width: "100%",
  },
  cardsContainer: {
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
    gap: 50,
  },
});
