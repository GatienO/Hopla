import { router } from "expo-router";
import { AppScaffold } from "@/components/AppScaffold";
import { EmptyState } from "@/components/EmptyState";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function ActivityFormScreen() {
  return (
    <AppScaffold
      title="Filtres rapides"
      subtitle="La sélection se fait directement depuis l’accueil, avec des options pensées pour les vrais moments."
      icon="⚙️"
      screenTitle="Filtres"
    >
      <EmptyState
        title="Les activités sont déjà là"
        message="Utilise la recherche et les filtres depuis l’accueil pour trouver une idée jouable tout de suite."
      />
      <PrimaryButton title="Retour aux activités" onPress={() => router.replace("/")} />
    </AppScaffold>
  );
}
