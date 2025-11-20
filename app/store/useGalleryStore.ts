import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";

interface GalleryImage {
  uri: string;
  id: string;
}

interface GalleryStore {
  images: GalleryImage[];
  currentIndex: number;
  keptImages: string[];
  deletedImages: string[];
  loadImages: () => Promise<void>;
  keepImage: () => Promise<void>;
  deleteImage: () => Promise<void>;
  reset: () => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  images: [],
  currentIndex: 0,
  keptImages: [],
  deletedImages: [],
  
  loadImages: async () => {
    try {
      // Request permission first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== "granted") {
        throw new Error("Permission denied");
      }

      // Get all photos and videos
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        first: 1000,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      // Load with asset IDs for deletion
      set({
        images: media.assets.map(asset => ({
          uri: asset.uri,
          id: asset.id,
        })),
        currentIndex: 0,
        keptImages: [],
        deletedImages: [],
      });
    } catch (error) {
      console.error("Error loading media:", error);
      throw error;
    }
  },
  
  keepImage: async () => {
    const { currentIndex, images, keptImages } = get();
    if (currentIndex < images.length) {
      const currentImage = images[currentIndex];
      
      // Just track as kept, don't delete
      set({
        keptImages: [...keptImages, currentImage.uri],
        currentIndex: currentIndex + 1,
      });
    }
  },
  
  deleteImage: async () => {
    const { currentIndex, images, deletedImages } = get();
    if (currentIndex < images.length) {
      const currentImage = images[currentIndex];
      
      try {
        // Delete from Media Library
        await MediaLibrary.deleteAssetsAsync([currentImage.id]);
        
        // Also try to delete file directly (backup method)
        try {
          const fileInfo = await FileSystem.getInfoAsync(currentImage.uri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(currentImage.uri, { idempotent: true });
          }
        } catch (fileError) {
          console.log("File delete error (non-critical):", fileError);
        }
        
        set({
          deletedImages: [...deletedImages, currentImage.uri],
          currentIndex: currentIndex + 1,
        });
      } catch (error) {
        console.error("Failed to delete image:", error);
        
        // Still move to next even if delete fails
        set({
          deletedImages: [...deletedImages, currentImage.uri],
          currentIndex: currentIndex + 1,
        });
      }
    }
  },
  
  reset: () => {
    set({ 
      images: [],
      currentIndex: 0,
      keptImages: [],
      deletedImages: [],
    });
  },
}));