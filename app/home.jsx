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
              textAlign: 'center',
              fontSize: 18,
              marginTop: 8,
              fontFamily: 'SuperFeel',
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
            style={{ position: 'relative' }} // Añadir estilo relativo
          >
            <Text className="text-gray-100 text-xl font-custom">Scaner</Text>
            <Text className="text-gray-100 pr-28 font-sla">
              Escanea tus emociones en tiempo real!
            </Text>
            <Image
              className="absolute"
              style={{
                width: 180,
                height: 140,
                right: -41, // Hace que sobresalga hacia la derecha
                bottom: 5, // Hace que sobresalga hacia abajo
              }}
              source={require('../assets/images/scaner.png')}
            />
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/games')}
            className="bg-sky-600 mx-8 rounded-xl px-5 py-5 mb-20"
            style={{ position: 'relative' }}
          >
            <Text className="text-gray-100 text-xl font-custom">Juegos</Text>
            <Text className="text-gray-100 font-sla pr-20">
              Sal de la rutina y diviertete un rato con minijuegos!
            </Text>
            <Image
              className="absolute"
              style={{
                width: 150,
                height: 150,
                right: -30, // Sobresale a la derecha
                bottom: -10, // Sobresale hacia abajo
              }}
              source={require('../assets/images/juegos.png')}
            />
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/cuentos')}
            className="bg-sky-400 mx-8 rounded-xl px-5 py-5 mb-20"
            style={{ position: 'relative' }}
          >
            <Text className="text-gray-100 text-xl font-custom">Cuentos</Text>
            <Text className="text-gray-100 pr-20 font-sla">
              Historias educativas para niños con pictogramas!
            </Text>
            <Image
              className="absolute"
              style={{
                width: 200,
                height: 150,
                right: -45, // Sobresale a la derecha
                bottom: -20, // Sobresale hacia abajo
              }}
              source={require('../assets/images/cuentos.png')}
            />
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/dailyTasks')}
            className="bg-sky-300 mx-8 rounded-xl px-5 py-5 mb-20"
            style={{ position: 'relative' }}
          >
            <Text className="text-gray-100 text-xl font-custom">Rutina</Text>
            <Text className="text-gray-100 pr-20 font-sla">
              Crear una rutina personalizable para tu hijo!
            </Text>
            <Image
              className="absolute"
              style={{
                width: 180,
                height: 150,
                right: -60, // Sobresale a la derecha
                bottom: -20, // Sobresale hacia abajo
              }}
              source={require('../assets/images/actividades.png')}
            />
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/actividades')}
            className="bg-sky-300 mx-8 rounded-xl px-5 py-5 mb-40"
            style={{ position: 'relative' }}
          >
            <Text className="text-gray-100 text-xl font-custom">
              Actividades
            </Text>
            <Text className="text-gray-100 pr-20 font-sla">
              Actividades imprimibles para el desarrollo socioemocional
            </Text>
            <Image
              className="absolute"
              style={{
                width: 200,
                height: 150,
                right: -50, // Sobresale a la derecha
                bottom: -20, // Sobresale hacia abajo
              }}
              source={require('../assets/images/act_descarga.png')}
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
