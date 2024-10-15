import { View, Text, Pressable, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export default function Tabs() {
  const route = useRoute();
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Suscribirse a los eventos de teclado
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setOpen(true)
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setOpen(false)
      }
    );

    // Limpiar los listeners cuando el componente se desmonte
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View className={`bg-white rounded-t-lg w-screen px-8 py-5 absolute bottom-0 ${isOpen ? 'hidden' : ''}`}>
      <View className="flex items-center justify-between flex-center flex-row">
        <Pressable
          onPress={() => router.navigate('/home')}
          className="flex items-center"
        >
          <Feather
            name="home"
            size={28}
            color={route.name == 'home' ? '#0369a1' : '#000'}
          />
          <Text
            className={`${
              route.name == 'home' ? 'text-sky-800 font-bold' : 'text-black'
            } text-center`}
          >
            Inicio
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.navigate('/emotions')}
          className="flex items-center justify-center text-center"
        >
          <FontAwesome6
            name="face-smile-beam"
            size={28}
            color={
              route.name == 'emotions' ||
              route.name == 'galery' ||
              route.name == 'report'
                ? '#0369a1'
                : '#000'
            }
          />
          <Text
            className={`${
              route.name == 'emotions' ||
              route.name == 'galery' ||
              route.name == 'report'
                ? 'text-sky-800 font-bold'
                : 'text-black'
            } text-center`}
          >
            Emociones
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.navigate('/settings')}
          className="flex items-center justify-center text-center"
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={28}
            color={route.name == 'settings' ? '#0369a1' : '#000'}
          />
          <Text
            className={`${
              route.name == 'settings' ? 'text-sky-800 font-bold' : 'text-black'
            } text-center`}
          >
            Mi Perfil
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
