import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const TASKS_KEY = 'tasks';
const DATE_KEY = 'lastDate';

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
        const storedDate = await AsyncStorage.getItem(DATE_KEY);
        const today = new Date().toDateString();

        if (storedDate !== today || !storedTasks) {
          await AsyncStorage.setItem(DATE_KEY, today);
          setTasks([]);
        } else {
          setTasks(JSON.parse(storedTasks).filter(task => !task.complete) || []);
        }
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (updatedTasks) => {
    try {
      setTasks(updatedTasks.filter(task => !task.complete));
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  };

  const toggleTaskComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, complete: !task.complete } : task
    );
    saveTasks(updatedTasks);
  };

  const addTask = () => {
    if (newTask.trim()) {
      if (editingIndex !== null) {
        const updatedTasks = tasks.map((task, i) =>
          i === editingIndex ? { ...task, title: newTask } : task
        );
        saveTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        const newTaskObj = { title: newTask, complete: false };
        const updatedTasks = [...tasks, newTaskObj];
        saveTasks(updatedTasks);
      }
      setNewTask('');
    }
  };

  const editTask = (index) => {
    setNewTask(tasks[index].title);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>Parece que completaste las tareas, si deseas agregar más presiona el botón</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.taskItem}>
              <Pressable style={styles.taskButton} onPress={() => toggleTaskComplete(index)}>
                <Checkbox value={item.complete} onValueChange={() => toggleTaskComplete(index)} />
                <Text style={styles.taskText}>{item.title}</Text>
              </Pressable>
              <Pressable onPress={() => editTask(index)}>
                <AntDesign name="edit" size={24} color="blue" />
              </Pressable>
            </View>
          )}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Añadir nueva tarea"
        value={newTask}
        onChangeText={setNewTask}
      />
      <Pressable style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>{editingIndex !== null ? 'Editar' : 'Agregar'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  noTasksText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: 'gray',
  },
  button: {
    backgroundColor: '#0369a1',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  taskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskText: {
    fontSize: 18,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
});
