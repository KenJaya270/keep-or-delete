import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface ImageCardProps {
  uri: string;
  onKeep: () => void;
  onDelete: () => void;
  index: number;
  totalCards: number;
}

export default function ImageCard({
  uri,
  onKeep,
  onDelete,
  index,
  totalCards,
}: ImageCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Reset position setiap kali component di-mount (key berubah)
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 15 });
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);
      
      const swipedLeft = event.translationX < -SWIPE_THRESHOLD;
      const swipedRight = event.translationX > SWIPE_THRESHOLD;
      
      if (swipedLeft) {
        // ← SWIPE KIRI = KEEP
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(onKeep)();
          }
        });
      } else if (swipedRight) {
        // → SWIPE KANAN = DELETE
        // Reset dulu, lalu panggil delete (yang akan show dialog)
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(onDelete)();
      } else {
        // Tidak sampai threshold - reset
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
    };
  });

  // KEEP label - muncul saat swipe KIRI
  const keepLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD * 1.5, -SWIPE_THRESHOLD * 0.5, 0],
      [1, 0.8, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return { opacity };
  });

  // DELETE label - muncul saat swipe KANAN
  const deleteLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD * 1.5],
      [0, 0.8, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image 
          source={{ uri }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {/* DELETE label - kanan atas, muncul saat swipe kanan */}
        <Animated.View style={[styles.label, styles.deleteLabel, deleteLabelStyle]}>
          <Text style={styles.deleteText}>DELETE ✗</Text>
        </Animated.View>
        
        {/* KEEP label - kiri atas, muncul saat swipe kiri */}
        <Animated.View style={[styles.label, styles.keepLabel, keepLabelStyle]}>
          <Text style={styles.keepText}>KEEP ✓</Text>
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
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.65,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  label: {
    position: "absolute",
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 3,
  },
  keepLabel: {
    left: 20,
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
  },
  deleteLabel: {
    right: 20,
    borderColor: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.15)",
  },
  keepText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  deleteText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F44336",
  },
  counter: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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