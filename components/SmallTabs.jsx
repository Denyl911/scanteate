import { View, Text, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";

export default function SmallTabs() {
  const route = useRoute();

  const isEmotionsActive =
    route.name === "emotions" || route.name === "galery" || route.name === "report";

  return (
    <View className="bg-white w-screen px-8 py-4 absolute bottom-0 rounded-xl">
      <View className="flex items-center justify-between flex-row">
        {/* Inicio */}
        <Pressable onPress={() => router.navigate("/home")} className="flex items-center">
          <Feather
            name="home"
            size={28}
            color={route.name === "home" ? "#0369a1" : "#000"}
          />
        </Pressable>

        {/* Emociones con imagen FIGURA-SLOGAN.png */}
        <Pressable onPress={() => router.navigate("/emotions")} className="flex items-center">
          <Image
            source={require("../assets/images/SCANTEATE LOGO FIGURA.png")}
            style={{
              width: 38,
              height: 38,
              resizeMode: "contain",
            }}
          />
        </Pressable>

        {/* Mi Perfil */}
        <Pressable onPress={() => router.navigate("/settings")} className="flex items-center">
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={28}
            color={route.name === "settings" ? "#0369a1" : "#000"}
          />
        </Pressable>
      </View>
    </View>
  );
}
