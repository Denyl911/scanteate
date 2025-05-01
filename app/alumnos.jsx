import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import Tabs from '../components/Tabs';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

export default function Galery() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    type: '',
  });
  const [alumnos, setAlumnos] = useState([]);

  const getUser = async () => {
    setAlumnos([]);
    setUser(JSON.parse(await AsyncStorage.getItem('user')) || user);
    const all = JSON.parse(await AsyncStorage.getItem('users')) || [];
    all.forEach((el) => {
      if (el.type == 'Alumno') {
        setAlumnos((op) => [...op, el]);
      }
    });
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
        className="absolute top-14 left-5 bg-slate-300 p-2 rounded-lg opacity-50 z-40"
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <View>
        <View className="h-[87%] mt-16">
          <Text className="text-sky-800 text-center font-bold text-3xl mb-10">
            Alumnos
          </Text>
          <ScrollView>
            {alumnos.map((el, i) => {
              return (
                <View
                  className=" rounded-lg py-3 px-4 bg-white w-[90%] mx-auto my-1"
                  key={i}
                >
                  <View className="flex flex-row items-center justify-between">
                    <View className="">
                      <Text className="text-lg font-bold">{el.name}</Text>
                      <Text>{el.email}</Text>
                      <Text className="text-sky-700 mt-3">{el.type}</Text>
                    </View>
                    <View className="w-20 h-20 rounded-full bg-sky-600 opacity-95 flex items-center justify-center">
                      <Image
                        className="w-14 h-14"
                        source={require('../assets/images/user3.png')}
                      ></Image>
                    </View>
                  </View>
                  <View className="flex flex-row mt-3">
                    <Pressable
                      onPress={() => router.navigate(`/galeria/${el.id}`)}
                      className="bg-sky-700 rounded-xl  py-3 w-1/2 mr-1"
                    >
                      <Text className="text-white text-center font-semibold">
                        Galería
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => router.navigate(`/reportes/${el.id}`)}
                      className="bg-sky-500 rounded-xl  py-3 w-1/2 ml-1"
                    >
                      <Text className="text-white text-center font-semibold">
                        Reportes
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <Tabs className="absolute bottom-0" />
    </View>
  );
}
