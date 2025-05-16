// MemoryGame.js

import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  Image,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Función para mezclar array
const randomArrFunction = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Genera un color aleatorio
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Genera cartas del juego
const gameCardsFunction = (pairsCount) => {
  const imageIcons = [
    require('../assets/images/memasombrado.png'),
    require('../assets/images/memconfuso.png'),
    require('../assets/images/memcontento.png'),
    require('../assets/images/memenfermo.png'),
    require('../assets/images/memenojado.png'),
    require('../assets/images/memfeliz.png'),
    require('../assets/images/memjugueton.png'),
    require('../assets/images/memriendo.png'),
    require('../assets/images/memtriste.png'),
  ];

  const selectedImages = imageIcons
    .slice(0, pairsCount)
    .flatMap((img) => [img, img]);

  const colors = Array.from({ length: pairsCount }, () => getRandomColor());

  const randomCards = randomArrFunction(
    selectedImages.map((img, index) => ({
      id: index,
      image: img,
      isFlipped: false,
      color: colors[Math.floor(index / 2)],
    }))
  );

  return randomCards;
};

export default function Memory() {
  const [hasStarted, setHasStarted] = useState(false);
  const [round, setRound] = useState(1);
  const maxRounds = 3;
  const pairsPerRound = [3, 6, 9];
  const [cards, setCards] = useState(gameCardsFunction(pairsPerRound[0]));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [winMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Cronómetro
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startTimer = () => {
    setIsActive(true);
    setStartTime(new Date());
  };

  const stopTimer = () => setIsActive(false);
  const resetTimer = () => {
    setTimer(0);
    setIsActive(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const cardClickFunction = (card) => {
    if (!isActive) startTimer();
    if (!gameWon && selectedCards.length < 2 && !card.isFlipped) {
      const updatedSelectedCards = [...selectedCards, card];
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);

      if (updatedSelectedCards.length === 2) {
        if (updatedSelectedCards[0].image === updatedSelectedCards[1].image) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
            if (round < maxRounds) {
              setTimeout(() => nextRound(), 500);
            } else {
              geekWinGameFunction();
              setGameWon(true);
              stopTimer();
              sendGameTimeToAPI();
            }
          }
        } else {
          setTimeout(() => {
            const flippedCards = updatedCards.map((c) =>
              updatedSelectedCards.some((s) => s.id === c.id)
                ? { ...c, isFlipped: false }
                : c
            );
            setSelectedCards([]);
            setCards(flippedCards);
          }, 1000);
        }
      }
    }
  };

  const nextRound = () => {
    setRound(round + 1);
    setCards(gameCardsFunction(pairsPerRound[round]));
    setSelectedCards([]);
    setMatches(0);
  };

  const geekWinGameFunction = () => {
    Animated.timing(winMessage, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const resetGame = () => {
    setRound(1);
    setCards(gameCardsFunction(pairsPerRound[0]));
    setSelectedCards([]);
    setMatches(0);
    setGameWon(false);
    resetTimer();
  };

  const sendGameTimeToAPI = async () => {
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);
    try {
      const us = JSON.parse(await AsyncStorage.getItem('user'));
      const response = await fetch('https://api.scanteate.com/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserId: us.id,
          type: 'Memorama',
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          duration,
        }),
      });
      const data = await response.json();
      console.log('Tiempo registrado con éxito:', data);
    } catch (error) {
      console.error('Error al registrar el tiempo:', error);
    }
  };

  if (!hasStarted) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/port_memo.gif')}
          style={styles.coverImage}
        />
        <Pressable style={styles.startButton} onPress={() => setHasStarted(true)}>
          <Text style={styles.startButtonText}>Iniciar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado y botones */}
      <Text style={styles.title}>MEMORAMA</Text>
      <Text style={styles.subtext}>Encuentra las imágenes iguales</Text>
      <Text style={styles.subtext}>Ronda {round} de {maxRounds}</Text>
      <Text style={styles.subtext}>
        Tiempo: {formatTime(timer)} | Encontrados: {matches}/{cards.length / 2}
      </Text>

      {gameWon ? (
        <View style={styles.winOverlay}>
          <Text style={styles.winText}>¡Felicidades! Has ganado</Text>
          <Text style={styles.winText}>Tiempo: {formatTime(timer)}</Text>
          <Pressable style={styles.restartButton} onPress={resetGame}>
            <Text style={styles.restartButtonText}>Reiniciar</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <Pressable
              key={card.id}
              onPress={() => cardClickFunction(card)}
              style={[styles.card, card.isFlipped && styles.cardFlipped]}
            >
              <LinearGradient
                colors={
                  card.isFlipped ? ['#f4f4f4', '#f4f4f4'] : ['#4dabf5', '#0284c7']
                }
                style={styles.card}
              >
                {card.isFlipped && (
                  <Image source={card.image} style={styles.cardImage} />
                )}
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(219,234,249)',
  },
  title: {
    fontSize: 40,
    marginTop: 50,
    fontWeight: 'bold',
    color: 'rgb(3,105,161)',
  },
  subtext: {
    fontSize: 16,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  card: {
    width: 80,
    height: 80,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cardFlipped: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgb(3,105,161)',
  },
  cardImage: {
    width: '120%',
    height: '120%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  winOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  restartButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  restartButtonText: {
    color: 'black',
    fontSize: 16,
  },
  coverImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  startButton: {
    backgroundColor: 'lime',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 700,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(3,105,161)',
  },
});
