import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import type { ViewStyle } from "react-native";
import type {
  ActivityFilters,
  DevelopmentGoalGroup,
  MaterialGroup,
  ParentMood
} from "@/types/activity";
import {
  AGE_RANGES,
  CLEANUP_TIME_OPTIONS,
  DEVELOPMENT_GOAL_GROUP_OPTIONS,
  DURATION_OPTIONS,
  ENERGY_OPTIONS,
  MATERIAL_GROUP_OPTIONS,
  MESS_OPTIONS,
  NOISE_OPTIONS,
  PARENT_MOOD_OPTIONS,
  SEASON_OPTIONS,
  SETUP_TIME_OPTIONS,
  SKILL_OPTIONS,
  SMART_FILTER_OPTIONS,
  WEATHER_OPTIONS
} from "@/types/options";
import { colors, radius } from "@/utils/theme";

const headerGradientStyle = {
  backgroundImage: `linear-gradient(110deg, ${colors.headerStart} 0%, ${colors.headerMiddle} 52%, ${colors.headerEnd} 100%)`
} as unknown as ViewStyle;

type FilterBarProps = {
  filters: ActivityFilters;
  resultCount: number;
  onChange: (filters: Partial<ActivityFilters>) => void;
  onReset: () => void;
};

type CategoryId =
  | "suggested"
  | "moment"
  | "age"
  | "time"
  | "materials"
  | "parent"
  | "weather"
  | "mess"
  | "autonomy"
  | "development";

type FilterCategory = {
  id: CategoryId;
  label: string;
  count: number;
};

export function FilterBar({ filters, resultCount, onChange, onReset }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("suggested");
  const { width, height } = useWindowDimensions();

  const activeFilterCount = getActiveFilterCount(filters);
  const categories = useMemo(() => getFilterCategories(filters), [filters]);
  const currentCategory = categories.find((category) => category.id === selectedCategory) ?? categories[0];
  const isWide = width >= 760;

  return (
    <View
      style={{
        borderRadius: radius.md,
        borderCurve: "continuous",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.headerPanel,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.22)"
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <TrendIcon />
            <Text
              selectable
              style={{ color: colors.surface, fontSize: 14, fontWeight: "900", fontVariant: ["tabular-nums"] }}
            >
              {resultCount} idées
            </Text>
          </View>
          {activeFilterCount > 0 ? (
            <View
              style={{
                minHeight: 30,
                borderRadius: 10,
                paddingHorizontal: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: colors.emerald
              }}
            >
              <Text selectable={false} style={{ color: colors.surface, fontSize: 13, lineHeight: 16, fontWeight: "900" }}>
                ✓
              </Text>
              <Text selectable style={{ color: colors.surface, fontSize: 13, fontWeight: "900" }}>
                {activeFilterCount} filtre{activeFilterCount > 1 ? "s" : ""}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <ToolbarButton label="Effacer" onPress={onReset} tone="ghost" />
          <ToolbarButton
            label="Filtrer"
            selected={expanded}
            icon={<FilterIcon />}
            onPress={() => setExpanded(true)}
          />
        </View>
      </View>

      <Modal
        visible={expanded}
        transparent
        animationType="slide"
        onRequestClose={() => setExpanded(false)}
        statusBarTranslucent
      >
        <View
          style={{
            flex: 1,
            justifyContent: isWide ? "center" : "flex-end",
            backgroundColor: isWide ? "rgba(15, 23, 42, 0.48)" : colors.background
          }}
        >
          {isWide ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer les filtres"
              onPress={() => setExpanded(false)}
              style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            />
          ) : null}

          <View
            style={{
              alignSelf: "center",
              width: "100%",
              maxWidth: isWide ? 940 : undefined,
              height: isWide ? Math.min(height - 72, 780) : "100%",
              borderRadius: isWide ? 24 : 0,
              borderCurve: "continuous",
              overflow: "hidden",
              backgroundColor: colors.background,
              boxShadow: isWide ? "0 24px 64px rgba(15, 23, 42, 0.28)" : undefined
            }}
          >
            <View
              style={[
                {
                  minHeight: 82,
                  paddingHorizontal: isWide ? 28 : 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                  backgroundColor: colors.primaryDark
                },
                headerGradientStyle
              ]}
            >
              <Text selectable style={{ color: colors.surface, fontSize: 26, lineHeight: 32, fontWeight: "900" }}>
                Filtres
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fermer les filtres"
                onPress={() => setExpanded(false)}
                style={({ pressed }) => ({
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.16)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.24)",
                  opacity: pressed ? 0.6 : 1
                })}
              >
                <Text selectable={false} style={{ color: colors.surface, fontSize: 34, lineHeight: 38, fontWeight: "700" }}>
                  ×
                </Text>
              </Pressable>
            </View>

            <View style={{ flex: 1, flexDirection: "row", minHeight: 0 }}>
              <View
                style={{
                  width: isWide ? 278 : 132,
                  flexGrow: 0,
                  flexShrink: 0,
                  backgroundColor: colors.primarySoft,
                  borderRightWidth: 1,
                  borderRightColor: colors.border
                }}
              >
                {categories.map((category) => (
                  <CategoryTab
                    key={category.id}
                    category={category}
                    selected={category.id === currentCategory.id}
                    onPress={() => setSelectedCategory(category.id)}
                  />
                ))}
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <ScrollView
                  contentInsetAdjustmentBehavior="automatic"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: isWide ? 30 : 20,
                    paddingTop: isWide ? 34 : 28,
                    paddingBottom: 108,
                    gap: 18
                  }}
                >
                  <Text selectable style={{ color: colors.text, fontSize: isWide ? 27 : 23, lineHeight: isWide ? 34 : 29, fontWeight: "900" }}>
                    {currentCategory.label}
                  </Text>
                  {renderCategoryContent(currentCategory.id, filters, onChange)}
                </ScrollView>
              </View>
            </View>

            <View
              style={{
                minHeight: 84,
                paddingHorizontal: isWide ? 28 : 18,
                paddingVertical: 14,
                alignItems: "flex-end",
                justifyContent: "center",
                borderTopWidth: 1,
                borderTopColor: colors.border,
                backgroundColor: colors.surface,
                boxShadow: "0 -10px 24px rgba(15, 23, 42, 0.06)"
              }}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => setExpanded(false)}
                style={({ pressed }) => ({
                  minHeight: 52,
                  width: isWide ? 340 : "100%",
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primary,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  boxShadow: "0 10px 22px rgba(124, 58, 237, 0.2)",
                  opacity: pressed ? 0.78 : 1
                })}
              >
                <Text selectable={false} style={{ color: colors.surface, fontSize: 18, fontWeight: "900", fontVariant: ["tabular-nums"] }}>
                  Afficher {resultCount} résultat{resultCount > 1 ? "s" : ""}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function renderCategoryContent(
  categoryId: CategoryId,
  filters: ActivityFilters,
  onChange: (filters: Partial<ActivityFilters>) => void
) {
  const toggleScalar = <K extends keyof ActivityFilters>(key: K, value: ActivityFilters[K]) => {
    const selected = filters[key] === value;
    onChange({ [key]: selected ? undefined : value } as Partial<ActivityFilters>);
  };

  const toggleArray = <K extends "materialGroups" | "parentMood" | "developmentGoalGroups" | "skills">(
    key: K,
    value: NonNullable<ActivityFilters[K]>[number]
  ) => {
    const current = filters[key] ?? [];
    const selected = current.includes(value as never);
    onChange({
      [key]: selected ? current.filter((item) => item !== value) : [...current, value]
    } as Partial<ActivityFilters>);
  };

  if (categoryId === "suggested") {
    return (
      <FilterContentGroup>
        <PillGrid>
          <SelectionPill
            label="Sans préparation"
            selected={filters.setupTimeMax === 0}
            onPress={() => toggleScalar("setupTimeMax", 0)}
          />
          <SelectionPill
            label="Parent KO"
            selected={filters.parentEnergy === "ko"}
            onPress={() => toggleScalar("parentEnergy", "ko")}
          />
          <SelectionPill
            label="Autonome"
            selected={filters.independenceLevel === "high"}
            onPress={() => toggleScalar("independenceLevel", "high")}
          />
          <SelectionPill
            label="Sans surveillance"
            selected={filters.requiresSupervision === false}
            onPress={() => toggleScalar("requiresSupervision", false)}
          />
          <SelectionPill
            label="Sans écran"
            selected={Boolean(filters.screenFree)}
            onPress={() => onChange({ screenFree: filters.screenFree ? undefined : true })}
          />
          <SelectionPill
            label="Favoris"
            selected={Boolean(filters.favoritesOnly)}
            onPress={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
          />
        </PillGrid>
      </FilterContentGroup>
    );
  }

  if (categoryId === "moment") {
    return (
      <FilterContentGroup helper="Choisis le contexte principal, puis affine avec les autres catégories.">
        <PillGrid>
          {SMART_FILTER_OPTIONS.map((option) => (
            <SelectionPill
              key={option.id}
              label={option.label}
              helper={option.helper}
              selected={filters.need === option.id}
              onPress={() => onChange(getNeedChange(filters, option.id))}
            />
          ))}
        </PillGrid>
      </FilterContentGroup>
    );
  }

  if (categoryId === "age") {
    return (
      <FilterContentGroup helper="Les activités restent visibles si elles croisent la tranche choisie.">
        <PillGrid>
          {AGE_RANGES.map((range) => (
            <SelectionPill
              key={range.id}
              label={range.label}
              selected={filters.ageRange === range.id}
              onPress={() => toggleScalar("ageRange", range.id)}
            />
          ))}
        </PillGrid>
      </FilterContentGroup>
    );
  }

  if (categoryId === "time") {
    return (
      <>
        <FilterContentGroup title="Durée">
          <PillGrid>
            {DURATION_OPTIONS.map((duration) => (
              <SelectionPill
                key={duration}
                label={`${duration} min max`}
                selected={filters.duration === duration}
                onPress={() => toggleScalar("duration", duration)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
        <FilterContentGroup title="Préparation">
          <PillGrid>
            {SETUP_TIME_OPTIONS.map((option) => (
              <SelectionPill
                key={option.value}
                label={option.label}
                selected={filters.setupTimeMax === option.value}
                onPress={() => toggleScalar("setupTimeMax", option.value)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
        <FilterContentGroup title="Rangement">
          <PillGrid>
            {CLEANUP_TIME_OPTIONS.map((option) => (
              <SelectionPill
                key={option.value}
                label={option.label}
                selected={filters.cleanupTimeMax === option.value}
                onPress={() => toggleScalar("cleanupTimeMax", option.value)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
      </>
    );
  }

  if (categoryId === "materials") {
    return (
      <FilterContentGroup helper="Tu peux sélectionner plusieurs familles.">
        <PillGrid>
          {MATERIAL_GROUP_OPTIONS.map((option) => (
            <SelectionPill
              key={option.id}
              label={option.label}
              selected={(filters.materialGroups ?? []).includes(option.id)}
              onPress={() => toggleArray("materialGroups", option.id as MaterialGroup)}
            />
          ))}
        </PillGrid>
      </FilterContentGroup>
    );
  }

  if (categoryId === "parent") {
    return (
      <>
        <FilterContentGroup title="Énergie">
          <PillGrid>
            {ENERGY_OPTIONS.map((option) => (
              <SelectionPill
                key={option.id}
                label={option.label}
                helper={option.helper}
                selected={filters.parentEnergy === option.id}
                onPress={() => toggleScalar("parentEnergy", option.id)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
        <FilterContentGroup title="Humeur">
          <PillGrid>
            {PARENT_MOOD_OPTIONS.map((option) => (
              <SelectionPill
                key={option.id}
                label={option.label}
                selected={(filters.parentMood ?? []).includes(option.id)}
                onPress={() => toggleArray("parentMood", option.id as ParentMood)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
      </>
    );
  }

  if (categoryId === "weather") {
    return (
      <>
        <FilterContentGroup title="Lieu et météo">
          <PillGrid>
            {WEATHER_OPTIONS.map((option) => (
              <SelectionPill
                key={option.id}
                label={option.label}
                selected={(filters.weather ?? "any") === option.id}
                onPress={() => onChange({ weather: option.id })}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
        <FilterContentGroup title="Saison">
          <PillGrid>
            {SEASON_OPTIONS.map((option) => (
              <SelectionPill
                key={option.id}
                label={option.label}
                selected={filters.season === option.id}
                onPress={() => toggleScalar("season", option.id)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
      </>
    );
  }

  if (categoryId === "mess") {
    return (
      <>
        <FilterContentGroup title="Bazar maximum">
          <PillGrid>
            {MESS_OPTIONS.map((option) => (
              <SelectionPill
                key={option.id}
                label={option.label}
                selected={filters.messLevel === option.id}
                onPress={() => toggleScalar("messLevel", option.id)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
        <FilterContentGroup title="Bruit maximum">
          <PillGrid>
            {NOISE_OPTIONS.map((option) => (
              <SelectionPill
                key={option.id}
                label={option.label}
                selected={filters.noiseLevel === option.id}
                onPress={() => toggleScalar("noiseLevel", option.id)}
              />
            ))}
          </PillGrid>
        </FilterContentGroup>
      </>
    );
  }

  if (categoryId === "autonomy") {
    return (
      <FilterContentGroup>
        <PillGrid>
          <SelectionPill
            label="Autonomie forte"
            selected={filters.independenceLevel === "high"}
            onPress={() => toggleScalar("independenceLevel", "high")}
          />
          <SelectionPill
            label="Autonomie moyenne ou plus"
            selected={filters.independenceLevel === "medium"}
            onPress={() => toggleScalar("independenceLevel", "medium")}
          />
          <SelectionPill
            label="Sans surveillance"
            selected={filters.requiresSupervision === false}
            onPress={() => toggleScalar("requiresSupervision", false)}
          />
          <SelectionPill
            label="Avec surveillance"
            selected={filters.requiresSupervision === true}
            onPress={() => toggleScalar("requiresSupervision", true)}
          />
          <SelectionPill
            label="Sans écran"
            selected={Boolean(filters.screenFree)}
            onPress={() => onChange({ screenFree: filters.screenFree ? undefined : true })}
          />
        </PillGrid>
      </FilterContentGroup>
    );
  }

  return (
    <>
      <FilterContentGroup title="Objectifs">
        <PillGrid>
          {DEVELOPMENT_GOAL_GROUP_OPTIONS.map((option) => (
            <SelectionPill
              key={option.id}
              label={option.label}
              selected={(filters.developmentGoalGroups ?? []).includes(option.id)}
              onPress={() => toggleArray("developmentGoalGroups", option.id as DevelopmentGoalGroup)}
            />
          ))}
        </PillGrid>
      </FilterContentGroup>
      <FilterContentGroup title="Compétences">
        <PillGrid>
          {SKILL_OPTIONS.map((skill) => (
            <SelectionPill
              key={skill}
              label={skill}
              selected={(filters.skills ?? []).includes(skill)}
              onPress={() => toggleArray("skills", skill)}
            />
          ))}
        </PillGrid>
      </FilterContentGroup>
    </>
  );
}

function getFilterCategories(filters: ActivityFilters): FilterCategory[] {
  return [
    { id: "suggested", label: "Filtres suggérés", count: getSuggestedCount(filters) },
    { id: "moment", label: "Moment", count: Number(Boolean(filters.need)) },
    { id: "age", label: "Âge", count: Number(Boolean(filters.ageRange)) },
    {
      id: "time",
      label: "Temps",
      count: Number(Boolean(filters.duration)) + Number(filters.setupTimeMax !== undefined) + Number(filters.cleanupTimeMax !== undefined)
    },
    {
      id: "materials",
      label: "Matériel",
      count: (filters.materialGroups?.length ?? 0) + (filters.materials?.length ?? 0)
    },
    {
      id: "parent",
      label: "Parent",
      count: Number(Boolean(filters.parentEnergy)) + (filters.parentMood?.length ?? 0)
    },
    {
      id: "weather",
      label: "Lieu et météo",
      count: Number(Boolean(filters.weather && filters.weather !== "any")) + Number(Boolean(filters.season && filters.season !== "all-season"))
    },
    {
      id: "mess",
      label: "Bazar et bruit",
      count: Number(Boolean(filters.messLevel)) + Number(Boolean(filters.noiseLevel)) + Number(Boolean(filters.messLevelMin)) + Number(Boolean(filters.noiseLevelMin))
    },
    {
      id: "autonomy",
      label: "Autonomie",
      count: Number(Boolean(filters.independenceLevel)) + Number(filters.requiresSupervision !== undefined) + Number(Boolean(filters.screenFree))
    },
    {
      id: "development",
      label: "Objectifs",
      count: (filters.developmentGoalGroups?.length ?? 0) + (filters.skills?.length ?? 0)
    }
  ];
}

function getSuggestedCount(filters: ActivityFilters) {
  return (
    Number(filters.setupTimeMax === 0) +
    Number(filters.parentEnergy === "ko") +
    Number(filters.independenceLevel === "high") +
    Number(filters.requiresSupervision === false) +
    Number(Boolean(filters.screenFree)) +
    Number(Boolean(filters.favoritesOnly))
  );
}

function getActiveFilterCount(filters: ActivityFilters) {
  return (
    Number(Boolean(filters.need)) +
    Number(Boolean(filters.ageRange)) +
    Number(Boolean(filters.duration)) +
    Number(filters.setupTimeMax !== undefined) +
    Number(filters.cleanupTimeMax !== undefined) +
    Number(Boolean(filters.parentEnergy)) +
    Number(Boolean(filters.weather && filters.weather !== "any")) +
    Number(Boolean(filters.messLevel)) +
    Number(Boolean(filters.messLevelMin)) +
    Number(Boolean(filters.noiseLevel)) +
    Number(Boolean(filters.noiseLevelMin)) +
    Number(Boolean(filters.independenceLevel)) +
    Number(filters.requiresSupervision !== undefined) +
    Number(Boolean(filters.screenFree)) +
    Number(Boolean(filters.season && filters.season !== "all-season")) +
    Number(Boolean(filters.favoritesOnly)) +
    (filters.parentMood?.length ?? 0) +
    (filters.materialGroups?.length ?? 0) +
    (filters.materials?.length ?? 0) +
    (filters.skills?.length ?? 0) +
    (filters.developmentGoalGroups?.length ?? 0)
  );
}

function getNeedChange(filters: ActivityFilters, need: NonNullable<ActivityFilters["need"]>): Partial<ActivityFilters> {
  const nextNeed = filters.need === need ? undefined : need;

  return {
    need: nextNeed,
    setupTimeMax: undefined,
    cleanupTimeMax: undefined,
    parentEnergy: undefined,
    parentMood: [],
    weather: "any",
    materialGroups: [],
    materials: [],
    messLevel: undefined,
    messLevelMin: undefined,
    noiseLevel: undefined,
    noiseLevelMin: undefined,
    independenceLevel: undefined,
    requiresSupervision: undefined,
    screenFree: undefined,
    skills: [],
    developmentGoalGroups: [],
    season: undefined
  };
}

function CategoryTab({
  category,
  selected,
  onPress
}: {
  category: FilterCategory;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 0,
        paddingHorizontal: 14,
        paddingVertical: 8,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(124, 58, 237, 0.12)",
        borderLeftWidth: selected ? 5 : 0,
        borderLeftColor: colors.primary,
        backgroundColor: selected ? colors.surface : colors.primarySoft,
        opacity: pressed ? 0.72 : 1
      })}
    >
      <Text selectable={false} numberOfLines={2} style={{ color: selected ? colors.primaryDark : colors.text, fontSize: 14, lineHeight: 18, fontWeight: "900" }}>
        {category.label}
      </Text>
      {category.count > 0 ? (
        <Text selectable={false} style={{ color: colors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800", marginTop: 4 }}>
          {category.count} actif{category.count > 1 ? "s" : ""}
        </Text>
      ) : null}
    </Pressable>
  );
}

function FilterContentGroup({
  title,
  helper,
  children
}: {
  title?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <View style={{ gap: 12 }}>
      {title ? (
        <Text selectable style={{ color: colors.text, fontSize: 18, lineHeight: 24, fontWeight: "900" }}>
          {title}
        </Text>
      ) : null}
      {helper ? (
        <Text selectable style={{ color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: "700" }}>
          {helper}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function PillGrid({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>{children}</View>;
}

function SelectionPill({
  label,
  helper,
  selected,
  onPress
}: {
  label: string;
  helper?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: helper ? 64 : 46,
        maxWidth: "100%",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: helper ? 10 : 9,
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primarySoft : colors.surface,
        boxShadow: selected ? "0 8px 18px rgba(124, 58, 237, 0.12)" : undefined,
        opacity: pressed ? 0.72 : 1
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
        {selected ? (
          <Text selectable={false} style={{ color: colors.primaryDark, fontSize: 18, lineHeight: 20, fontWeight: "900" }}>
            ✓
          </Text>
        ) : null}
        <View style={{ minWidth: 0 }}>
          <Text selectable={false} style={{ color: selected ? colors.primaryDark : colors.text, fontSize: 16, lineHeight: 21, fontWeight: "900" }}>
            {label}
          </Text>
          {helper ? (
            <Text selectable={false} style={{ color: colors.muted, fontSize: 12, lineHeight: 16, fontWeight: "700", marginTop: 2 }}>
              {helper}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function TrendIcon() {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View
        style={{
          width: 13,
          height: 2,
          borderRadius: 999,
          backgroundColor: colors.surface,
          position: "absolute",
          left: 1,
          top: 8,
          transform: [{ rotate: "-32deg" }]
        }}
      />
      <View
        style={{
          width: 6,
          height: 6,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: colors.surface,
          position: "absolute",
          right: 1,
          top: 3
        }}
      />
    </View>
  );
}

function FilterIcon() {
  return (
    <View style={{ width: 14, height: 14 }}>
      {[3, 7, 11].map((top, index) => (
        <View
          key={top}
          style={{
            height: 2,
            borderRadius: 999,
            backgroundColor: colors.primary,
            position: "absolute",
            left: 0,
            right: 0,
            top
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 999,
              backgroundColor: colors.primary,
              position: "absolute",
              top: -1,
              left: index === 1 ? 8 : 2
            }}
          />
        </View>
      ))}
    </View>
  );
}

function ToolbarButton({
  label,
  selected = false,
  icon,
  tone = "solid",
  onPress
}: {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  tone?: "solid" | "ghost";
  onPress: () => void;
}) {
  const isGhost = tone === "ghost";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={selected ? { selected } : undefined}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 32,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderCurve: "continuous",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        backgroundColor: isGhost ? "rgba(255, 255, 255, 0.18)" : colors.surface,
        borderWidth: 1,
        borderColor: isGhost ? "rgba(255, 255, 255, 0.3)" : colors.surface,
        boxShadow: isGhost ? undefined : "0 10px 22px rgba(15, 23, 42, 0.14)",
        opacity: pressed ? 0.76 : 1
      })}
    >
      {icon}
      <Text selectable={false} style={{ color: isGhost ? colors.surface : colors.primary, fontSize: 12, fontWeight: "900" }}>
        {label}
      </Text>
    </Pressable>
  );
}
