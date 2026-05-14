import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { AppScaffold } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useActivityStore } from "@/store/activity-store";
import { Activity } from "@/types/activity";
import { getActivityById } from "@/utils/activity-filter";
import { energyLabel, independenceLabel, messLabel, noiseLabel, weatherLabel } from "@/utils/labels";
import { colors, radius } from "@/utils/theme";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const activity = getActivityById(id);
  const toggleFavorite = useActivityStore((state) => state.toggleFavorite);
  const isFavorite = useActivityStore((state) => state.isFavorite);
  const saveToHistory = useActivityStore((state) => state.saveToHistory);

  useEffect(() => {
    if (activity) {
      saveToHistory(activity);
    }
  }, [activity, saveToHistory]);

  if (!activity) {
    return (
      <AppScaffold title="Activité introuvable" subtitle="Elle a peut-être changé de nom." icon="🔎" screenTitle="Activité">
        <EmptyState title="Activité introuvable" message="Reviens à la liste pour choisir une autre idée." />
        <PrimaryButton title="Retour aux activités" onPress={() => router.replace("/")} />
      </AppScaffold>
    );
  }

  const favorite = isFavorite(activity.id);

  return (
    <AppScaffold
      title={activity.title}
      subtitle={activity.description}
      icon={activity.thumbnail}
      screenTitle={activity.title}
    >
      <View style={{ gap: 10 }}>
        <View
          style={{
            padding: 18,
            borderRadius: radius.lg,
            borderCurve: "continuous",
            backgroundColor: colors.surface,
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.1)",
            gap: 12
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <InfoBadge label={`${activity.duration} min`} />
            <InfoBadge label={`${activity.ageMin}-${activity.ageMax} ans`} />
            <InfoBadge label={energyLabel(activity.parentEnergy)} />
            <InfoBadge label={`Bazar ${messLabel(activity.messLevel).toLocaleLowerCase("fr-FR")}`} />
            <InfoBadge label={weatherLabel(activity.weather)} />
            <InfoBadge label={`${activity.setupTime} min préparation`} />
            <InfoBadge label={`${activity.cleanupTime} min rangement`} />
            <InfoBadge label={independenceLabel(activity.independenceLevel)} />
            <InfoBadge label={noiseLabel(activity.noiseLevel)} />
            <InfoBadge label={activity.requiresSupervision ? "Surveillance conseillée" : "Surveillance légère"} />
            <InfoBadge label={activity.screenFree ? "Sans écran" : "Avec écran"} />
          </View>
        </View>
      </View>

      <DetailBlock
        title="Materiel"
        items={activity.materials.length > 0 ? activity.materials : ["Rien de special"]}
      />
      <DetailBlock title="Competences" items={activity.skills} />
      <DetailBlock title="Objectifs de developpement" items={activity.developmentGoals} />
      <DetailBlock title="Humeurs parent compatibles" items={activity.parentMood} />
      <DetailBlock title="Etapes" items={activity.steps} ordered />

      <Variant title="Variante parent KO" value={activity.koVariant} />
      <Variant title="Plus difficile" value={activity.harderVariant} />

      <View style={{ gap: 10 }}>
        <PrimaryButton
          title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          variant={favorite ? "danger" : "secondary"}
          onPress={() => toggleFavorite(activity.id)}
        />
        <PrimaryButton title="Retour" onPress={() => router.back()} />
      </View>
    </AppScaffold>
  );
}

function InfoBadge({ label }: { label: string }) {
  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.primarySoft
      }}
    >
      <Text selectable style={{ color: colors.primaryDark, fontSize: 13, fontWeight: "900" }}>
        {label}
      </Text>
    </View>
  );
}

function DetailBlock({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  return (
    <View
      style={{
        padding: 18,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 10
      }}
    >
      <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
        {title}
      </Text>
      {items.map((item, index) => (
        <Text key={`${item}-${index}`} selectable style={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>
          {ordered ? `${index + 1}. ` : ""}
          {item}
        </Text>
      ))}
    </View>
  );
}

function Variant({ title, value }: Pick<Activity, "title"> & { value: string }) {
  return (
    <View
      style={{
        padding: 16,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        backgroundColor: "#FFF1D8",
        gap: 6
      }}
    >
      <Text selectable style={{ color: colors.text, fontSize: 16, fontWeight: "900" }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>
        {value}
      </Text>
    </View>
  );
}
