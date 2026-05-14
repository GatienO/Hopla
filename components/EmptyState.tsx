import { Text, View } from "react-native";
import { colors, radius } from "@/utils/theme";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View
      style={{
        padding: 22,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 8,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)"
      }}
    >
      <Text selectable style={{ color: colors.text, fontSize: 19, fontWeight: "900" }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>
        {message}
      </Text>
    </View>
  );
}
