import { CameraView, useCameraPermissions } from "expo-camera";
import { useCallback, useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import Anthropic from "@anthropic-ai/sdk";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SmallTabs from "../components/SmallTabs";

export default function Emotions() {
  const anthropic = new Anthropic({
    apiKey:
      ""
  });

  const [type, setType] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [emotion, setEmotion] = useState("Escaner de Emociones");
  const [scanText, setScanText] = useState("ESCANEAR");
  const [fotoUri, setFotoUri] = useState(null);
  const [color, setColor] = useState("text-sky-900");
  const [user, setUser] = useState({
    id: 0,
    name: "",
    type: "",
  });
  const getUser = async () => {
    setUser(JSON.parse(await AsyncStorage.getItem("user")) || user);
  };
  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const emotionColors = {
    Felicidad: "text-green-500",
    Alegría: "text-green-500",
    Tristeza: "text-yellow-400",
    Enojo: "text-rose-600",
    Ira: "text-rose-600",
    Miedo: "text-yellow-400",
    Disgusto: "text-yellow-400",
    Sorpresa: "text-green-500",
    No: "text-sky-900",
  };

  function toggleCameraType() {
    setType((current) => (current === "back" ? "front" : "back"));
  }

  async function scanFace() {
    if (fotoUri) {
      setFotoUri(null);
      setScanText("ESCANEAR");
      setEmotion("Escaner de Emociones");
      setColor("text-sky-900");
      return;
    }
    setEmotion("Escaneando...");
    setScanText("Volver");
    try {
      const img = await cameraRef.takePictureAsync({
        base64: true,
      });
      if (type == "front") {
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
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 20,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: img.base64,
                },
              },
              {
                type: "text",
                text: "Menciona unicamente el nombre de la emocion presente en el rostro y si no encuentras ningun rostro di solamente 'No'",
              },
            ],
          },
        ],
      });
      const emo = msg.content[0].text;

      if (emo != "No") {
        setEmotion(emo);
        setColor(emotionColors[emo]);
        const emotions =
          JSON.parse(await AsyncStorage.getItem("emotions")) || [];
        const data = {
          userId: user.id,
          emocion: emo,
          color: emotionColors[emo],
          uri: img.uri,
          date: Date.now(),
        };
        emotions.unshift(data);
        await AsyncStorage.setItem("emotions", JSON.stringify(emotions));
      } else {
        setEmotion("No se detectó ninguna");
      }
    } catch (e) {
      console.log(e);
    }
  }

  function ShowImage(props) {
    if (props.show) {
      return (
        <Image
          style={{
            borderRadius: 8,
            borderColor: "#000",
            borderWidth: 2,
            height: 472,
            width: 382,
          }}
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
      <View className="flex- items-center">
        <View className="w-full">
          <Pressable
            className=" bg-slate-200 p-2 rounded-lg z-40 w-12 my-2 ml-2"
            onPress={() => router.back()}
          >
            <AntDesign name="left" size={24} color="#0369a1" />
          </Pressable>
        </View>
        <View
          style={{
            display: fotoUri ? "none" : "block",
            marginHorizontal: 20,
            borderColor: "#000",
            borderWidth: 4,
            borderRadius: 12,
            height: 480,
            width: 390,
          }}
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
        <Text className={`mt-16 text-4xl font-bold text-center ${color}`}>
          {emotion}
        </Text>
      </View>
      <View className="flex flex-row justify-between items-center mt-16 mx-5">
        <Pressable
          className="p-2 rounded-full bg-slate-200 active:bg-slate-300"
          onPress={toggleCameraType}
        >
          <FontAwesome6 name="camera-rotate" size={38} color="rgb(8 47 73)" />
        </Pressable>
        <Pressable
          className="px-4 py-3 rounded-full bg-sky-800 active:bg-sky-700"
          onPress={scanFace}
        >
          <Text className="text-3xl font-bold text-center text-white">
            {scanText}
          </Text>
        </Pressable>
        <Pressable
          className="p-2 rounded-full  bg-slate-200 active:bg-slate-300"
          onPress={() => router.navigate("/galery")}
        >
          <MaterialIcons name="photo-library" size={40} color="rgb(8 47 73)" />
        </Pressable>
      </View>
      <SmallTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderColor: "#000",
    borderWidth: 4,
    borderRadius: 12,
    height: 480,
    width: 390,
  },
  face: {
    marginHorizontal: 20,
    borderColor: "#000",
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
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
