import { Image, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useGalleryStore } from "../store/useGalleryStore";

interface Props {
  asset: any;
  isTopCard: boolean;
  nextScale?: SharedValue<number>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function SwipeCard({ asset, isTopCard, nextScale }: Props) {
  const { deleteImage, skipImage } = useGalleryStore();

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const SWIPE_THRESHOLD = 120;

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      rotate.value = interpolate(e.translationX, [-200, 0, 200], [-15, 0, 15]);

      // ⬇️ Animasi untuk nextScale (kartu di belakang)
      if (isTopCard && nextScale) {
        nextScale.value = interpolate(
          Math.abs(e.translationX),
          [0, SWIPE_THRESHOLD],
          [1, 0]    // makin digeser, kartu belakang makin membesar
        );
      }
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        deleteImage(asset.id);
        translateX.value = withSpring(500);

      } else if (translateX.value < -SWIPE_THRESHOLD) {
        skipImage();
        translateX.value = withSpring(-500);

      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }

      if (nextScale) {
        nextScale.value = withSpring(1);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.card,
          rStyle,
          { zIndex: isTopCard ? 2 : 1 },
        ]}
      >
        <Image source={{ uri: asset.uri }} style={styles.image} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
