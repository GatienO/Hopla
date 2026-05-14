import { Pressable, Text, View } from "react-native";
import { ParentEnergy } from "@/types/activity";
import { ENERGY_OPTIONS } from "@/types/options";
import { colors, radius } from "@/utils/theme";

type EnergySelectorProps = {
  value: ParentEnergy;
  onChange: (value: ParentEnergy) => void;
};

export function EnergySelector({ value, onChange }: EnergySelectorProps) {
  return (
    <View style={{ gap: 10 }}>
      {ENERGY_OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => ({
              minHeight: 62,
              borderRadius: radius.md,
              borderCurve: "continuous",
              padding: 14,
              borderWidth: 1,
              borderColor: selected ? colors.primary : colors.border,
              backgroundColor: selected ? colors.primarySoft : colors.surface,
              opacity: pressed ? 0.82 : 1
            })}
          >
            <Text selectable style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>
              {option.label}
            </Text>
            <Text selectable style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
              {option.helper}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
