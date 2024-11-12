import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
} from 'react-native';

import Tabs from '../components/Tabs';
import UserAvatar from '../components/UserAvatar';

export default function HomeScreen() {
  const [user, setUser] = useState({
    name: '',
    type: '',
  });
  const getUser = async () => {
    const data = await AsyncStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );
  return (
    <View className="h-[100%]">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <View style={{ marginTop: StatusBar.currentHeight, zIndex: 99 }}>
        <Image
          className="w-screen h-44 rounded-b-3xl"
          source={require('../assets/images/image.png')}
        ></Image>
        <View className="-mt-48 flex items-center">
          <View className="mt-10">
            <UserAvatar />
          </View>
          <Text
            style={{
              color: 'white',
              textAlign: 'center', // text-center
              fontSize: 18, // text-md (en React Native, text-md suele ser 16px)
              marginTop: 8, // mt-2 (en React Native, la unidad es dp)
              fontFamily: 'SuperFeel', // font-bold
            }}
          >
            {user.name}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView className="mb-12">
          <Pressable
            onPress={() => router.navigate('/emotions')}
            className="bg-sky-900 mx-8 rounded-xl px-5 py-5 mt-24 mb-20"
          >
            <Text className="text-gray-100 text-xl font-custom">Scaner</Text>
            <Text className="text-gray-100 pr-28 font-sla">
              Escaner de emociones faciales para niños y adultos
            </Text>
            <Image
              className="mt-10 absolute right-0 bottom-2 w-[120] h-[120]"
              source={require('../assets/images/img10.png')}
            ></Image>
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/games')}
            className="bg-sky-600 mx-8 rounded-xl px-5 py-5 mb-20"
          >
            <Text className="text-gray-100 text-xl font-custom">Juegos</Text>
            <Text className="text-gray-100 font-sla pr-20">
              Juegos para poner en práctica los conocimientos
            </Text>
            <Image
              className="mt-10 absolute -right-2 bottom-2 w-[125] h-[125]"
              source={require('../assets/images/img2.png')}
            ></Image>
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/cuentos')}
            className="bg-sky-400 mx-8 rounded-xl px-5 py-5 mb-20"
          >
            <Text className="text-gray-100 text-xl font-custom">Cuentos</Text>
            <Text className="text-gray-100 pr-20 font-sla">
              Historias educativas para niños con ¡pictogramas!
            </Text>
            <Image
              className="absolute right-0 bottom-2 w-[125] h-[125]"
              source={require('../assets/images/img8.png')}
              style={[styles.image, styles.imageCuentos]}
            ></Image>
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/dailyTasks')}
            className="bg-sky-300 mx-8 rounded-xl px-5 py-5 mb-20"
          >
            <Text className="text-gray-100 text-xl font-custom">Rutina</Text>
            <Text className="text-gray-100 pr-20 font-sla">
              Crear una rutina saludable y estructurada puede ser beneficioso
            </Text>
            <Image
              className="mt-10 absolute right-0 bottom-3 w-[70] h-[70]"
              source={require('../assets/images/rutina.png')}
            ></Image>
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/actividades')}
            className="bg-sky-300 mx-8 rounded-xl px-5 py-5 mb-40"
          >
            <Text className="text-gray-100 text-xl font-custom">
              Actividades
            </Text>
            <Text className="text-gray-100 pr-20 font-sla">
              Actividades imprimibles para el desarrollo socioemocional
            </Text>
            <Image
              className="mt-10 absolute right-0 bottom-3 w-[100] h-[100]"
              source={require('../assets/images/img5.png')}
            ></Image>
          </Pressable>
        </ScrollView>
      </View>
      <Tabs className="absolute bottom-0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 700,
  },
  image: {
    width: 95, // Tamaño de imagen uniforme
    height: 95,
  },
  imageCuentos: {
    bottom: 30, // Mueve la imagen hacia arriba (ajusta el valor según necesidad)
  },
});
