import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Image ,SafeAreaView} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Home = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [streak, setStreak] = useState(5); // Example streak count
    const [userName, setUserName] = useState('Aditya');

    const [dailyGoals, setDailyGoals] = useState([
        { id: 1, text: "10,000 Steps", completed: false },
        { id: 2, text: "30 Min Cardio", completed: false },
        { id: 3, text: "Drink 2L Water", completed: false },
        { id: 4, text: "Eat Healthy Meals", completed: false },
    ]);

    const [workouts, setWorkouts] = useState([
        { id: '1', title: 'Morning Yoga', image: require('../../assets/images/yoga.png') },
        { id: '2', title: 'HIIT Workout', image: require('../../assets/images/hiit.png') },
        { id: '3', title: 'Strength Training', image: require('../../assets/images/strength.png') },
        { id: '4', title: 'Cardio Blast', image: require('../../assets/images/cardio.png') },
    ]);

    const [recentWorkouts, setRecentWorkouts] = useState([workouts[1], workouts[2]]);
    const [suggestedWorkout, setSuggestedWorkout] = useState(workouts[0]);

    const toggleGoalCompletion = (id) => {
        setDailyGoals(prevGoals =>
            prevGoals.map(goal =>
                goal.id === id ? { ...goal, completed: !goal.completed } : goal
            )
        );
    };

    const renderItem = ({ item }) => (
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)} layout={Layout.springify()}>  
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
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container1}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Good Morning, {userName}! ✨</Text>
                <Text style={styles.subtitle}>You're on a {streak}-day workout streak! 🔥</Text>
            </View>

            <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder="Search workouts..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity>
                    <Feather name="search" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Today's Recommended Workout</Text>
            <TouchableOpacity 
                style={styles.recommendationCard} 
                onPress={() => router.push(`/workout/${suggestedWorkout.id}`)}
            >
                <Text style={styles.recommendationText}>{suggestedWorkout.title}</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Your Daily Goals</Text>
            <View style={styles.goalsContainer}>
                {dailyGoals.map((goal) => (
                    <TouchableOpacity key={goal.id} style={styles.goalItem} onPress={() => toggleGoalCompletion(goal.id)}>
                        <Feather name={goal.completed ? "check-circle" : "circle"} size={20} color={goal.completed ? "#4CAF50" : "gray"} />
                        <Text style={styles.goalText}>{goal.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Workout Categories</Text>
            <FlatList
                data={workouts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            <FlatList
                data={recentWorkouts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 4,
    },
    container1: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 0,
      paddingHorizontal: 20,
  },
    header: {
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    goalsContainer: {
        backgroundColor: '#E8F5E9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    recommendationCard: {
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    recommendationText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginRight: 15,
        alignItems: 'center',
        width: 140,
        height: 160,
        overflow: 'hidden',
        shadowColor: "#000",
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

export default Home;
