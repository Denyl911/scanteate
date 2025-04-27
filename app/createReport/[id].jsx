import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  ToastAndroid,
} from "react-native";
import Tabs from "../../components/Tabs";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
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

export default function createReport() {
  const [selectedMonth, setSelectedMonth] = useState("5");
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState({
    name: "",
    type: "",
  });
  const [reportName, setReportName] = useState();

  const getUser = async () => {
    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const alumno = users.find((el) => el.id == id);
    if (alumno) {
      setUser(alumno);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const saveReport = async () => {
    const all = JSON.parse(await AsyncStorage.getItem("emotions")) || [];
    let emotions = [];
    all.forEach((el) => {
      if (el.userId == user.id) {
        let date = new Date();
        let year = date.getFullYear();
        let firstDayOfMonth = new Date(
          year,
          Number(selectedMonth),
          1
        ).getTime();
        let lastDayOfMonth = new Date(
          year,
          Number(selectedMonth) + 1,
          0
        ).getTime();
        if (el.date >= firstDayOfMonth && el.date <= lastDayOfMonth) {
          emotions.push(el);
        }
      }
    });
    const reports = JSON.parse(await AsyncStorage.getItem("reports")) || [];
    await AsyncStorage.setItem(
      "reports",
      JSON.stringify([
        ...reports,
        {
          id: reports.length + 1,
          userId: user.id,
          name: reportName,
          month: meses[Number(selectedMonth)],
          emotions: emotions,
        },
      ])
    );
    ToastAndroid.showWithGravity(
      "Reporte generado exitosamente",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    router.replace(`/reporte/${reports.length + 1}`);
  };

  return (
    <View className="h-[100%] bg-slate-200">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <Pressable
        className="absolute top-11 left-5 bg-slate-300 p-2 rounded-lg opacity-50"
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <View>
        <View className="h-[87%] mt-16">
          <Text className="text-sky-800 text-center font-bold text-3xl mb-10">
            Crear Reporte
          </Text>
          <View className="mx-5">
            <View className="mb-8">
              <Text className="text-slate-700 font-bold text-xl">
                Nombre de reporte:
              </Text>
              <TextInput
                className="bg-slate-300 rounded-lg px-2 py-1"
                onChangeText={setReportName}
                value={reportName}
                placeholder="Nombre del reporte"
              />
            </View>
            <View className="mb-8">
              <Text className="text-slate-700 font-bold text-xl">Alumno:</Text>
              <View className="bg-slate-300 rounded-lg p-2">
                <Text className="text-gray-800 font-bold text-xl bg-slate-300">
                  {user.name}
                </Text>
              </View>
            </View>
            <View className="mb-10">
              <Text className="text-slate-700 font-bold text-xl">Mes: </Text>
              <View className="bg-slate-300 rounded-lg p-1">
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedMonth(itemValue)
                  }
                >
                  <Picker.Item label="Enero" value="0" />
                  <Picker.Item label="Febrero" value="1" />
                  <Picker.Item label="Marzo" value="2" />
                  <Picker.Item label="Abril" value="3" />
                  <Picker.Item label="Mayo" value="4" />
                  <Picker.Item label="Junio" value="5" />
                  <Picker.Item label="Julio" value="6" />
                  <Picker.Item label="Agosto" value="7" />
                  <Picker.Item label="Septiembre" value="8" />
                  <Picker.Item label="Octubre" value="9" />
                  <Picker.Item label="Noviembre" value="10" />
                  <Picker.Item label="Diciembre" value="11" />
                </Picker>
              </View>
            </View>
            <View className="flex items-center">
              <Pressable
                onPress={saveReport}
                className="bg-sky-700 rounded-xl px-4 py-3"
              >
                <Text className="text-white">Generar reporte</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <Tabs className="absolute bottom-0" />
    </View>
  );
}
