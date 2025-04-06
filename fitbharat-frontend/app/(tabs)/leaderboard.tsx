import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, SafeAreaView
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Friend {
  id: string;
  name: string;
  xp: number;
  profileImage: any;
}

const Leaderboard: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [showRequests, setShowRequests] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Retrieved Token:', token);

      if (!token) {
        Alert.alert('Unauthorized', 'Please log in first.');
        return;
      }

      const res = await axios.get('http://192.168.29.119:8001/users/usernames', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedFriends: Friend[] = res.data.usernames.map((name: string, index: number) => ({
        id: `${index}`,
        name,
        xp: Math.floor(Math.random() * 300), // Placeholder XP
        profileImage: require('../../assets/images/default.png'), // Default avatar
      }));

      setFriends(fetchedFriends);

      // Sample request data (replace when backend for requests is ready)
      setFriendRequests([
        { id: '100', name: 'Sample Request', xp: 0, profileImage: require('../../assets/images/default.png') }
      ]);

    } catch (error: any) {
      console.error('Fetch Users Error:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        Alert.alert('Unauthorized', 'Session expired. Please log in again.');
      } else {
        Alert.alert('Error', 'Failed to fetch users from server.');
      }
    }
  };

  const handleAcceptRequest = (friend: Friend) => {
    setFriends([...friends, friend]);
    setFriendRequests(friendRequests.filter((req) => req.id !== friend.id));
    Alert.alert('Friend Request Accepted', `${friend.name} is now your friend!`);
  };

  const handleDeclineRequest = (friend: Friend) => {
    setFriendRequests(friendRequests.filter((req) => req.id !== friend.id));
    Alert.alert('Friend Request Declined', `You declined ${friend.name}'s request.`);
  };

  const renderFriendItem = ({ item, index }: { item: Friend; index: number }) => (
    <Animated.View style={styles.friendItem} entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Image source={item.profileImage} style={styles.profileImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.xp}>XP: {item.xp}</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🏆 Leaderboard</Text>
        <TouchableOpacity style={styles.requestsButton} onPress={() => setShowRequests(!showRequests)}>
          <Text style={styles.requestsButtonText}>{showRequests ? 'Hide Requests' : 'Friend Requests'}</Text>
        </TouchableOpacity>
      </View>

      {showRequests && (
        <Animated.View style={styles.requestsContainer} entering={FadeIn} exiting={FadeOut}>
          <FlatList
            data={friendRequests}
            renderItem={({ item }) => (
              <Animated.View style={styles.requestItem} entering={SlideInLeft} exiting={SlideOutRight} layout={Layout.springify()}>
                <Image source={item.profileImage} style={styles.profileImage} />
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>{item.name}</Text>
                  <View style={styles.requestButtons}>
                    <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRequest(item)}>
                      <Text style={styles.buttonText}>✔ Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton} onPress={() => handleDeclineRequest(item)}>
                      <Text style={styles.buttonText}>✖ Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}
            keyExtractor={(item) => item.id}
          />
        </Animated.View>
      )}

      <FlatList
        data={friends.sort((a, b) => b.xp - a.xp)}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  requestsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  requestsButtonText: {
    color: '#fff',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  xp: {
    fontSize: 14,
    color: '#FFD700',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginRight: 10,
  },
  requestsContainer: {
    backgroundColor: '#0F3460',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  requestButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#00C851',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Leaderboard;
