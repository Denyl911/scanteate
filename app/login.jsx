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
  ToastAndroid,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

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
          password: pass,
        }),
      });
      if (!res.status == 200) {
        ToastAndroid.showWithGravity(
          'Datos incorrectos',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        const data = await res.json();
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('token', JSON.stringify(data.token));
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
        <View>
          <Pressable
            className="ml-2 p-2 rounded-xl mt-5 bg-slate-50 opacity-40"
            onPress={() => router.back()}
          >
            <AntDesign name="left" size={24} color="white" />
          </Pressable>
        </View>
        <Image
          style={{ height: 230, width: 230 }}
          source={require('../assets/images/img6.png')}
        ></Image>
      </View>
      <View>
        <View style={styles.separador}>
          <View className="mt-14"></View>
          <Text className="text-sky-900 text-3xl font-super">
            Iniciar Sesión
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            placeholder="Email"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
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
            <Text className="text-white text-xl font-super">
              Iniciar Sesión
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert('Enviaremos un email de recuperacion a tu correo')
            }
            className="rounded-xl p-3 mb-8  mt-8"
          >
            <Text className="text-sky-800 text-lg font-super">
              Olvidaste tu contraseña?
            </Text>
          </Pressable>
          <Text className="text-gray-400 mb-6">ó</Text>
          <Pressable
            onPress={() => router.navigate('/register')}
            className="rounded-xl py-4 px-6 mt-4 mb-80 bg-slate-50"
          >
            <Text className="text-sky-800 text-lg font-sla">Registrarme</Text>
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
  input: {
    marginTop: 48, // mt-12 equivale a 12 * 4 (en React Native, la unidad es dp)
    borderBottomWidth: 2, // border-b-2
    borderColor: '#0284c7', // border-sky-800
    fontSize: 20, // text-2xl
    placeholderTextColor: '#94a3b8', // placeholder:text-slate-400
    width: 245, // w-60 equivale a 60 * 4 (en React Native, la unidad es dp)
    padding: 10, // p-2 equivale a 2 * 4 (en React Native, la unidad es dp)
    backgroundColor: '#f1f5f9', // bg-slate-100
    borderRadius: 8, // rounded-md
    fontFamily: 'Slaberlin',
  },
});
