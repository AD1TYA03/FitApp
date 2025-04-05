import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const WorkoutDetails = () => {
    const { id } = useLocalSearchParams();
    const workoutId = Array.isArray(id) ? id[0] : id;

    // Dummy data for different workouts
    const workouts = {
        "1": { title: "Morning Yoga", image: require('../../assets/images/yoga.png'), exercises: [
            { id: '1', name: "Sun Salutation", duration: "5 min", image: require('../../assets/images/sun_salutation.png') },
            { id: '2', name: "Downward Dog", duration: "3 min", image: require('../../assets/images/downward_dog.png') },
            { id: '3', name: "Tree Pose", duration: "4 min", image: require('../../assets/images/tree_pose.png') },
        ]},
        "2": { title: "HIIT Workout", image: require('../../assets/images/hiit.png'), exercises: [
            { id: '1', name: "Jump Squats", duration: "30 sec", image: require('../../assets/images/jump_squats.png') },
            { id: '2', name: "Mountain Climbers", duration: "45 sec", image: require('../../assets/images/mountain_climbers.png') },
            { id: '3', name: "Burpees", duration: "40 sec", image: require('../../assets/images/burpees.png') },
        ]},
        "3": { title: "Strength Training", image: require('../../assets/images/strength.png'), exercises: [
            { id: '1', name: "Deadlift", duration: "3 sets x 10 reps", image: require('../../assets/images/deadlift.png') },
            { id: '2', name: "Bench Press", duration: "3 sets x 12 reps", image: require('../../assets/images/bench_press.png') },
            { id: '3', name: "Bicep Curls", duration: "3 sets x 15 reps", image: require('../../assets/images/bicep_curls.png') },
        ]},
        "4": { title: "Cardio Blast", image: require('../../assets/images/cardio.png'), exercises: [
            { id: '1', name: "Jump Rope", duration: "10 min", image: require('../../assets/images/jump_rope.png') },
            { id: '2', name: "Running", duration: "20 min", image: require('../../assets/images/running.png') },
            { id: '3', name: "Cycling", duration: "30 min", image: require('../../assets/images/cycling.png') },
        ]}
    };

    const workout = workouts[workoutId];

    if (!workout) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Workout Not Found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={workout.image} style={styles.headerImage} />
            <Text style={styles.title}>{workout.title}</Text>

            <Text style={styles.sectionTitle}>Exercises</Text>
            <FlatList
                data={workout.exercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.exerciseCard}>
                        <Image source={item.image} style={styles.exerciseImage} />
                        <View style={styles.exerciseDetails}>
                            <Text style={styles.exerciseTitle}>{item.name}</Text>
                            <Text style={styles.exerciseDuration}>{item.duration}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.exerciseList}
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
    headerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    exerciseList: {
        paddingBottom: 20,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    exerciseImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    exerciseDetails: {
        flex: 1,
    },
    exerciseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    exerciseDuration: {
        fontSize: 14,
        color: '#666',
    },
});

export default WorkoutDetails;
