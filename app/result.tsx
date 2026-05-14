import { router } from "expo-router";
import { AppScaffold } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useActivityStore } from "@/store/activity-store";

export default function ResultScreen() {
  const currentActivityId = useActivityStore((state) => state.currentActivityId);

  return (
    <AppScaffold
      title="Nouvelle expérience"
      subtitle="Les activités s’ouvrent maintenant depuis la liste d’accueil."
      icon="✨"
      screenTitle="Activité"
    >
      <EmptyState
        title="Tout est prêt"
        message="Choisis une idée depuis la liste, ou rouvre la dernière activité consultée."
      />
      <PrimaryButton
        title={currentActivityId ? "Ouvrir la dernière activité" : "Voir les activités"}
        onPress={() => router.replace(currentActivityId ? `/activity/${currentActivityId}` : "/")}
      />
    </AppScaffold>
  );
}
