import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { fetchExerciseById } from '../../utils/api';

export default function ExerciseDetails() {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        if (id) {
          const data = await fetchExerciseById(id as string);
          setExercise(data);
        }
      } catch (error) {
        console.error('Error fetching exercise details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF4081" />
        <Text style={{ marginTop: 10 }}>Loading exercise...</Text>
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Exercise not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Image source={{ uri: exercise.gifUrl }} style={styles.image} />

      <View style={styles.metaContainer}>
        <Text style={styles.meta}>💪 Body Part: {exercise.bodyPart}</Text>
        <Text style={styles.meta}>🛠 Equipment: {exercise.equipment}</Text>
        <Text style={styles.meta}>🎯 Target Muscle: {exercise.target}</Text>
      </View>

      <Text style={styles.instructionsTitle}>Instructions:</Text>
      {exercise.instructions?.length ? (
        exercise.instructions.map((step: string, index: number) => (
          <Text key={index} style={styles.instruction}>
            • {step}
          </Text>
        ))
      ) : (
        <Text style={styles.instruction}>No instructions available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
  },
  metaContainer: {
    marginBottom: 20,
  },
  meta: {
    fontSize: 16,
    color: '#444',
    marginVertical: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  instruction: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#a00',
  },
});
