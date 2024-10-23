import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  StatusBar,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function Cuentos() {
  const cuentos = [
    {
      title: 'El Dragon Chef',
      path: 'https://drive.google.com/uc?export=download&id=1WFvQyMxjIHF_5eyLPuZ3Uja5-_a-L-3u',
      image: require('../assets/images/El Dragon Chef portada.png'),
    },
    {
      title: 'Un lío de narices',
      path: 'https://drive.google.com/uc?export=download&id=1V_EDIxQreJZcnZEz1nOb1l42O6suov-3',
      image: require('../assets/images/Un lío de narices portada.png'),
    },
    {
      title: 'Un tirón de orejas',
      path: 'https://drive.google.com/uc?export=download&id=1b_vENKrzT0gfGkEvtdvoTM6TAy6xOR_s',
      image: require('../assets/images/Un tirón de orejas portada.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <Text style={styles.title}>Cuentos Disponibles</Text>
      {cuentos.map((cuento, index) => (
        <Pressable
          key={index}
          style={styles.cuentoButton}
          onPress={() => Linking.openURL(cuento.path)} // Abre el enlace
        >
          <Image source={cuento.image} style={styles.cuentoImage} />
          <Text style={styles.cuentoText}>{cuento.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 14,
    left: 5,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
    marginTop: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 65,
    marginBottom: 30,
    color: '#0369a1',
  },
  cuentoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  cuentoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  cuentoText: {
    fontSize: 18,
    color: '#0369a1',
    textAlign: 'left',
    fontWeight: 'bold'
  },
});
