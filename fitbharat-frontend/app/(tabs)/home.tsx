// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   Image,
//   SafeAreaView,
// } from 'react-native';
// import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
// import { Feather } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { getUser } from '@/utils/storage';

// const Home = () => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [streak, setStreak] = useState(5);
//   const [userName, setUserName] = useState('User');

//   const [dailyGoals, setDailyGoals] = useState([
//     { id: 1, text: '10,000 Steps', completed: false },
//     { id: 2, text: '30 Min Cardio', completed: false },
//     { id: 3, text: 'Drink 2L Water', completed: false },
//     { id: 4, text: 'Eat Healthy Meals', completed: false },
//   ]);

//   const [workouts, setWorkouts] = useState([
//     { id: '1', title: 'Morning Yoga', image: require('../../assets/images/yoga.png') },
//     { id: '2', title: 'HIIT Workout', image: require('../../assets/images/hiit.png') },
//     { id: '3', title: 'Strength Training', image: require('../../assets/images/strength.png') },
//     { id: '4', title: 'Cardio Blast', image: require('../../assets/images/cardio.png') },
//   ]);

//   const [recentWorkouts, setRecentWorkouts] = useState([]);
//   const [suggestedWorkout, setSuggestedWorkout] = useState(null);

//   useEffect(() => {
//     setRecentWorkouts([workouts[1], workouts[2]]);
//     setSuggestedWorkout(workouts[0]);

//     const fetchUser = async () => {
//       const user = await getUser();
//       if (user?.name) setUserName(user.name);
//     };

//     fetchUser();
//   }, []);

//   const toggleGoalCompletion = (id: number) => {
//     setDailyGoals((prev) =>
//       prev.map((goal) =>
//         goal.id === id ? { ...goal, completed: !goal.completed } : goal
//       )
//     );
//   };

//   const renderItem = ({ item }: { item: any }) => (
//     <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)} layout={Layout.springify()}>
//       <TouchableOpacity style={styles.card} onPress={() => router.push(`/workout/${item.id}`)}>
//         <Image source={item.image} style={styles.cardImage} />
//         <Text style={styles.cardTitle}>{item.title}</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   // Filter workouts based on search
//   const filteredWorkouts = useMemo(() => {
//     if (!searchQuery) return workouts;
//     return workouts.filter((item) =>
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [searchQuery, workouts]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Good Morning, {userName}! ✨</Text>
//           <Text style={styles.subtitle}>You're on a {streak}-day workout streak! 🔥</Text>
//         </View>

//         {/* Search Bar */}
//         <View style={styles.searchBar}>
//           <TextInput
//             style={styles.input}
//             placeholder="Search workouts..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           <TouchableOpacity onPress={() => console.log('Searching:', searchQuery)}>
//             <Feather name="search" size={24} color="black" />
//           </TouchableOpacity>
//         </View>

//         {/* Suggested Workout */}
//         {suggestedWorkout && (
//           <>
//             <Text style={styles.sectionTitle}>Today's Recommended Workout</Text>
//             <TouchableOpacity
//               style={styles.recommendationCard}
//               onPress={() => router.push(`/workout/${suggestedWorkout.id}`)}
//             >
//               <Text style={styles.recommendationText}>{suggestedWorkout.title}</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {/* Daily Goals */}
//         <Text style={styles.sectionTitle}>Your Daily Goals</Text>
//         <View style={styles.goalsContainer}>
//           {dailyGoals.map((goal) => (
//             <TouchableOpacity key={goal.id} style={styles.goalItem} onPress={() => toggleGoalCompletion(goal.id)}>
//               <Feather
//                 name={goal.completed ? 'check-circle' : 'circle'}
//                 size={20}
//                 color={goal.completed ? '#4CAF50' : 'gray'}
//               />
//               <Text style={styles.goalText}>{goal.text}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Workout Categories */}
//         <Text style={styles.sectionTitle}>Workout Categories</Text>
//         <FlatList
//           data={filteredWorkouts}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 10 }}
//         />

//         {/* Recent Workouts */}
//         <Text style={styles.sectionTitle}>Recent Workouts</Text>
//         <FlatList
//           data={recentWorkouts}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 10 }}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   header: {
//     marginTop: 40,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     padding: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     paddingHorizontal: 10,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   goalsContainer: {
//     backgroundColor: '#E8F5E9',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   goalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   goalText: {
//     fontSize: 16,
//     marginLeft: 10,
//     color: '#333',
//   },
//   recommendationCard: {
//     backgroundColor: '#FFD700',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   recommendationText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginRight: 15,
//     alignItems: 'center',
//     width: 140,
//     height: 160,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardImage: {
//     width: '100%',
//     height: '75%',
//     resizeMode: 'cover',
//   },
//   cardTitle: {
//     marginTop: 5,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { fetchAllExercises, fetchBodyPartList } from '../../utils/api';
import CategoryList from '../../components/CategoryList';
import DailyGoal from '../../components/DailyGoal';
import ProgressCard from '../../components/ProgressCard';

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exerciseData, categoryData] = await Promise.all([
          fetchAllExercises(),
          fetchBodyPartList(),
        ]);

        setExercises(exerciseData);

        // Map categories to placeholder images (you can improve this later with real images)
        const formattedCategories = categoryData.map((item, index) => ({
          id: String(index),
          title: item,
          image: getCategoryImage(item),
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCategoryImage = (category) => {
    switch (category.toLowerCase()) {
      case 'chest':
        return require('../../assets/images/chest.png');
      case 'back':
        return require('../../assets/images/back.png');
      case 'cardio':
        return require('../../assets/images/cardio.png');
      case 'lower legs':
      case 'upper legs':
      case 'legs':
        return require('../../assets/images/legs.png');
      default:
        return require('../../assets/images/chest.png'); // Add a default image in assets
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.Text entering={FadeInDown.duration(500)} style={styles.heading}>
        Welcome Back, Champion 💪
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(100).duration(600)}>
        <ProgressCard title="Calories Burned" value={354} goal={500} unit="kcal" />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(600)}>
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        <View style={styles.dailyGoalsContainer}>
          <DailyGoal label="Steps" value={5200} goal={8000} />
          <DailyGoal label="Water" value={1.2} goal={2} unit="L" />
          <DailyGoal label="Sleep" value={6} goal={8} unit="hrs" />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(600)}>
        <CategoryList categories={categories} title="Workout Categories" />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(600)}>
        <Text style={styles.sectionTitle}>Popular Workouts</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FF4081" />
        ) : (
          exercises.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.workoutCard}>
              <Text style={styles.workoutName}>{item.name}</Text>
              <Text style={styles.workoutMeta}>
                {item.bodyPart} | {item.equipment}
              </Text>
            </View>
          ))
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 20,
    marginBottom: 10,
  },
  dailyGoalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutCard: {
    backgroundColor: '#f3f3f3',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  workoutMeta: {
    fontSize: 14,
    color: '#777',
  },
});
