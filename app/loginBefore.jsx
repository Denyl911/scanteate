import { Image, StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';
import { Link } from 'expo-router';

export default function PreLogin() {
  return (
    <ScrollView className="bg-white">
      <StatusBar backgroundColor="#0284c7" hidden={false} translucent={true} />
      <View style={{ marginTop: StatusBar.currentHeight }} ></View>
      <View className="flex flex-row items-center bg-sky-600 pb-96 px-10 pt-20">
        <Image
          style={styles.logo}
          source={require('../assets/images/logo-shadow.png')}
        ></Image>
        <Text className="text-3xl text-white text-center font-bold ml-6">
          SCAN<Text className="text-rose-300">TEA</Text>TE
        </Text>
      </View>
      <View>
        <View style={styles.separador}>
          <Image
            className="-mt-56"
            source={require('../assets/images/preLogin.png')}
          ></Image>
          <Link
            href="/register"
            className="rounded-xl  shadow shadow-black bg-sky-800 py-3 px-24 mt-16"
          >
            <Text className="text-white text-lg">Registrarme</Text>
          </Link>
          <Link
            href="/login"
            className="rounded-xl shadow shadow-black bg-slate-200 py-3 px-20 mb-12  mt-8"
          >
            <Text className="text-sky-800 text-lg">Iniciar Sesión</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 90,
    height: 90,
  },
  separador: {
    borderTopRightRadius: 50,
    marginTop: -50,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
