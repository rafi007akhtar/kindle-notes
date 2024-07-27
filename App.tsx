import { StyleSheet } from "react-native";

// import NotesCreator from "./components/NotesCreator";

import NotesViewer from "./components/NotesViewer";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
  BottomNavigation,
} from "react-native-paper";
import { useEffect, useState } from "react";
import SetupRoute from "./screens/SetupRoute";
import { BaseRoute } from "react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigation";
import { StatusBar } from "expo-status-bar";
import { closeDB, initDB, schema } from "./utils/db.util";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { useAtom } from "jotai";
import { bookHighlightsAtom, fileContentsAtom } from "./data/fileData";
import { convertHighlightsArrayToObject } from "./utils/highlights.util";
import { NormalizedHighlights } from "./models/common.model";

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<BaseRoute[]>([
    { key: "setup", title: "Setup", focusedIcon: "tune" },
    { key: "viewNotes", title: "View Notes", focusedIcon: "note-multiple" },
  ]);
  const [fileContents, setFileContents] = useAtom(fileContentsAtom);
  const [_, setBookHighlights] = useAtom(bookHighlightsAtom);

  useEffect(() => {
    (async () => {
      const [drizzleDB, err] = await initDB();
      if (err) {
        console.error("Error in getting table:", err);
        return;
      }
      console.log("no err in getting db");

      const fileContentsTable = await (
        drizzleDB as ExpoSQLiteDatabase<Record<string, never>>
      )
        .select()
        .from(schema.clippingsFile);
      console.log("should have gotten file contents");
      console.log({ fileContentsTable });
      if (fileContentsTable?.length) {
        const fileContentsFromDB = fileContentsTable[0].fileContents || "";
        console.log({ fileContentsFromDB });
        if (fileContentsFromDB) {
          setFileContents(fileContentsFromDB);
        }
        // console.log({ fileContents });
      }

      const bookHighlightsTable = await (
        drizzleDB as ExpoSQLiteDatabase<Record<string, never>>
      )
        .select()
        .from(schema.bookHighlights);
      console.log({ bookHighlightsTable });
      if (bookHighlightsTable?.length) {
        const bookHighlights = convertHighlightsArrayToObject(
          bookHighlightsTable as NormalizedHighlights
        );
        if (bookHighlights) {
          setBookHighlights(bookHighlights);
        }
      }
    })();

    return () => {
      closeDB();
    };
  }, []);

  const renderScene = BottomNavigation.SceneMap({
    setup: SetupRoute,
    viewNotes: NotesViewer,
  });

  return (
    <>
      <StatusBar style="dark" />
      <PaperProvider theme={DefaultTheme}>
        <BottomNavigation
          renderScene={renderScene}
          onIndexChange={setIndex}
          navigationState={{ index, routes }}
        />
      </PaperProvider>
    </>
  );
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
