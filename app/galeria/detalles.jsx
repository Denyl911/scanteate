import React, { useState, useEffect } from 'react'; // Importa useState y useEffect
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator, // Para mostrar un indicador de carga
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export default function Detalles() {
  const { emotionId } = useLocalSearchParams(); // Ahora solo recibimos 'emotionId'
  const [emotionData, setEmotionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función asíncrona para cargar los datos de la emoción
    const fetchEmotionDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!emotionId) {
          setError('No se proporcionó un ID de emoción.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.scanteate.com/emotions/${emotionId}`,
          {
            method: 'GET',
            headers: {
              auth: token,
            },
          }
        );
        if (!response.ok) {
          // Si la respuesta no es 2xx, lanza un error
          throw new Error(
            `Error HTTP: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        setEmotionData(data);
      } catch (err) {
        console.error('Error al obtener detalles de la emoción:', err);
        setError(
          'No se pudieron cargar los datos de la emoción. Inténtalo de nuevo.'
        );
      } finally {
        setLoading(false); // Siempre desactiva el loading al finalizar
      }
    };

    fetchEmotionDetails();
  }, [emotionId]); // El efecto se ejecuta cuando emotionId cambia

  // Mostrar estado de carga
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0369a1" />
        <Text style={styles.loadingText}>Cargando emoción...</Text>
      </View>
    );
  }

  // Mostrar estado de error
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="#0369a1" />
        </Pressable>
      </View>
    );
  }

  // Si no hay datos (por ejemplo, si la API devuelve 404 para el ID), también se puede manejar aquí
  if (!emotionData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Emoción no encontrada.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="#0369a1" />
        </Pressable>
      </View>
    );
  }

  // Una vez que tenemos los datos, los usamos para renderizar
  const imageSource = emotionData.uri ? { uri: emotionData.uri } : null;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <Text style={styles.title}>Detalles</Text>
      {imageSource && (
        <Image
          source={imageSource}
          className="w-[90vw] h-[65vh] rounded-lg mx-auto"
        />
      )}
      <Pressable
        onPress={() => {
          Speech.speak(emotionData.name, { language: 'es' });
        }}
      >
        <Text
          className={`mt-12 text-3xl text-center font-super ${emotionData.color}`}
        >
          {emotionData.name}
        </Text>
      </Pressable>

      <Text className="text-center">
        {formatearFecha(emotionData.createdAt)}
      </Text>
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    // Nuevo estilo para centrar el contenido de carga/error
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 28,
    fontFamily: 'PlayChickens',
    marginTop: 65,
    marginBottom: 30,
    color: '#0369a1',
  },
  cuentoImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
  },
  loadingText: {
    // Nuevo estilo para el texto de carga
    marginTop: 10,
    fontSize: 18,
    color: '#0369a1',
  },
  errorText: {
    // Nuevo estilo para el texto de error
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
