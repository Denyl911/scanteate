import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  Pressable,
  Modal,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import Tabs from "../../components/Tabs";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function Reportes() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState({
    id: 0,
    name: "",
    type: "",
  });
  const [userEmotions, setUserEmotions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const getUser = async () => {
    setUserEmotions([]);
    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const alumno = users.find((el) => el.id == id);
    if (alumno) {
      setUser(alumno);
    }
    const all = JSON.parse(await AsyncStorage.getItem("reports")) || [];
    all.forEach((el) => {
      if (el.userId == alumno.id) {
        setUserEmotions((op) => [...op, el]);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const deleteReport = async () => {
    const all = JSON.parse(await AsyncStorage.getItem("reports")) || [];
    const allFilt = all.filter((el) => el.id != deleteId);
    setUserEmotions(allFilt);
    await AsyncStorage.setItem("reports", JSON.stringify(allFilt));
    setModalVisible(!modalVisible);
    ToastAndroid.showWithGravity(
      "Eliminado exitosamente",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };
  const preDelete = (date) => {
    setModalVisible(!modalVisible);
    setDeleteId(date);
  };

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
        <View className="h-[87%] mt-20 p-2">
          <Text className="text-sky-800 text-center font-bold text-2xl">
            Reportes de emociones
          </Text>
          <Text className="text-sky-800 text-center font-bold text-xl mt-3">
            Alumno:
          </Text>
          <Text className="text-gray-800 text-center font-bold text-xl mb-8">
            {user.name}
          </Text>
          <ScrollView>
            {userEmotions.map((el, i) => {
              return (
                <Pressable
                  onPress={() => router.navigate(`/reporte/${el.id}`)}
                  className="flex flex-row items-center justify-between rounded-lg p-3 bg-white w-[90%] mx-auto my-2"
                  key={i}
                >
                  <View className="my-1">
                    <Text className="text-lg font-bold ">{el.name}</Text>
                    <Text>{el.month}</Text>
                    <Pressable
                      onPress={() => preDelete(el.id)}
                      className="mt-5 bg-slate-50 rounded-md px-2 py-1"
                    >
                      <Text className="text-red-500 text-center">
                        X Eliminar
                      </Text>
                    </Pressable>
                  </View>
                  <View className="w-20 h-20 rounded-full bg-sky-600 opacity-95 flex items-center justify-center">
                    <Image
                      className="w-14 h-14"
                      source={require("../../assets/images/user2.png")}
                    ></Image>
                  </View>
                </Pressable>
              );
            })}
            <View
              className={`mt-10 mb-10 ${
                userEmotions.length > 0 ? "block" : "hidden"
              }`}
            >
              <Pressable
                onPress={() => router.navigate(`/createReport/${user.id}`)}
                className="bg-sky-600  rounded-lg py-3 mx-2 mt-4"
              >
                <Text className="text-white font-semibold text-center">
                  Generar reporte
                </Text>
              </Pressable>
            </View>
            <View
              className={`mt-28 ${
                userEmotions.length > 0 ? "hidden" : "block"
              }`}
            >
              <Text className="text-center text-lg">
                Parece que no hay ningun reporte
              </Text>
              <Pressable
                onPress={() => router.navigate(`/createReport/${user.id}`)}
                className="bg-sky-600  rounded-lg py-3 mx-2 mt-4"
              >
                <Text className="text-white font-semibold text-center">
                  Generar reporte
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Estas seguro de eliminar el reporte?
            </Text>
            <View className="flex flex-row">
              <Pressable
                className="p-3 bg-slate-200 rounded-xl mr-5"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="font-bold text-gray-800">Cancelar</Text>
              </Pressable>
              <Pressable
                className="p-3 bg-sky-600 rounded-xl mr-2"
                onPress={deleteReport}
              >
                <Text className="font-bold text-white">Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
