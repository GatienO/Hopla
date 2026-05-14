import { activities } from "@/data/activities";
import { Activity } from "@/types/activity";

export type ActivityCollectionId =
  | "five-minutes"
  | "parent-ko"
  | "no-mess"
  | "before-bath"
  | "rainy-day"
  | "autonomy"
  | "emergency";

export type ActivityCollection = {
  id: ActivityCollectionId;
  title: string;
  description: string;
  predicate: (activity: Activity) => boolean;
};

export const activityCollections: ActivityCollection[] = [
  {
    id: "five-minutes",
    title: "5 minutes",
    description: "Quand il faut une idee minuscule.",
    predicate: (activity) => activity.duration <= 5
  },
  {
    id: "parent-ko",
    title: "Parent KO",
    description: "Faible energie adulte, preparation courte.",
    predicate: (activity) => activity.parentEnergy === "ko" && activity.setupTime <= 2
  },
  {
    id: "no-mess",
    title: "Sans bazar",
    description: "Peu de bruit, peu de rangement.",
    predicate: (activity) => activity.messLevel === "low" && activity.cleanupTime <= 2
  },
  {
    id: "before-bath",
    title: "Avant le bain",
    description: "Le petit bazar est acceptable.",
    predicate: (activity) => activity.materials.includes("eau") || activity.messLevel === "medium"
  },
  {
    id: "rainy-day",
    title: "Pendant la pluie",
    description: "Idees compatibles interieur et pluie.",
    predicate: (activity) => activity.weather === "rainy" || activity.weather === "indoor"
  },
  {
    id: "autonomy",
    title: "Autonomie",
    description: "Pour recuperer quelques minutes.",
    predicate: (activity) => activity.independenceLevel === "high" && !activity.requiresSupervision
  },
  {
    id: "emergency",
    title: "Urgence",
    description: "Occuper maintenant, sans preparation mentale.",
    predicate: (activity) =>
      activity.setupTime <= 1 &&
      activity.cleanupTime <= 2 &&
      activity.parentEnergy === "ko" &&
      activity.noiseLevel !== "high"
  }
];

export const getActivitiesForCollection = (
  collectionId: ActivityCollectionId,
  sourceActivities: Activity[] = activities
) => {
  const collection = activityCollections.find((item) => item.id === collectionId);
  if (!collection) return [];
  return sourceActivities.filter(collection.predicate);
};
