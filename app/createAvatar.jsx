import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Pressable,
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';
import SmallTabs from '../components/SmallTabs';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { ScrollView } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CreateAvatar() {
    const [cabello, setCabello] = useState(
        require('../assets/images/avatars/cabelloh1.png')
      );
  const [cara, setCara] = useState(
    require('../assets/images/avatars/cara1.png')
  );
  const [camisa, setCamisa] = useState(
    require('../assets/images/avatars/camisa1.png')
  );
  const [short, setShort] = useState(
    require('../assets/images/avatars/short1.png')
  );
  return (
    <View className="h-[100%] bg-white">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <View style={{ marginTop: StatusBar.currentHeight }}></View>
      <View className="flex flex-row justify-between items-center p-2 bg-white">
        <Pressable
          className="bg-slate-300 p-2 rounded-lg opacity-50 z-40"
          onPress={() => router.back()}
        >
          <AntDesign name="left" size={24} color="#0369a1" />
        </Pressable>
        <Text className="text-slate-500 text-center font-bold text-2xl">
          Perzonalizar Avatar
        </Text>
        <Pressable
          className=" bg-slate-300 py-2 px-3 rounded-lg opacity-50 z-40"
          onPress={() => router.back()}
        >
          <Text className="font-semibold text-sky-800 text-lg">Ok</Text>
        </Pressable>
      </View>
      <View>
        <View className="h-[30%] w-full flex items-center justify-center content-center mt-2 bg-slate-200">
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/images/avatars/caraBase.png')}
              className="w-[116] h-[80] absolute top-[20]"
            />
            <Image source={cara} className="w-[116] h-[80] absolute top-[20]" />
            <Image
              source={cabello}
              className="w-[108] h-[100] absolute"
            />
            <Image
              source={camisa}
              className="w-[107] h-[60] absolute top-[93]"
            />
            <Image
              source={require('../assets/images/avatars/legsOut.png')}
              className="w-[72] h-[50] absolute top-[136]"
            />
            <Image
              source={short}
              className="w-[66] h-[30] absolute top-[137]"
            />
          </View>
        </View>
        {/* <View className="bg-white flex flex-row">
          <Pressable className="border-b-2 border-sky-700 p-3">
            <FontAwesome5 name="tshirt" size={35} color="rgb(3,105,161)" />
          </Pressable>
          <Pressable className="border-b-2 border-slate-500 p-3">
            <Ionicons name="body" size={35} color="rgb(100,116,139)" />
          </Pressable>
        </View> */}
        <Text className="text-lg font-bold text-slate-500 px-3">Cabello</Text>
        <View className="bg-white flex flex-row justify-center pt-3">
          <Pressable
            className="p-2 mx-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCabello(require('../assets/images/avatars/cabelloh1.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/cabelloh1.png')}
              className="w-[64] h-[60]"
            />
          </Pressable>
          <Pressable
            className="p-2 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCabello(require('../assets/images/avatars/cabelloh2.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/cabelloh2.png')}
              className="w-[64] h-[60]"
            />
          </Pressable>
          <Pressable
            className="p-2 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCabello(require('../assets/images/avatars/cabellom1.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/cabellom1.png')}
              className="w-[69] h-[60]"
            />
          </Pressable>
        </View>
        <Text className="text-lg font-bold text-slate-500 px-3">Rostros</Text>
        <View className="bg-white flex flex-row justify-center pt-3">
          <Pressable
            className="p-2 mx-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCara(require('../assets/images/avatars/cara1.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/cara1.png')}
              className="w-[87] h-[60]"
            />
          </Pressable>
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCara(require('../assets/images/avatars/cara2.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/cara2.png')}
              className="w-[87] h-[60]"
            />
          </Pressable>
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCara(require('../assets/images/avatars/cara2.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/cara2.png')}
              className="w-[87] h-[60]"
            />
          </Pressable>
        </View>
        <Text className="text-lg font-bold text-slate-500 px-3 py-1">Camisas</Text>
        <View className="bg-white flex flex-row justify-center">
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCamisa(require('../assets/images/avatars/camisa1.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/camisa1.png')}
              className="w-[107] h-[60]"
            />
          </Pressable>
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCamisa(require('../assets/images/avatars/camisa2.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/camisa2.png')}
              className="w-[107] h-[60]"
            />
          </Pressable>
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setCamisa(require('../assets/images/avatars/camisa3.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/camisa3.png')}
              className="w-[107] h-[60]"
            />
          </Pressable>
        </View>
        <Text className="text-lg font-bold text-slate-500 px-3 py-1">Panntalones</Text>
        <View className="bg-white flex flex-row justify-center">
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setShort(require('../assets/images/avatars/short1.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/short1.png')}
              className="w-[88] h-[40]"
            />
          </Pressable>
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setShort(require('../assets/images/avatars/short2.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/short2.png')}
              className="w-[88] h-[40]"
            />
          </Pressable>
          <Pressable
            className="p-2 mr-1 rounded-lg border-2 border-gray-100"
            onPress={() =>
              setShort(require('../assets/images/avatars/short3.png'))
            }
          >
            <Image
              source={require('../assets/images/avatars/short3.png')}
              className="w-[88] h-[40]"
            />
          </Pressable>
        </View>

      </View>
      <SmallTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  avatarContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    flex: 1,
    alignItems: 'center',
  },
  avatarPart: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Superpone las imágenes una encima de otra
  },
});
