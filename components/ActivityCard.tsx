import { Pressable, Text, View } from "react-native";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Activity } from "@/types/activity";
import { energyLabel, independenceLabel, messLabel, noiseLabel, weatherLabel } from "@/utils/labels";
import { colors, radius } from "@/utils/theme";

type ActivityCardProps = {
  activity: Activity;
  favorite?: boolean;
  compact?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  rightAction?: ReactNode;
};

type ActivityTone = {
  soft: string;
  accent: string;
  text: string;
};

const tones: ActivityTone[] = [
  { soft: "#DBEAFE", accent: "#3B82F6", text: "#1E3A8A" },
  { soft: "#CFFAFE", accent: "#06B6D4", text: "#164E63" },
  { soft: "#FFE4E6", accent: "#F43F5E", text: "#9F1239" },
  { soft: "#FEF3C7", accent: "#F59E0B", text: "#92400E" }
];

const toneByActivityId: Record<string, ActivityTone> = {
  "yoga-rigolo": tones[0],
  "chasse-couleurs": tones[1],
  "course-glacons": tones[2],
  "mini-chasse-tresor": tones[3]
};

export function ActivityCard({
  activity,
  favorite = false,
  compact = false,
  onPress,
  onToggleFavorite,
  rightAction
}: ActivityCardProps) {
  const content = compact ? (
    <CompactActivityContent
      activity={activity}
      favorite={favorite}
      onOpen={onPress}
      onToggleFavorite={onToggleFavorite}
      rightAction={rightAction}
    />
  ) : (
    <DetailedActivityContent
      activity={activity}
      favorite={favorite}
      onOpen={onPress}
      onToggleFavorite={onToggleFavorite}
      rightAction={rightAction}
    />
  );

  const cardStyle = compact
    ? {
        minHeight: 286,
        borderRadius: 18,
        borderCurve: "continuous" as const,
        backgroundColor: colors.surface,
        overflow: "hidden" as const,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)"
      }
    : {
        padding: 18,
        borderRadius: radius.md,
        borderCurve: "continuous" as const,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.09)"
      };

  return <View style={cardStyle}>{content}</View>;
}

function CompactActivityContent({
  activity,
  favorite,
  onOpen,
  onToggleFavorite,
  rightAction
}: {
  activity: Activity;
  favorite: boolean;
  onOpen?: () => void;
  onToggleFavorite?: () => void;
  rightAction?: ReactNode;
}) {
  const mainMaterial = activity.materials[0] ?? "Sans matériel";
  const tone = getActivityTone(activity);
  const popularity = getActivityPopularity(activity);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          minHeight: 176,
          backgroundColor: tone.soft,
          paddingHorizontal: 22,
          paddingTop: 22,
          paddingBottom: 18,
          gap: 14,
          overflow: "hidden"
        }}
      >
        {onToggleFavorite ? (
          <FavoriteStarButton favorite={favorite} onPress={onToggleFavorite} />
        ) : (
          rightAction
        )}

        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, paddingRight: 52 }}>
          <ThumbnailBadge value={activity.thumbnail} />
          <View style={{ flex: 1, minWidth: 0, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <AccentBadge label={`${activity.duration} min`} accentColor={tone.accent} />
            <PopularityBadge value={popularity} />
            <AgeBadge label={`${activity.ageMin}-${activity.ageMax} ans`} textColor={tone.text} />
          </View>
        </View>

        <OpenArea
          label={`Ouvrir ${activity.title}`}
          onPress={onOpen}
          style={{ gap: 9, borderRadius: radius.sm }}
        >
          <Text selectable numberOfLines={2} style={{ color: tone.text, fontSize: 20, lineHeight: 25, fontWeight: "900" }}>
            {activity.title}
          </Text>
        </OpenArea>

        <View
          style={{
            alignSelf: "flex-start",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: tone.accent,
            boxShadow: "0 7px 14px rgba(15, 23, 42, 0.14)"
          }}
        >
          <Text selectable numberOfLines={1} style={{ color: colors.surface, fontSize: 12, fontWeight: "900" }}>
            {mainMaterial}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 18, gap: 18 }}>
        <OpenArea label={`Ouvrir ${activity.title}`} onPress={onOpen} style={{ flex: 1 }}>
          <Text selectable numberOfLines={2} style={{ color: "#334155", fontSize: 13, lineHeight: 19, fontWeight: "500" }}>
            {activity.description}
          </Text>
        </OpenArea>

        <OpenArea
          label={`Ouvrir ${activity.title}`}
          onPress={onOpen}
          style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
        >
          <MiniBadge label={energyLabel(activity.parentEnergy)} muted />
          <MiniBadge label={weatherLabel(activity.weather)} muted />
          <MiniBadge label={`${activity.setupTime} min prep`} muted />
          <MiniBadge label={independenceLabel(activity.independenceLevel).replace("Autonomie ", "Auto. ")} muted />
        </OpenArea>

      </View>
    </View>
  );
}

function DetailedActivityContent({
  activity,
  favorite,
  onOpen,
  onToggleFavorite,
  rightAction
}: {
  activity: Activity;
  favorite: boolean;
  onOpen?: () => void;
  onToggleFavorite?: () => void;
  rightAction?: ReactNode;
}) {
  const mainMaterial = activity.materials[0] ?? "rien de spécial";
  const skillTags = activity.skills.slice(0, 3);

  return (
    <View style={{ gap: 13 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <ThumbnailBadge value={activity.thumbnail} compact />
        <OpenArea label={`Ouvrir ${activity.title}`} onPress={onOpen} style={{ flex: 1, gap: 6 }}>
          <Text selectable style={{ color: colors.text, fontSize: 19, lineHeight: 24, fontWeight: "900" }}>
            {activity.title}
          </Text>
          <Text selectable numberOfLines={2} style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
            {activity.description}
          </Text>
        </OpenArea>

        {onToggleFavorite ? (
          <FavoriteButton favorite={favorite} accentColor={colors.primary} compact onPress={onToggleFavorite} />
        ) : (
          rightAction
        )}
      </View>

      <OpenArea
        label={`Ouvrir ${activity.title}`}
        onPress={onOpen}
        style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
      >
        <MetaBadge label={`${activity.duration} min`} tone="yellow" />
        <MetaBadge label={`${activity.ageMin}-${activity.ageMax} ans`} tone="blue" />
        <MetaBadge label={energyLabel(activity.parentEnergy)} tone="green" />
        <MetaBadge label={`Bazar ${messLabel(activity.messLevel).toLocaleLowerCase("fr-FR")}`} tone="peach" />
        <MetaBadge label={weatherLabel(activity.weather)} tone="plain" />
        <MetaBadge label={`${activity.setupTime} min prep`} tone="plain" />
        <MetaBadge label={noiseLabel(activity.noiseLevel)} tone="plain" />
      </OpenArea>

      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: colors.muted, fontSize: 13, fontWeight: "800" }}>
          Matériel: {mainMaterial}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
          {skillTags.map((skill) => (
            <View
              key={skill}
              style={{
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: "#F8FAFC"
              }}
            >
              <Text selectable style={{ color: colors.text, fontSize: 12, fontWeight: "800" }}>
                {skill}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function AccentBadge({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <View
      style={{
        minHeight: 28,
        borderRadius: 9,
        paddingHorizontal: 11,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        backgroundColor: accentColor,
        boxShadow: "0 6px 12px rgba(15, 23, 42, 0.14)"
      }}
    >
      <ClockGlyph />
      <Text selectable style={{ color: colors.surface, fontSize: 12, fontWeight: "900" }}>
        {label}
      </Text>
    </View>
  );
}

function ClockGlyph() {
  return (
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: colors.surface,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <View style={{ width: 2, height: 4, backgroundColor: colors.surface, borderRadius: 999, position: "absolute", top: 2 }} />
      <View style={{ width: 4, height: 2, backgroundColor: colors.surface, borderRadius: 999, position: "absolute", right: 2 }} />
    </View>
  );
}

function PopularityBadge({ value }: { value: string }) {
  return (
    <View
      style={{
        minHeight: 28,
        borderRadius: 9,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(255, 255, 255, 0.82)"
      }}
    >
      <Text selectable={false} style={{ color: colors.yellow, fontSize: 13, lineHeight: 16, fontWeight: "900" }}>
        ★
      </Text>
      <Text selectable style={{ color: "#334155", fontSize: 12, fontWeight: "900" }}>
        {value}
      </Text>
    </View>
  );
}

function AgeBadge({ label, textColor }: { label: string; textColor: string }) {
  return (
    <View
      style={{
        minHeight: 28,
        borderRadius: 9,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.78)"
      }}
    >
      <Text selectable numberOfLines={1} style={{ color: textColor, fontSize: 11, fontWeight: "900" }}>
        {label}
      </Text>
    </View>
  );
}

function ThumbnailBadge({ value, compact = false }: { value: string; compact?: boolean }) {
  return (
    <View
      style={{
        width: compact ? 42 : 48,
        height: compact ? 42 : 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.76)",
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.12)"
      }}
    >
      <Text selectable={false} style={{ fontSize: compact ? 22 : 26, lineHeight: compact ? 28 : 32 }}>
        {value}
      </Text>
    </View>
  );
}

function FavoriteStarButton({ favorite, onPress }: { favorite: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      accessibilityState={{ selected: favorite }}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
      style={({ pressed }) => ({
        position: "absolute",
        top: 14,
        right: 14,
        zIndex: 2,
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: favorite ? "#FEF3C7" : "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
        borderColor: favorite ? "#F59E0B" : "rgba(255, 255, 255, 0.7)",
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.14)",
        opacity: pressed ? 0.74 : 1
      })}
    >
      <Text selectable={false} style={{ color: favorite ? "#F59E0B" : "#94A3B8", fontSize: 22, lineHeight: 26, fontWeight: "900" }}>
        ★
      </Text>
    </Pressable>
  );
}

function OpenArea({
  children,
  label,
  onPress,
  style
}: {
  children: ReactNode;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  if (!onPress) {
    return <View style={style}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [style, { opacity: pressed ? 0.78 : 1 }]}
    >
      {children}
    </Pressable>
  );
}

function FavoriteButton({
  favorite,
  compact = false,
  accentColor,
  onPress
}: {
  favorite: boolean;
  compact?: boolean;
  accentColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
      style={({ pressed }) => ({
        minHeight: compact ? 38 : 40,
        borderRadius: compact ? 999 : 10,
        borderCurve: "continuous",
        paddingHorizontal: compact ? 14 : 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: favorite ? colors.text : accentColor,
        boxShadow: compact ? undefined : "0 8px 18px rgba(15, 23, 42, 0.16)",
        opacity: pressed ? 0.74 : 1
      })}
    >
      <Text selectable={false} style={{ color: colors.surface, fontSize: 12, fontWeight: "900" }}>
        {favorite ? "Activité gardée" : compact ? "Garder" : "Garder cette activité"}
      </Text>
    </Pressable>
  );
}

function MiniBadge({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <View
      style={{
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: muted ? "#F1F5F9" : colors.surface
      }}
    >
      <Text selectable style={{ color: colors.text, fontSize: 11, fontWeight: "800" }}>
        {label}
      </Text>
    </View>
  );
}

function MetaBadge({ label, tone }: { label: string; tone: "blue" | "yellow" | "green" | "peach" | "plain" }) {
  const backgroundColor =
    tone === "blue"
      ? colors.blue
      : tone === "yellow"
        ? colors.amber
        : tone === "green"
          ? colors.primarySoft
          : tone === "peach"
            ? colors.peach
            : "#F8FAFC";

  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor
      }}
    >
      <Text selectable style={{ color: colors.text, fontSize: 12, fontWeight: "900" }}>
        {label}
      </Text>
    </View>
  );
}

function getActivityTone(activity: Activity) {
  if (toneByActivityId[activity.id]) {
    return toneByActivityId[activity.id];
  }

  const index = Array.from(activity.id).reduce((total, character) => total + character.charCodeAt(0), 0) % tones.length;
  return tones[index];
}

function getActivityPopularity(activity: Activity) {
  if (activity.id === "mini-chasse-tresor") return "5";
  if (activity.id === "chasse-couleurs") return "4.9";
  if (activity.id === "course-glacons") return "4.7";
  if (activity.duration <= 5) return "4.8";
  if (activity.duration >= 15) return "5";
  return "4.8";
}
