import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import '../assets/css/glogal.css';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [sessionStart, setSessionStart] = useState(null);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // La app acaba de volver a primer plano (inicia sesión)
        const start = new Date().toISOString();
        setSessionStart(start);
        console.log('La app está activa, inicio de sesión:', start);
      }

      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // La app va a segundo plano (finaliza sesión)
        const sessionEnd = new Date().toISOString();
        const sessionDuration = Math.floor(
          (new Date(sessionEnd) - new Date(sessionStart)) / 1000
        );

        console.log('La app está en segundo plano, fin de sesión:', sessionEnd);
        sendSessionData(sessionStart, sessionEnd, sessionDuration);
      }

      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [appState, sessionStart]);

  const sendSessionData = async (start, end, duration) => {
    try {
      const us = JSON.parse(await AsyncStorage.getItem('user'));
      const response = await fetch('https://api.scanteate.fun/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: us.id,
          start,
          end,
          duration,
          device: Platform.constants.Fingerprint,
        }),
      });

      if (!response.ok) {
        console.log('Error al enviar los datos de la sesión');
      }
      const data = await response.json();
      console.log('Sesión registrada con éxito', data);
    } catch (error) {
      console.error('Error al registrar la sesión', error);
    }
  };
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    ></Stack>
  );
}
