import React, { useCallback, useState, useEffect } from "react";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

export default function Emotions() {
  const [type, setType] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [fotoUri, setFotoUri] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [showPrepareText, setShowPrepareText] = useState(false);
  const [round, setRound] = useState(1);
  const [usedEmojis, setUsedEmojis] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1)); // Para animación de opacidad

  const emojis = ["😄", "😡", "😢", "😨", "😔", "😲", "😐", "🤔", "😭"];
  const emotionNames = [
    "Feliz",
    "Enojado",
    "Triste",
    "Asustado",
    "Desilucionado",
    "Asombrado",
    "Neutral",
    "Pensativo",
    "Llorando",
  ];

  useEffect(() => {
    if (usedEmojis.length >= emojis.length) return;

    const interval = setInterval(() => {
      if (isAnimating) {
        setEmojiIndex((prevIndex) => (prevIndex + Math.floor(Math.random() * emojis.length)) % emojis.length);
      }
    }, 250);

    const timeout = setTimeout(() => {
      let newEmojiIndex = emojiIndex;
      while (usedEmojis.includes(newEmojiIndex)) {
        newEmojiIndex = Math.floor(Math.random() * emojis.length);
      }

      setIsAnimating(false);
      setSelectedEmotion(emotionNames[newEmojiIndex]);
      setEmotion(emojis[newEmojiIndex]);
      setShowPrepareText(true);
      setUsedEmojis((prevUsedEmojis) => [...prevUsedEmojis, newEmojiIndex]);

      // Iniciar la animación de parpadeo
      fadeInOut();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAnimating]);

  const fadeInOut = () => {
    fadeAnim.setValue(1); // Restablecer opacidad a 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const selectEmotion = () => {
    setIsAnimating(true);
    setShowPrepareText(false);
    setSelectedEmotion(""); // Limpiar el texto de la emoción seleccionada antes de que se elija un nuevo emoji
  };

  const getUser = async () => {
    // Lógica para obtener el usuario
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const scanFace = async () => {
    if (fotoUri) {
      setFotoUri(null);
      setEmotion("");
      return;
    }

    setEmotion(selectedEmotion);

    try {
      const img = await cameraRef.takePictureAsync({
        base64: true,
      });

      const flippedImg = await manipulateAsync(
        img.uri,
        [{ flip: FlipType.Horizontal }],
        { format: SaveFormat.JPEG }
      );
      setFotoUri(flippedImg.uri);
      setFotos((prevFotos) => [...prevFotos, { uri: flippedImg.uri, emotion: selectedEmotion }]);
    } catch (e) {
      console.log(e);
    }

    if (round < 3) {
      setRound(round + 1);
      setCurrentScreen(2);
      selectEmotion();
    } else {
      setCurrentScreen(5);
    }
  };

  const showCompletionAlert = () => {
    Alert.alert(
      "Felicidades",
      "¡Completaste las rondas correctamente!",
      [{ text: "OK" }]
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-3xl font-bold">Bienvenido al juego IMITAME!!!</Text>
            <Text className="text-center mt-2">Imita las emociones que te salgan en pantalla!!!</Text>
            <Pressable
              className="bg-sky-800 p-4 rounded-lg mt-4"
              onPress={() => setCurrentScreen(2)}
            >
              <Text className="text-white font-bold text-lg">Comenzar</Text>
            </Pressable>
          </View>
        );

      case 2:
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold" style={{ marginBottom: 1 }}>
              Seleccionando tu emoción a imitar...
            </Text>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{emojis[emojiIndex]}</Text>
            </View>
            {/* Solo mostrar el nombre de la emoción después de que se haya seleccionado */}
            {!isAnimating && selectedEmotion && (
              <Text className="text-xl font-bold">Vas a imitar la emoción: {selectedEmotion}</Text>
            )}
            {showPrepareText && (
              <Animated.Text style={[styles.pulseText, { opacity: fadeAnim, color: "red", textAlign: 'center' }]}>
                Prepárate para imitar, ponte guapo y péinate!
              </Animated.Text>
            )}
            {showPrepareText && (
              <Pressable
                className="bg-sky-800 p-3 rounded-lg mt-4"
                onPress={() => setCurrentScreen(3)}
              >
                <Text className="text-white font-bold text-lg">Empezar</Text>
              </Pressable>
            )}
          </View>
        );
      case 3:
        return (
          <View className="flex-1">
            <CameraView style={styles.camera} ref={setCameraRef} type={type}>
              {/* Espacio para la cámara */}
            </CameraView>
            <Pressable onPress={scanFace} style={styles.minimalistButton}>
              <Text className="text-white">Tomar Foto</Text>
            </Pressable>
          </View>
        );
      case 4:
        return (
          <View className="flex-1 items-center justify-center">
            <Text style={styles.emotionText}>{emotion}</Text>
            {fotoUri && (
              <Image style={styles.photo} source={{ uri: fotoUri }} />
            )}
            <Text className="text-lg text-center">Imitaste la emoción: {selectedEmotion}</Text>
            {round === 3 ? (
              <Pressable
                className="bg-sky-800 p-4 rounded-lg mt-4"
                onPress={() => setCurrentScreen(5)} // Ir a la pantalla de resultados
              >
                <Text className="text-white font-bold text-lg">Siguiente</Text>
              </Pressable>
            ) : null}
          </View>
        );

      case 5:
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-xl font-bold text-center">Completaste las emociones!!!</Text>
            <View style={styles.photosContainer}>
              {fotos.map((foto, index) => (
                <View key={index} style={styles.photoWithEmotion}>
                  <Image source={{ uri: foto.uri }} style={styles.finalPhoto} />
                  <Text style={styles.emotionLabel}>{foto.emotion}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                className="bg-blue-800 p-4 rounded-lg" // Botón azul marino
                onPress={() => {
                  setRound(1);
                  setCurrentScreen(1);
                  setFotos([]);
                  setUsedEmojis([]);
                  setEmotion("");
                  setFotoUri(null);
                }}
              >
                <Text className="text-white font-bold">Reiniciar</Text>
              </Pressable>
              <Pressable
                className="bg-blue-800 p-4 rounded-lg"
                onPress={() => router.back()}
              >
                <Text className="text-white font-bold">Menú Principal</Text>
              </Pressable>
            </View>\
            {/* Llamamos a la función para mostrar la notificación */}
            {showCompletionAlert()}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="auto" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 80 },
  pulseText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center", // Centrado del texto
  },
  emotionText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center", // Centrado del texto
  },
  photo: {
    width: 350, // Aumentar tamaño de imagen
    height: 350, // Aumentar tamaño de imagen
    marginTop: 20,
  },
  photosContainer: {
    flexDirection: "column", // Mantener en columna
    alignItems: "center", // Alinear imágenes al centro
    marginTop: 20,
  },
  finalPhoto: {
    width: 120, // Tamaño de imagen más grande
    height: 120, // Tamaño de imagen más grande
    marginBottom: 10,
  },
  minimalistButton: {
    backgroundColor: "navy", // Azul marino
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-around",
    width: "100%",
  },
  photoWithEmotion: {
    alignItems: "center",
    marginRight: 20,
  },
  emotionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center", // Centrar el texto de la emoción
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});