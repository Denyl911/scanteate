import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  ToastAndroid,
  Modal,
  StyleSheet,
} from "react-native";
import Tabs from "../../components/Tabs";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

function formatearFecha(fecha) {
  if (fecha) {
    fecha = new Date(fecha);
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const dia = fecha.getDate();
    const mesIndex = fecha.getMonth();
    const año = fecha.getFullYear();

    return `${meses[mesIndex]} ${dia}, ${año}`;
  }
}

export default function Galery() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState({
    name: "",
    type: "",
  });
  const [allEmotions, setAllEmotions] = useState([]);
  const [userEmotions, setUserEmotions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const getUser = async () => {
    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const alumno = users.find((el) => el.id == id);
    if (alumno) {
      setUser(alumno);
    }
    const all = JSON.parse(await AsyncStorage.getItem("emotions")) || [];
    setAllEmotions(all);
    all.forEach((el) => {
      if (el.userId == id) {
        setUserEmotions((op) => [...op, el]);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const deleteEmotion = async () => {
    const date = deleteId;
    const allFilt = allEmotions.filter((el) => el.date != date);
    setAllEmotions(allFilt);
    setUserEmotions(userEmotions.filter((el) => el.date != date));
    await AsyncStorage.setItem("emotions", JSON.stringify(allFilt));
    setModalVisible(!modalVisible);
    ToastAndroid.showWithGravity(
      "Registrado exitosamente",
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
        <View className="h-[87%] mt-16">
          <Text className="text-sky-800 text-center font-bold text-3xl mb-3">
            Galería de Emociones
          </Text>
          <Text className="text-gray-800 text-center font-bold text-2xl mb-10">
            {user.name}
          </Text>
          <ScrollView>
            {userEmotions.map((el, i) => {
              return (
                <View
                  className="flex flex-row items-center justify-between rounded-lg p-3 bg-white w-[90%] mx-auto my-1"
                  key={i}
                >
                  <View className="basis-">
                    <Text className="text-lg font-bold mb-3">{el.emocion}</Text>
                    <Text>{formatearFecha(el.date)}</Text>
                  </View>
                  <Image
                    className="w-28 h-28 rounded"
                    source={{ uri: el.uri }}
                  ></Image>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Estas seguro de eliminar el registo?
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
                onPress={deleteEmotion}
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
