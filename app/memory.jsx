import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Tabs from '../components/Tabs';

const randomArrFunction = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const gameCardsFunction = () => {
  const icons = [
    'paw',
    'paw',
    'heart',
    'heart',
    // 'tree',
    // 'tree',
    'star',
    'star',
    'bell',
    'bell',
    'gift',
    'gift',
    'rocket',
    'rocket',
    'leaf',
    'leaf',
    'car',
    'car',
    'bicycle',
    'bicycle',
  ];
  const randomIcons = randomArrFunction(icons);
  return randomIcons.map((icon, index) => ({
    id: index,
    symbol: icon,
    isFlipped: false,
  }));
};

export default function Memory() {
  const [cards, setCards] = useState(gameCardsFunction());
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);
  const [round, setRound] = useState(1); // Estado para la ronda actual
  const maxRounds = 3; // Total de rondas
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

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
  };

  const stopTimer = () => {
    setIsActive(false);
  };

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
    if (!isActive) {
      startTimer();
    }
    if (!gameWon && selectedCards.length < 2 && !card.isFlipped) {
      const updatedSelectedCards = [...selectedCards, card];
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);
      if (updatedSelectedCards.length === 2) {
        if (updatedSelectedCards[0].symbol === updatedSelectedCards[1].symbol) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
            if (round < maxRounds) {
              setTimeout(() => {
                nextRound(); // Pasar a la siguiente ronda
              }, 500);
            } else {
              geekWinGameFunction(); // Si es la última ronda, mostrar victoria
              setGameWon(true);
              stopTimer();
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
    setCards(gameCardsFunction());
    setSelectedCards([]);
    setMatches(0);
    setWinMessage(new Animated.Value(0));
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
    setCards(gameCardsFunction());
    setSelectedCards([]);
    setMatches(0);
    setWinMessage(new Animated.Value(0));
    setGameWon(false);
    resetTimer();
    setRound(1); // Reiniciar la ronda a 1
  };

  // useEffect(() => {
  //   if (matches === cards.length / 2) {
  //     geekWinGameFunction();
  //     setGameWon(true);
  //     stopTimer();
  //   }
  // }, [matches]);

  const msg = `${matches}${cards.length / 2}`;

  return (
    <View style={styles.container}>
      <Text className="text-4xl text-sky-700 font-bold mt-14">MEMORAMA</Text>
      <View>
      {/* <Button className="relative right-5 top-5" title="Reiniciar" onPress={resetGame} /> */}
      </View>
      <Text className="text-center mb-3">Encuentra las imagenes iguales</Text>
      <Text className="text-center font-bold text-xl ,b-2">
        Ronda <Text className="text-sky-600">{round}</Text> de {maxRounds}
      </Text>
      <View className="flex flex-row content-center justify-between w-screen px-5">
        <Text className="text-center font-bold text-xl">
          Cronómetro <Text className="text-sky-600">{formatTime(timer)}</Text>
        </Text>
        <Text className="text-center font-bold text-xl">
          Encontrados <Text className="text-sky-600">{matches} </Text>/{' '}
          {cards.length / 2}
        </Text>
      </View>
      {gameWon ? (
        <View style={styles.winMessage}>
          <View style={styles.winMessageContent}>
            <Text style={styles.winText}>¡Felicidades!</Text>
            <Text style={styles.winText}>Has ganado el juego!</Text>
            <Text style={styles.winTimeText}>Tiempo: {formatTime(timer)}</Text>
          </View>
          <View className="mt-5"></View>
          <Button title="Reiniciar" onPress={resetGame} />
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <Pressable key={card.id} onPress={() => cardClickFunction(card)} style={[styles.card, card.isFlipped && styles.cardFlipped]}>
              <LinearGradient
                colors={
                  card.isFlipped ? ['#f4f4f4', '#f4f4f4'] : ['#4dabf5', '#0284c7']
                }
                style={[styles.card, card.isFlipped && styles.cardFlipped]}
              >
                {card.isFlipped ? (
                  <Icon name={card.symbol} size={40} style={styles.cardIcon} />
                ) : null}
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      )}
      <Tabs className="absolute bottom-0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(241 245 249)',
  },
  header1: {
    fontSize: 36,
    marginBottom: 10,
    color: 'green',
  },
  header2: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(3, 105, 161)',
    marginBottom: 10,
  },
  matchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  roundText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'red',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%'
  },
  card: {
    width: 90,
    height: 90,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(to right, #4dabf5, #0284c7)',
    borderRadius: 8,
  },
  cardFlipped: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgb(3, 105, 161)',
    borderRadius: 8
  },
  cardIcon: {
    color: 'rgb(3, 105, 161)',
  },
  winMessage: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  winMessageContent: {
    backgroundColor: 'rgba(14, 165, 233, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  winText: {
    fontSize: 36,
    color: 'white',
  },
  winTimeText: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
  },
});
