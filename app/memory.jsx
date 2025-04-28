import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const randomArrFunction = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Modifica `gameCardsFunction` para asignar un color único a cada par
const gameCardsFunction = (pairsCount) => {
  const icons = [
    "paw",
    "heart",
    "star",
    "bell",
    "gift",
    "rocket",
    "leaf",
    "car",
    "bicycle",
  ];

  // Selecciona los íconos necesarios y duplica cada ícono para crear los pares
  const selectedIcons = icons
    .slice(0, pairsCount)
    .flatMap((icon) => [icon, icon]);

  // Genera un color único para cada par de íconos
  const colors = Array.from({ length: pairsCount }, () => getRandomColor());

  // Asigna los colores a los pares de íconos
  const randomIcons = randomArrFunction(
    selectedIcons.map((icon, index) => ({
      id: index,
      symbol: icon,
      isFlipped: false,
      color: colors[Math.floor(index / 2)], // Asigna el mismo color a ambos íconos del par
    }))
  );

  return randomIcons;
};

export default function Memory() {
  const [round, setRound] = useState(1);
  const maxRounds = 3;
  const pairsPerRound = [3, 6, 9];
  const [cards, setCards] = useState(
    gameCardsFunction(pairsPerRound[round - 1])
  );
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);

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
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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
                nextRound();
              }, 500);
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
    setRound(1);
    setCards(gameCardsFunction(pairsPerRound[0]));
    setSelectedCards([]);
    setMatches(0);
    setWinMessage(new Animated.Value(0));
    setGameWon(false);
    resetTimer();
  };

  const sendGameTimeToAPI = async () => {
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);

    try {
      const us = JSON.parse(await AsyncStorage.getItem("user"));
      const token = JSON.parse(await AsyncStorage.getItem("token"));
      const response = await fetch("https://api.scanteate.com/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
        body: JSON.stringify({
          UserId: us.id,
          type: "Memorama",
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          duration,
        }),
      });
      if (!response.ok) {
        console.log("Error al enviar los datos del tiempo del juego");
      }
      const data = await response.json();
      console.log("Datos del tiempo enviados con éxito:", data);
    } catch (error) {
      console.error("Error al enviar los datos del tiempo", error);
    }
  };

  return (
    <View style={styles.container}>
      <View className="absolute left-0 top-8">
        <Pressable
          className="ml-4 p-2 rounded-xl mt-5 bg-slate-50"
          onPress={() => router.back()}
        >
          <AntDesign name="left" size={24} color="gray" />
        </Pressable>
      </View>
      <View className="absolute right-6 top-10">
        <Pressable
          className="p-2 rounded-xl mt-5 bg-slate-300"
          onPress={resetGame}
        >
          <AntDesign name="reload1" size={24} color="rgb(3,105,61)" />
        </Pressable>
      </View>
      <Text className="text-5xl text-sky-700 mt-14 font-custom">MEMORAMA</Text>
      <Text className="text-center mb-4 font-slabold">
        Encuentra las imágenes iguales
      </Text>
      <Text className="text-center font-super text-lg">
        Ronda <Text className="text-sky-600">{round}</Text> de {maxRounds}
      </Text>
      <View className="flex flex-row content-center justify-between w-screen px-5 mb-2">
        <Text className="text-center font-super text-lg">
          Cronómetro <Text className="text-sky-600">{formatTime(timer)}</Text>
        </Text>
        <Text className="text-center font-super text-lg">
          Encontrados <Text className="text-sky-600">{matches} </Text>/{" "}
          {cards.length / 2}
        </Text>
      </View>
      {gameWon ? (
        <View style={styles.winMessage}>
          <View style={styles.winMessageContent}>
            <Text className="font-custom text-yellow-500 text-5xl text-center mb-1">
              Felicidades!
            </Text>
            <Text className="font-custom text-white text-4xl text-center mb-5">
              Has ganado el juego
            </Text>
            <Text className="font-super text-white text-3xl text-center">
              Tiempo:{" "}
              <Text className="text-green-400">{formatTime(timer)}</Text>
            </Text>
            <Pressable
              onPress={resetGame}
              className="bg-white p-3 rounded-md mt-8"
            >
              <Text className="text-sky-800 font-super text-xl">Reiniciar</Text>
            </Pressable>
          </View>
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
                  card.isFlipped
                    ? ["#f4f4f4", "#f4f4f4"]
                    : ["#4dabf5", "#0284c7"]
                }
                style={[styles.card, card.isFlipped && styles.cardFlipped]}
              >
                {card.isFlipped ? (
                  <Icon
                    name={card.symbol}
                    size={40}
                    style={{ color: card.color }}
                  />
                ) : null}
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
    alignItems: "center",
    backgroundColor: "rgb(219, 234, 249)",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: 90,
    height: 90,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  cardFlipped: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "rgb(3, 105, 161)",
    borderRadius: 8,
  },
  winMessage: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  winMessageContent: {
    backgroundColor: "rgba(14, 165, 233, 0.7)",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  winText: {
    fontSize: 36,
    color: "white",
    fontFamily: "PlayChickens",
    marginBottom: 8,
  },
  winTimeText: {
    fontSize: 24,
    color: "white",
    marginTop: 10,
    fontFamily: "SuperFeel",
  },
});
