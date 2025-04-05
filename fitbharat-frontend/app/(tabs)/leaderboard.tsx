import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout, SlideInLeft, SlideOutRight } from 'react-native-reanimated';

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
    const fetchedFriends: Friend[] = [
      { id: '1', name: 'Ketan', xp: 250, profileImage: require('../../assets/images/ketan.png') },
      { id: '2', name: 'Alok', xp: 200, profileImage: require('../../assets/images/alok.png') },
      { id: '3', name: 'Farhana', xp: 180, profileImage: require('../../assets/images/farhana.png') },
    ];

    const fetchedRequests: Friend[] = [
      { id: '4', name: 'Ankit', xp: 0, profileImage: require('../../assets/images/ankit.png') },
      { id: '5', name: 'Ashish', xp: 0, profileImage: require('../../assets/images/ashish.png') },
    ];

    setFriends(fetchedFriends);
    setFriendRequests(fetchedRequests);
  }, []);

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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
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
    backgroundColor: '#00C851', // Bright green
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: '#FF4444', // Bright red
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
