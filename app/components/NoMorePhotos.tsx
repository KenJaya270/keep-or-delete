import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useGalleryStore } from "../store/useGalleryStore";

export default function NoMorePhotos() {

    const reset = useGalleryStore((state) => state.reset);

    const loadImages = useGalleryStore((s) => s.loadImages);

    return (

        <View style={styles.container}>

            <Image 
                source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/748/748074.png"
                }}
                style={styles.icon}
            />

            <Text style={styles.title}>No More Photos</Text>
            <Text style={styles.subtitle}>You have reviewed everything 🎉</Text>

            <Pressable
                style={styles.button}
                onPress={async () => {
                    reset();
                    await loadImages();
                }}
            >
                <Text style={styles.buttonText}>Reload Gallery</Text>
            </Pressable>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 120,
        height: 120,
        marginBottom: 16,
        opacity: 0.7,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#1e88e5",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});