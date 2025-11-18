/* eslint-disable react-hooks/rules-of-hooks */
import { StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import { useGalleryStore } from "../store/useGalleryStore";
import ImageCard from "./ImageCard";
import NoMorePhotos from "./NoMorePhotos";

interface Props{
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

export default function ImageStack({ onSwipeLeft, onSwipeRight }: Props) {
    const { images, currentIndex } = useGalleryStore();

    if (currentIndex >= images.length) {
        return <NoMorePhotos />;
    }

    const nextScale = useSharedValue(1);

    const nextStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(nextScale.value, [0, 1], [0.9, 1])
            }
        ],
        opacity: 0.6
    }));

    return (
        <View style={styles.container}>
            {images[currentIndex + 1] && (
                <Animated.View style={[styles.nextCard, nextStyle]}>
                    <ImageCard asset={images[currentIndex + 1]} isTopCard={false} />
                </Animated.View>
            )}

        {/* CURRENT TOP CARD */}
        <ImageCard
            asset={images[currentIndex]}
            isTopCard={true}
            nextScale={nextScale} // <--- ini penting: mengontrol animasi kartu belakang
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    nextCard: {
        position: "absolute",
        width: "100%",
        height: 500
    }
});
