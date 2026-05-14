export type ParentEnergy = "ko" | "medium" | "motivated";
export type ActivityWeather = "indoor" | "outdoor" | "rainy" | "sunny" | "any";
export type MessLevel = "low" | "medium" | "high";
export type AgeRangeId = "1-2" | "2-3" | "3-4" | "4-6";
export type DurationOption = 5 | 10 | 15 | 30;
export type IndependenceLevel = "low" | "medium" | "high";
export type NoiseLevel = "low" | "medium" | "high";
export type Season = "spring" | "summer" | "autumn" | "winter" | "all-season";
export type ParentMood = "epuise" | "patient" | "besoin-calme" | "besoin-defoulement";
export type ActivityNeed = "urgence" | "calme" | "autonomie" | "sans-bazar" | "defoulement" | "pluie" | "avant-bain";
export type MaterialGroup = "rien" | "doudous" | "cuisine" | "creation" | "construction" | "mouvement" | "voitures-livres";
export type DevelopmentGoalGroup = "bouger" | "motricite-fine" | "langage" | "calme-emotions" | "observer-trier" | "imaginer";
export type DevelopmentGoal =
  | "motricite-fine"
  | "motricite-globale"
  | "coordination"
  | "langage"
  | "attention"
  | "autonomie"
  | "imagination"
  | "gestion-emotions"
  | "observation"
  | "memoire"
  | "apaisement"
  | "tri"
  | "rythme"
  | "narration"
  | "self-control"
  | "socialisation"
  | "equilibre"
  | "expression"
  | "formes"
  | "controle-mouvement"
  | "jeu-symbolique"
  | "precision"
  | "adresse"
  | "organisation"
  | "respiration"
  | "nature"
  | "creativite"
  | "vocabulaire"
  | "cooperation"
  | "curiosite"
  | "expression-corporelle";
export type ActivitySource = "proposed" | "custom";

export type Activity = {
  id: string;
  title: string;
  thumbnail: string;
  image?: string;
  ageMin: number;
  ageMax: number;
  duration: number;
  setupTime: number;
  cleanupTime: number;
  parentEnergy: ParentEnergy;
  parentMood: ParentMood[];
  weather: ActivityWeather;
  messLevel: MessLevel;
  noiseLevel: NoiseLevel;
  independenceLevel: IndependenceLevel;
  requiresSupervision: boolean;
  screenFree: boolean;
  season: Season[];
  materials: string[];
  skills: string[];
  developmentGoals: DevelopmentGoal[];
  description: string;
  steps: string[];
  koVariant: string;
  harderVariant: string;
  source?: ActivitySource;
};

export type ActivitySimilarityResolution = {
  activity: Activity;
  source: "existing-similar" | "custom-kept";
  similarActivity?: Activity;
  similarityScore: number;
};

export type ActivityFilters = {
  search?: string;
  need?: ActivityNeed;
  ageRange?: AgeRangeId;
  duration?: DurationOption;
  setupTimeMax?: number;
  cleanupTimeMax?: number;
  parentEnergy?: ParentEnergy;
  parentMood?: ParentMood[];
  weather?: ActivityWeather;
  materials?: string[];
  materialGroups?: MaterialGroup[];
  messLevel?: MessLevel;
  messLevelMin?: MessLevel;
  noiseLevel?: NoiseLevel;
  noiseLevelMin?: NoiseLevel;
  independenceLevel?: IndependenceLevel;
  requiresSupervision?: boolean;
  screenFree?: boolean;
  skills?: string[];
  developmentGoalGroups?: DevelopmentGoalGroup[];
  season?: Season;
  favoritesOnly?: boolean;
};

export type HistoryEntry = {
  activityId: string;
  date: string;
};
