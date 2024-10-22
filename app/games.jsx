import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Tabs from '../components/Tabs';

export default function Games() {
  const [user, setUser] = useState({
    id: 0,
    name: '',
    type: '',
  });
  const getUser = async () => {
    setUser(JSON.parse(await AsyncStorage.getItem('user')) || user);
  };
  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/loginBefore');
  };
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
            Juegos
          </Text>
          <Text className="text-white text-center mt-1 mb-0 text-sm">
            Aprende divirtiendote
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView className="mt-12">
          <Pressable
            onPress={() => router.navigate('/memory')}
            className="bg-sky-500 mx-10 rounded-xl px-6 py-5 mt-24"
          >
            <Text className="text-white text-xl">Memorama</Text>
            <Text className="text-white pr-7">
              Entrena tu memoria mientras te diviertes
            </Text>
            <FontAwesome5
              name="brain"
              size={45}
              color="rgb(244 114 182);"
              className="absolute right-6 bottom-6"
            />
          </Pressable>

          <Pressable
            onPress={() => router.navigate(`/reportes/${user.id}`)}
            className="bg-sky-700 mx-10 rounded-xl px-6 py-5 mt-8"
          >
            <Text className="text-white text-xl">
              ¡Crea tus propias emociones!
            </Text>
            <Text className="text-white pe-3 pr-3">
              ¡Aprende emociones creando tu propio AVATAR!
            </Text>
            <Entypo
              name="brush"
              size={45}
              color="rgb(240 171 252);"
              className="absolute right-4 bottom-7"
            />
          </Pressable>

          <Pressable
            onPress={() => router.navigate('/imitame')}
            className="bg-sky-900 mx-10 rounded-xl px-6 py-5 mt-8 pr-5"
          >
            <Text className="text-white text-xl">Imitame</Text>
            <Text className="text-white pe-3 pr-3">
              Aprender emociones, imitando emojis!
            </Text>
            <MaterialIcons
              name="emoji-emotions"
              size={45}
              color="rgb(240 171 252);"
              className="absolute right-4 bottom-7"
            />
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
});
