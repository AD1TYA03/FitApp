import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import io from 'socket.io-client';
import { Feather } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values'; // Import the polyfill

const socket = io('http://192.168.29.91:3001');

interface Message {
    id: string;
    sender: 'You' | string;
    text: string;
    timestamp: number;
}

interface Chat {
    id: string;
    name: string;
    image: string;
}

interface Story {
    id: string;
    name: string;
    image: string | null;
}

const ChatScreen: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([
    { id: 'add', name: 'Add Story', image: null },
    { id: 'ankit', name: 'Ankit', image: require('../../assets/images/ankit.png') },
    { id: 'farhana', name: 'Farhana', image: require('../../assets/images/farhana.png') },
    { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png')},
]);

const [chats, setChats] = useState<Chat[]>([
    { id: 'ankit', name: 'Ankit', image: require('../../assets/images/ankit.png') },
    { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png') },
    { id: 'verma', name: 'Verma', image: require('../../assets/images/verma.png') },
    { id: 'arjit', name: 'Arjit', image: require('../../assets/images/arjit.png') },
    { id: 'ketan', name: 'Ketan', image: require('../../assets/images/ketan.png') },
]);


    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
    const [messageInput, setMessageInput] = useState<string>('');
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

    useEffect(() => {
        socket.on('chatMessage', (data: { chatId: string, message: Message }) => {
            if (data.chatId === selectedChat?.id) {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [data.chatId]: [...(prevMessages[data.chatId] || []), { ...data.message, id: uuidv4() }],
                }));
            }
        });

        return () => {
            socket.off('chatMessage');
        };
    }, [selectedChat]);

    const handleChatSelection = useCallback((chat: Chat) => {
        setSelectedChat(chat);
        setLoadingMessages(true);
        if (!messages[chat.id]) {
            setTimeout(() => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [chat.id]: [],
                }));
                setLoadingMessages(false);
            }, 500);
        } else {
            setLoadingMessages(false);
        }
    }, [messages]);

    const sendMessage = useCallback(() => {
        if (messageInput && selectedChat) {
            const message: Message = { sender: 'You', text: messageInput, timestamp: Date.now(), id: uuidv4() };
            socket.emit('chatMessage', { chatId: selectedChat.id, message });
            setMessages((prevMessages) => ({
                ...prevMessages,
                [selectedChat.id]: [...(prevMessages[selectedChat.id] || []), message],
            }));
            setMessageInput('');
        }
    }, [messageInput, selectedChat]);

    const renderMessageItem = useCallback(({ item }: { item: Message }) => (
        <View key={item.id} style={item.sender === 'You' ? styles.sentMessage : styles.receivedMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
    ), []);

    const chatInterface = useMemo(() => {
        if (!selectedChat) {
            return null;
        }

        return (
            <View style={styles.chatInterface}>
                {loadingMessages ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <FlatList
                        data={messages[selectedChat.id] || []}
                        renderItem={renderMessageItem}
                        keyExtractor={(item) => item.id}
                        style={styles.messageList}
                        inverted={true}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        value={messageInput}
                        onChangeText={setMessageInput}
                        placeholder="Type a message..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, [selectedChat, messages, messageInput, sendMessage, loadingMessages, renderMessageItem]);

    return (
        <SafeAreaView style={styles.container}>
            {selectedChat ? (
                <View style={styles.chatScreen}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setSelectedChat(null)}>
                            <Feather name="arrow-left" size={24} color="#007AFF" />
                        </TouchableOpacity>
                        <Text style={styles.title}>{selectedChat.name}</Text>
                    </View>
                    {chatInterface}
                </View>
            ) : (
                <View>
                    <View style={styles.header}>
                        <Text style={styles.title}>Chatting</Text>
                        <TouchableOpacity style={styles.searchButton}>
                            <Feather name="more-horizontal" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.storySection}>
                        <Text style={styles.sectionTitle}>Story</Text>
                        <FlatList
                            data={stories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.storyItem}>
                                    {item.image ? (
                                        <Image source={item.image} style={styles.storyImage} />
                                    ) : (
                                        <View style={styles.addStory}>
                                            <Text style={styles.addStoryText}>+</Text>
                                        </View>
                                    )}
                                    <Text style={styles.storyName}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <View style={styles.chatSection}>
                        <Text style={styles.sectionTitle}>Chat</Text>
                        <FlatList
                            data={chats}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id} style={styles.chatItem} onPress={() => handleChatSelection(item)}>
                                    <Image source={item.image} style={styles.chatImage} />
                                    <View style={styles.chatText}>
                                        <Text style={styles.chatName}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    chatScreen: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    backButton: {
        marginRight: 10,
    },
    searchButton: {
        padding: 10,
    },
    chatInterface: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    messageList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        maxWidth: '80%',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    messageTime: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    storySection: {
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 12,
        color: '#333',
    },
    storyItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    storyImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    addStory: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    addStoryText: {
        fontSize: 30,
        color: '#666',
    },
    storyName: {
        fontSize: 14,
        color: '#666',
    },
    chatSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    chatImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    chatText: {
        flex: 1,
    },
    chatName: {
        fontWeight: '500',
        color: '#333',
        fontSize: 16,
    },
});

export default ChatScreen;