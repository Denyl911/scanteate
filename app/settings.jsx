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

import Tabs from '../components/Tabs';
import UserAvatar from '../components/UserAvatar';

export default function Settings() {
  const [user, setUser] = useState({
    id: 0,
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

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/loginBefore');
  };

  const settingsButtons = [
    {
      route: '/createAvatar',
      image: require('../assets/images/bo_avatarv2.png'),
      marginBottom: 0,
    },
    {
      route: '/galery',
      image: require('../assets/images/bo_galeriav2.png'),
      marginBottom: -25,
    },
    {
      route: '/reportConfig',
      image: require('../assets/images/bo_reportv2.png'),
      marginBottom: 0,
    },
    {
      route: 'logout',
      image: require('../assets/images/bo_logoutv2.png'),
      marginBottom: -30,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <View style={{ marginTop: StatusBar.currentHeight }}>
        <Image
          className="w-screen h-44 rounded-b-3xl"
          source={require('../assets/images/image.png')}
        />
        <View className="-mt-48 flex items-center">
          <View className="mt-10">
            <UserAvatar />
          </View>
          <Text className="text-white text-center text-xl mt-2 font-custom">Configuración</Text>
          <Text className="text-white text-center mt-1 mb-0 text-sm font-slabold">
            Personaliza tu experiencia
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 30 }}>
          {settingsButtons.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.route === 'logout' ? logout : () => router.navigate(item.route)}
              style={[styles.buttonContainer, { marginBottom: item.marginBottom }]}
            >
              <Image
                source={item.image}
                style={styles.buttonImage}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Tabs className="absolute bottom-0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonImage: {
    width: '100%',
    maxWidth: 300,
    height: 300,
    alignSelf: 'center',
  },
});
