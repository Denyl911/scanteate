import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Link } from 'expo-router';

export default function PreLogin() {
  return (
    <ScrollView className="bg-white">
      <StatusBar backgroundColor="#0284c7" hidden={false} translucent={true} />
      <View style={{ marginTop: StatusBar.currentHeight }}></View>
      <View className="flex flex-row items-center bg-sky-600 pb-96 px-10 pt-20">
        <Image
          source={require('../assets/images/SNTv2.png')} // Ruta de la imagen del logo
          style={{ width: 335, height: 150 }} // Ajusta el tamaño según necesites
        />
      </View>
      <View>
        <View style={styles.separador}>
          <Image
            className="-mt-56 w-[290] h-[290]"
            source={require('../assets/images/img11.png')}
          />
          <Link
            href="/register"
            className="rounded-xl  shadow shadow-black bg-sky-800 py-4 px-24 mt-8"
          >
            <Text
              style={{ color: 'white', fontSize: 18, fontFamily: 'SuperFeel' }}
            >
              Registrarme
            </Text>
          </Link>
          <Link
            href="/login"
            className="rounded-xl shadow shadow-black bg-slate-200 py-4 px-20 mb-12  mt-8"
          >
            <Text
              style={{
                color: 'rgb(7,89,133)',
                fontSize: 18,
                fontFamily: 'SuperFeel',
              }}
            >
              Iniciar Sesión
            </Text>
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
