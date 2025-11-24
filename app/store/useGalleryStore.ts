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
  keepImage: () => void;
  deleteImage: () => void;
  reset: () => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  images: [],
  currentIndex: 0,
  keptImages: [],
  deletedImages: [],
  
  loadImages: async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        first: 1000,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });
      
      console.log("Loaded " + media.assets.length + " media items");
      
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
  
  keepImage: () => {
    const { currentIndex, images, keptImages } = get();
    
    if (currentIndex >= images.length) {
      console.log("No more images");
      return;
    }
    
    const currentImage = images[currentIndex];
    console.log("KEEP image " + (currentIndex + 1) + "/" + images.length);
    
    set({
      keptImages: [...keptImages, currentImage.uri],
      currentIndex: currentIndex + 1,
    });
  },
  
  deleteImage: () => {
    const { currentIndex, images, deletedImages } = get();
    
    if (currentIndex >= images.length) {
      console.log("No more images");
      return;
    }
    
    const currentImage = images[currentIndex];
    console.log("DELETE image " + (currentIndex + 1) + "/" + images.length);
    
    // Move to next FIRST
    set({
      deletedImages: [...deletedImages, currentImage.uri],
      currentIndex: currentIndex + 1,
    });
    
    // Delete file in background
    setTimeout(async () => {
      try {
        await MediaLibrary.deleteAssetsAsync([currentImage.id]);
        console.log("File deleted: " + currentImage.id);
      } catch (error: any) {
        console.error("Delete failed: " + (error?.message || error));
      }
    }, 50);
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