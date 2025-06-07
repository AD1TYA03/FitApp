import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout, SlideInLeft, SlideOutRight } from 'react-native-reanimated';

// Dummy data without images
const dummyFriends = [
  { id: '1', name: 'Alice', xp: 120, profileImage: null },
  { id: '2', name: 'Bob', xp: 240, profileImage: null },
  { id: '3', name: 'Charlie', xp: 180, profileImage: null },
];

const dummyFriendRequests = [
  { id: '4', name: 'Daisy', xp: 0, profileImage: null },
];

const Leaderboard: React.FC = () => {
  const [friends, setFriends] = useState(dummyFriends);
  const [friendRequests, setFriendRequests] = useState(dummyFriendRequests);
  const [showRequests, setShowRequests] = useState(false);

  const handleAcceptRequest = (friend) => {
    setFriends([...friends, friend]);
    setFriendRequests(friendRequests.filter(req => req.id !== friend.id));
    Alert.alert('Friend Request Accepted', `${friend.name} is now your friend!`);
  };

  const handleDeclineRequest = (friend) => {
    setFriendRequests(friendRequests.filter(req => req.id !== friend.id));
    Alert.alert('Friend Request Declined', `You declined ${friend.name}'s request.`);
  };

  const renderFriendItem = ({ item, index }) => (
    <Animated.View style={styles.friendItem} entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
      <Text style={styles.rank}>{index + 1}</Text>
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
          <Text style={styles.requestsButtonText}>
            {showRequests ? 'Hide Requests' : 'Friend Requests'}
          </Text>
        </TouchableOpacity>
      </View>

      {showRequests && (
        <Animated.View style={styles.requestsContainer} entering={FadeIn} exiting={FadeOut}>
          <FlatList
            data={friendRequests}
            renderItem={({ item }) => (
              <Animated.View style={styles.requestItem} entering={SlideInLeft} exiting={SlideOutRight} layout={Layout.springify()}>
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
        data={[...friends].sort((a, b) => b.xp - a.xp)}
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
    marginTop: 6,
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
