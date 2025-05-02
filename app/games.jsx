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

export default function Games() {
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

  // Lista de botones con espaciado personalizado
  const gameButtons = [
    {
      route: '/memory',
      image: require('../assets/images/bo_memov2.png'),
      marginBottom: 5,
    },
    {
      route: '/imitame',
      image: require('../assets/images/bo_imitamev2.png'),
      marginBottom: -10,
    },
    {
      route: '/simondice',
      image: require('../assets/images/bo_simonjiv2.png'),
      marginBottom: -50,
    },
    {
      route: '/games',
      image: require('../assets/images/bo_prox.png'),
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
          <Text className="text-white text-center text-xl mt-2 font-custom">Juegos</Text>
          <Text className="text-white text-center mt-1 mb-0 text-sm font-slabold">
            Aprende divirtiéndote
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 30 }}>
          {gameButtons.map((item, index) => (
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
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonImage: {
    width: '100%',
    maxWidth: 300,
    height: 300,
    alignSelf: 'center',
    // Sin bordes, como pediste
  },
});
