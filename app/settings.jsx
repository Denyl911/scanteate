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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import Tabs from '../components/Tabs';
import UserAvatar from '../components/UserAvatar';

export default function Settings() {
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
        <ScrollView className="mt-12">
          <Pressable
            onPress={() => router.navigate('/createAvatar')}
            className="bg-sky-400 mx-10 rounded-xl px-6 py-5 mt-20"
          >
            <Text className="text-gray-100 text-xl font-super">Mi Avatar</Text>
            <Text className="text-gray-100 font-sla">Personaliza tu avatar</Text>
            <FontAwesome5
              name="user-astronaut"
              size={43}
              color="rgb(254 240 138)"
              className="absolute right-6 bottom-5"
            />
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/galery')}
            className="bg-sky-500 mx-10 rounded-xl px-6 py-5 mt-8"
          >
            <Text className="text-gray-100 text-xl font-super">Galería</Text>
            <Text className="text-gray-100 font-sla">Galería de fichas de emociones</Text>
            <MaterialCommunityIcons
              name="view-gallery"
              size={43}
              color="rgb(245 243 255);"
              className="absolute right-6 bottom-5"
            />
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/reportConfig')}
            className="bg-sky-700 mx-10 rounded-xl px-6 py-5 mt-8"
          >
            <Text className="text-gray-100 text-xl font-super">Reportes</Text>
            <Text className="text-gray-100 font-sla">
              Configuración y envio de reportes
            </Text>
            <Octicons
              name="repo"
              size={42}
              color="rgb(245 243 255);"
              className="absolute right-6 bottom-4"
            />
          </Pressable>
          <Pressable
            onPress={logout}
            className="bg-sky-900 mx-10 rounded-xl px-6 py-5 mt-8"
          >
            <Text className="text-gray-100 text-xl font-super">Logout</Text>
            <Text className="text-gray-100 font-sla">Cerrar Sesión</Text>
            <MaterialCommunityIcons
              name="logout"
              size={42}
              color="rgb(245 243 255);"
              className="absolute right-6 bottom-5"
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
