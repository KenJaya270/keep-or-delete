import React from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useGalleryStore } from "../store/useGalleryStore";
import ImageCard from "./ImageCard";
import NoMorePhotos from "./NoMorePhotos";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ImageStack() {
  const { images, currentIndex, keepImage, deleteImage } = useGalleryStore();

  const handleKeep = async () => {
    await keepImage();
  };

  const handleDelete = async () => {
    Alert.alert(
      "Hapus File?",
      "File ini akan dihapus permanen dari perangkat Anda!",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            await deleteImage();
          }
        },
      ]
    );
  };

  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Loading gallery...
        </Text>
      </View>
    );
  }

  // Show NoMorePhotos when all photos are reviewed
  if (currentIndex >= images.length) {
    return <NoMorePhotos />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Preview next card */}
        {currentIndex + 1 < images.length && (
          <View style={[styles.nextCard, { opacity: 0.5, transform: [{ scale: 0.9 }] }]}>
            <View style={styles.cardPlaceholder} />
          </View>
        )}

        {/* Current card */}
        <ImageCard
          key={currentIndex}
          uri={images[currentIndex].uri}
          onSwipeLeft={handleKeep}
          onSwipeRight={handleDelete}
          index={currentIndex}
          totalCards={images.length}
        />
      </View>

      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionArrow}>←</Text>
          <Text style={styles.instructionText}>Swipe kiri = KEEP</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>Swipe kanan = DELETE</Text>
          <Text style={styles.instructionArrow}>→</Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  nextCard: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.9,
    height: "70%",
  },
  cardPlaceholder: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#888",
    fontSize: 18,
    textAlign: "center",
  },
  instructions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  instructionArrow: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  instructionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});