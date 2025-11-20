import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface ImageCardProps {
  uri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  index: number;
  totalCards: number;
}

export default function ImageCard({
  uri,
  onSwipeLeft,
  onSwipeRight,
  index,
  totalCards,
}: ImageCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
      scale.value = withSpring(0.95);
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);
      
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe completed
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, {}, (finished) => {
          if (finished) {
            if (direction > 0) {
              runOnUI(onSwipeLeft)();
            } else {
              runOnUI(onSwipeRight)();
            }
          }
        });
      } else {
        // Reset position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  const keepLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return { opacity };
  });

  const deleteLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, rStyle]}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        
        <Animated.View style={[styles.label, styles.keepLabel, keepLabelStyle]}>
          <Text style={styles.labelText}>KEEP</Text>
        </Animated.View>
        
        <Animated.View style={[styles.label, styles.deleteLabel, deleteLabelStyle]}>
          <Text style={styles.labelText}>DELETE</Text>
        </Animated.View>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {index + 1} / {totalCards}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    position: "absolute",
    padding: 15,
    borderRadius: 10,
    borderWidth: 4,
  },
  keepLabel: {
    top: 50,
    left: 30,
    borderColor: "#4CAF50",
    transform: [{ rotate: "-20deg" }],
  },
  deleteLabel: {
    top: 50,
    right: 30,
    borderColor: "#F44336",
    transform: [{ rotate: "20deg" }],
  },
  labelText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  counter: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});