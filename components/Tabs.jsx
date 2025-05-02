import { View, Text, Pressable, Keyboard, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function Tabs() {
  const route = useRoute();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const isEmotionsActive =
    route.name === "emotions" || route.name === "galery" || route.name === "report";

  return (
    <View
      className={`bg-white rounded-t-xl w-screen px-8 py-5 absolute bottom-0 ${
        isOpen ? "hidden" : ""
      }`}
    >
      <View className="flex items-center justify-between flex-row">
        {/* Inicio */}
        <Pressable onPress={() => router.navigate("/home")} className="flex items-center">
          <Feather
            name="home"
            size={28}
            color={route.name === "home" ? "#0369a1" : "rgb(107,114,128)"}
          />
          <Text
            className={`${
              route.name === "home"
                ? "text-sky-800 font-slabold"
                : "text-gray-500 font-slabold"
            } text-center`}
          >
            Inicio
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.navigate("/emotions")}
          className="flex items-center justify-center"
        >
          <Image
            source={require("../assets/images/SCANTEATE LOGO FIGURA.png")}
            style={{
              width: 33,
              height: 33,
            }}
            resizeMode="contain"
          />
          <Text
            className={`${
              isEmotionsActive
                ? "text-sky-800 font-slabold"
                : "text-gray-500 font-slabold"
            } text-center`}
          >
            Emociones
          </Text>
        </Pressable>

        {/* Mi Perfil */}
        <Pressable onPress={() => router.navigate("/settings")} className="flex items-center">
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={28}
            color={route.name === "settings" ? "#0369a1" : "rgb(107,114,128)"}
          />
          <Text
            className={`${
              route.name === "settings"
                ? "text-sky-800 font-slabold"
                : "text-gray-500 font-slabold"
            } text-center`}
          >
            Mi Perfil
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
