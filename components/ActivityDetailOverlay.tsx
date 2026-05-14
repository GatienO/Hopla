import { useEffect } from "react";
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { ActivityDetailBody } from "@/components/ActivityDetailBody";
import { useActivityStore } from "@/store/activity-store";
import type { Activity } from "@/types/activity";
import { colors, radius } from "@/utils/theme";

type ActivityDetailOverlayProps = {
  activity: Activity | null;
  visible: boolean;
  onClose: () => void;
};

export function ActivityDetailOverlay({ activity, visible, onClose }: ActivityDetailOverlayProps) {
  const { width, height } = useWindowDimensions();
  const favoriteIds = useActivityStore((state) => state.favoriteIds);
  const toggleFavorite = useActivityStore((state) => state.toggleFavorite);
  const saveToHistory = useActivityStore((state) => state.saveToHistory);

  useEffect(() => {
    if (visible && activity) {
      saveToHistory(activity);
    }
  }, [activity, saveToHistory, visible]);

  if (!activity) {
    return null;
  }

  const isWide = width >= 720;
  const favorite = favoriteIds.includes(activity.id);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: isWide ? 48 : 12,
          paddingVertical: isWide ? 40 : 12
        }}
      >
        <Pressable
          accessibilityLabel="Fermer le detail"
          accessibilityRole="button"
          onPress={onClose}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: "rgba(15, 23, 42, 0.56)"
          }}
        />

        <View
          style={{
            alignSelf: "center",
            width: "100%",
            maxWidth: 860,
            maxHeight: Math.max(360, height - (isWide ? 80 : 24)),
            borderRadius: isWide ? 26 : 22,
            borderCurve: "continuous",
            overflow: "hidden",
            backgroundColor: colors.background,
            boxShadow: "0 24px 72px rgba(15, 23, 42, 0.3)"
          }}
        >
          <View
            style={{
              paddingHorizontal: isWide ? 28 : 20,
              paddingTop: isWide ? 24 : 20,
              paddingBottom: 18,
              backgroundColor: colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              gap: 14
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primarySoft
                }}
              >
                <Text selectable={false} style={{ fontSize: 27, lineHeight: 34 }}>
                  {activity.thumbnail}
                </Text>
              </View>

              <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
                <Text selectable style={{ color: colors.text, fontSize: isWide ? 26 : 22, lineHeight: isWide ? 32 : 28, fontWeight: "900" }}>
                  {activity.title}
                </Text>
                <Text selectable style={{ color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: "600" }}>
                  {activity.description}
                </Text>
              </View>

              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                onPress={onClose}
                style={({ pressed }) => ({
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F1F5F9",
                  opacity: pressed ? 0.72 : 1
                })}
              >
                <Text selectable={false} style={{ color: colors.text, fontSize: 24, lineHeight: 28, fontWeight: "800" }}>
                  ×
                </Text>
              </Pressable>
            </View>
          </View>

          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              gap: 18,
              paddingHorizontal: isWide ? 28 : 20,
              paddingTop: 22,
              paddingBottom: 28
            }}
          >
            <ActivityDetailBody
              activity={activity}
              closeLabel="Fermer"
              favorite={favorite}
              onClose={onClose}
              onToggleFavorite={() => toggleFavorite(activity.id)}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
