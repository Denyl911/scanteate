import { useState } from 'react';
import { router } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ToastAndroid,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  const [name, setName] = useState('');
  const [emailT, setEmailT] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    setLoading(true);
    try {
      if (name && emailT && pass && pass2) {
        if (pass != pass2) {
          ToastAndroid.showWithGravity(
            'Las contraseñas no coinciden',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          return;
        }
        const res = await fetch('https://api.scanteate.fun/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: emailT,
            password: pass,
          }),
        });
        if (!res.status == 201) {
          ToastAndroid.showWithGravity(
            'Oops ocurrio un error',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          console.log(await res.json());
        } else {
          const data = await res.json();
          console.log(data);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          await AsyncStorage.setItem('token', JSON.stringify(data.token));
          router.replace('/home');
        }
      } else {
        ToastAndroid.showWithGravity(
          'Faltan campos por llenar',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    } catch (e) {
      ToastAndroid.showWithGravity(
        'Opps ocurrio un error!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      console.log(e);
    }
    setLoading(false);
  };
  return (
    <ScrollView className="bg-white">
      <View className="w-full flex flex-row  justify-between bg-sky-700 pt-10">
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'PlayChickens',
            textAlign: 'center',
            color: 'white',
            marginTop: 64,
            marginLeft: 20,
          }}
        >
          Registrarme
        </Text>
        <Image
          style={{height: 230, width: 230}}
          source={require('../assets/images/img7.png')}
        ></Image>
      </View>
      <View>
        <KeyboardAvoidingView style={styles.separador}>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmailT}
            value={emailT}
            inputMode="email-address"
            autoCapitalize="none"
            placeholder="Email del tutor"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPass}
            value={pass}
            secureTextEntry={true}
            autoCapitalize="none"
            placeholder="Contraseña"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPass2}
            value={pass2}
            secureTextEntry={true}
            autoCapitalize="none"
            placeholder="Confirmar contraseña"
          />
        </KeyboardAvoidingView>
        <View className="bg-white flex items-center">
          <Pressable
            onPress={registerUser}
            disabled={loading}
            className="rounded-xl  shadow shadow-black bg-sky-800 py-3 px-4 mt-20"
          >
            <Text className="text-white text-lg font-super">Registrarme</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl  p-3 mb-12 mt-3"
          >
            <Text className="text-sky-800 text-lg font-super">Volver</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
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
