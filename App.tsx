import { StyleSheet } from "react-native";

// import NotesCreator from "./components/NotesCreator";

import NotesViewer from "./components/NotesViewer";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
  BottomNavigation,
} from "react-native-paper";
import { useState } from "react";
import SetupRoute from "./screens/SetupRoute";
import { BaseRoute } from "react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigation";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<BaseRoute[]>([
    { key: "setup", title: "Setup", focusedIcon: "tune" },
    { key: "viewNotes", title: "View Notes", focusedIcon: "note-multiple" },
  ]);

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
