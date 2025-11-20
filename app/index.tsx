import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageStack from "./components/ImageStack";
import { useGalleryStore } from "./store/useGalleryStore";

export default function Home() {
  const { loadImages, keptImages, deletedImages, reset, images } = useGalleryStore();
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {

    requestPermissionAndLoadMedia();
    
  }, []);

  const requestPermissionAndLoadMedia = async () => {
    setLoading(true);
    
    try {
      await loadImages();
      setHasPermission(true);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Permission Diperlukan",
        "Aplikasi memerlukan akses ke galeri untuk bekerja. Silakan berikan izin di Settings.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const showResults = () => {
    Alert.alert(
      "Hasil",
      `✓ Disimpan: ${keptImages.length}\n✗ Dihapus: ${deletedImages.length}\n📊 Total: ${images.length}`,
      [{ text: "OK" }]
    );
  };

  const handleReset = async () => {
    Alert.alert(
      "Muat Ulang Gallery",
      "Yakin ingin memuat ulang semua media?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Muat Ulang", 
          onPress: async () => {
            setLoading(true);
            reset();
            try {
              await loadImages();
            } catch (error) {
              Alert.alert("Error", `Gagal memuat gallery ${error}` );
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat gallery...</Text>
      </View>
    );
  }

  if (!hasPermission && images.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️</Text>
        <Text style={styles.errorSubtext}>Permission ditolak</Text>
        <TouchableOpacity style={styles.retryButton} onPress={requestPermissionAndLoadMedia}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gallery Manager</Text>
        <View style={styles.headerButtons}>
          {images.length > 0 && (
            <>
              <TouchableOpacity style={styles.resultButton} onPress={showResults}>
                <Text style={styles.resultButtonText}>
                  ✓ {keptImages.length} | ✗ {deletedImages.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>🔄</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ImageStack />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  resultButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
  },
  errorText: {
    fontSize: 64,
    marginBottom: 10,
  },
  errorSubtext: {
    color: "#888",
    fontSize: 18,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});