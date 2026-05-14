import { Pressable, Text } from "react-native";
import { colors, radius } from "@/utils/theme";

type MaterialChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function MaterialChip({ label, selected, onPress }: MaterialChipProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 42,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primarySoft : colors.surface,
        opacity: pressed ? 0.78 : 1
      })}
    >
      <Text
        selectable
        style={{
          color: selected ? colors.primaryDark : colors.text,
          fontWeight: selected ? "800" : "600",
          fontSize: 14
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
