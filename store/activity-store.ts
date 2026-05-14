import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { createJSONStorage as createJSONStorageType, persist as persistType } from "zustand/middleware";
import { Activity, ActivityFilters, HistoryEntry } from "@/types/activity";

declare const require: <T>(moduleName: string) => T;

const { createJSONStorage, persist } = require<{
  createJSONStorage: typeof createJSONStorageType;
  persist: typeof persistType;
}>("zustand/middleware");

type ActivityState = {
  filters: ActivityFilters;
  currentActivityId?: string;
  wasAdapted: boolean;
  favoriteIds: string[];
  history: HistoryEntry[];
  setFilters: (filters: Partial<ActivityFilters>) => void;
  resetFilters: () => void;
  setCurrentActivity: (activity: Activity, wasAdapted: boolean) => void;
  toggleFavorite: (activityId: string) => void;
  isFavorite: (activityId: string) => boolean;
  saveToHistory: (activity: Activity) => void;
};

export const initialFilters: ActivityFilters = {
  weather: "any",
  materials: [],
  skills: [],
  favoritesOnly: false
};

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      filters: initialFilters,
      currentActivityId: undefined,
      wasAdapted: false,
      favoriteIds: [],
      history: [],
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () => set({ filters: initialFilters }),
      setCurrentActivity: (activity, wasAdapted) => {
        set({ currentActivityId: activity.id, wasAdapted });
      },
      toggleFavorite: (activityId) => {
        const favoriteIds = get().favoriteIds;
        set({
          favoriteIds: favoriteIds.includes(activityId)
            ? favoriteIds.filter((id) => id !== activityId)
            : [activityId, ...favoriteIds]
        });
      },
      isFavorite: (activityId) => get().favoriteIds.includes(activityId),
      saveToHistory: (activity) => {
        const nextEntry = { activityId: activity.id, date: new Date().toISOString() };
        const deduped = get().history.filter((entry) => entry.activityId !== activity.id);
        set({ history: [nextEntry, ...deduped].slice(0, 30) });
      }
    }),
    {
      name: "mini-activites-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
        history: state.history,
        filters: state.filters
      })
    }
  )
);
