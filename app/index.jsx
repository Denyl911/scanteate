import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';

function Dots({ x }) {
  if (x == 1) {
    return (
      <View className="flex flex-row">
        <Image
          className="mr-2"
          source={require('../assets/images/dot1.png')}
        ></Image>
        <Image source={require('../assets/images/dot2.png')}></Image>
      </View>
    );
  } else {
    return (
      <View className="flex flex-row">
        <Image
          className="mr-2"
          source={require('../assets/images/dot2.png')}
        ></Image>
        <Image source={require('../assets/images/dot1.png')}></Image>
      </View>
    );
  }
}

function Slides({ x }) {
  if (x == 1) {
    return (
      <View className="flex-1 items-center justify-center">
        <Image style={{height: 280, width: 380}} source={require('../assets/images/SNTv5.png')}></Image>
        <Pressable onLongPress={() => router.navigate('/setUrl')}>
        </Pressable>
        <Text className="text-center mx-5 text-xl font-play">
          Una aplicación para ayudar a los niños con
          autismo a comunicarse con su entorno
        </Text>
      </View>
    );
  } else {
    return (
      <View className="flex-1 items-center justify-center">
        <Image style={{height: 380, width: 350}} source={require('../assets/images/FIGURA-SLOGAN.png')}></Image>
        <Text className="text-center mx-5 text-xl font-Mexcellent">
          En esta app la comunicación se hará a través de imágenes y figuras,
          para que todo sea mucho más amigable
        </Text>
      </View>
    );5
  }
}

export default function Welcome() {
  const [n, setN] = useState(1);

  const getUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('user'));
    if (data) {
      router.replace('/home');
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const nextSlide = () => {
    if (n == 2) {
      router.navigate('/loginBefore');
    } else {
      setN(n + 1);
    }
  };
  return (
    <View className="flex-1 items-center justify-center">
      <Slides x={n} />
      <View className="absolute bottom-10 flex justify-between flex-row items-center w-screen px-8">
        <Pressable
          onPress={() => setN(1)}
          className="rounded-full bg-sky-900 p-3"
        >
          <Text style={styles.buttonText}>Atras</Text>
        </Pressable>
        <Dots x={n} />
        <Pressable onPress={nextSlide} className="rounded-full bg-sky-900 p-3">
          <Text style={styles.buttonText}>Siguiente</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0D5692',
    padding: 15,
    borderRadius: '50%',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'SuperFeel',
    fontSize: 18
  },
});
