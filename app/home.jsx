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
      <View style={{ marginTop: StatusBar.currentHeight }}>
        <Image
          className="w-screen h-44 rounded-b-3xl"
          source={require('../assets/images/home2.jpg')}
        ></Image>
        <View className="-mt-48 flex items-center">
          <View className="w-20 h-20 rounded-full bg-sky-600 opacity-95 mt-10 flex items-center justify-center">
            <Image
              className="w-14 h-14"
              source={require('../assets/images/user3.png')}
            ></Image>
          </View>
          <Text className="text-white text-center text-md mt-2 font-bold">
            {user.name}
          </Text>
          <Text className="text-white text-center mt-1 mb-0 text-sm">
            {user.type}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView className=" mb-12">
          <Pressable
            onPress={() => router.navigate('/emotions')}
            className="bg-sky-900 mx-10 rounded-xl px-6 py-5 mt-24"
          >
            <Text className="text-white text-xl">Emociones</Text>
            <Text className="text-white pr-16">
              Escaner de emociones faciales para niños y adultos
            </Text>
            <Image
              className="mt-10 absolute right-0 bottom-2"
              source={require('../assets/images/juegos.png')}
            ></Image>
          </Pressable>
          <View className="bg-sky-600 mx-10 rounded-xl px-6 py-5 my-20">
            <Text className="text-white text-xl">Cronograma</Text>
            <Text className="text-white">
              Un calendario completo con todas tus tareas pendientes
            </Text>
            <Image
              className="mt-10 absolute right-0 bottom-2"
              source={require('../assets/images/cronograma.png')}
            ></Image>
          </View>
          <View className="bg-sky-300 mx-10 rounded-xl px-6 py-5 mb-40">
            <Text className="text-white text-xl">Juegos</Text>
            <Text className="text-white">
              Juegos para poner en práctica los conocimientos
            </Text>
            <Image
              className="mt-10 absolute right-0 bottom-2"
              source={require('../assets/images/juegos2.png')}
            ></Image>
          </View>
        </ScrollView>
      </View>
      <Tabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 700,
  },
});
