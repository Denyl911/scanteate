import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import Tabs from '../components/Tabs';

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

export default function Report() {
  const [user, setUser] = useState({
    name: '',
    type: '',
  });
  const [maxEmotion, setMaxEmotion] = useState('');
  const counter = {};
  const [userEmotions, setUserEmotions] = useState([]);
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return meses[d.getMonth()];
  });
  const getUser = async () => {
    setUser(JSON.parse(await AsyncStorage.getItem('user')) || user);
    const all = JSON.parse(await AsyncStorage.getItem('emotions')) || [];
    all.forEach((el) => {
      if (el.id == user.id) {
        setUserEmotions((op) => [...op, el]);
        if (counter.hasOwnProperty(el.emocion)) {
          counter[el.emocion] += 1;
        } else {
          counter[el.emocion] = 1;
        }
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

  return (
    <View className="h-[100%] bg-slate-200">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <View>
        <View className="h-[87%] mt-16">
          <Text className="text-sky-800 text-center font-bold text-3xl">
            Reporte de Emociones
          </Text>
          <Text className="text-sky-700 text-center font-semibold text-2xl mb-2">
            {mes}
          </Text>
          <Text className="text-center text-lg mb-2 px-10">
            La emocion mas presente de este mes fue:{' '}
            <Text className="text-sky-600 font-bold">{maxEmotion}</Text>
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
                  <Image className="w-28 h-28" source={{ uri: el.uri }}></Image>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <Tabs />
    </View>
  );
}

