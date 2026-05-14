import { activities } from "@/data/activities";
import {
  AGE_RANGES,
  CLEANUP_TIME_OPTIONS,
  DEVELOPMENT_GOAL_GROUP_OPTIONS,
  DURATION_OPTIONS,
  ENERGY_OPTIONS,
  MATERIAL_GROUP_OPTIONS,
  MESS_OPTIONS,
  NOISE_OPTIONS,
  PARENT_MOOD_OPTIONS,
  SEASON_OPTIONS,
  SETUP_TIME_OPTIONS,
  SMART_FILTER_OPTIONS,
  WEATHER_OPTIONS
} from "@/types/options";
import {
  developmentGoalGroupLabel,
  energyLabel,
  independenceLabel,
  materialGroupLabel,
  messLabel,
  noiseLabel,
  parentMoodLabel,
  seasonLabel,
  weatherLabel
} from "@/utils/labels";
import {
  Activity,
  ActivityFilters,
  ActivityNeed,
  AgeRangeId,
  IndependenceLevel,
  MessLevel,
  NoiseLevel,
  ParentEnergy
} from "@/types/activity";

const energyRank: Record<ParentEnergy, number> = {
  ko: 0,
  medium: 1,
  motivated: 2
};

const messRank: Record<MessLevel, number> = {
  low: 0,
  medium: 1,
  high: 2
};

const noiseRank: Record<NoiseLevel, number> = {
  low: 0,
  medium: 1,
  high: 2
};

const independenceRank: Record<IndependenceLevel, number> = {
  low: 0,
  medium: 1,
  high: 2
};

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getAgeRange = (id: AgeRangeId) => {
  return AGE_RANGES.find((range) => range.id === id) ?? AGE_RANGES[0];
};

const includesAny = <T,>(source: T[], selected?: T[]) => {
  if (!selected || selected.length === 0) return true;
  return source.some((item) => selected.includes(item));
};

const matchesNeed = (activity: Activity, need?: ActivityNeed) => {
  if (!need) return true;

  if (need === "urgence") {
    return activity.duration <= 10 && activity.setupTime <= 1 && activity.cleanupTime <= 1 && activity.parentEnergy === "ko";
  }

  if (need === "calme") {
    return activity.noiseLevel === "low" && activity.parentMood.includes("besoin-calme");
  }

  if (need === "autonomie") {
    return activity.independenceLevel === "high" && !activity.requiresSupervision;
  }

  if (need === "sans-bazar") {
    return activity.messLevel === "low" && activity.cleanupTime <= 1;
  }

  if (need === "defoulement") {
    return activity.noiseLevel !== "low" || activity.parentMood.includes("besoin-defoulement");
  }

  if (need === "pluie") {
    return activity.weather === "indoor" || activity.weather === "rainy" || activity.weather === "any";
  }

  return (
    activity.duration <= 20 &&
    activity.setupTime <= 3 &&
    (
      messRank[activity.messLevel] >= messRank.medium ||
      activity.materials.some((material) => ["eau", "riz", "pates", "crayons"].includes(material)) ||
      noiseRank[activity.noiseLevel] >= noiseRank.medium ||
      activity.parentMood.includes("besoin-defoulement")
    )
  );
};

const matchingNeedTerms = (activity: Activity) => {
  return SMART_FILTER_OPTIONS.filter((option) => matchesNeed(activity, option.id)).flatMap((option) => [
    option.id,
    option.label,
    option.helper
  ]);
};

const matchingMaterialGroupTerms = (activity: Activity) => {
  return MATERIAL_GROUP_OPTIONS.filter((group) => {
    if (group.id === "rien") return activity.materials.length === 0;
    return activity.materials.some((material) => group.materials.includes(material));
  }).flatMap((group) => [group.id, group.label, materialGroupLabel(group.id)]);
};

const matchingDevelopmentGroupTerms = (activity: Activity) => {
  return DEVELOPMENT_GOAL_GROUP_OPTIONS.filter((group) =>
    group.goals.some((goal) => activity.developmentGoals.includes(goal))
  ).flatMap((group) => [group.id, group.label, developmentGoalGroupLabel(group.id)]);
};

const numericSearchTerms = (activity: Activity) => {
  const ageRange = `${activity.ageMin}-${activity.ageMax}`;

  return [
    String(activity.ageMin),
    String(activity.ageMax),
    ageRange,
    `${ageRange} ans`,
    `${activity.ageMin} ans`,
    `${activity.ageMax} ans`,
    String(activity.duration),
    `${activity.duration} min`,
    `${activity.duration} minutes`,
    `${activity.setupTime}`,
    `${activity.setupTime} min prep`,
    `${activity.setupTime} minutes preparation`,
    `${activity.setupTime} min preparation`,
    `${activity.cleanupTime}`,
    `${activity.cleanupTime} min rangement`,
    `${activity.cleanupTime} minutes rangement`
  ];
};

const buildSearchText = (activity: Activity) => {
  const setupOption = SETUP_TIME_OPTIONS.find((option) => option.value === activity.setupTime);
  const cleanupOption = CLEANUP_TIME_OPTIONS.find((option) => option.value === activity.cleanupTime);

  const searchable = [
    activity.id,
    activity.title,
    activity.description,
    activity.thumbnail,
    activity.koVariant,
    activity.harderVariant,
    ...activity.steps,
    ...numericSearchTerms(activity),
    ...activity.materials,
    ...activity.skills,
    ...activity.developmentGoals,
    ...activity.parentMood,
    ...activity.season,
    activity.parentEnergy,
    energyLabel(activity.parentEnergy),
    activity.weather,
    weatherLabel(activity.weather),
    activity.weather === "outdoor" ? "dehors exterieur balade jardin parc" : "",
    activity.weather === "indoor" ? "dedans interieur maison appartement salon" : "",
    activity.weather === "rainy" ? "pluie pluvieux flaques mauvais temps" : "",
    activity.weather === "sunny" ? "soleil beau temps ombre dehors" : "",
    activity.messLevel,
    messLabel(activity.messLevel),
    activity.messLevel === "low" ? "sans bazar propre peu rangement" : "",
    activity.messLevel === "medium" ? "un peu bazar salissant" : "",
    activity.messLevel === "high" ? "tres salissant gros bazar avant bain" : "",
    activity.noiseLevel,
    noiseLabel(activity.noiseLevel),
    activity.noiseLevel === "low" ? "calme silencieux repos retour au calme" : "",
    activity.noiseLevel === "medium" ? "bruit ok bouger" : "",
    activity.noiseLevel === "high" ? "bruyant defouler energie bouger" : "",
    activity.independenceLevel,
    independenceLabel(activity.independenceLevel),
    activity.independenceLevel === "high" ? "autonome autonomie cafe possible seul" : "",
    activity.requiresSupervision ? "surveillance supervision accompagner securite" : "sans surveillance autonome parent tranquille",
    activity.screenFree ? "sans ecran screen free pas ecran" : "",
    setupOption?.label ?? "",
    cleanupOption?.label ?? "",
    ...ENERGY_OPTIONS.flatMap((option) => activity.parentEnergy === option.id ? [option.label, option.helper] : []),
    ...WEATHER_OPTIONS.flatMap((option) => activity.weather === option.id ? [option.label] : []),
    ...MESS_OPTIONS.flatMap((option) => activity.messLevel === option.id ? [option.label] : []),
    ...NOISE_OPTIONS.flatMap((option) => activity.noiseLevel === option.id ? [option.label] : []),
    ...PARENT_MOOD_OPTIONS.flatMap((option) => activity.parentMood.includes(option.id) ? [option.label, parentMoodLabel(option.id)] : []),
    ...SEASON_OPTIONS.flatMap((option) => activity.season.includes(option.id) ? [option.label, seasonLabel(option.id)] : []),
    ...DURATION_OPTIONS.flatMap((duration) => activity.duration <= duration ? [`moins de ${duration}`, `${duration} min max`] : []),
    ...AGE_RANGES.flatMap((range) =>
      activity.ageMin <= range.max && activity.ageMax >= range.min ? [range.id, range.label] : []
    ),
    ...matchingNeedTerms(activity),
    ...matchingMaterialGroupTerms(activity),
    ...matchingDevelopmentGroupTerms(activity)
  ];

  return normalize(searchable.filter(Boolean).join(" "));
};

const matchesStrictSearchPhrase = (activity: Activity, query: string) => {
  if (query.includes("sans surveillance") || query.includes("sans supervision")) {
    return !activity.requiresSupervision;
  }

  if (query.includes("avec surveillance") || query.includes("avec supervision") || query.includes("surveillance obligatoire")) {
    return activity.requiresSupervision;
  }

  return undefined;
};

const matchesSearch = (activity: Activity, search?: string) => {
  const query = normalize(search ?? "");
  if (!query) return true;

  const strictMatch = matchesStrictSearchPhrase(activity, query);
  if (strictMatch !== undefined) return strictMatch;

  const searchable = buildSearchText(activity);
  if (searchable.includes(query)) return true;

  const tokens = query.split(/\s+/).filter(Boolean);
  return tokens.every((token) => searchable.includes(token));
};

const matchesAge = (activity: Activity, ageRange?: AgeRangeId) => {
  if (!ageRange) return true;
  const range = getAgeRange(ageRange);
  return activity.ageMin <= range.max && activity.ageMax >= range.min;
};

const matchesDuration = (activity: Activity, duration?: ActivityFilters["duration"]) => {
  if (!duration) return true;
  return activity.duration <= duration;
};

const matchesTimeMax = (value: number, max?: number) => {
  if (max === undefined) return true;
  return value <= max;
};

const matchesEnergy = (activity: Activity, parentEnergy?: ParentEnergy) => {
  if (!parentEnergy) return true;
  return energyRank[activity.parentEnergy] <= energyRank[parentEnergy];
};

const matchesWeather = (activity: Activity, weather?: ActivityFilters["weather"]) => {
  if (!weather || weather === "any") return true;
  return activity.weather === "any" || activity.weather === weather;
};

const matchesMaterialGroups = (activity: Activity, materialGroups?: ActivityFilters["materialGroups"]) => {
  if (!materialGroups || materialGroups.length === 0) return true;
  return materialGroups.some((groupId) => {
    const group = MATERIAL_GROUP_OPTIONS.find((option) => option.id === groupId);
    if (!group) return false;
    if (group.id === "rien") return activity.materials.length === 0;
    return activity.materials.some((material) => group.materials.includes(material));
  });
};

const matchesMaterials = (activity: Activity, materials?: string[]) => {
  if (!materials || materials.length === 0) return true;
  return activity.materials.some((material) => materials.includes(material));
};

const matchesMess = (activity: Activity, messLevel?: MessLevel) => {
  if (!messLevel) return true;
  return messRank[activity.messLevel] <= messRank[messLevel];
};

const matchesMessMin = (activity: Activity, messLevelMin?: MessLevel) => {
  if (!messLevelMin) return true;
  return messRank[activity.messLevel] >= messRank[messLevelMin];
};

const matchesNoise = (activity: Activity, noiseLevel?: NoiseLevel) => {
  if (!noiseLevel) return true;
  return noiseRank[activity.noiseLevel] <= noiseRank[noiseLevel];
};

const matchesNoiseMin = (activity: Activity, noiseLevelMin?: NoiseLevel) => {
  if (!noiseLevelMin) return true;
  return noiseRank[activity.noiseLevel] >= noiseRank[noiseLevelMin];
};

const matchesIndependence = (activity: Activity, independenceLevel?: IndependenceLevel) => {
  if (!independenceLevel) return true;
  return independenceRank[activity.independenceLevel] >= independenceRank[independenceLevel];
};

const matchesSupervision = (activity: Activity, requiresSupervision?: boolean) => {
  if (requiresSupervision === undefined) return true;
  return activity.requiresSupervision === requiresSupervision;
};

const matchesScreenFree = (activity: Activity, screenFree?: boolean) => {
  if (!screenFree) return true;
  return activity.screenFree;
};

const matchesSkills = (activity: Activity, skills?: string[]) => {
  if (!skills || skills.length === 0) return true;
  return activity.skills.some((skill) => skills.includes(skill));
};

const matchesParentMood = (activity: Activity, parentMood?: ActivityFilters["parentMood"]) => {
  return includesAny(activity.parentMood, parentMood);
};

const matchesDevelopmentGoalGroups = (
  activity: Activity,
  developmentGoalGroups?: ActivityFilters["developmentGoalGroups"]
) => {
  if (!developmentGoalGroups || developmentGoalGroups.length === 0) return true;
  return developmentGoalGroups.some((groupId) => {
    const group = DEVELOPMENT_GOAL_GROUP_OPTIONS.find((option) => option.id === groupId);
    return Boolean(group?.goals.some((goal) => activity.developmentGoals.includes(goal)));
  });
};

const matchesSeason = (activity: Activity, season?: ActivityFilters["season"]) => {
  if (!season || season === "all-season") return true;
  return activity.season.includes("all-season") || activity.season.includes(season);
};

const matchesFavorite = (activity: Activity, favoritesOnly?: boolean, favoriteIds: string[] = []) => {
  if (!favoritesOnly) return true;
  return favoriteIds.includes(activity.id);
};

export const findMatchingActivities = (
  filters: ActivityFilters,
  sourceActivities: Activity[] = activities,
  favoriteIds: string[] = []
): Activity[] => {
  return sourceActivities.filter((activity) => {
    return (
      matchesSearch(activity, filters.search) &&
      matchesNeed(activity, filters.need) &&
      matchesAge(activity, filters.ageRange) &&
      matchesDuration(activity, filters.duration) &&
      matchesTimeMax(activity.setupTime, filters.setupTimeMax) &&
      matchesTimeMax(activity.cleanupTime, filters.cleanupTimeMax) &&
      matchesEnergy(activity, filters.parentEnergy) &&
      matchesParentMood(activity, filters.parentMood) &&
      matchesWeather(activity, filters.weather) &&
      matchesMaterialGroups(activity, filters.materialGroups) &&
      matchesMaterials(activity, filters.materials) &&
      matchesMess(activity, filters.messLevel) &&
      matchesMessMin(activity, filters.messLevelMin) &&
      matchesNoise(activity, filters.noiseLevel) &&
      matchesNoiseMin(activity, filters.noiseLevelMin) &&
      matchesIndependence(activity, filters.independenceLevel) &&
      matchesSupervision(activity, filters.requiresSupervision) &&
      matchesScreenFree(activity, filters.screenFree) &&
      matchesSkills(activity, filters.skills) &&
      matchesDevelopmentGoalGroups(activity, filters.developmentGoalGroups) &&
      matchesSeason(activity, filters.season) &&
      matchesFavorite(activity, filters.favoritesOnly, favoriteIds)
    );
  });
};

export const sortActivitiesByRelevance = (sourceActivities: Activity[], favoriteIds: string[] = []) => {
  return [...sourceActivities].sort((a, b) => {
    const favoriteDelta = Number(favoriteIds.includes(b.id)) - Number(favoriteIds.includes(a.id));
    if (favoriteDelta !== 0) return favoriteDelta;

    const setupDelta = a.setupTime - b.setupTime;
    if (setupDelta !== 0) return setupDelta;

    const durationDelta = a.duration - b.duration;
    if (durationDelta !== 0) return durationDelta;

    const energyDelta = energyRank[a.parentEnergy] - energyRank[b.parentEnergy];
    if (energyDelta !== 0) return energyDelta;

    const cleanupDelta = a.cleanupTime - b.cleanupTime;
    if (cleanupDelta !== 0) return cleanupDelta;

    const messDelta = messRank[a.messLevel] - messRank[b.messLevel];
    if (messDelta !== 0) return messDelta;

    return a.title.localeCompare(b.title, "fr-FR");
  });
};

export const getActivityById = (activityId?: string) => {
  if (!activityId) return undefined;
  return activities.find((activity) => activity.id === activityId);
};
