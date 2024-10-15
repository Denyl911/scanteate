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
  TextInput,
  StyleSheet,
  ToastAndroid,
  Switch,
} from "react-native";
import Tabs from "../components/Tabs";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from "@react-native-picker/picker";

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
export default function ReportConfig() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState({
    id: 0,
    name: "",
    type: "",
  });
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [selectedVal, setSelectedVal] = useState("Semanal");

  const sendReport = () => {
    ToastAndroid.showWithGravity(
      "Enviando Reporte",
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };

  const setPscicoEmail = async () => {
    const res = await fetch()
  }

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
          <Text className="text-sky-800 text-center font-bold text-3xl">
            Configuración de envio de reportes
          </Text>
          <View className="mb-6 mt-10 px-2">
            <Text className="text-slate-800 font-bold text-xl">
              Correo electrónico del psicólogo
            </Text>
            <View className="flex flex-row content-center justify-between">
              <TextInput
                className="border-2 rounded-lg border-sky-800 text-2xl placeholder:text-slate-400 w-[72%] p-1 pl-3 text-sm"
                onChangeText={setEmail} 
                value={email}
                keyboardType="email-address"
                placeholder="Email"
              />
              <Pressable className="p-2 bg-sky-600 rounded w-[25%] flex items-center mr-2"><Text className="text-white font-bold">Guardar <Entypo name="save" size={16} color="white" /></Text></Pressable>
            </View>
          </View>
          <View className="mx-2 px-3 border-b-2 border-sky-800 py-2 rounded">
            <Text className="text-xl mt-3 font-bold text-slate-800">
              Envío de reportes automatico
            </Text>
            <Switch
              style={{ position: "absolute", right: 40, top: 5 }}
              trackColor={{ false: "#767577", true: "rgb(125 211 252)" }}
              thumbColor={"#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <View className="mb-10 mt-10 px-2">
            <Text className="text-slate-800 font-bold text-xl">
              Periodo de envio:{" "}
            </Text>
            <View className="bg-slate-300 rounded-lg">
              <Picker
                selectedValue={selectedVal}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedVal(itemValue)
                }
              >
                <Picker.Item label="Semanal" value="Semanal" />
                <Picker.Item label="Quincenal" value="Quincenal" />
                <Picker.Item label="Mensual" value="Mensual" />
              </Picker>
            </View>
          </View>
          <Text className="text-slate-800 font-bold text-xl ml-2">
            Envio manual:
          </Text>
          <Pressable
            className="p-3 bg-sky-600 rounded mx-2"
            onPress={sendReport}
          >
            <Text className="text-center text-xl font-bold text-white">
              Enviar reporte manualmente
            </Text>
            <MaterialCommunityIcons
              className="absolute right-7 bottom-2"
              name="email-send"
              size={30}
              color="white"
            />
          </Pressable>
        </View>
      </View>
      <Tabs />
    </View>
  );
}