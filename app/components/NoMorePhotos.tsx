import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useGalleryStore } from "../store/useGalleryStore";

export default function NoMorePhotos() {
    const reset = useGalleryStore((state) => state.reset);
    const loadImages = useGalleryStore((s) => s.loadImages);
    const [loading, setLoading] = useState(false);

    const handleReload = async () => {
        setLoading(true);
        reset();
        try {
            await loadImages();
        } catch (error) {
            console.error("Failed to reload:", error);
        } finally {
            setLoading(false);
        }
    };

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
            
            {loading ? (
                <ActivityIndicator size="large" color="#1e88e5" style={styles.loader} />
            ) : (
                <Pressable
                    style={styles.button}
                    onPress={handleReload}
                >
                    <Text style={styles.buttonText}>Reload Gallery</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
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
        color: "#fff",
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 20,
        color: "#fff",
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
    loader: {
        marginTop: 20,
    },
});