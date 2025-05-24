import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { serverURI } from '@/utils/serverAddress';

interface CommunityMember {
  _id: string;
  name: string;
  description: string;
  image?: string;
  isPrivate: boolean;
  members: [];
  pathid: string;
}


const PathDetailsScreen = () => {
  const navigation = useNavigation();
  const { route, pathName, description, id } = useLocalSearchParams();
  const [mockCommunity, setMockCommunity] = React.useState<CommunityMember[]>([]);


  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${serverURI}:8001/group/getallbypathid?pathid=${id}`);
        const data = await response.json();
        if (data) {
          console.log("Groups fetched successfully:", data);
          setMockCommunity(data);

        } else {
          console.error("No groups found for the given route.");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }
    fetchGroups();
  }, [id]);


  const handleCreateRoom = () => {
    router.push(`/(run)/createRoom?route=${route}`)
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: pathName,
    });
  }, [navigation, pathName]);

  const renderHeader = () => (
    <>
      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>About the Road</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>

      {/* Community Title */}
      <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.communityTitle}>Communities</Text>
        <TouchableOpacity style={{ backgroundColor: '#34D399', padding: 8, borderRadius: 8 }} onPress={() => router.push(`/(community)/create?pathid=${id}`)}>
          <Text>Create</Text>
        </TouchableOpacity>
      </View>

    </>
  );


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mockCommunity}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>{item.name}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.flatlistContent}
      />
      <View style={styles.topButtonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom}>
          <Text style={styles.createButtonText}>Create Room ➕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PathDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flatlistContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  topButtonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#34D399',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#34D399',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    minHeight: 100,
  },
  communityTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  memberCard: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  memberName: {
    fontSize: 16,
    color: '#1f2937',
  },
  separator: {
    height: 12,
  },
});
