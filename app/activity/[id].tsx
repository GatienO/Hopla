import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityDetailBody } from "@/components/ActivityDetailBody";
import { AppScaffold } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useActivityStore } from "@/store/activity-store";
import { getActivityById } from "@/utils/activity-filter";

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
      <ActivityDetailBody
        activity={activity}
        favorite={favorite}
        onClose={() => router.back()}
        onToggleFavorite={() => toggleFavorite(activity.id)}
      />
    </AppScaffold>
  );
}
