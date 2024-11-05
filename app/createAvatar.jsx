import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import SmallTabs from '../components/SmallTabs';
import { router } from 'expo-router';


const avatarImages = {
  color: [
    require('../assets/images/avatars/Color1.png'),
    require('../assets/images/avatars/Color2.png'),
    require('../assets/images/avatars/Color3.png'),
  ],
  cara: [
    require('../assets/images/avatars/Cara1.png'),
    require('../assets/images/avatars/Cara2.png'),
    require('../assets/images/avatars/Cara3.png'),
    require('../assets/images/avatars/Cara4.png'),
    require('../assets/images/avatars/Cara5.png'),
    require('../assets/images/avatars/Cara6.png'),
    require('../assets/images/avatars/Cara7.png'),
  ],
  cabello: [
    require('../assets/images/avatars/Cabello1.png'),
    require('../assets/images/avatars/Cabello2.png'),
    require('../assets/images/avatars/Cabello3.png'),
    require('../assets/images/avatars/Cabello4.png'),
    require('../assets/images/avatars/Cabello5.png'),
    require('../assets/images/avatars/Cabello6.png'),
    require('../assets/images/avatars/Cabello7.png'),
    require('../assets/images/avatars/Cabello8.png'),
  ],
  camisa: [
    require('../assets/images/avatars/Camisas1.png'),
    require('../assets/images/avatars/Camisas2.png'),
    require('../assets/images/avatars/Camisas3.png'),
    require('../assets/images/avatars/Camisas4.png'),
    require('../assets/images/avatars/Camisas5.png'),
    require('../assets/images/avatars/Camisas6.png'),
    require('../assets/images/avatars/Camisas7.png'),
    require('../assets/images/avatars/Camisas8.png'),
    require('../assets/images/avatars/Camisas9.png'),
    require('../assets/images/avatars/Camisas10.png'),
    require('../assets/images/avatars/Camisas11.png'),
    require('../assets/images/avatars/Camisas12.png'),
    require('../assets/images/avatars/Camisas13.png'),
    require('../assets/images/avatars/Camisas14.png'),
    require('../assets/images/avatars/Camisas15.png'),
    require('../assets/images/avatars/Camisas16.png'),
  ],
  short: [
    require('../assets/images/avatars/Shorts1.png'),
    require('../assets/images/avatars/Shorts2.png'),
    require('../assets/images/avatars/Shorts3.png'),
    require('../assets/images/avatars/Shorts4.png'),
  ],
  pies: [
    require('../assets/images/avatars/Pies1.png'),
    require('../assets/images/avatars/Pies2.png'),
    require('../assets/images/avatars/Pies3.png'),
    require('../assets/images/avatars/Pies4.png'),
    require('../assets/images/avatars/Pies5.png'),
    require('../assets/images/avatars/Pies6.png'),
    require('../assets/images/avatars/Pies7.png'),
    require('../assets/images/avatars/Pies8.png'),
  ],
};

export default function CreateAvatar() {
  const [selectedImages, setSelectedImages] = useState({
    color: avatarImages.color[0],
    cara: avatarImages.cara[0],
    cabello: avatarImages.cabello[0],
    camisa: avatarImages.camisa[0],
    short: avatarImages.short[0],
    pies: avatarImages.pies[0],
  });

  const handleSelectImage = (category, index) => {
    setSelectedImages((prev) => ({
      ...prev,
      [category]: avatarImages[category][index],
    }));
  };

  const getUserAvatar = async () => {
    let avatar = await AsyncStorage.getItem('avatar');
    if (avatar) {
      avatar = JSON.parse(avatar);
      setSelectedImages({
        color: avatarImages.color[avatar.colorIndex || 0],
        cara: avatarImages.cara[avatar.caraIndex || 0],
        cabello: avatarImages.cabello[avatar.cabelloIndex || 0],
        camisa: avatarImages.camisa[avatar.camisaIndex || 0],
        short: avatarImages.short[avatar.shortIndex || 0],
        pies: avatarImages.pies[avatar.piesIndex || 0],
      });
    }
  };

  const saveUserAvatar = async () => {
    const avatarIndices = {
      colorIndex: avatarImages.color.indexOf(selectedImages.color),
      caraIndex: avatarImages.cara.indexOf(selectedImages.cara),
      cabelloIndex: avatarImages.cabello.indexOf(selectedImages.cabello),
      camisaIndex: avatarImages.camisa.indexOf(selectedImages.camisa),
      shortIndex: avatarImages.short.indexOf(selectedImages.short),
      piesIndex: avatarImages.pies.indexOf(selectedImages.pies),
    };

    try {
      router.navigate('/settings')
      await AsyncStorage.setItem('avatar', JSON.stringify(avatarIndices));
      ToastAndroid.showWithGravity(
        'Actualizado',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } catch (error) {
      console.error('Error guardando el avatar:', error);
    }
  };


  useFocusEffect(
    useCallback(() => {
      getUserAvatar();
    }, [])
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
        <Text className="text-slate-500 text-center font-custom text-3xl">
          Personalizar Avatar
        </Text>
        <Pressable
          className=" bg-slate-300 py-2 px-3 rounded-lg opacity-50 z-40"
          onPress={saveUserAvatar}
        >
          <Text className="font-slabold text-sky-800 text-lg">Ok</Text>
        </Pressable>
      </View>
      <View className="h-[220] w-full flex items-center justify-center content-center mt-2 pt-3 pb-2 bg-slate-200">
        <View style={styles.avatarContainer}>
          {Object.values(selectedImages).map((image, index) => (
            <Image
              key={index}
              source={image}
              className="w-[200] h-[200] absolute"
            />
          ))}
        </View>
      </View>
      <View className="bg-slate-200">
        <View className="rounded-t-2xl bg-white pt-2"></View>
      </View>
      <ScrollView className="h-[60%] rounded-3xl">
        {Object.keys(avatarImages).map((category) => (
          <View key={category}>
            <Text className="text-lg font-super text-slate-500 px-3 mt-4">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <ScrollView horizontal className="bg-white flex flex-row pt-3">
              {avatarImages[category].map((image, index) => (
                <Pressable
                  key={index}
                  className="ml-4 mr-2 rounded-lg border-2 border-gray-100"
                  onPress={() => handleSelectImage(category, index)}
                >
                  <Image source={image} className="w-[100] h-[100]" />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ))}
        <Pressable
          className=" bg-sky-800 py-3 mx-8 rounded-lg  z-40 mt-10 mb-10"
          onPress={saveUserAvatar}
        >
          <Text className="font-semibold text-white text-xl text-center">
            Guardar
          </Text>
        </Pressable>
        <View className="bg-slate-200">
          <View className="rounded-b-2xl bg-white pb-2"></View>
          <View className="bg-slate-200 pb-20"></View>
        </View>
      </ScrollView>

      <View className="bg-red-500">
        <SmallTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    flex: 1,
    alignItems: 'center',
  },
});
