import React, { useCallback, useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { useGalleryStore } from "../store/useGalleryStore";
import ImageCard from "./ImageCard";
import NoMorePhotos from "./NoMorePhotos";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ImageStack() {
  const images = useGalleryStore((state) => state.images);
  const currentIndex = useGalleryStore((state) => state.currentIndex);
  const keepImage = useGalleryStore((state) => state.keepImage);
  const deleteImage = useGalleryStore((state) => state.deleteImage);
  
  // Key untuk force re-render card setelah cancel
  const [refreshKey, setRefreshKey] = useState(0);

  const currentImage = images[currentIndex];
  const nextImage = images[currentIndex + 1];

  // ← Swipe KIRI = KEEP
  const handleKeep = useCallback(() => {
    console.log("KEEP:", currentIndex);
    keepImage();
  }, [keepImage, currentIndex]);

  // → Swipe KANAN = DELETE (dengan konfirmasi)
  const handleDelete = useCallback(() => {
    console.log("DELETE request:", currentIndex);
    
    Alert.alert(
      "Hapus File?",
      "File ini akan dihapus permanen dari perangkat Anda!",
      [
        { 
          text: "Batal", 
          style: "cancel",
          onPress: () => {
            // Force re-render card dengan key baru
            console.log("Cancel - refreshing card");
            setRefreshKey(prev => prev + 1);
          }
        },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: () => {
            console.log("DELETE confirmed");
            deleteImage();
          }
        },
      ],
      { cancelable: false }
    );
  }, [deleteImage, currentIndex]);

  // Loading state
  if (images.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Memuat gallery...</Text>
      </View>
    );
  }

  // All done state
  if (currentIndex >= images.length || !currentImage) {
    return <NoMorePhotos />;
  }

  return (
    <View style={styles.container}>
      {/* Cards container */}
      <View style={styles.cardsArea}>
        {/* Next card preview (di belakang) */}
        {nextImage && (
          <View style={styles.nextCardContainer}>
            <Image 
              source={{ uri: nextImage.uri }}
              style={styles.nextCardImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Current card (di depan) */}
        <ImageCard
          key={`card-${currentIndex}-${refreshKey}`}
          uri={currentImage.uri}
          onKeep={handleKeep}
          onDelete={handleDelete}
          index={currentIndex}
          totalCards={images.length}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.keepInstruction}>← KEEP</Text>
        <Text style={styles.deleteInstruction}>DELETE →</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#888",
    fontSize: 18,
  },
  cardsArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nextCardContainer: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.85,
    height: "60%",
    borderRadius: 20,
    backgroundColor: "#222",
    overflow: "hidden",
    opacity: 0.5,
    transform: [{ scale: 0.92 }],
  },
  nextCardImage: {
    width: "100%",
    height: "100%",
  },
  instructions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  keepInstruction: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteInstruction: {
    color: "#F44336",
    fontSize: 20,
    fontWeight: "bold",
  },
});