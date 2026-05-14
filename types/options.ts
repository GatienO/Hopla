import {
  ActivityNeed,
  ActivityWeather,
  AgeRangeId,
  DevelopmentGoal,
  DevelopmentGoalGroup,
  DurationOption,
  MaterialGroup,
  MessLevel,
  NoiseLevel,
  ParentEnergy,
  ParentMood,
  Season
} from "@/types/activity";

export const AGE_RANGES: Array<{ id: AgeRangeId; label: string; min: number; max: number }> = [
  { id: "1-2", label: "1-2 ans", min: 1, max: 2 },
  { id: "2-3", label: "2-3 ans", min: 2, max: 3 },
  { id: "3-4", label: "3-4 ans", min: 3, max: 4 },
  { id: "4-6", label: "4-6 ans", min: 4, max: 6 }
];

export const ENERGY_OPTIONS: Array<{ id: ParentEnergy; label: string; helper: string }> = [
  { id: "ko", label: "KO", helper: "Minimum d'effort" },
  { id: "medium", label: "Moyenne", helper: "Un peu present" },
  { id: "motivated", label: "Motive", helper: "On bouge" }
];

export const WEATHER_OPTIONS: Array<{ id: ActivityWeather; label: string }> = [
  { id: "indoor", label: "Interieur" },
  { id: "outdoor", label: "Exterieur" },
  { id: "rainy", label: "Pluie" },
  { id: "sunny", label: "Soleil" },
  { id: "any", label: "Peu importe" }
];

export const DURATION_OPTIONS: DurationOption[] = [5, 10, 15, 30];

export const MESS_OPTIONS: Array<{ id: MessLevel; label: string }> = [
  { id: "low", label: "Bazar doux" },
  { id: "medium", label: "Un peu" },
  { id: "high", label: "Bazar fort" }
];

export const NOISE_OPTIONS: Array<{ id: NoiseLevel; label: string }> = [
  { id: "low", label: "Calme" },
  { id: "medium", label: "Bruit ok" },
  { id: "high", label: "Ca bouge" }
];

export const PARENT_MOOD_OPTIONS: Array<{ id: ParentMood; label: string }> = [
  { id: "epuise", label: "Parent epuise" },
  { id: "besoin-calme", label: "Besoin de calme" },
  { id: "besoin-defoulement", label: "Besoin de defouler" },
  { id: "patient", label: "Parent dispo" }
];

export const SMART_FILTER_OPTIONS: Array<{ id: ActivityNeed; label: string; helper: string }> = [
  { id: "urgence", label: "Urgence", helper: "Occuper maintenant" },
  { id: "calme", label: "Retour au calme", helper: "Bruit bas" },
  { id: "autonomie", label: "Autonomie", helper: "Cafe possible" },
  { id: "sans-bazar", label: "Sans bazar", helper: "Peu a ranger" },
  { id: "defoulement", label: "Defouler", helper: "Besoin de bouger" },
  { id: "pluie", label: "Jour de pluie", helper: "Dedans" },
  { id: "avant-bain", label: "Avant bain", helper: "On peut salir" }
];

export const SETUP_TIME_OPTIONS = [
  { value: 0, label: "Instantane" },
  { value: 1, label: "1 min prep" },
  { value: 2, label: "2 min prep" },
  { value: 3, label: "3 min prep" }
];

export const CLEANUP_TIME_OPTIONS = [
  { value: 0, label: "Aucun rangement" },
  { value: 1, label: "1 min rangement" },
  { value: 2, label: "2 min rangement" },
  { value: 4, label: "4 min rangement" }
];

export const SEASON_OPTIONS: Array<{ id: Season; label: string }> = [
  { id: "spring", label: "Printemps" },
  { id: "summer", label: "Ete" },
  { id: "autumn", label: "Automne" },
  { id: "winter", label: "Hiver" }
];

export const MATERIAL_GROUP_OPTIONS: Array<{ id: MaterialGroup; label: string; materials: string[] }> = [
  { id: "rien", label: "Rien", materials: [] },
  { id: "doudous", label: "Doudous", materials: ["doudous", "figurines", "jouets"] },
  { id: "cuisine", label: "Cuisine", materials: ["bols", "cuillere", "eau", "pates", "riz"] },
  { id: "creation", label: "Creation", materials: ["feuilles", "crayons", "pinces a linge"] },
  { id: "construction", label: "Construction", materials: ["cartons", "scotch", "rouleaux papier toilette"] },
  { id: "mouvement", label: "Mouvement", materials: ["coussins", "chaussettes"] },
  { id: "voitures-livres", label: "Voitures & livres", materials: ["voitures", "livres"] }
];

export const DEVELOPMENT_GOAL_GROUP_OPTIONS: Array<{
  id: DevelopmentGoalGroup;
  label: string;
  goals: DevelopmentGoal[];
}> = [
  { id: "bouger", label: "Bouger", goals: ["motricite-globale", "coordination", "equilibre", "controle-mouvement", "adresse", "expression-corporelle"] },
  { id: "motricite-fine", label: "Motricite fine", goals: ["motricite-fine", "precision", "formes"] },
  { id: "langage", label: "Langage", goals: ["langage", "narration", "expression", "socialisation", "vocabulaire"] },
  { id: "calme-emotions", label: "Calme & emotions", goals: ["gestion-emotions", "apaisement", "self-control", "respiration"] },
  { id: "observer-trier", label: "Observer / trier", goals: ["attention", "observation", "memoire", "tri", "organisation", "nature", "curiosite"] },
  { id: "imaginer", label: "Imaginer", goals: ["imagination", "jeu-symbolique", "rythme", "creativite", "cooperation"] }
];

export const MATERIAL_OPTIONS = MATERIAL_GROUP_OPTIONS.flatMap((group) => group.materials).filter(
  (material, index, materials) => materials.indexOf(material) === index
);

export const SKILL_OPTIONS = [
  "motricite",
  "concentration",
  "autonomie",
  "langage",
  "imagination",
  "emotions"
];
