import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View, Image } from 'react-native';

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

export default function UserAvatar() {
  const [selectedImages, setSelectedImages] = useState({
    color: avatarImages.color[0],
    cara: avatarImages.cara[0],
    cabello: avatarImages.cabello[0],
    camisa: avatarImages.camisa[0],
    short: avatarImages.short[0],
    pies: avatarImages.pies[0],
  });
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

  useFocusEffect(
    useCallback(() => {
      getUserAvatar();
    }, [])
  );

  return (
    <View>
      <View className="w-[70] h-[70] rounded-full bg-sky-600 opacity-95 flex items-center justify-center">
        {Object.values(selectedImages).map((image, index) => (
          <Image
            key={index}
            source={image}
            className="w-[60] h-[60] absolute"
          />
        ))}
      </View>
    </View>
  );
}
