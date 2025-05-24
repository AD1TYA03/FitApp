import { serverURI } from '@/utils/serverAddress';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Switch,
    ScrollView,
} from 'react-native';

export default function CreateCommunityScreen() {
    const { pathid } = useLocalSearchParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleCreateGroup = async () => {
        if (!name.trim() || !description.trim()) {
            Alert.alert('Validation Error', 'Name and description are required');
            return;
        }

        try {
            const payload = {
                name,
                description,
                image: imageUri, // You can later handle uploading if needed
                isPrivate,
                pathid
            };

            const res = await fetch(`${serverURI}:8001/group/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                Alert.alert('Success', 'Community created!');
                setName('');
                setDescription('');
                setImageUri(null);
                setIsPrivate(false);
            } else {
                Alert.alert('Error', 'Failed to create community');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: 'white', flexGrow: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Create Community</Text>

            <Text style={{ marginBottom: 5 }}>Group Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter group name"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 15,
                }}
            />

            <Text style={{ marginBottom: 5 }}>Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 15,
                    height: 100,
                }}
            />

            {/* Placeholder for image upload */}
            <Text style={{ marginBottom: 5 }}>Group Image</Text>
            <TouchableOpacity
                onPress={() => Alert.alert('Not implemented', 'Image picker not included')}
                style={{
                    backgroundColor: '#eee',
                    padding: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginBottom: 15,
                }}
            >
                <Text>Select Image</Text>
            </TouchableOpacity>

            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: '100%', height: 150, borderRadius: 10, marginBottom: 15 }}
                    resizeMode="cover"
                />
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ flex: 1 }}>Private Group</Text>
                <Switch value={isPrivate} onValueChange={setIsPrivate} />
            </View>

            <TouchableOpacity
                onPress={handleCreateGroup}
                style={{
                    backgroundColor: '#007bff',
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Create Group</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
