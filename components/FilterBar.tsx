import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { ActivityFilters } from "@/types/activity";
import { SMART_FILTER_OPTIONS } from "@/types/options";
import { colors, radius } from "@/utils/theme";

type FilterBarProps = {
  filters: ActivityFilters;
  resultCount: number;
  onChange: (filters: Partial<ActivityFilters>) => void;
  onReset: () => void;
};

type QuickFilter = {
  key: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

type QuickFilterGroup = {
  key: string;
  title: string;
  helper: string;
  filters: QuickFilter[];
};

export function FilterBar({ filters, resultCount, onChange, onReset }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const activeFilterCount = getActiveFilterCount(filters);
  const activeFilterLabel =
    activeFilterCount > 0
      ? `${activeFilterCount} filtre${activeFilterCount > 1 ? "s" : ""} actif${activeFilterCount > 1 ? "s" : ""}`
      : "Aucun filtre actif";

  const quickFilterGroups = useMemo<QuickFilterGroup[]>(() => {
    return [
      {
        key: "need",
        title: "De quoi tu as besoin ?",
        helper: "Choisis d'abord le moment",
        filters: SMART_FILTER_OPTIONS.map((option) => ({
          key: `need-${option.id}`,
          label: option.label,
          selected: filters.need === option.id,
          onPress: () => onChange(getNeedChange(filters, option.id))
        }))
      }
    ];
  }, [filters, onChange]);

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
                ★
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
            onPress={() => setExpanded((current) => !current)}
          />
        </View>
      </View>

      <Modal
        visible={expanded}
        transparent
        animationType="fade"
        onRequestClose={() => setExpanded(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 16,
            backgroundColor: "rgba(15, 23, 42, 0.44)"
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Masquer les options"
            onPress={() => setExpanded(false)}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <View
            style={{
              width: "100%",
              maxWidth: 640,
              maxHeight: "86%",
              alignSelf: "center",
              borderRadius: radius.md,
              borderCurve: "continuous",
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden",
              boxShadow: "0 24px 56px rgba(15, 23, 42, 0.24)"
            }}
          >
            <View
              style={{
                padding: 18,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                gap: 10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10
                }}
              >
                <View style={{ gap: 3, minWidth: 0, flex: 1 }}>
                  <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
                    Options de filtre
                  </Text>
                  <Text selectable style={{ color: colors.muted, fontSize: 13, fontWeight: "800" }}>
                    {activeFilterLabel}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <ToolbarButton label="Effacer" onPress={onReset} tone="light" />
                  <CloseButton onPress={() => setExpanded(false)} />
                </View>
              </View>
            </View>

            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 18, gap: 16 }}
            >
              <View style={{ gap: 12 }}>
                {quickFilterGroups.map((group, index) => (
                  <QuickFilterSection key={group.key} title={group.title} helper={group.helper} divided={index > 0}>
                    {group.filters.map((filter) => (
                      <CompactChip
                        key={filter.key}
                        label={filter.label}
                        selected={filter.selected}
                        onPress={filter.onPress}
                      />
                    ))}
                  </QuickFilterSection>
                ))}
              </View>

              <AdvancedFilters filters={filters} onChange={onChange} />
            </ScrollView>

            <View
              style={{
                padding: 18,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                backgroundColor: colors.surface
              }}
            >
              <ValidateButton onPress={() => setExpanded(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Fermer les options"
      onPress={onPress}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.text,
        opacity: pressed ? 0.76 : 1
      })}
    >
      <Text selectable={false} style={{ color: colors.surface, fontSize: 17, fontWeight: "900" }}>
        X
      </Text>
    </Pressable>
  );
}

function ValidateButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 48,
        borderRadius: radius.sm,
        borderCurve: "continuous",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        opacity: pressed ? 0.78 : 1
      })}
    >
      <Text selectable={false} style={{ color: colors.surface, fontSize: 15, fontWeight: "900" }}>
        Valider
      </Text>
    </Pressable>
  );
}

function QuickFilterSection({
  title,
  helper,
  children,
  divided
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
        <Text selectable style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
          {helper}
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>
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
  tone?: "solid" | "ghost" | "light";
  onPress: () => void;
}) {
  const isGhost = tone === "ghost";
  const isLight = tone === "light";

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
        borderColor: isGhost ? "rgba(255, 255, 255, 0.3)" : isLight ? colors.border : colors.surface,
        boxShadow: isGhost || isLight ? undefined : "0 10px 22px rgba(15, 23, 42, 0.14)",
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

function CompactChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 36,
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : "#F8FAFC",
        opacity: pressed ? 0.76 : 1
      })}
    >
      <Text selectable style={{ color: selected ? colors.surface : colors.text, fontSize: 13, fontWeight: "900" }}>
        {label}
      </Text>
    </Pressable>
  );
}
