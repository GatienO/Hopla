import { Stack } from "expo-router";
import { ReactNode } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import type { ViewStyle } from "react-native";
import { colors } from "@/utils/theme";

type AppScaffoldProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  screenTitle?: string;
  children: ReactNode;
};

const headerGradientStyle = {
  backgroundImage: `linear-gradient(110deg, ${colors.headerStart} 0%, ${colors.headerMiddle} 52%, ${colors.headerEnd} 100%)`
} as unknown as ViewStyle;

export function AppScaffold({ title, subtitle, icon = "🧱", screenTitle, children }: AppScaffoldProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 720 ? 48 : 20;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      <Stack.Screen options={{ title: screenTitle ?? title, headerShown: false }} />

      <View
        style={[
          {
            width: "100%",
            paddingTop: width >= 720 ? 34 : 28,
            paddingBottom: width >= 720 ? 30 : 24,
            paddingHorizontal: horizontalPadding,
            backgroundColor: colors.primaryDark
          },
          headerGradientStyle
        ]}
      >
        <View style={{ width: "100%", maxWidth: 1240, alignSelf: "center", gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.16)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.22)"
              }}
            >
              <Text selectable={false} style={{ fontSize: 22, lineHeight: 28 }}>
                {icon}
              </Text>
            </View>
            <Text selectable style={{ flex: 1, color: colors.surface, fontSize: width >= 720 ? 30 : 24, lineHeight: width >= 720 ? 36 : 30, fontWeight: "900" }}>
              {title}
            </Text>
          </View>

          {subtitle ? (
            <Text selectable style={{ color: "#F3E8FF", fontSize: 14, lineHeight: 20, fontWeight: "700" }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: 1240,
          alignSelf: "center",
          paddingHorizontal: horizontalPadding,
          paddingTop: width >= 720 ? 32 : 22,
          gap: 18
        }}
      >
        {children}
      </View>
    </ScrollView>
  );
}
