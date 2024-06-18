import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';

export default function SmallTabs() {
  const route = useRoute();
  return (
    <View className="bg-white w-screen px-8 py-4 absolute bottom-0 rounded-xl">
      <View className="flex items-center justify-between flex-center flex-row">
        <Pressable
          onPress={() => router.navigate('/home')}
          className="flex items-center"
        >
          <Feather
            name="home"
            size={28}
            color={route.name == 'home' ? '#0369a1' : '#000'}
          />
        </Pressable>
        <Pressable
          onPress={() => router.navigate('/emotions')}
          className="flex items-center justify-center text-center"
        >
          <FontAwesome6
            name="face-smile-beam"
            size={28}
            color={
              route.name == 'emotions' ||
              route.name == 'galery' ||
              route.name == 'report'
                ? '#0369a1'
                : '#000'
            }
          />
        </Pressable>
        <Pressable
          onPress={() => router.navigate('/settings')}
          className="flex items-center justify-center text-center"
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={28}
            color={route.name == 'settings' ? '#0369a1' : '#000'}
          />
        </Pressable>
      </View>
    </View>
  );
}
