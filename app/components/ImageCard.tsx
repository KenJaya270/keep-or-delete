import * as Haptics from "expo-haptics";
import { Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {
  asset: any;
  isTopCard: boolean;
  nextScale?: SharedValue<number>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function ImageCard({
  asset,
  isTopCard,
  nextScale,
  onSwipeLeft,
  onSwipeRight,
}: Props) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const labelOpacity = useSharedValue(0);

  const SWIPE_THRESHOLD = 120;
  let hasTriggeredHaptic = false;

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;

      rotate.value = interpolate(e.translationX, [-200, 0, 200], [-15, 0, 15]);

      labelOpacity.value = interpolate(
        Math.abs(e.translationX),
        [0, SWIPE_THRESHOLD],
        [0, 1]
      );

      // Haptic ketika melewati threshold
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD && !hasTriggeredHaptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        hasTriggeredHaptic = true;
      }

      if (Math.abs(e.translationX) < SWIPE_THRESHOLD) {
        hasTriggeredHaptic = false;
      }

      // Next card scale animation
      if (isTopCard && nextScale) {
        nextScale.value = interpolate(
          Math.abs(e.translationX),
          [0, SWIPE_THRESHOLD],
          [1, 0.9]
        );
      }
    })
    .onEnd(() => {
      // SWIPE RIGHT = DELETE
      if (translateX.value > SWIPE_THRESHOLD) {
        onSwipeRight!();
        translateX.value = withSpring(500, { damping: 12 });
        return;
      }

      // SWIPE LEFT = KEEP
      if (translateX.value < -SWIPE_THRESHOLD) {
        onSwipeLeft!();
        translateX.value = withSpring(-500, { damping: 12 });
        return;
      }

      // Reset position
      translateX.value = withSpring(0);
      rotate.value = withSpring(0);
      labelOpacity.value = withTiming(0);

      if (nextScale) nextScale.value = withSpring(1);
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const keepStyle = useAnimatedStyle(() => ({
    opacity: interpolate(labelOpacity.value, [0, 1], [0, 1]),
    transform: [{ rotate: "-20deg" }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: interpolate(labelOpacity.value, [0, 1], [0, 1]),
    transform: [{ rotate: "20deg" }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, rStyle]}>
        <Image source={{ uri: asset.uri }} style={styles.image} />

        {/* Swipe Labels */}
        {isTopCard && (
          <>
            <Animated.Text style={[styles.keepLabel, keepStyle]}>
              KEEP
            </Animated.Text>

            <Animated.Text style={[styles.deleteLabel, deleteStyle]}>
              DELETE
            </Animated.Text>
          </>
        )}

        <View style={styles.gradient} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    height: "30%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  keepLabel: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 10,
    borderWidth: 3,
    borderColor: "#4cd964",
    color: "#4cd964",
    fontSize: 32,
    fontWeight: "900",
    borderRadius: 10,
  },
  deleteLabel: {
    position: "absolute",
    top: 60,
    right: 20,
    padding: 10,
    borderWidth: 3,
    borderColor: "#ff3b30",
    color: "#ff3b30",
    fontSize: 32,
    fontWeight: "900",
    borderRadius: 10,
  },
});
