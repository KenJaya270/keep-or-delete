import { useEffect } from "react";
import { View } from "react-native";
import ImageStack from "./components/ImageStack";
import { useGalleryStore } from "./store/useGalleryStore";

export default function Home() {
  const {
    images,
    currentIndex,
    loadImages,
    deleteImage,
    skipImage
  } = useGalleryStore();

  useEffect(() => {
    loadImages(); // PANGGIL FUNGSI NYA, jangan loadImages saja
  }, []);

  if (images.length === 0)
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  const handleKeep = () => {
    skipImage();
  };

  const handleDelete = () => {
    const asset = images[currentIndex];
    if (asset) {
      deleteImage(asset.id);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", marginTop: 50 }}>
      <ImageStack
        onSwipeLeft={handleKeep}
        onSwipeRight={handleDelete}
      />
    </View>
  );
}
