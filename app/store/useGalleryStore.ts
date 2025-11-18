import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";

interface GalleryState {
    images: MediaLibrary.Asset[];
    currentIndex: number;
    loadImages: () => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
    skipImage: () => void;
    reset: () => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
    images: [],
    currentIndex: 0,

    loadImages: async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") return;

        const gallery = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        sortBy: [["creationTime", false]],
        first: 200,
        });

        set({ images: gallery.assets, currentIndex: 0 });
    },

    deleteImage: async (id: string) => {
        await MediaLibrary.deleteAssetsAsync([id]);

        const { images, currentIndex } = get();

        const filtered = images.filter((img) => img.id !== id);

        set({
            images: filtered,
            currentIndex: currentIndex + 1,
        });
    },

    skipImage: () =>
        set((state) => ({
        currentIndex: state.currentIndex + 1,
        })),

    reset: () => set({ currentIndex: 0, images: [] }),
}));
