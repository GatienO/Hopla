import { router } from "expo-router";
import { View } from "react-native";
import { ActivityList } from "@/components/ActivityList";
import { AppScaffold } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { PrimaryButton } from "@/components/PrimaryButton";
import { activities } from "@/data/activities";
import { useActivityStore } from "@/store/activity-store";
import { sortActivitiesByRelevance } from "@/utils/activity-filter";

export default function FavoritesScreen() {
  const favoriteIds = useActivityStore((state) => state.favoriteIds);
  const toggleFavorite = useActivityStore((state) => state.toggleFavorite);
  const favoriteActivities = sortActivitiesByRelevance(
    activities.filter((activity) => favoriteIds.includes(activity.id)),
    favoriteIds
  );

  return (
    <AppScaffold
      title="Idées gardées"
      subtitle="Les activités qui ont déjà sauvé un moment."
      icon="★"
      screenTitle="Favoris"
    >
      {favoriteActivities.length === 0 ? (
        <View style={{ gap: 14 }}>
          <EmptyState
            title="Aucun favori pour l'instant"
            message="Quand une idee marche bien, garde-la ici pour les jours ou il faut aller vite."
          />
          <PrimaryButton title="Voir les activites" onPress={() => router.replace("/")} />
        </View>
      ) : (
        <ActivityList
          activities={favoriteActivities}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </AppScaffold>
  );
}
