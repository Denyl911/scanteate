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
        <Image style={{height: 270, width: 270}} source={require('../assets/images/img1.png')}></Image>
        <Pressable onLongPress={() => router.navigate('/setUrl')}>
          <Text style={{fontFamily: 'PlayChickens', textAlign: 'center', fontSize: 46, paddingVertical: 16, color:'rgb(3,105,161)'}}>
            SCAN
            <Text className="text-yellow-500">
              T<Text className="text-green-500">E</Text>
              <Text className="text-red-500">A</Text>
            </Text>
            TE
          </Text>
        </Pressable>
        <Text className="text-center mx-5 text-xl font-sla">
          Una aplicación de comunicación para ayudar a los estudiantes con
          autismo a comunicarse con amigos y profesores.
        </Text>
      </View>
    );
  } else {
    return (
      <View className="flex-1 items-center justify-center">
        <Image style={{height: 270, width: 270}} source={require('../assets/images/img12.png')}></Image>
        <Text style={{fontFamily: 'PlayChickens', textAlign: 'center', fontSize: 40, paddingVertical: 16, color:'rgb(3,105,161)'}}>
          Todo muy fácil
        </Text>
        <Text className="text-center mx-5 text-xl font-sla">
          En esta app la comunicación se hará a través de imágenes y figuras,
          para que todo sea mucho más amigable
        </Text>
      </View>
    );
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
