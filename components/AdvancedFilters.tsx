import { Text, View } from "react-native";
import type { ReactNode } from "react";
import { FilterChip } from "@/components/FilterChip";
import { ActivityFilters } from "@/types/activity";
import { AGE_RANGES, DURATION_OPTIONS } from "@/types/options";
import { colors } from "@/utils/theme";

type AdvancedFiltersProps = {
  filters: ActivityFilters;
  onChange: (filters: Partial<ActivityFilters>) => void;
};

type CascadeFilter = {
  key: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  const cascadeFilters = getCascadeFilters(filters, onChange);

  return (
    <View style={{ gap: 14 }}>
      <FilterSection
        title={filters.need ? "Affiner ce moment" : "Ensuite"}
        helper={filters.need ? "Options utiles ici" : "Choisis un moment au-dessus"}
      >
        {cascadeFilters.length > 0 ? (
          cascadeFilters.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              selected={filter.selected}
              onPress={filter.onPress}
            />
          ))
        ) : (
          <Text selectable style={{ color: colors.muted, fontSize: 13, fontWeight: "800", lineHeight: 18 }}>
            Les affinages apparaissent selon le contexte choisi.
          </Text>
        )}
      </FilterSection>

      <FilterSection title="Base" helper="optionnel" divided>
        {AGE_RANGES.map((range) => {
          const selected = filters.ageRange === range.id;
          return (
            <FilterChip
              key={range.id}
              label={range.label}
              selected={selected}
              onPress={() => onChange({ ageRange: selected ? undefined : range.id })}
            />
          );
        })}
        {DURATION_OPTIONS.map((duration) => {
          const selected = filters.duration === duration;
          return (
            <FilterChip
              key={duration}
              label={`${duration} min`}
              selected={selected}
              onPress={() => onChange({ duration: selected ? undefined : duration })}
            />
          );
        })}
        <FilterChip
          label="Favoris"
          selected={Boolean(filters.favoritesOnly)}
          onPress={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
        />
      </FilterSection>
    </View>
  );
}

function getCascadeFilters(filters: ActivityFilters, onChange: (filters: Partial<ActivityFilters>) => void): CascadeFilter[] {
  if (!filters.need) return [];

  const toggleScalar = <K extends keyof ActivityFilters>(key: K, value: ActivityFilters[K]) => {
    const selected = filters[key] === value;
    return {
      selected,
      onPress: () => onChange({ [key]: selected ? undefined : value } as Partial<ActivityFilters>)
    };
  };

  const toggleArray = <K extends "materialGroups" | "parentMood" | "developmentGoalGroups">(key: K, value: NonNullable<ActivityFilters[K]>[number]) => {
    const current = filters[key] ?? [];
    const selected = current.includes(value as never);
    return {
      selected,
      onPress: () =>
        onChange({
          [key]: selected ? current.filter((item) => item !== value) : [...current, value]
        } as Partial<ActivityFilters>)
    };
  };

  if (filters.need === "urgence") {
    const instant = toggleScalar("setupTimeMax", 0);
    const parentKo = toggleScalar("parentEnergy", "ko");
    const zeroRangement = toggleScalar("cleanupTimeMax", 0);
    const sansSurveillance = toggleScalar("requiresSupervision", false);
    return [
      { key: "instant", label: "Sans preparation", ...instant },
      { key: "parent-ko", label: "Parent KO", ...parentKo },
      { key: "zero-rangement", label: "Zero rangement", ...zeroRangement },
      { key: "sans-surveillance", label: "Sans surveillance", ...sansSurveillance }
    ];
  }

  if (filters.need === "calme") {
    const tresCalme = toggleScalar("noiseLevel", "low");
    const autonome = toggleScalar("independenceLevel", "high");
    const sansMateriel = toggleArray("materialGroups", "rien");
    const emotions = toggleArray("developmentGoalGroups", "calme-emotions");
    return [
      { key: "tres-calme", label: "Tres calme", ...tresCalme },
      { key: "autonome", label: "Autonome", ...autonome },
      { key: "sans-materiel", label: "Sans materiel", ...sansMateriel },
      { key: "emotions", label: "Emotions", ...emotions }
    ];
  }

  if (filters.need === "autonomie") {
    const sansSurveillance = toggleScalar("requiresSupervision", false);
    const parentKo = toggleScalar("parentEnergy", "ko");
    const calme = toggleScalar("noiseLevel", "low");
    const sansMateriel = toggleArray("materialGroups", "rien");
    return [
      { key: "sans-surveillance", label: "Sans surveillance", ...sansSurveillance },
      { key: "parent-ko", label: "Parent KO", ...parentKo },
      { key: "calme", label: "Calme", ...calme },
      { key: "sans-materiel", label: "Sans materiel", ...sansMateriel }
    ];
  }

  if (filters.need === "sans-bazar") {
    const rien = toggleArray("materialGroups", "rien");
    const zeroRangement = toggleScalar("cleanupTimeMax", 0);
    const interieur = toggleScalar("weather", "indoor");
    const calme = toggleScalar("noiseLevel", "low");
    return [
      { key: "rien", label: "Sans materiel", ...rien },
      { key: "zero-rangement", label: "Zero rangement", ...zeroRangement },
      { key: "interieur", label: "Interieur", ...interieur },
      { key: "calme", label: "Calme", ...calme }
    ];
  }

  if (filters.need === "defoulement") {
    const dedans = toggleScalar("weather", "indoor");
    const mouvement = toggleArray("materialGroups", "mouvement");
    const bouger = toggleArray("developmentGoalGroups", "bouger");
    const bruitOk = toggleScalar("noiseLevelMin", "medium");
    return [
      { key: "dedans", label: "Dedans", ...dedans },
      { key: "mouvement", label: "Coussins / chaussettes", ...mouvement },
      { key: "bouger", label: "Objectif bouger", ...bouger },
      { key: "bruit-ok", label: "Bruit OK", ...bruitOk }
    ];
  }

  if (filters.need === "pluie") {
    const calme = toggleScalar("noiseLevel", "low");
    const doudous = toggleArray("materialGroups", "doudous");
    const construction = toggleArray("materialGroups", "construction");
    const imaginer = toggleArray("developmentGoalGroups", "imaginer");
    return [
      { key: "calme", label: "Calme", ...calme },
      { key: "doudous", label: "Doudous", ...doudous },
      { key: "construction", label: "Construction", ...construction },
      { key: "imaginer", label: "Imaginer", ...imaginer }
    ];
  }

  const plusSalissant = toggleScalar("messLevelMin", "medium");
  const eauCuisine = toggleArray("materialGroups", "cuisine");
  const bouger = toggleScalar("noiseLevelMin", "medium");
  const dehors = toggleScalar("weather", "outdoor");
  return [
    { key: "plus-salissant", label: "Plus salissant", ...plusSalissant },
    { key: "eau-cuisine", label: "Eau / cuisine", ...eauCuisine },
    { key: "bouger", label: "Ca bouge", ...bouger },
    { key: "dehors", label: "Dehors", ...dehors }
  ];
}

function FilterSection({
  title,
  helper,
  children,
  divided = false
}: {
  title: string;
  helper: string;
  children: ReactNode;
  divided?: boolean;
}) {
  return (
    <View
      style={{
        gap: 8,
        paddingTop: divided ? 12 : 0,
        borderTopWidth: divided ? 1 : 0,
        borderTopColor: colors.border
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <Text selectable style={{ color: colors.text, fontSize: 14, fontWeight: "900" }}>
          {title}
        </Text>
        <Text selectable style={{ color: colors.muted, fontSize: 12, fontWeight: "800", textAlign: "right", flexShrink: 1 }}>
          {helper}
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>
    </View>
  );
}
