import {
  View,
  Text,
  StatusBar,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import Tabs from "../components/Tabs";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { ScrollView } from "react-native";

export default function Actvidades() {
  return (
    <View className="h-[100%] bg-slate-200">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <Pressable
        className="absolute top-14 left-5 bg-slate-300 p-2 rounded-lg opacity-50 z-40"
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <View>
        <View className="h-[87%] mt-24 p-3">
          <Text className="text-sky-800 text-center font-custom text-3xl">
            Actividades Descargables
          </Text>
          <ScrollView className="mt-10 px-2">
            <Pressable
              className="p-4 bg-slate-300 rounded-lg mb-5"
              onPress={() =>
                Linking.openURL(
                  "https://drive.google.com/file/d/1BnX6I1JD0gnxAbG1I6ipS_jlWQfBMa3w/view?usp=drive_link"
                )
              }
            >
              <Text className="text-slate-800 font-super text-xl ml-1">
                Relaciona los animales
              </Text>
              <Pressable
                className="bg-sky-700 text-white p-4 rounded w-3/4 mt-4"
                onPress={() =>
                  Linking.openURL(
                    "https://drive.google.com/file/d/1BnX6I1JD0gnxAbG1I6ipS_jlWQfBMa3w/view?usp=drive_link"
                  )
                }
              >
                <Text className="text-center text-white font-super">
                  Descargar
                </Text>
              </Pressable>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  position: "absolute",
                  right: 8,
                  bottom: 25,
                }}
                source={require("../assets/images/act1.jpeg")}
              ></Image>
            </Pressable>
            <Pressable
              className="p-4 bg-slate-300 rounded-lg mb-5"
              onPress={() =>
                Linking.openURL(
                  "https://drive.google.com/file/d/1CJNrYkWFZQ5DfOEbBTkFRlPw6GPhwttB/view?usp=drive_link"
                )
              }
            >
              <Text className="text-slate-800 font-super text-xl ml-1">
                Rompecabezas
              </Text>
              <Pressable
                className="bg-sky-700  p-4 rounded w-3/4 mt-4"
                onPress={() =>
                  Linking.openURL(
                    "https://drive.google.com/file/d/1CJNrYkWFZQ5DfOEbBTkFRlPw6GPhwttB/view?usp=drive_link"
                  )
                }
              >
                <Text className="text-center text-white font-super">
                  Descargar
                </Text>
              </Pressable>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  position: "absolute",
                  right: 8,
                  bottom: 25,
                }}
                source={require("../assets/images/act2.jpeg")}
              ></Image>
            </Pressable>
            <Pressable
              className="p-4 bg-slate-300 rounded-lg mb-5"
              onPress={() =>
                Linking.openURL(
                  "https://drive.google.com/file/d/1fDJz8ZQeT8oPsDhMvCaMBU1GVOUWDKx4/view?usp=drive_link"
                )
              }
            >
              <Text className="text-slate-800 font-super text-xl ml-1">
                ¿Cuál es la parte faltante?
              </Text>
              <Pressable
                className="bg-sky-700 p-4 rounded w-3/4 mt-4"
                onPress={() =>
                  Linking.openURL(
                    "https://drive.google.com/file/d/1fDJz8ZQeT8oPsDhMvCaMBU1GVOUWDKx4/view?usp=drive_link"
                  )
                }
              >
                <Text className="text-center text-white font-super">
                  Descargar
                </Text>
              </Pressable>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  position: "absolute",
                  right: 8,
                  bottom: 25,
                }}
                source={require("../assets/images/act3.jpeg")}
              ></Image>
            </Pressable>
            <Pressable
              className="p-4 bg-slate-300 rounded-lg mb-5"
              onPress={() =>
                Linking.openURL(
                  "https://drive.google.com/file/d/1hs70QcHYUHybIzC1IAAHjy_YtkqbOoCG/view?usp=drive_link"
                )
              }
            >
              <Text className="text-slate-800 font-super text-xl ml-1">
                Relaciona las emociones
              </Text>
              <Pressable
                className="bg-sky-700 p-4 rounded w-3/4 mt-4"
                onPress={() =>
                  Linking.openURL(
                    "https://drive.google.com/file/d/1hs70QcHYUHybIzC1IAAHjy_YtkqbOoCG/view?usp=drive_link"
                  )
                }
              >
                <Text className="text-center text-white font-super">
                  Descargar
                </Text>
              </Pressable>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  position: "absolute",
                  right: 8,
                  bottom: 25,
                }}
                source={require("../assets/images/act4.jpeg")}
              ></Image>
            </Pressable>
            <Pressable
              className="p-4 bg-slate-300 rounded-lg mb-6"
              onPress={() =>
                Linking.openURL(
                  "https://drive.google.com/file/d/1onRV7GIIBZc0A5BIMYYcQPAEKN86_4tf/view?usp=drive_link"
                )
              }
            >
              <Text className="text-slate-800 font-super text-xl ml-1">
                Arma tu emoción
              </Text>
              <Pressable
                className="bg-sky-700 p-4 rounded w-3/4 mt-4"
                onPress={() =>
                  Linking.openURL(
                    "https://drive.google.com/file/d/1onRV7GIIBZc0A5BIMYYcQPAEKN86_4tf/view?usp=drive_link"
                  )
                }
              >
                <Text className="text-center text-white font-super">
                  Descargar
                </Text>
              </Pressable>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  position: "absolute",
                  right: 8,
                  bottom: 25,
                }}
                source={require("../assets/images/act5.jpeg")}
              ></Image>
            </Pressable>
            <Pressable className="px-4 py-8 bg-slate-300 rounded-lg mb-20">
              <Text className="text-slate-800 font-super text-xl ml-1 text-center">
                Más actividades pronto...
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
      <Tabs />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
