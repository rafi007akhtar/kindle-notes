import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, Alert } from "react-native";

import { useAtom } from "jotai";
import {
  bookTitlesAtom,
  currentlyParsingAtom,
  fileContentsAtom,
} from "./data/fileData";
import FileParser from "./components/FileParser";
// import NotesCreator from "./components/NotesCreator";

import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerResult } from "expo-document-picker";
import NotesViewer from "./components/NotesViewer";
import Loader from "./components/Loader";

function POCViewer() {
  const [fileContents, setFileContents] = useAtom(fileContentsAtom);
  const [bookTitles] = useAtom(bookTitlesAtom);
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
      Alert.alert("Error", err1.toString ? err1.toString() : "Error 1");
      return;
    }

    const [contents, err2] = await getFileContents(
      file as DocumentPickerResult
    );
    if (err2) {
      console.log("err2:", err2);
      Alert.alert("Error", err2.toString ? err2.toString() : "Error 2");
      return;
    }
    setFileContents(contents as string);
  }

  return (
    <View style={styles.container}>
      <View style={styles.btnsContainer}>
        <View>
          <Button title="Select file" onPress={selectFile}></Button>
        </View>
        {!!fileContents && (
          <View style={styles.btnContainer}>
            <FileParser />
          </View>
        )}
        {/* {!!bookTitles?.length && (
          <View style={styles.btnContainer}>
            <NotesCreator />
          </View>
        )} */}
      </View>

      {currentlyParsing && <Loader />}
      {!!bookTitles?.length && <NotesViewer />}

      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return <POCViewer />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 40,
  },
  btnContainer: {
    marginLeft: 10,
  },
  btnsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
});
