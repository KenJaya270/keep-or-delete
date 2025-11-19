import { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import ImageStack from "./components/ImageStack";
import NoMorePhotos from "./components/NoMorePhotos";
import { useGalleryStore } from "./store/useGalleryStore";

export default function Home() {
  const {
    images,
    currentIndex,
    loadImages,
    deleteImage,
    skipImage
  } = useGalleryStore();

  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {

    loadImages(); 

  }, []);

  if (images.length === 0)
    return <NoMorePhotos />;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      {/* Onboarding pop-up */}
      <Modal visible={showHelp} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.7)"
        }}>
          <View style={{
            width: "80%",
            padding: 20,
            backgroundColor: "#111",
            borderRadius: 16
          }}>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#fff", marginBottom: 10 }}>
              Cara Menggunakan
            </Text>
            <Text style={{ color: "#ccc", marginBottom: 20 }}>
              • Swipe LEFT = Keep  
              • Swipe RIGHT = Delete
            </Text>

            <Image
              source={{
                uri: "../assets/images/showHelp.png",
              }}
              style={{ width: 100, height: 100, marginBottom: 20 }}
            />

            <TouchableOpacity
              onPress={() => setShowHelp(false)}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 10,
                borderRadius: 12,
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: "600" }}>Mengerti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ImageStack
        onSwipeLeft={skipImage}
        onSwipeRight={() => deleteImage(images[currentIndex].id)}
      />
    </View>
  );
}
