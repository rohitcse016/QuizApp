import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Image,
} from 'react-native';
import BaseText from '../components/BaseText';

const { width, height } = Dimensions.get('window');

// Simple leaf emoji (you can also replace with image if you want)
const leaves = Array.from({ length: 10 }); // number of leaves

export default function ResultScreen({ route, navigation }: any) {
  const { score, total } = route.params;

  // Create animation refs for each leaf
  const fallAnimations = useRef(
    leaves.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    // Start animations for each leaf
    fallAnimations.forEach((anim, index) => {
      const randomDelay = Math.random() * 1000;
      const randomDuration = 4000 + Math.random() * 3000;

      const startFalling = () => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: randomDuration,
          delay: randomDelay,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => startFalling()); // loop continuously
      };

      startFalling();
    });
  }, [fallAnimations]);

  const leafEmojis = ['🍃', '🍂', '🍁', '🌿'];
  return (
    <View style={styles.container}>
      {/* Falling leaves animation layer */}
      {leaves.map((_, index) => {
        const translateY = fallAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [-50, height + 50],
        });

        const translateX = fallAnimations[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [
            Math.random() * width, // start X
            Math.random() * width, // middle sway
            Math.random() * width, // end X
          ],
        });

        const rotate = fallAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${Math.random() * 360}deg`],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.leaf,
              {
                transform: [{ translateY }, { translateX }, { rotate }],
                opacity: 0.8,
              },
            ]}
          >
            <BaseText>{leafEmojis[index % leafEmojis.length]}</BaseText>
          </Animated.View>
        );
      })}

      {/* Main content */}
      <BaseText style={styles.title}>🎉 Quiz Completed!</BaseText>
      <BaseText style={styles.scoreText}>
        You scored {score} / {total}
      </BaseText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Quiz')}
      >
        <BaseText style={styles.buttonText}>Restart Quiz</BaseText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, zIndex: 10 },
  scoreText: { fontSize: 20, marginBottom: 30, zIndex: 10 },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    zIndex: 10,
  },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  leaf: {
    position: 'absolute',
  },
  leafText: {
    fontSize: 24,
  },
});
