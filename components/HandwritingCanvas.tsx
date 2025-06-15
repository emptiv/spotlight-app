import {
  Canvas,
  Path,
  Skia,
  useCanvasRef,
} from "@shopify/react-native-skia";
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
};

export default function HandwritingCanvas({ onPrediction, onClear }: HandwritingCanvasProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const canvasRef = useCanvasRef();

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

    // setPreviewUri(`data:image/png;base64,${base64}`);

    try {
      const response = await fetch("http://192.168.68.63:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();
      const result = data?.prediction || "No prediction returned.";
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
        <CustomButton label="Clear" onPress={handleClear} theme="danger" />
        <CustomButton label="Submit" onPress={handleSubmit} theme="success" />
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
  label,
  onPress,
  theme = "default",
}: {
  label: string;
  onPress: () => void;
  theme?: "default" | "danger" | "success";
}) => {
  const backgroundColor =
    theme === "danger"
      ? "#ff6666"
      : theme === "success"
      ? "#4CAF50"
      : "#E0E0E0";
  const textColor = theme === "default" ? "#333" : "#fff";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor }]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
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
});
