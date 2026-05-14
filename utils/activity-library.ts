import { activities } from "@/data/activities";
import { Activity, ActivitySimilarityResolution } from "@/types/activity";

type SimilarityBreakdown = {
  title: number;
  materials: number;
  goals: number;
  age: number;
  duration: number;
};

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value: string) => {
  return new Set(
    normalize(value)
      .split(" ")
      .filter((token) => token.length >= 3)
  );
};

const overlapScore = (left: string[], right: string[]) => {
  const leftSet = new Set(left.map(normalize));
  const rightSet = new Set(right.map(normalize));
  if (leftSet.size === 0 && rightSet.size === 0) return 1;
  if (leftSet.size === 0 || rightSet.size === 0) return 0;

  const shared = [...leftSet].filter((value) => rightSet.has(value)).length;
  return shared / Math.max(leftSet.size, rightSet.size);
};

const titleScore = (left: Activity, right: Activity) => {
  const leftTokens = tokenize(`${left.title} ${left.description}`);
  const rightTokens = tokenize(`${right.title} ${right.description}`);
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;

  const shared = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return shared / Math.max(leftTokens.size, rightTokens.size);
};

const ageOverlapScore = (left: Activity, right: Activity) => {
  const overlapMin = Math.max(left.ageMin, right.ageMin);
  const overlapMax = Math.min(left.ageMax, right.ageMax);
  if (overlapMax < overlapMin) return 0;

  const overlap = overlapMax - overlapMin + 1;
  const span = Math.max(left.ageMax, right.ageMax) - Math.min(left.ageMin, right.ageMin) + 1;
  return overlap / span;
};

const durationScore = (left: Activity, right: Activity) => {
  const delta = Math.abs(left.duration - right.duration);
  return Math.max(0, 1 - delta / 30);
};

export const getActivitySimilarityScore = (left: Activity, right: Activity) => {
  const breakdown: SimilarityBreakdown = {
    title: titleScore(left, right),
    materials: overlapScore(left.materials, right.materials),
    goals: overlapScore(left.developmentGoals, right.developmentGoals),
    age: ageOverlapScore(left, right),
    duration: durationScore(left, right)
  };

  return (
    breakdown.title * 0.34 +
    breakdown.materials * 0.22 +
    breakdown.goals * 0.2 +
    breakdown.age * 0.12 +
    breakdown.duration * 0.12
  );
};

export const findMostSimilarProposedActivity = (
  customActivity: Activity,
  proposedActivities: Activity[] = activities
) => {
  return proposedActivities.reduce<{ activity?: Activity; score: number }>(
    (bestMatch, proposedActivity) => {
      const score = getActivitySimilarityScore(customActivity, proposedActivity);
      if (score > bestMatch.score) {
        return { activity: proposedActivity, score };
      }
      return bestMatch;
    },
    { score: 0 }
  );
};

export const resolveCustomActivity = (
  customActivity: Activity,
  proposedActivities: Activity[] = activities,
  similarityThreshold = 0.58
): ActivitySimilarityResolution => {
  const bestMatch = findMostSimilarProposedActivity(customActivity, proposedActivities);

  if (bestMatch.activity && bestMatch.score >= similarityThreshold) {
    return {
      activity: bestMatch.activity,
      source: "existing-similar",
      similarActivity: bestMatch.activity,
      similarityScore: bestMatch.score
    };
  }

  return {
    activity: { ...customActivity, source: "custom" },
    source: "custom-kept",
    similarityScore: bestMatch.score
  };
};

export const mergeProposedAndCustomActivities = (
  customActivities: Activity[],
  proposedActivities: Activity[] = activities,
  similarityThreshold = 0.58
) => {
  const resolutions = customActivities.map((customActivity) =>
    resolveCustomActivity(customActivity, proposedActivities, similarityThreshold)
  );
  const keptCustomActivities = resolutions
    .filter((resolution) => resolution.source === "custom-kept")
    .map((resolution) => resolution.activity);

  return {
    activities: [...proposedActivities, ...keptCustomActivities],
    resolutions
  };
};
