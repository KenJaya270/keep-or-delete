import * as MediaLibrary from "expo-media-library";
import * as Updates from "expo-updates";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ImageStack from "./components/ImageStack";
import { useGalleryStore } from "./store/useGalleryStore";

export default function Home() {
  const loadImages = useGalleryStore((state) => state.loadImages);
  const keptImages = useGalleryStore((state) => state.keptImages);
  const deletedImages = useGalleryStore((state) => state.deletedImages);
  const reset = useGalleryStore((state) => state.reset);
  const images = useGalleryStore((state) => state.images);
  
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Check for updates on app start
  useEffect(() => {
    checkForUpdates();
    initializeApp();
  }, []);

  const checkForUpdates = async () => {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert(
            "Update Tersedia",
            "Versi baru tersedia. Restart untuk update?",
            [
              { text: "Nanti", style: "cancel" },
              { 
                text: "Update", 
                onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                }
              },
            ]
          );
        }
      }
    } catch (error) {
      console.log("Update check error:", error);
    }
  };

  const initializeApp = async () => {
    setLoading(true);
    setPermissionDenied(false);
    
    try {
      // Check existing permission
      let { status } = await MediaLibrary.getPermissionsAsync();
      console.log("Initial permission:", status);
      
      // Request if not granted
      if (status !== "granted") {
        const response = await MediaLibrary.requestPermissionsAsync();
        status = response.status;
        console.log("Requested permission:", status);
      }
      
      if (status === "granted") {
        await loadImages();
        setPermissionDenied(false);
      } else {
        setPermissionDenied(true);
      }
    } catch (error: any) {
      console.error("Init error:", error);
      setPermissionDenied(true);
    } finally {
      setLoading(false);
    }
  };

  const showResults = useCallback(() => {
    Alert.alert(
      "Hasil",
      `✓ Disimpan: ${keptImages.length}\n✗ Dihapus: ${deletedImages.length}\n📊 Total: ${images.length}`,
      [{ text: "OK" }]
    );
  }, [keptImages.length, deletedImages.length, images.length]);

  const handleReset = useCallback(() => {
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
            } catch (error: any) {
              Alert.alert("Error", `Gagal memuat gallery: ${error?.message || error}`);
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  }, [reset, loadImages]);

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Memuat gallery...</Text>
      </View>
    );
  }

  // Permission denied state
  if (permissionDenied) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️</Text>
        <Text style={styles.errorSubtext}>Permission ditolak</Text>
        <Text style={styles.errorHint}>
          Buka Settings → Apps → Gallery Manager → Permissions → Photos and Videos → Allow
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeApp}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No images found
  if (images.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>📷</Text>
        <Text style={styles.errorSubtext}>Gallery kosong</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeApp}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gallery Manager</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.resultButton} onPress={showResults}>
              <Text style={styles.resultButtonText}>
                ✓ {keptImages.length} | ✗ {deletedImages.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ImageStack />
      </View>
    </ErrorBoundary>
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
    marginBottom: 10,
  },
  errorHint: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
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