import { Pressable, Text } from "react-native";
import { colors, radius } from "@/utils/theme";

type FilterChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 36,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primarySoft : colors.surface,
        opacity: pressed ? 0.78 : 1
      })}
    >
      <Text selectable style={{ color: selected ? colors.primaryDark : colors.text, fontSize: 13, fontWeight: "800" }}>
        {label}
      </Text>
    </Pressable>
  );
}
