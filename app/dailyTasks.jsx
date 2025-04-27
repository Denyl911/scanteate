import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const TASKS_KEY = "tasks";
const DATE_KEY = "lastDate";

export default function DailyTasks() {
  const initialTasks = [
    {
      title: "Despertar a las 8:00am",
      image: require("../assets/images/cama.png"),
      complete: false,
    },
    {
      title: "Comer saludable",
      image: require("../assets/images/comida.png"),
      complete: false,
    },
    {
      title: "Lavarme los dientes",
      image: require("../assets/images/cepillo.png"),
      complete: false,
    },
    {
      title: "Hacer tarea",
      image: require("../assets/images/tarea.png"),
      complete: false,
    },
    {
      title: "Hacer ejercicio",
      image: require("../assets/images/ejercicio.png"),
      complete: false,
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    // Cargar el estado de las tareas al iniciar la aplicación
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
        const storedDate = await AsyncStorage.getItem(DATE_KEY);
        const today = new Date().toDateString();

        // Si es un nuevo día o no hay tareas almacenadas, inicializa el estado
        if (storedDate !== today || !storedTasks) {
          await resetTasks(today);
        } else {
          await resetTasks(today);
          //   setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    loadTasks();
  }, []);

  // Guardar el estado de las tareas en AsyncStorage
  const saveTasks = async (updatedTasks) => {
    try {
      setTasks(updatedTasks);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
      await AsyncStorage.setItem(DATE_KEY, new Date().toDateString());
    } catch (error) {
      console.error("Error al guardar tareas:", error);
    }
  };

  // Marcar tarea como completada y guardar el estado
  const toggleTaskComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, complete: !task.complete } : task
    );
    saveTasks(updatedTasks);
  };

  // Reiniciar el estado de las tareas y actualizar la fecha en AsyncStorage
  const resetTasks = async (date) => {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
      await AsyncStorage.setItem(DATE_KEY, date);
      setTasks(initialTasks);
    } catch (error) {
      console.error("Error al reiniciar tareas:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d5692" hidden={false} translucent={true} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="left" size={24} color="#0369a1" />
      </Pressable>
      <Text style={styles.title}>Mi rutina</Text>
      {tasks.map((task, index) => (
        <Pressable
          key={index}
          style={styles.cuentoButton}
          onPress={() => toggleTaskComplete(index)}
        >
          <Checkbox
            value={task.complete}
            onValueChange={() => toggleTaskComplete(index)}
          />
          <Text
            style={[styles.cuentoText, task.complete && styles.textComplete]}
          >
            {task.title}
          </Text>
          <Image
            blurRadius={task.complete ? 10 : 0}
            source={task.image}
            style={[styles.cuentoImage]}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    position: "absolute",
    top: 14,
    left: 5,
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
    marginTop: 30,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontFamily: "PlayChickens",
    marginTop: 65,
    marginBottom: 30,
    color: "#0369a1",
  },
  cuentoButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  cuentoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  cuentoText: {
    fontSize: 18,
    color: "#0369a1",
    textAlign: "left",
    fontFamily: "SuperFeel",
    marginLeft: 10,
    marginRight: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  textComplete: {
    textDecorationLine: "line-through",
    color: "rgb(51, 65, 85)",
  },
  imgComplete: {
    tintColor: "gray",
  },
});
