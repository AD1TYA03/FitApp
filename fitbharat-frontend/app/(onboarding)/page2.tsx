import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const features = [
  { 
    title: "AI-powered Fitness Guidance", 
    description: "Personalized workout & diet plans tailored to your needs.", 
    animation: require('../../assets/animations/ai_fitness.json') 
  },
  { 
    title: "Run Together Mode", 
    description: "Join real-time fitness sessions with friends & track progress.", 
    animation: require('../../assets/animations/run_together.json') 
  },
  { 
    title: "Best Path Recommendation", 
    description: "Find optimized running & cycling paths based on terrain & weather.", 
    animation: require('../../assets/animations/path_recommendation.json') 
  },
  { 
    title: "Gamification & Rewards", 
    description: "Earn points, unlock achievements, and stay motivated.", 
    animation: require('../../assets/animations/gamification.json') 
  },
];

export default function FeaturesPage() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const handleNext = () => {
    router.push('/page3');
  };

  return (
    <LinearGradient colors={["#000000", "#000000"]} style={styles.container}>
      <Animated.FlatList
        data={features}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={styles.featureContainer}>
            <LottieView source={item.animation} autoPlay loop style={styles.animation} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {features.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  animation: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 100,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginHorizontal: 5,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  nextButtonText: {
    color: '#0A0F24',
    fontSize: 18,
    fontWeight: 'bold',
  },
});