import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  TextInput,
  ToastAndroid
} from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const login = async () => {
    const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
    const user = users.find((el) => el.email == email && el.password == pass);
    if (!user) {
      ToastAndroid.showWithGravity(
        'Datos incorrectos',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      console.log('Datos incorrectos');
    } else {
      await AsyncStorage.setItem('user', JSON.stringify(user))
      router.replace('Home');
    }
  };
  return (
    <View>
      <View className="w-full flex flex-row justify-between bg-sky-700 pt-7">
        <Pressable onPress={() => router.back()}>
          <Image
            className=" mx-6 mt-5"
            source={require('../assets/images/back.png')}
          ></Image>
        </Pressable>
        <Image source={require('../assets/images/login.png')}></Image>
      </View>
      <View>
        <View style={styles.separador}>
          <TextInput
            className="mt-20 border-b-2 border-sky-800 text-2xl placeholder:text-slate-400 w-60 p-2"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            placeholder="Email"
          />
          <TextInput
            className="mt-12 border-b-2 border-sky-800 text-2xl placeholder:text-slate-400 w-60 p-2"
            onChangeText={setPass}
            value={pass}
            secureTextEntry={true}
            placeholder="Contraseña"
          />
          <Pressable
            onPress={login}
            className="rounded-xl  shadow shadow-black bg-sky-800 py-3 px-4 mt-28"
          >
            <Text className="text-white text-lg">Iniciar Sesión</Text>
          </Pressable>
          <Pressable
            onPress={() => Alert.alert('Enviaremos un email de recuperacion a tu correo')}
            className="rounded-xl p-3 mb-12  mt-8"
          >
            <Text className="text-sky-800 text-lg">
              Olvidaste tu contraseña?
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/register')}
            className="rounded-xl  p-3  mt-8 mb-80"
          >
            <Text className="text-sky-800 text-lg">Registrarme</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 90,
  },
  separador: {
    borderRadius: 50,
    marginTop: -50,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {},
});
