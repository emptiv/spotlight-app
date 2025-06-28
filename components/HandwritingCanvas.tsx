import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Canvas,
  Path,
  Skia,
  useCanvasRef,
} from "@shopify/react-native-skia";
import { Audio } from "expo-av";
import React, { useState } from "react";
import {
  Alert,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CANVAS_SIZE = 280;
const DRAWING_SIZE = 280;

type HandwritingCanvasProps = {
  onPrediction?: (prediction: string) => void;
  onClear?: () => void;
  lesson?: string;
  showGuide?: boolean;
  guideImage?: any;
  character?: string;
  hideAudioButton?: boolean;
};

export default function HandwritingCanvas({ onPrediction, onClear, lesson, showGuide, guideImage, character, hideAudioButton }: HandwritingCanvasProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const canvasRef = useCanvasRef();

  const playCharacterAudio = async () => {
  if (!character) {
    Alert.alert("Audio Error", "Character not set.");
    return;
  }

  try {
    const { sound } = await Audio.Sound.createAsync(
      // Use dynamic path based on character prop
      // You must use a static require for bundling
      getAudioFile(character)
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (err) {
    console.error("Audio error:", err);
    Alert.alert("Audio Error", "Unable to play character audio.");
  }
};

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath(`M${locationX} ${locationY}`);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prev) => `${prev} L${locationX} ${locationY}`);
    },
    onPanResponderRelease: () => {
      if (currentPath.trim() !== "") {
        setPaths((prev) => [...prev, currentPath]);
      }
      setCurrentPath("");
    },
  });

  const handleClear = () => {
    setPaths([]);
    setCurrentPath("");
    setPrediction(null);
    setPreviewUri(null);
    onClear?.();
  };

  const handleSubmit = async () => {
    if (paths.length === 0 && currentPath.trim() === "") {
    Alert.alert("No Drawing", "Please write something before submitting.");
    return;
  }
    const surface = Skia.Surface.MakeOffscreen(DRAWING_SIZE, DRAWING_SIZE);
    if (!surface) {
      Alert.alert("Error", "Failed to create Skia surface.");
      return;
    }

    const canvas = surface.getCanvas();
    canvas.clear(Skia.Color("white"));

    const paint = Skia.Paint();
    paint.setColor(Skia.Color("black"));
    paint.setStyle(1);
    paint.setStrokeWidth(2);

    [...paths, currentPath]
      .map((svg) => Skia.Path.MakeFromSVGString(svg))
      .filter((path): path is NonNullable<typeof path> => path !== null)
      .forEach((path) => {
        canvas.drawPath(path, paint);
      });

    const image = surface.makeImageSnapshot();
    const base64 = image.encodeToBase64();

    // setPreviewUri(data:image/png;base64,${base64});

    try {
      const response = await fetch("http://192.168.68.60:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, image: base64 }),
      });

      const data = await response.json();
      console.log("Raw API response:", data);

      const result = data?.prediction || "No prediction returned.";
      if (!result) {
        Alert.alert("Prediction error", "API did not return a valid prediction.");
        onPrediction?.("No prediction");
        return;
        }

      setPrediction(result);
      onPrediction?.(result);
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Error", "Failed to submit handwriting.");
      setPrediction("Error during prediction.");
      onPrediction?.("Error during prediction.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        {showGuide && guideImage && (
          <Image
          source={guideImage} // or { uri: ... } for remote
            style={styles.guideOverlay}
            resizeMode="contain"
          />
  )}
        <Canvas ref={canvasRef} style={styles.canvas}>
          {[...paths, currentPath]
            .map((p) => Skia.Path.MakeFromSVGString(p))
            .filter((skPath): skPath is NonNullable<typeof skPath> => skPath !== null)
            .map((skPath, idx) => (
              <Path
                key={idx}
                path={skPath}
                color="#000"
                style="stroke"
                strokeWidth={8}
              />
            ))}
        </Canvas>
      </View>

      <View style={styles.buttonRow}>
        <CustomButton onPress={handleClear} theme="danger" icon={<Ionicons name="trash" size={30} color="white" />} disabled={paths.length === 0 && currentPath.trim() === ""} />
        
        {!hideAudioButton && ( // 👈 Hides audio button when prop is true
          <CustomButton
            onPress={playCharacterAudio}
            theme="default"
            icon={<Ionicons name="volume-high" size={30} color="black" />}
          />
        )}
    
        <CustomButton onPress={handleSubmit} theme="success" icon={<Ionicons name="checkmark-sharp" size={30} color="white" />} disabled={paths.length === 0 && currentPath.trim() === ""}/>
      </View>

      {previewUri && (
        <Image
          source={{ uri: previewUri }}
          style={styles.previewImage}
        />
      )}

      {prediction && (
        <Text style={styles.prediction}>
          Prediction: <Text style={{ fontWeight: "bold" }}>{prediction}</Text>
        </Text>
      )}
    </View>
  );
}

const CustomButton = ({
  icon,
  onPress,
  theme = "default",
  disabled = false,
}: {
  icon: React.ReactNode;
  onPress: () => void;
  theme?: "default" | "danger" | "success";
  disabled?: boolean;
}) => {
  const backgroundColor = disabled
    ? "#bbb"
    : theme === "danger"
    ? "#ff6666"
    : theme === "success"
    ? "#4CAF50"
    : "#E0E0E0";

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      disabled={disabled}
    >
      {icon}
    </TouchableOpacity>
  );
};



const getAudioFile = (character: string) => {
  switch (character) {
    case "a": return require("../assets/audio/a.wav");
    case "e_i": return require("../assets/audio/e_i.wav");
    case "o_u": return require("../assets/audio/o_u.wav");
    case "pa": return require("../assets/audio/pa.wav");
    case "ka": return require("../assets/audio/ka.wav");
    case "na": return require("../assets/audio/na.wav");
    case "ha": return require("../assets/audio/ha.wav");
    case "ba": return require("../assets/audio/ba.wav");
    case "ga": return require("../assets/audio/ga.wav");
    case "sa": return require("../assets/audio/sa.wav");
    case "da_ra": return require("../assets/audio/da_ra.wav");
    case "ta": return require("../assets/audio/ta.wav");
    case "nga": return require("../assets/audio/nga.wav");
    case "wa": return require("../assets/audio/wa.wav");
    case "la": return require("../assets/audio/la.wav");
    case "ma": return require("../assets/audio/ma.wav");
    case "ya": return require("../assets/audio/ya.wav");
    default:
      throw new Error("Audio file not found for character: " + character);
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  canvasContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 20,
  },
  canvas: {
    flex: 1,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  },
  buttonRow: {
    flexDirection: "row",
    columnGap: 12,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginHorizontal: 4,
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 12,
  },
  prediction: {
    fontSize: 18,
    color: "#222",
    textAlign: "center",
  },
  guideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    zIndex: 1,
    opacity: 0.3, // adjust as needed
  },
});