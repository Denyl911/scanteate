import { useState } from "react";
import { router } from "expo-router";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const [name, setName] = useState("");
  const [emailT, setEmailT] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    setLoading(true)
    try {
      if (name && emailT && pass && pass2) {
        if (pass != pass2) {
          ToastAndroid.showWithGravity(
            "Las contraseñas no coinciden",
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
            password: pass 
          })
        })
        if (!res.status == 201) {
          ToastAndroid.showWithGravity(
            'Oops ocurrio un error',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          console.log(await res.json());
        } else {
          const data = await res.json()
          console.log(data);
          await AsyncStorage.setItem('user', JSON.stringify(data.user))
          await AsyncStorage.setItem('token', JSON.stringify(data.token))
          router.replace('/home');
        }
      } else {
        ToastAndroid.showWithGravity(
          "Faltan campos por llenar",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
      
    } catch (e) {
      ToastAndroid.showWithGravity(
        "Opps ocurrio un error!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      console.log(e);
    }
    setLoading(false)
  };
  return (
    <ScrollView className="bg-white">
      <View className="w-full flex flex-row  justify-between bg-sky-700 pt-10">
        <Text className="text-3xl font-bold text-center text-white mt-16 ml-10">
          Registrarme
        </Text>
        <Image
          height={100}
          width={100}
          source={require("../assets/images/register.png")}
        ></Image>
      </View>
      <View>
        <KeyboardAvoidingView style={styles.separador}>
          <TextInput
            className="mt-12 border-b-2 border-sky-800 text-2xl placeholder:text-slate-400 w-60 p-2 bg-slate-100 rounded-md"
            onChangeText={setName}
            value={name}
            placeholder="Nombre"
          />
          <TextInput
            className="mt-8 border-b-2 border-sky-800 text-2xl placeholder:text-slate-400 w-60 p-2 bg-slate-100 rounded-md"
            onChangeText={setEmailT}
            value={emailT}
            inputMode="email-address"
            autoCapitalize="none"
            placeholder="Email del tutor"
          />
          <TextInput
            className="mt-8 border-b-2 border-sky-800 text-2xl placeholder:text-slate-400 w-60 p-2 bg-slate-100 rounded-md"
            onChangeText={setPass}
            value={pass}
            secureTextEntry={true}
            autoCapitalize="none"
            placeholder="Contraseña"
          />
          <TextInput
            className="mt-8 border-b-2 border-sky-800 text-2xl placeholder:text-slate-400 w-60 p-2 bg-slate-100 rounded-md"
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
            <Text className="text-white text-lg">Registrarme</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl  p-3 mb-12 mt-3"
          >
            <Text className="text-sky-800 text-lg">Volver</Text>
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
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {},
});
