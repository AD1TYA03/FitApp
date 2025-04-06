import React from 'react';
import { FlatList, Text, TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

interface Category {
  id: string;
  title: string;
  image: any; // You can strongly type this if using remote images or specific types
}

interface Props {
  categories: Category[];
  title?: string;
}

const CategoryList: React.FC<Props> = ({ categories, title = "Workout Categories" }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Category }) => (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/workout/${item.id}`)}
      >
        <Image source={item.image} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    width: 140,
    height: 160,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
  },
  cardTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategoryList;
