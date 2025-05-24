import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  Image, TouchableOpacity, Modal, Pressable, Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { fetchAllExercises, fetchBodyPartList } from '../../utils/api';
import CategoryList from '../../components/CategoryList';
import DailyGoal from '../../components/DailyGoal';
import ProgressCard from '../../components/ProgressCard';
import { getUser } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exerciseData, categoryData] = await Promise.all([
          fetchAllExercises(),
          fetchBodyPartList(),
        ]);

    const fetchUser = async () => {
      const user = await getUser();
      if (user?.name) setUserName(user.name);
    };

    fetchUser();

        setExercises(exerciseData || []);
        const formattedCategories = (categoryData || []).map((item, index) => ({
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
        return require('../../assets/images/cardio_image.png');
      case 'lower legs':
      case 'upper legs':
      case 'legs':
        return require('../../assets/images/legs.png');
      default:
        return require('../../assets/images/chest.png');
    }
  };

  const profileOptions: { label: string; icon: keyof typeof Ionicons.glyphMap; action: () => void }[] = [
    { label: 'My Profile', icon: 'person-outline', action: () => Alert.alert('Profile') },
    { label: 'Settings', icon: 'settings-outline', action: () => Alert.alert('Settings') },
    { label: 'Workout History', icon: 'barbell-outline', action: () => Alert.alert('Workout History') },
    { label: 'Log Out', icon: 'log-out-outline', action: () => Alert.alert('Logged out!') },
  ];

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile icon top-right */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={require('../../assets/images/ankit.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <Animated.Text entering={FadeInDown.duration(500)} style={styles.heading}>
          Welcome Back, {userName} 💪
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

      {/* Profile Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Image
              source={require('../../assets/images/ankit.png')}
              style={styles.modalAvatar}
            />
            <Text style={styles.modalUsername}>{userName}</Text>
          </View>
          {profileOptions.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.option}
              onPress={() => {
                setModalVisible(false);
                option.action();
              }}
            >
              <Ionicons name ={option.icon} size={20} color="#333" style={{ marginRight: 10 }} />
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  modalUsername: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
