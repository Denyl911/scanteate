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

  const buttons = [
    {
      route: '/emotions',
      image: require('../assets/images/bo_escanv2.png'),
      marginBottom: -20,
    },
    {
      route: '/games',
      image: require('../assets/images/bo_juegosv2.png'),
      marginBottom: 10,
    },
    {
      route: '/cuentos',
      image: require('../assets/images/bo_cuentosv2.png'),
      marginBottom: 10,
    },
    {
      route: '/dailyTasks',
      image: require('../assets/images/bo_rutinav2.png'),
      marginBottom: 10,
    },
    {
      route: '/actividades',
      image: require('../assets/images/bo_actividadesv2.png'),
      marginBottom: -20,
    },
  ];

  return (
    <View className="h-[100%]">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <View style={{ marginTop: StatusBar.currentHeight, zIndex: 99 }}>
        <Image
          className="w-screen h-44 rounded-b-3xl"
          source={require('../assets/images/image.png')}
        />
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
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 30 }}>
          {buttons.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => router.navigate(item.route)}
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
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  buttonImage: {
    width: '100%',
    maxWidth: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: 10,
  },
});
