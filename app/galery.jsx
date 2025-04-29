import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  ToastAndroid,
  Modal,
  StyleSheet,
} from 'react-native';
import Tabs from '../components/Tabs';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

function formatearFecha(fecha) {
  if (fecha) {
    fecha = new Date(fecha);
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const dia = fecha.getDate();
    const mesIndex = fecha.getMonth();
    const año = fecha.getFullYear();

    return `${meses[mesIndex]} ${dia}, ${año}`;
  }
}

export default function Galery() {
  const [user, setUser] = useState({
    name: '',
    type: '',
  });
  const [allEmotions, setAllEmotions] = useState([]);
  const [userEmotions, setUserEmotions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const getUser = async () => {
    const us = JSON.parse(await AsyncStorage.getItem('user'));
    setUser(us);
    try {
      const res = await fetch(`https://api.scanteate.com/users/emotions/${us.id}`);
      const emotions = await res.json();
      setUserEmotions(emotions);
    } catch (e) {
      const all = JSON.parse(await AsyncStorage.getItem('emotions')) || [];
      setAllEmotions(all);
      all.forEach((el) => {
        if (el.UserId == us.id) {
          setUserEmotions((op) => [...op, el]);
        }
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const deleteEmotion = async () => {
    const id = deleteId;
    if (Number.isInteger(id)) {
      try {
        await fetch(`https://api.scanteate.com/users/emotions/${id}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.log(e);
      }
    }
    const allFilt = allEmotions.filter((el) => el.id != id);
    setAllEmotions(allFilt);
    setUserEmotions(userEmotions.filter((el) => el.id != id));
    await AsyncStorage.setItem('emotions', JSON.stringify(allFilt));
    setModalVisible(!modalVisible);
    ToastAndroid.showWithGravity(
      'Eliminado exitosamente',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };
  const preDelete = (id) => {
    setModalVisible(!modalVisible);
    setDeleteId(id);
  };

  return (
    <View className="h-[100%] bg-slate-200">
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <Pressable
        className="absolute top-14 left-5 bg-slate-300 p-2 rounded-lg opacity-50 z-40"
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <View>
        <View className="h-[87%] mt-16">
          <Text className="text-sky-800 text-center font-bold text-3xl mb-10">
            Galería de Emociones
          </Text>
          <ScrollView>
            {userEmotions.map((el, i) => {
              return (
                <View
                  className="flex flex-row items-center justify-between rounded-lg p-3 bg-white w-[90%] mx-auto my-1"
                  key={i}
                >
                  <View className="basis-">
                    <Text className={`text-lg font-bold ${el.color}`}>
                      {el.name}
                    </Text>
                    <Text>{formatearFecha(el.createdAt)}</Text>
                    <Pressable
                      onPress={() => preDelete(el.id)}
                      className="mt-5 bg-slate-50 rounded-md px-2 py-1"
                    >
                      <Text className="text-red-500 text-center">
                        X Eliminar
                      </Text>
                    </Pressable>
                  </View>
                  <Image
                    className="w-28 h-28 rounded"
                    source={{ uri: el.uri }}
                  ></Image>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Estas seguro de eliminar el registo?
            </Text>
            <View className="flex flex-row">
              <Pressable
                className="p-3 bg-slate-200 rounded-xl mr-5"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="font-bold text-gray-800">Cancelar</Text>
              </Pressable>
              <Pressable
                className="p-3 bg-sky-600 rounded-xl mr-2"
                onPress={deleteEmotion}
              >
                <Text className="font-bold text-white">Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Tabs />
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
