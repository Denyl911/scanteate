import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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

export default function setUrl() {
  const [url, setUrl] = useState('');

  const saveReport = async () => {
    await AsyncStorage.setItem('apiUrl', url);
    ToastAndroid.showWithGravity(
      'Reporte generado exitosamente',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const getUser = async () => {
    const data = await AsyncStorage.getItem('apiUrl');
    if (data) {
      setUrl(data);
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
      <Pressable
        className="absolute top-11 left-5 bg-slate-300 p-2 rounded-lg opacity-50"
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <View>
        <View className="h-[87%] mt-16">
          <Text className="text-sky-800 text-center font-bold text-3xl mb-10">
            Set API url
          </Text>
          <View className="mx-5">
            <View className="mb-8">
              <Text className="text-slate-700 font-bold text-xl">URL:</Text>
              <TextInput
                className="bg-slate-300 rounded-lg px-2 py-1"
                onChangeText={setUrl}
                value={url}
                placeholder="https://"
              />
            </View>
            <View className="mx-5">
              <Pressable
                onPress={saveReport}
                className="bg-emerald-500 rounded-xl px-3 py-4"
              >
                <Text className="text-white text-center">Guardar </Text>
              </Pressable>
              <Pressable
                onPress={() => router.navigate('/')}
                className="bg-sky-700 rounded-xl px-3 py-4 mt-8"
              >
                <Text className="text-white text-center">Welcome</Text>
              </Pressable>
              <Pressable
                onPress={() => router.navigate('/home')}
                className="bg-sky-500 rounded-xl px-4 py-4 my-3"
              >
                <Text className="text-white text-center">Home</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
