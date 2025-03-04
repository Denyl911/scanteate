import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { Audio } from 'expo-av';  // Importa el módulo de sonido

const emotions = ['Alegría', 'Miedo', 'Tristeza', 'Enojo', 'Asco', 'Asombro'];
const colors = ['#FFD700', '#FF4500', '#1E90FF', '#32CD32', '#8A2BE2', '#FF1493'];

export default function SimonSays() {
    const [gameState, setGameState] = useState('start'); // 'start', 'countdown', 'playing', 'gameover'
    const [sequence, setSequence] = useState([]);
    const [userInput, setUserInput] = useState([]);
    const [score, setScore] = useState(0);
    const [record, setRecord] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [highlighted, setHighlighted] = useState(null);
    const [jumpAnim] = useState(new Animated.Value(1));
    const [sound, setSound] = useState();  // Estado para el sonido

    const emotionImages = {
        'Alegría': require('../assets/images/emoalegria.png'),
        'Miedo': require('../assets/images/emomiedo.png'),
        'Tristeza': require('../assets/images/emotristeza.png'),
        'Enojo': require('../assets/images/emoenojo.png'),
        'Asco': require('../assets/images/emoasco.png'),
        'Asombro': require('../assets/images/emoasombro.png'),
    };

    // Mapea los sonidos para cada emoción
    const emotionSounds = {
        'Alegría': require('../assets/sounds/Button1.mp3'),
        'Miedo': require('../assets/sounds/Button2.mp3'),
        'Tristeza': require('../assets/sounds/Button3.mp3'),
        'Enojo': require('../assets/sounds/Button4.mp3'),
        'Asco': require('../assets/sounds/Button5.mp3'),
        'Asombro': require('../assets/sounds/Button6.mp3'),
    };

    // Función para reproducir sonido durante 500ms
    async function playSound(emotion) {
        const { sound } = await Audio.Sound.createAsync(emotionSounds[emotion]);
        setSound(sound);
        await sound.playAsync();  // Reproduce el sonido
        setTimeout(() => {
            sound.stopAsync();  // Detiene el sonido después de 500ms
        }, 300);  // Suena solo por 500ms
    }

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync(); // Desmonta el sonido cuando se salga del componente
              }
            : undefined;
    }, [sound]);

    useEffect(() => {
        if (gameState === 'countdown') {
            let timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        startGame();
                        return 3;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'playing' && sequence.length > 0) {
            showSequence();
        }
    }, [sequence]);

    const startGame = () => {
        setSequence([emotions[Math.floor(Math.random() * emotions.length)]]);
        setUserInput([]);
        setScore(0);
        setGameState('playing');
    };

    // Calcula el tiempo basado en la puntuación: cuanto mayor el puntaje, menor el tiempo de espera
    const getSpeed = () => {
        const baseSpeed = 800;
        const minSpeed = 300;
        return Math.max(baseSpeed - score * 50, minSpeed); // Reduce la velocidad a medida que aumenta el puntaje, pero nunca baja de minSpeed
    };

    const showSequence = async () => {
        const speed = getSpeed();
        for (let i = 0; i < sequence.length; i++) {
            setHighlighted(sequence[i]);
            await playSound(sequence[i]);  // Reproduce el sonido correspondiente a la emoción en la secuencia
            Animated.sequence([
                Animated.timing(jumpAnim, { toValue: 1.5, duration: speed / 2, useNativeDriver: true }), // Animación más rápida a medida que aumenta el puntaje
                Animated.timing(jumpAnim, { toValue: 1, duration: speed / 2, useNativeDriver: true }),
            ]).start();
            await new Promise((resolve) => setTimeout(resolve, speed));
            setHighlighted(null);
            await new Promise((resolve) => setTimeout(resolve, speed / 2)); // Pausa entre cada emoción
        }
    };

    const handleEmotionPress = async (emotion) => {
        const newUserInput = [...userInput, emotion];
        setUserInput(newUserInput);

        // Reproducir sonido al presionar la emoción
        await playSound(emotion); 

        if (newUserInput.join() === sequence.slice(0, newUserInput.length).join()) {
            if (newUserInput.length === sequence.length) {
                setTimeout(() => {
                    const nextEmotion = emotions[Math.floor(Math.random() * emotions.length)];
                    setSequence([...sequence, nextEmotion]);
                    setUserInput([]);
                    setScore(score + 1);
                }, 1000);
            }
        } else {
            setRecord(Math.max(record, score));
            setGameState('gameover');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {gameState === 'start' && (
                <>
                    <Text style={{ fontSize: 48, fontWeight: 'bold' }}>SIMONJI</Text>
                    <Text style={{ fontSize: 22, marginVertical: 15 }}>SIGUE LA SECUENCIA DE LAS EMOCIONES!</Text>
                    <TouchableOpacity
                        onPress={() => setGameState('countdown')}
                        style={{ marginTop: 20, padding: 20, borderRadius: 50, backgroundColor: 'blue' }}
                    >
                        <Text style={{ color: 'white', fontSize: 20 }}>Iniciar</Text>
                    </TouchableOpacity>
                </>
            )}
            {gameState === 'countdown' && (
                <Text style={{ fontSize: 48, fontWeight: 'bold' }}>{countdown}</Text>
            )}
            {gameState === 'playing' && (
                <>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>SIMONJI</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginTop: 20,
                        }}
                    >
                        {emotions.map((emotion, index) => (
                            <Animated.View
                                key={emotion}
                                style={{
                                    transform: [{ scale: highlighted === emotion ? jumpAnim : 1 }],
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => handleEmotionPress(emotion)}
                                    style={{
                                        margin: 10,
                                        padding: 0,
                                        borderRadius: 10,
                                        backgroundColor: colors[index],
                                        minWidth: 150,
                                        height: 150,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 4,
                                        borderColor: '#fff',
                                    }}
                                >
                                    <Image
                                        source={emotionImages[emotion]}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            resizeMode: 'contain',
                                        }}
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </>
            )}
            {gameState === 'gameover' && (
                <>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'red' }}>¡Perdiste!</Text>
                    <Text style={{ fontSize: 24 }}>Puntaje: {score}</Text>
                    <Text style={{ fontSize: 24 }}>Récord: {record}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 20,
                            justifyContent: 'space-between',
                            width: '60%',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setGameState('countdown')}
                            style={{
                                padding: 15,
                                borderRadius: 50,
                                backgroundColor: 'green',
                                flex: 1,
                                marginRight: 10,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: 'white' }}>Volver a jugar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setGameState('start')}
                            style={{
                                padding: 15,
                                borderRadius: 50,
                                backgroundColor: 'blue',
                                flex: 1,
                                marginLeft: 10,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: 'white' }}>Menú principal</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}
