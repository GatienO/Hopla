import { router } from "expo-router";
import { Text, View } from "react-native";
import { AppScaffold } from "@/components/AppScaffold";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { PrimaryButton } from "@/components/PrimaryButton";
import { activities } from "@/data/activities";
import { useActivityStore } from "@/store/activity-store";
import { colors } from "@/utils/theme";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
};

export default function HistoryScreen() {
  const history = useActivityStore((state) => state.history);
  const favoriteIds = useActivityStore((state) => state.favoriteIds);
  const toggleFavorite = useActivityStore((state) => state.toggleFavorite);
  const historyActivities = history
    .map((entry) => ({
      entry,
      activity: activities.find((activity) => activity.id === entry.activityId)
    }))
    .filter((item): item is { entry: typeof item.entry; activity: NonNullable<typeof item.activity> } =>
      Boolean(item.activity)
    );

  return (
    <AppScaffold
      title="Historique"
      subtitle="Les activités ouvertes récemment, pour repérer ce qui marche vraiment."
      icon="🕘"
    >
      {historyActivities.length === 0 ? (
        <View style={{ gap: 14 }}>
          <EmptyState
            title="Rien dans l'historique"
            message="Les activites ouvertes apparaitront ici automatiquement."
          />
          <PrimaryButton title="Voir les activites" onPress={() => router.replace("/")} />
        </View>
      ) : (
        historyActivities.map(({ activity, entry }) => (
          <View key={`${activity.id}-${entry.date}`} style={{ gap: 6 }}>
            <Text selectable style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
              {formatDate(entry.date)}
            </Text>
            <ActivityCard
              activity={activity}
              favorite={favoriteIds.includes(activity.id)}
              onPress={() => router.push(`/activity/${activity.id}`)}
              onToggleFavorite={() => toggleFavorite(activity.id)}
            />
          </View>
        ))
      )}
    </AppScaffold>
  );
}
