import { useState } from "react";
import { Text } from "react-native";

type StateIndicator = "." | ".." | "...";

export default function Loader() {
  const [showDot, setShowDot] = useState<StateIndicator>(".");
  const nextDots = {
    ".": "..",
    "..": "...",
    "...": ".",
  };
  setTimeout(() => {
    setShowDot((curr: StateIndicator) => nextDots[curr] as StateIndicator);
  }, 1000);

  return <Text>Loading {showDot}</Text>;
}
