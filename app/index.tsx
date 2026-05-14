import { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { Animated, Easing, ScrollView, Text, useWindowDimensions, View } from "react-native";
import type { ViewStyle } from "react-native";
import { ActivityList } from "@/components/ActivityList";
import { FilterBar } from "@/components/FilterBar";
import { SearchBar } from "@/components/SearchBar";
import { activities } from "@/data/activities";
import { useActivityStore } from "@/store/activity-store";
import { findMatchingActivities, sortActivitiesByRelevance } from "@/utils/activity-filter";
import { colors } from "@/utils/theme";

const headerGradientStyle = {
  backgroundImage: `linear-gradient(110deg, ${colors.headerStart} 0%, ${colors.headerMiddle} 52%, ${colors.headerEnd} 100%)`
} as unknown as ViewStyle;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const filters = useActivityStore((state) => state.filters);
  const favoriteIds = useActivityStore((state) => state.favoriteIds);
  const setFilters = useActivityStore((state) => state.setFilters);
  const resetFilters = useActivityStore((state) => state.resetFilters);
  const toggleFavorite = useActivityStore((state) => state.toggleFavorite);

  const matchingActivities = sortActivitiesByRelevance(
    findMatchingActivities(filters, activities, favoriteIds),
    favoriteIds
  );
  const horizontalPadding = width >= 720 ? 48 : 20;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      <Stack.Screen options={{ title: "Mini Activites", headerShown: false }} />

      <View
        style={[
          {
            width: "100%",
            paddingTop: width >= 720 ? 32 : 30,
            paddingBottom: width >= 720 ? 26 : 24,
            paddingHorizontal: horizontalPadding,
            backgroundColor: colors.primaryDark
          },
          headerGradientStyle
        ]}
      >
        <View style={{ width: "100%", maxWidth: 1240, alignSelf: "center", gap: 16 }}>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <AnimatedCubesIcon />
              <Text selectable style={{ color: colors.surface, fontSize: width >= 720 ? 24 : 22, lineHeight: 30, fontWeight: "900" }}>
                Activités rapides
              </Text>
            </View>
            <Text selectable style={{ color: "#F3E8FF", fontSize: 13, lineHeight: 19, fontWeight: "700" }}>
              Trouve une idée jouable avec le temps, l'énergie et le matériel du moment.
            </Text>
          </View>

          <SearchBar
            value={filters.search ?? ""}
            onChange={(search) => setFilters({ search })}
            placeholder="Ex: 5, dehors, calme, bain, doudou..."
          />

          <FilterBar
            filters={filters}
            resultCount={matchingActivities.length}
            onChange={setFilters}
            onReset={resetFilters}
          />
        </View>
      </View>

      <View style={{ width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: horizontalPadding, paddingTop: 32 }}>
        <ActivityList
          activities={matchingActivities}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      </View>
    </ScrollView>
  );
}

function AnimatedCubesIcon() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let stopped = false;

    const randomDelay = () => 20000 + Math.random() * 100000;
    const scheduleNextAnimation = () => {
      timeout = setTimeout(playAnimation, randomDelay());
    };
    const playAnimation = () => {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true
      }).start(() => {
        if (!stopped) {
          scheduleNextAnimation();
        }
      });
    };

    scheduleNextAnimation();
    return () => {
      stopped = true;
      clearTimeout(timeout);
      progress.stopAnimation();
    };
  }, [progress]);

  return (
    <View style={{ width: 28, height: 36, overflow: "visible" }}>
      {cubeStack.map((cube) => (
        <Animated.View
          key={cube.key}
          style={{
            position: "absolute",
            left: 8,
            top: 0,
            width: 10,
            height: 10,
            borderRadius: 2,
            backgroundColor: cube.color,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, cube.delay, cube.delay + 0.1, cube.delay + 0.24, 1],
                  outputRange: [cube.y, cube.y, -16, cube.y, cube.y]
                })
              },
              {
                rotate: progress.interpolate({
                  inputRange: [0, cube.delay, cube.delay + 0.1, cube.delay + 0.24, 1],
                  outputRange: ["0deg", "0deg", "-8deg", "0deg", "0deg"]
                })
              }
            ],
            boxShadow: "2px 2px 0 rgba(15, 23, 42, 0.22)"
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 1,
              backgroundColor: "rgba(255, 255, 255, 0.32)",
              marginLeft: 2,
              marginTop: 2
            }}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const cubeStack = [
  { key: "blue", color: "#60A5FA", delay: 0.02, y: 26 },
  { key: "yellow", color: "#FDE047", delay: 0.2, y: 17 },
  { key: "rose", color: "#FB7185", delay: 0.38, y: 8 },
  { key: "green", color: "#86EFAC", delay: 0.56, y: -1 }
];
