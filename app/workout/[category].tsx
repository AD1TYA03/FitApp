import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { fetchBodyPartList, fetchExercisesByBodyPart } from '../../utils/api';

export default function CategoryExercises() {
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const loadCategoryAndExercises = async () => {
      try {
        setLoading(true);
        const categoryList = await fetchBodyPartList();
        setCategories(categoryList);

        const catIndex = Number(category);
        if (!isNaN(catIndex) && catIndex >= 0 && catIndex < categoryList.length) {
          const selected = categoryList[catIndex];
          setSelectedCategory(selected);

          const data = await fetchExercisesByBodyPart(selected);
          setExercises(data);
        } else {
          console.warn('Invalid category index:', category);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryAndExercises();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF4081" />
        <Text style={{ marginTop: 10 }}>Loading exercises...</Text>
      </View>
    );
  }

  if (!exercises.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>No exercises found for {selectedCategory}.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedCategory.toUpperCase()} Workouts</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/exercise/${item.id}`)}
            style={styles.card}
          >
            <Image source={{ uri: item.gifUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.bodyPart} | {item.equipment}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  meta: {
    fontSize: 14,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});
