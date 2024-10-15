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
    try {
      const res = await fetch('https://api.scanteate.fun/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: pass 
        })
      })
      if (!res.status == 200) {
        ToastAndroid.showWithGravity(
          'Datos incorrectos',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        const data = await res.json()
        await AsyncStorage.setItem('user', JSON.stringify(data.user))
        await AsyncStorage.setItem('token', JSON.stringify(data.token))
        router.replace('/home');
      }
    } catch (e) {
      ToastAndroid.showWithGravity(
        'Datos incorrectos',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      console.log(e);
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
            autoCapitalize="none"
          />
          <TextInput
            className="mt-12 border-b-2 border-sky-800 text-2xl placeholder:text-slate-400 w-60 p-2"
            onChangeText={setPass}
            value={pass}
            secureTextEntry={true}
            placeholder="Contraseña"
            autoCapitalize="none"
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
