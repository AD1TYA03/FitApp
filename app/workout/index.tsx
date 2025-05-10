import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const workouts = [
    { id: '1', title: 'Morning Yoga', image: require('../../assets/images/yoga.png') },
    { id: '2', title: 'HIIT Workout', image: require('../../assets/images/hiit.png') },
    { id: '3', title: 'Strength Training', image: require('../../assets/images/strength.png') },
    { id: '4', title: 'Cardio Blast', image: require('../../assets/images/cardio.png') },
];

const WorkoutList = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Workout</Text>
            <FlatList
                data={workouts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/workout/${item.id}`)}>
                        <Image source={item.image} style={styles.cardImage} />
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
    },
    cardImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    cardTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WorkoutList;
