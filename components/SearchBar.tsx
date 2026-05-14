import { TextInput, View } from "react-native";
import { colors, radius } from "@/utils/theme";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder = "Chercher une activite, un materiel" }: SearchBarProps) {
  return (
    <View
      style={{
        minHeight: 48,
        borderRadius: radius.md,
        borderCurve: "continuous",
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0)",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 18px 36px rgba(15, 23, 42, 0.14)"
      }}
    >
      <SearchIcon />
      <TextInput
        accessibilityLabel="Recherche"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        style={{
          flex: 1,
          color: colors.text,
          fontSize: 14,
          fontWeight: "500",
          minWidth: 0
        }}
      />
    </View>
  );
}

function SearchIcon() {
  return (
    <View style={{ width: 18, height: 18 }}>
      <View
        style={{
          width: 11,
          height: 11,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: "#94A3B8",
          position: "absolute",
          top: 1,
          left: 1
        }}
      />
      <View
        style={{
          width: 8,
          height: 2,
          borderRadius: 999,
          backgroundColor: "#94A3B8",
          position: "absolute",
          right: 0,
          bottom: 2,
          transform: [{ rotate: "45deg" }]
        }}
      />
    </View>
  );
}
