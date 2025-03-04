import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useState } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import Anthropic from '@anthropic-ai/sdk';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Speech from 'expo-speech';
import SmallTabs from '../components/SmallTabs';

export default function Emotions() {
  const anthropic = new Anthropic({
    apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API,
  });

  const [type, setType] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [emotion, setEmotion] = useState('Escaner de Emociones');
  const [scanText, setScanText] = useState('ESCANEAR');
  const [fotoUri, setFotoUri] = useState(null);
  const [color, setColor] = useState('text-sky-900');
  const [border, setBorder] = useState('border-sky-900');
  const [user, setUser] = useState({
    id: 0,
    name: '',
  });
  const getUser = async () => {
    setUser(JSON.parse(await AsyncStorage.getItem('user')) || user);
  };
  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const emotionColors = {
    Felicidad: 'text-green-500',
    Alegría: 'text-green-500',
    Tristeza: 'text-yellow-400',
    Enojo: 'text-rose-600',
    Ira: 'text-rose-600',
    Miedo: 'text-yellow-400',
    Disgusto: 'text-yellow-400',
    Sorpresa: 'text-green-500',
    No: 'text-sky-900',
  };

  function toggleCameraType() {
    setType((current) => (current === 'back' ? 'front' : 'back'));
  }

  const sayEmotion = () => {
    if (emotion != 'Escaner de Emociones') {
      Speech.speak(emotion, { language: 'es' });
    }
  };

  async function scanFace() {
    if (fotoUri) {
      setFotoUri(null);
      setScanText('ESCANEAR');
      setEmotion('Escaner de Emociones');
      setColor('text-sky-900');
      return;
    }
    setEmotion('Escaneando...');
    setScanText('Volver a Escanear');
    try {
      const img = await cameraRef.takePictureAsync({
        base64: true,
      });
      if (type == 'front') {
        const fliped = await manipulateAsync(
          img.uri,
          [{ flip: FlipType.Horizontal }],
          { format: SaveFormat.JPEG }
        );
        setFotoUri(fliped.uri);
      } else {
        setFotoUri(img.uri);
      }
      const msg = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 20,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: img.base64,
                },
              },
              {
                type: 'text',
                text: "Identifica exclusivamente la emoción predominante reflejada en el rostro de la persona. Si no se detecta ningún rostro, responde únicamente con 'No'.",
              },
            ],
          },
        ],
      });
      const emo = msg.content[0].text;

      if (emo != 'No') {
        setEmotion(emo);
        Speech.speak(emo, { language: 'es' });
        setColor(emotionColors[emo]);
        setBorder(color.replace('text', 'border'));
        try {
          const res = await fetch('https://api.scanteate.fun/users/emotions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              UserId: user.id,
              name: emo,
              color: emotionColors[emo],
              uri: img.uri,
            }),
          });
          const data = await res.json();
          const emotions =
            JSON.parse(await AsyncStorage.getItem('emotions')) || [];
          emotions.unshift(data);
          await AsyncStorage.setItem('emotions', JSON.stringify(emotions));
        } catch (e) {
          console.log(e);
        }
      } else {
        setEmotion('No se detectó ninguna');
      }
    } catch (e) {
      console.log(e);
    }
  }

  function ShowImage(props) {
    if (props.show) {
      return (
        <Image
          className={`rounded-lg ${border} border-2 h-[472] w-[382]`}
          source={{
            uri: fotoUri,
          }}
        ></Image>
      );
    }
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className=" flex items-center justify-center h-[100%]">
        <StatusBar
          backgroundColor="#0d5692"
          hidden={false}
          translucent={true}
        />
        <Text className="text-center text-2xl font-semibold">
          Necesitamos que nos otorgues permiso para acceder a la camara
        </Text>
        <Pressable
          className="bg-sky-700 p-3 rounded-lg mt-3"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-lg">Otorgar permisos</Text>
        </Pressable>
        <Pressable
          className="bg-sky-100 p-3 rounded-lg mt-3"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 font-bold text-lg">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="h-[100%]">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <View style={{ marginTop: StatusBar.currentHeight }}></View>
      <View className="flex flex-row justify-between items-center p-2 bg-white">
        <Pressable
          className="bg-slate-300 p-2 rounded-lg opacity-50 z-40"
          onPress={() => router.back()}
        >
          <AntDesign name="left" size={24} color="#0369a1" />
        </Pressable>

        <Image
          source={require('../assets/images/SNTv2.png')}  // Asegúrate de que la ruta sea correcta
          style={{ width: 135, height: 50 }}  // Ajusta el tamaño según sea necesario
        />

        <View className="px-5"></View>
      </View>
      <View className="flex- items-center">
        <View
          className={`h-[500] w-[100%] rounded-xl border-4 ${border} mx-5 ${fotoUri ? 'hidden' : 'block'
            }`}
        >
          <CameraView
            ref={(ref) => setCameraRef(ref)}
            style={styles.camera}
            facing={type}
            pictureSize="1080x1080"
          ></CameraView>
        </View>
        <ShowImage show={fotoUri ? true : false}></ShowImage>
      </View>
      <View>
        <Pressable onPress={sayEmotion}>
          <Text className={`mt-12 text-3xl text-center font-super ${color}`}>
            {emotion}
          </Text>
        </Pressable>
        <Text className="text-center font-sla">
          Toma una foto y escanea la emoción del rostro
        </Text>
      </View>
      <View className="flex flex-row justify-between items-center mt-10 mx-4">
        <Pressable
          className="p-2 rounded-xl bg-slate-200 active:bg-slate-300"
          onPress={toggleCameraType}
        >
          <FontAwesome6 name="camera-rotate" size={34} color="rgb(8 47 73)" />
        </Pressable>
        <Pressable
          className="px-6 py-3 rounded-full bg-sky-800 active:bg-sky-700"
          onPress={scanFace}
        >
          <Text className="text-3xl font-custom text-center text-white">
            {scanText}
          </Text>
        </Pressable>
        <Pressable
          className="p-2 rounded-xl  bg-slate-200 active:bg-slate-300"
          onPress={() => router.navigate('/galery')}
        >
          <MaterialIcons name="photo-library" size={36} color="rgb(8 47 73)" />
        </Pressable>
      </View>
      <SmallTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderColor: '#000',
    borderWidth: 4,
    borderRadius: 12,
    height: 480,
    width: 390,
  },
  face: {
    marginHorizontal: 20,
    borderColor: '#000',
    borderWidth: 4,
    borderRadius: 12,
    height: 420,
    width: 340,
  },
  camera: {
    flex: 1,
    borderRadius: 15,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
