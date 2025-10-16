import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import BaseText from '../components/BaseText';
import { questions } from '../data/questions';

export default function QuizScreen({ navigation }: any) {
  const [quizType, setQuizType] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Animated values for feedback
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Only load questions after a quiz type is selected
  const currentQuestions = quizType ? questions[quizType] : [];

  const handleOptionPress = (option: string) => {
    setSelected(option);
    const isCorrect = option === currentQuestions[current].correct;
    setShowFeedback(true);
    if (isCorrect) setScore(prev => prev + 1);

    // Start feedback animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowFeedback(false);
        setSelected(null);
        if (current + 1 < currentQuestions.length) {
          setCurrent(current + 1);
        } else {
          navigation.navigate('Result', {
            score,
            total: currentQuestions.length,
          });
        }
      });
    }, 1000);
  };

  if (!quizType) {
    // Show quiz type selection screen
    const types = Object.keys(questions);
    return (
      <View style={styles.container}>
        <BaseText style={styles.question}>Select a Quiz Type</BaseText>
        {types.map(type => (
          <TouchableOpacity
            key={type}
            style={styles.option}
            onPress={() => setQuizType(type)}
          >
            <BaseText style={styles.optionText}>{type}</BaseText>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Quiz question screen
  const question = currentQuestions[current];

  return (
    <View style={styles.container}>
      <BaseText style={styles.question}>{question.question}</BaseText>

      <FlatList
        data={question.options}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const isSelected = selected === item;
          const isCorrect = item === question.correct;

          return (
            <TouchableOpacity
              style={[
                styles.option,
                isSelected && {
                  backgroundColor: isCorrect ? '#4CAF50' : '#F44336',
                },
              ]}
              disabled={!!selected}
              onPress={() => handleOptionPress(item)}
            >
              <BaseText style={styles.optionText}>{item}</BaseText>
            </TouchableOpacity>
          );
        }}
      />

      {showFeedback && (
        <Animated.View
          style={[
            styles.feedbackBox,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <BaseText style={styles.feedbackText}>
            {selected === question.correct ? '🎉 Correct!' : '❌ Wrong!'}
          </BaseText>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  question: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
  option: {
    padding: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginVertical: 8,
  },
  optionText: { fontSize: 18 },
  feedbackBox: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  feedbackText: { fontSize: 22, fontWeight: 'bold' },
});
