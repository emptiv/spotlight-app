import { playSound } from '@/constants/playClickSound';
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Canvas,
  Path,
  Skia,
  useCanvasRef,
} from "@shopify/react-native-skia";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const CANVAS_SIZE = 280;
const DRAWING_SIZE = 280;

type HandwritingCanvasProps = {
  onPrediction?: (prediction: string) => void;
  onClear?: () => void;
  lesson?: string;
  showGuide?: boolean;
  guideGIF?: any;
  guideImage?: any;
  character?: string;
  hideAudioButton?: boolean;
  gifDuration?: number;
};

export default function HandwritingCanvas({
  onPrediction,
  onClear,
  lesson,
  showGuide,
  guideGIF,
  guideImage,
  character,
  hideAudioButton,
  gifDuration = 2000,
}: HandwritingCanvasProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [showGuideGIF, setShowGuideGIF] = useState(true);
  const canvasRef = useCanvasRef();
  const [strokeHistory, setStrokeHistory] = useState<Array<Array<{ x: number, y: number }>>>([]);
  const [strokeTimings, setStrokeTimings] = useState<Array<{ start: number, end: number }>>([]);

  const strokeStartRef = useRef<number>(0);

  const currentStrokeRef = useRef<Array<{ x: number, y: number }>>([]); 

  useEffect(() => {
    setShowGuideGIF(true); // reset GIF on character change
  }, [guideGIF]);

  const playCharacterAudio = async () => {
    if (!character) {
      Alert.alert("Audio Error", "Character not set.");
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(getAudioFile(character));
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
      strokeStartRef.current = Date.now();
      setCurrentPath(`M${locationX} ${locationY}`);
      currentStrokeRef.current = [{ x: locationX, y: locationY }];
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      currentStrokeRef.current.push({ x: locationX, y: locationY });
      setCurrentPath((prev) => `${prev} L${locationX} ${locationY}`);
    },
    onPanResponderRelease: () => {
      const strokeEnd = Date.now();
      const strokeStart = strokeStartRef.current;
      if (currentPath.trim() !== "") {
        setPaths((prev) => [...prev, currentPath]);
        setStrokeHistory((prev) => [...prev, currentStrokeRef.current]);
        setStrokeTimings((prev) => [...prev, { start: strokeStart, end: strokeEnd }]);
      }
      setCurrentPath("");
    },
  });

  const validateGesture = () => {
    const strokeCount = strokeHistory.length;
    const totalDuration = strokeTimings.reduce((sum, { start, end }) => sum + (end - start), 0);

    console.log("Stroke count:", strokeCount);
    console.log("Duration:", totalDuration);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    strokeHistory.flat().forEach(({ x, y }) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    const boxArea = boxWidth * boxHeight;
    const areaRatio = boxArea / (CANVAS_SIZE * CANVAS_SIZE);

    console.log("Bounding box area ratio:", areaRatio.toFixed(4));
    console.log("Box size:", boxWidth.toFixed(2), "×", boxHeight.toFixed(2));

    if (boxArea === 0 || areaRatio < 0.08) {
      Alert.alert("Invalid input", "Try again.");
      return false;
    }

    if (areaRatio > 0.70) {
      Alert.alert("Invalid input", "Try again.");
      return false;
    }

    if (strokeCount === 0) {
      Alert.alert("Invalid input", "No strokes detected.");
      return false;
    }

    if (totalDuration < 150) {
      Alert.alert("Invalid input", "Drawing was too quick.");
      return false;
    }

    return true;
  };

  const handleClear = () => {
    playSound('click');
    setPaths([]);
    setCurrentPath("");
    setPrediction(null);
    setPreviewUri(null);
    setStrokeHistory([]);
    setStrokeTimings([]);
    onClear?.();
  };

  const handleSubmit = async () => {
    if (!validateGesture()) return;

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

    try {
      const response = await fetch("http://192.168.68.55:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, image: base64 }),
      });

      const data = await response.json();
      const result = data?.prediction || "No prediction returned.";
      setPrediction(result);
      onPrediction?.(result);

      if (result === character) {
        playSound('correct');
      } else {
        playSound('wrong');
      }

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
        {showGuide && (
          <>
            {guideImage && (
              <Image
                source={guideImage}
                resizeMode="contain"
                style={styles.guideImage}
              />
            )}
            {guideGIF && showGuideGIF && (
              <WebView
                originWhitelist={["*"]}
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          html, body {
                            margin: 0;
                            padding: 0;
                            background: transparent;
                          }
                          img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                          }
                        </style>
                      </head>
                      <body>
                        <img src="${Image.resolveAssetSource(guideGIF).uri}" />
                        <script>
                          setTimeout(() => {
                            window.ReactNativeWebView.postMessage("done");
                          }, ${gifDuration});
                        </script>
                      </body>
                    </html>
                  `,
                }}
                javaScriptEnabled
                onMessage={(event) => {
                  if (event.nativeEvent.data === "done") {
                    setShowGuideGIF(false);
                  }
                }}
                style={styles.guideOverlay}
                scrollEnabled={false}
                scalesPageToFit={false}
                automaticallyAdjustContentInsets={false}
                mixedContentMode="always"
              />
            )}
          </>
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
        <CustomButton
          onPress={handleClear}
          theme="danger"
          icon={<Ionicons name="trash" size={30} color="white" />}
          disabled={paths.length === 0 && currentPath.trim() === ""}
        />
        {showGuide && (
          <CustomButton
            onPress={() => {
              playSound('click');
              setShowGuideGIF(true);
            }}
            theme="default"
            icon={<Ionicons name="eye" size={30} color="black" />}
          />
        )}
        {!hideAudioButton && (
          <CustomButton
            onPress={playCharacterAudio}
            theme="default"
            icon={<Ionicons name="volume-high" size={30} color="black" />}
          />
        )}
        <CustomButton
          onPress={handleSubmit}
          theme="success"
          icon={<Ionicons name="checkmark-sharp" size={30} color="white" />}
          disabled={paths.length === 0 && currentPath.trim() === ""}
        />
      </View>

      {previewUri && (
        <Image source={{ uri: previewUri }} style={styles.previewImage} />
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
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 20,
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    zIndex: 3,
  },
  guideImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    zIndex: 1,
    opacity: 0.1,
  },
  guideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    zIndex: 2,
    opacity: 0.2,
    backgroundColor: "transparent",
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
