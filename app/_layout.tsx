import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/utils/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "900" },
          contentStyle: { backgroundColor: colors.background }
        }}
      />
    </>
  );
}
