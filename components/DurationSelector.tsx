import { Pressable, Text, View } from "react-native";
import { DURATION_OPTIONS } from "@/types/options";
import { colors, radius } from "@/utils/theme";

type DurationSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {DURATION_OPTIONS.map((duration) => {
        const selected = duration === value;
        return (
          <Pressable
            key={duration}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(duration)}
            style={({ pressed }) => ({
              minWidth: 78,
              minHeight: 48,
              borderRadius: radius.lg,
              borderCurve: "continuous",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: selected ? colors.primary : colors.border,
              backgroundColor: selected ? colors.primarySoft : colors.surface,
              opacity: pressed ? 0.82 : 1
            })}
          >
            <Text
              selectable
              style={{
                color: selected ? colors.primaryDark : colors.text,
                fontWeight: "800",
                fontSize: 15,
                fontVariant: ["tabular-nums"]
              }}
            >
              {duration} min
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
