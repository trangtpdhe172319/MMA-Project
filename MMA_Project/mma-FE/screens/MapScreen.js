import React from "react";
import { SafeAreaView } from "react-native";
import MapComponent from "../components/MapComponent";

export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapComponent />
    </SafeAreaView>
  );
}
