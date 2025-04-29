import React, { useCallback, useState, useEffect } from 'react';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

export default function Emotions() {
  const [type, setType] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [emotion, setEmotion] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [showPrepareText, setShowPrepareText] = useState(false);
  const [round, setRound] = useState(1);
  const [usedEmojis, setUsedEmojis] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1)); // Para animación de opacidad

  const emojis = ['😄', '😡', '😢', '😨', '😔', '😲', '😐', '🤔', '😭'];
  const emotionNames = [
    'Feliz',
    'Enojado',
    'Triste',
    'Asustado',
    'Desilucionado',
    'Asombrado',
    'Neutral',
    'Pensativo',
    'Llorando',
  ];

  useEffect(() => {
    if (usedEmojis.length >= emojis.length) return;

    const interval = setInterval(() => {
      if (isAnimating) {
        setEmojiIndex(
          (prevIndex) =>
            (prevIndex + Math.floor(Math.random() * emojis.length)) %
            emojis.length
        );
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
          duration: 1000,
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
    setSelectedEmotion(''); // Limpiar el texto de la emoción seleccionada antes de que se elija un nuevo emoji
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
      setEmotion('');
      return;
    }

    setEmotion(selectedEmotion);

    try {
      const img = await cameraRef.takePictureAsync();

      const flippedImg = await manipulateAsync(
        img.uri,
        [{ flip: FlipType.Horizontal }],
        { format: SaveFormat.JPEG }
      );
      setFotoUri(flippedImg.uri);
      setFotos((prevFotos) => [
        ...prevFotos,
        { uri: flippedImg.uri, emotion: selectedEmotion },
      ]);
    } catch (e) {
      console.log(e);
    }

    if (round < 3) {
      setRound(round + 1);
      setCurrentScreen(2);
      selectEmotion();
    } else {
      setCurrentScreen(5);
      showCompletionAlert()
    }
  };

  const showCompletionAlert = () => {
    Alert.alert('Felicidades', '¡Completaste las rondas correctamente!', [
      { text: 'OK' },
    ]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        case 1:
          return (
            <View className="flex-1 items-center justify-center relative">
              <Image 
                source={require('../assets/images/port_imitame.gif')} // Ajusta la ruta del GIF
                style={{ width: '100%', height: '100%', position: 'absolute' }} 
                resizeMode="cover"
              />
              <Pressable
                className="bg-sky-800 p-4 rounded-lg absolute bottom-20"
                onPress={() => setCurrentScreen(2)}
              >
                <Text className="text-white font-super text-lg">Comenzar</Text>
              </Pressable>
            </View>
          );
        
      case 2:
        return (
          <View className="flex-1 items-center justify-center">
            <View className="absolute left-0 top-8">
              <Pressable
                className="ml-4 p-2 rounded-xl mt-5 bg-sky-100"
                onPress={() => router.back()}
              >
                <AntDesign name="left" size={24} color="gray" />
              </Pressable>
            </View>
            <Text className="text-xl font-super mb-2">
            Ronda <Text className="text-sky-600">{round}</Text> de 3
            </Text>
            <Text className="text-lg font-super mb-4">
              Seleccionando tu emoción a imitar...
            </Text>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{emojis[emojiIndex]}</Text>
            </View>
            {/* Solo mostrar el nombre de la emoción después de que se haya seleccionado */}
            {!isAnimating && selectedEmotion && (
              <View className="mb-5">
                <Text className="text-xl font-super">
                  Vas a imitar la emoción:
                </Text>
                <Text className="text-xl font-super text-sky-700 text-center">
                  {selectedEmotion}
                </Text>
              </View>
            )}
            {showPrepareText && (
              <Animated.Text
                style={[
                  styles.pulseText,
                  {
                    opacity: fadeAnim,
                    color: 'red',
                    textAlign: 'center',
                    fontFamily: 'SlaberlinBold',
                    marginBottom: 24,
                  },
                ]}
              >
                Prepárate para imitar, ponte guapo y péinate!
              </Animated.Text>
            )}
            {showPrepareText && (
              <Pressable
                className="bg-sky-800 p-3 rounded-lg mt-4 w-[90%] mx-auto"
                onPress={() => setCurrentScreen(3)}
              >
                <Text className="text-white text-xl font-custom px-5 text-center py-1">
                  Empezar
                </Text>
              </Pressable>
            )}
          </View>
        );
      case 3:
        return (
          <View className="flex-1">
            <CameraView
              style={styles.camera}
              ref={setCameraRef}
              facing={type}
            ></CameraView>
            <Pressable onPress={scanFace} className="bg-sky-800 py-5">
              <Text className="text-white font-super text-center text-xl">
                Tomar Foto
              </Text>
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
            <Text className="text-lg text-center">
              Imitaste la emoción: {selectedEmotion}
            </Text>
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
            <Text className="text-3xl text-center font-custom text-sky-800">
              Completaste las emociones!!!
            </Text>
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
                className="bg-sky-700 p-4 rounded-lg" // Botón azul marino
                onPress={() => {
                  setRound(1);
                  setCurrentScreen(1);
                  setFotos([]);
                  setUsedEmojis([]);
                  setEmotion('');
                  setFotoUri(null);
                }}
              >
                <Text className="text-white font-super">Reiniciar</Text>
              </Pressable>
              <Pressable
                className="bg-sky-700 p-4 rounded-lg"
                onPress={() => router.back()}
              >
                <Text className="text-white font-super">Menú Principal</Text>
              </Pressable>
            </View>
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
    textAlign: 'center', // Centrado del texto
  },
  emotionText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center', // Centrado del texto
  },
  photo: {
    width: 350, // Aumentar tamaño de imagen
    height: 350, // Aumentar tamaño de imagen
    marginTop: 20,
  },
  photosContainer: {
    flexDirection: 'column', // Mantener en columna
    alignItems: 'center', // Alinear imágenes al centro
    marginTop: 20,
  },
  finalPhoto: {
    width: 150, // Tamaño de imagen más grande
    height: 150, // Tamaño de imagen más grande
    marginBottom: 10,
    borderRadius: 8
  },
  minimalistButton: {
    backgroundColor: 'navy', // Azul marino
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    width: '100%',
  },
  photoWithEmotion: {
    alignItems: 'center',
    marginRight: 20,
  },
  emotionLabel: {
    fontSize: 16,
    marginBottom: 14,
    textAlign: 'center', // Centrar el texto de la emoción
    fontFamily: 'SlaberlinBold'
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
