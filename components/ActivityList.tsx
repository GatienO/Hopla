import { router } from "expo-router";
import { useWindowDimensions, View } from "react-native";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { Activity } from "@/types/activity";

type ActivityListProps = {
  activities: Activity[];
  favoriteIds: string[];
  onToggleFavorite: (activityId: string) => void;
  onOpenActivity?: (activity: Activity) => void;
};

export function ActivityList({ activities, favoriteIds, onToggleFavorite, onOpenActivity }: ActivityListProps) {
  const { width } = useWindowDimensions();
  const useTwoColumns = width >= 720;

  if (activities.length === 0) {
    return (
      <EmptyState
        title="Aucune activite parfaite"
        message="Essaie d'enlever un filtre. Une idee simple peut suffire."
      />
    );
  }

  const openActivity = (activity: Activity) => {
    if (onOpenActivity) {
      onOpenActivity(activity);
      return;
    }
    router.push(`/activity/${activity.id}`);
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: useTwoColumns ? 28 : 18 }}>
      {activities.map((activity) => (
        <View
          key={activity.id}
          style={{
            flexBasis: useTwoColumns ? "46%" : "100%",
            flexGrow: 1,
            maxWidth: useTwoColumns ? "49%" : "100%"
          }}
        >
          <ActivityCard
            activity={activity}
            compact
            favorite={favoriteIds.includes(activity.id)}
            onPress={() => openActivity(activity)}
            onToggleFavorite={() => onToggleFavorite(activity.id)}
          />
        </View>
      ))}
    </View>
  );
}
