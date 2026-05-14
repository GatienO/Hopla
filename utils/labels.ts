import {
  ActivityNeed,
  ActivityWeather,
  DevelopmentGoalGroup,
  IndependenceLevel,
  MaterialGroup,
  MessLevel,
  NoiseLevel,
  ParentEnergy,
  ParentMood,
  Season
} from "@/types/activity";

export const energyLabel = (energy: ParentEnergy) => {
  if (energy === "ko") return "KO";
  if (energy === "medium") return "Moyenne";
  return "Motive";
};

export const weatherLabel = (weather: ActivityWeather) => {
  if (weather === "indoor") return "Interieur";
  if (weather === "outdoor") return "Exterieur";
  if (weather === "rainy") return "Pluie";
  if (weather === "sunny") return "Soleil";
  return "Peu importe";
};

export const messLabel = (level: MessLevel) => {
  if (level === "low") return "Faible";
  if (level === "medium") return "Moyen";
  return "Eleve";
};

export const independenceLabel = (level: IndependenceLevel) => {
  if (level === "low") return "Autonomie faible";
  if (level === "medium") return "Autonomie moyenne";
  return "Autonomie forte";
};

export const noiseLabel = (level: NoiseLevel) => {
  if (level === "low") return "Bruit faible";
  if (level === "medium") return "Bruit moyen";
  return "Bruit eleve";
};

export const parentMoodLabel = (mood: ParentMood) => {
  if (mood === "epuise") return "Parent epuise";
  if (mood === "besoin-calme") return "Besoin de calme";
  if (mood === "besoin-defoulement") return "Besoin de bouger";
  return "Parent patient";
};

export const activityNeedLabel = (need: ActivityNeed) => {
  if (need === "urgence") return "Urgence";
  if (need === "calme") return "Calme";
  if (need === "autonomie") return "Autonomie";
  if (need === "sans-bazar") return "Sans bazar";
  if (need === "defoulement") return "Defoulement";
  if (need === "pluie") return "Pluie";
  return "Avant le bain";
};

export const materialGroupLabel = (group: MaterialGroup) => {
  if (group === "rien") return "Rien";
  if (group === "doudous") return "Doudous";
  if (group === "cuisine") return "Cuisine";
  if (group === "creation") return "Creation";
  if (group === "construction") return "Construction";
  if (group === "mouvement") return "Bouger";
  return "Voitures & livres";
};

export const developmentGoalGroupLabel = (group: DevelopmentGoalGroup) => {
  if (group === "bouger") return "Bouger";
  if (group === "motricite-fine") return "Motricite fine";
  if (group === "langage") return "Langage";
  if (group === "calme-emotions") return "Calme & emotions";
  if (group === "observer-trier") return "Observer / trier";
  return "Imaginer";
};

export const seasonLabel = (season: Season) => {
  if (season === "spring") return "Printemps";
  if (season === "summer") return "Ete";
  if (season === "autumn") return "Automne";
  if (season === "winter") return "Hiver";
  return "Toute saison";
};
