import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';
import Tabs from '../../components/Tabs';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function formatearFecha(fecha) {
  if (fecha) {
    fecha = new Date(fecha);

    const dia = fecha.getDate();
    const mesIndex = fecha.getMonth();
    const año = fecha.getFullYear();

    return `${meses[mesIndex]} ${dia}, ${año}`;
  }
}

export default function Reporte() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState({
    name: '',
    type: '',
  });
  const [maxEmotion, setMaxEmotion] = useState('');
  const counter = {};
  const [userEmotions, setUserEmotions] = useState([]);
  const [mes, setMes] = useState('');
  const [obs, setObs] = useState('');
  const [rep, setRep] = useState({});
  const getUser = async () => {
    const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
    const all = JSON.parse(await AsyncStorage.getItem('reports')) || [];

    const emo = all.find((el) => el.id == id);
    setRep(emo);
    if (emo.comments) {
        setObs(emo.comments)
    }
    const alumno = users.find((el) => el.id == emo.userId);
    if (alumno) {
      setUser(alumno);
    }
    setMes(emo.month);
    setUserEmotions(emo.emotions);
    emo.emotions.forEach((el) => {
      if (counter.hasOwnProperty(el.emocion)) {
        counter[el.emocion] += 1;
      } else {
        counter[el.emocion] = 1;
      }
    });
    try {
      const highestPair = Object.entries(counter).reduce((max, current) => {
        return current[1] > max[1] ? current : max;
      });
      const [key, value] = highestPair;
      setMaxEmotion(key);
    } catch (e) {
      console.log(e);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const saveObs = async () => {
    const all = JSON.parse(await AsyncStorage.getItem('reports')) || [];
    const filtered = all.filter((el) => el.id != id);
    const data = { ...rep };
    data.comments = obs;
    filtered.push(data);
    await AsyncStorage.setItem('reports', JSON.stringify(filtered));
    ToastAndroid.showWithGravity(
      'Observaciones guardadas exitosamente',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  return (
    <View className="h-[100%] bg-slate-200">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <Pressable
        className="absolute top-10 left-5 bg-slate-300 p-2 rounded-lg opacity-50"
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <View>
        <View className="h-[64%] mt-20 p-2">
          <Text className="text-sky-800 text-center font-bold text-2xl">
            Reporte de emociones del alumno
          </Text>
          <Text className="text-gray-800 text-center font-bold text-xl mt-3">
            {user.name}
          </Text>
          <Text className="text-gray-800 text-center font-semibold text-lg mb-4">
            <Text className="text-slate-600">Mes:</Text> {mes}
          </Text>
          <Text className="text-center text-lg mb-4 px-10">
            La emoción mas presente de este mes fue:
            <Text className="text-sky-600 font-bold"> {maxEmotion}</Text>
          </Text>
          <ScrollView>
            {userEmotions.map((el, i) => {
              return (
                <View
                  className="flex flex-row items-center justify-between rounded-lg p-3 bg-white w-[90%] mx-auto my-2"
                  key={i}
                >
                  <View className="basis-">
                    <Text className="text-lg font-bold">{el.emocion}</Text>
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
        <KeyboardAvoidingView className="mx-6 mt-3">
          <Text className="font-bold">Observaciones:.</Text>
          <TextInput
            className="mt-3 border-2 border-sky-800 text- placeholder:text-slate-400 px-2 rounded-lg bg-slate-300"
            onChangeText={setObs}
            value={obs}
            placeholder="Observaciones y comentarios"
            multiline
            numberOfLines={5}
          />
          <Pressable
            onPress={saveObs}
            className="bg-sky-600 rounded-xl py-3 mt-3"
          >
            <Text className="text-white font-semibold text-center">
              Guardar Observaciones
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
      <Tabs />
    </View>
  );
}
