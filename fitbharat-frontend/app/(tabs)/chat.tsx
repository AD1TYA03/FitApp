import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { Feather } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
}

interface Chat {
    id: string;
    name: string;
    image: any;
    type: 'private' | 'group';
}

interface Story {
    id: string;
    name: string;
    image: any | null;
}

const USER_ID = 'ankit'; // Replace with actual logged-in user ID
const socket: Socket = io('http://192.168.204.25:3001');

// const ChatScreen: React.FC = () => {
//     const [stories, setStories] = useState<Story[]>([
//         { id: 'add', name: 'Add Story', image: null },
//         { id: 'ankit', name: 'Ankit', image: require('../../assets/images/ankit.png') },
//         { id: 'farhana', name: 'Farhana', image: require('../../assets/images/farhana.png') },
//         { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png') },
//     ]);

//     const [chats, setChats] = useState<Chat[]>([
//         { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png'), type: 'private' },
//         { id: 'group_123', name: 'Morning Runners', image: require('../../assets/images/cardio.png'), type: 'group' },
//     ]);

//     const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//     const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
//     const [messageInput, setMessageInput] = useState('');
//     const [loadingMessages, setLoadingMessages] = useState(false);

//     useEffect(() => {
//         socket.on('connect', () => {
//             console.log('Connected to socket server');
//             socket.emit('join', { userId: USER_ID });
//         });

//         socket.on('receiveMessage', ({ chatId, message }: { chatId: string, message: Message }) => {
//             setMessages(prev => ({
//                 ...prev,
//                 [chatId]: [...(prev[chatId] || []), { ...message, id: uuidv4() }]
//             }));
//         });

//         socket.on('chatHistory', ({ chatId, messages: history }: { chatId: string, messages: Message[] }) => {
//             setMessages(prev => ({
//                 ...prev,
//                 [chatId]: history.map(message => ({ ...message, id: uuidv4() }))
//             }));
//             setLoadingMessages(false); // Hide loading indicator after fetching history
//         });

//         socket.on('error', (error: { message: string }) => {
//             console.error('Socket error:', error.message);
//             setLoadingMessages(false); // Hide loading indicator if an error occurs
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const handleChatSelection = (chat: Chat) => {        
//         setSelectedChat(chat);
//         if (!messages[chat.id]) {
//             console.log(chat.id);

//             setLoadingMessages(true); // Show loading indicator while fetching history
//             socket.emit('getChatHistory', { chatId: chat.id }); // Request chat history from the server
//         }
//     };

//     const sendMessage = () => {
//         if (!messageInput || !selectedChat) return;

//         const isGroup = selectedChat.type === 'group';

//         const message: Message = {
//             id: uuidv4(),
//             sender: USER_ID,
//             text: messageInput,
//             timestamp: Date.now(),
//         };

//         socket.emit('sendMessage', {
//             chatId: selectedChat.id,
//             message,
//             isGroup,
//         });

//         setMessages(prev => ({
//             ...prev,
//             [selectedChat.id]: [...(prev[selectedChat.id] || []), { ...message, sender: USER_ID }],
//         }));

//         setMessageInput('');
//     };

//     const renderMessageItem = useCallback(({ item }: { item: Message }) => (
//         <View style={item.sender === USER_ID ? styles.sentMessage : styles.receivedMessage}>
//             <Text style={styles.messageText}>{item.text}</Text>
//             <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
//         </View>
//     ), []);

//     const chatInterface = useMemo(() => {
//         if (!selectedChat) return null;

//         return (
//             <View style={styles.chatInterface}>
//                 {loadingMessages ? (
//                     <ActivityIndicator size="large" color="#007AFF" />
//                 ) : (
//                     <FlatList
//                         data={[...(messages[selectedChat.id] || [])].reverse()}
//                         renderItem={renderMessageItem}
//                         keyExtractor={(item) => item.id}
//                         contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
//                         inverted
//                     />
//                 )}
//                 <View style={styles.inputArea}>
//                     <TextInput
//                         style={styles.input}
//                         value={messageInput}
//                         onChangeText={setMessageInput}
//                         placeholder="Type a message..."
//                     />
//                     <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//                         <Text style={styles.sendButtonText}>Send</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         );
//     }, [selectedChat, messages, messageInput, sendMessage, loadingMessages, renderMessageItem]);

//     return (
//         <SafeAreaView style={styles.container}>
//             {selectedChat ? (
//                 <View style={styles.chatScreen}>
//                     <View style={styles.header}>
//                         <TouchableOpacity onPress={() => setSelectedChat(null)}>
//                             <Feather name="arrow-left" size={24} color="#007AFF" />
//                         </TouchableOpacity>
//                         <Text style={styles.title}>{selectedChat.name}</Text>
//                     </View>
//                     {chatInterface}
//                 </View>
//             ) : (
//                 <View>
//                     <View style={styles.header}>
//                         <Text style={styles.title}>Chatting</Text>
//                         <TouchableOpacity style={styles.searchButton}>
//                             <Feather name="more-horizontal" size={24} color="#007AFF" />
//                         </TouchableOpacity>
//                     </View>

//                     <View style={styles.storySection}>
//                         <Text style={styles.sectionTitle}>Story</Text>
//                         <FlatList
//                             data={stories}
//                             horizontal
//                             showsHorizontalScrollIndicator={false}
//                             keyExtractor={(item) => item.id}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity style={styles.storyItem}>
//                                     {item.image ? (
//                                         <Image source={item.image} style={styles.storyImage} />
//                                     ) : (
//                                         <View style={styles.addStory}>
//                                             <Text style={styles.addStoryText}>+</Text>
//                                         </View>
//                                     )}
//                                     <Text style={styles.storyName}>{item.name}</Text>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     </View>

//                     <View style={styles.chatSection}>
//                         <Text style={styles.sectionTitle}>Chat</Text>
//                         <FlatList
//                             data={chats}
//                             keyExtractor={(item) => item.id}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity style={styles.chatItem} onPress={() => handleChatSelection(item)}>
//                                     <Image source={item.image} style={styles.chatImage} />
//                                     <View style={styles.chatText}>
//                                         <Text style={styles.chatName}>{item.name}</Text>
//                                     </View>
//                                 </TouchableOpacity>
//                             )}
//                             showsVerticalScrollIndicator={false}
//                         />
//                     </View>
//                 </View>
//             )}
//         </SafeAreaView>
//     );
// };

const storiesofuser = [
    { id: 'add', name: 'Add Story', image: null },
    { id: 'ankit', name: 'Ankit', image: require('../../assets/images/ankit.png') },
    { id: 'farhana', name: 'Farhana', image: require('../../assets/images/farhana.png') },
    { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png') },
]

const chatsOfUser: Chat[] = [
    { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png'), type: 'private' },
    { id: 'group_123', name: 'Morning Runners', image: require('../../assets/images/cardio.png'), type: 'group' },
];

const ChatScreen: React.FC = () => {
    const [stories, setStories] = useState<Story[]>();
    const [chats, setChats] = useState<Chat[]>();
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
    const [messageInput, setMessageInput] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Fetch user-specific data (stories and chats) when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            // try {
            //     // Replace with your API endpoint
            //     const response = await fetch(`http://192.168.204.25:3001/api/user/${USER_ID}/data`);
            //     const data = await response.json();

            //     setStories(data.stories); // Set user-specific stories
            //     setChats(data.chats); // Set user-specific chats
            // } catch (error) {
            //     console.error('Error fetching user data:', error);
            // }
            setStories(storiesofuser); 
            setChats(chatsOfUser);
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('join', { userId: USER_ID });
        });

        socket.on('receiveMessage', ({ chatId, message }: { chatId: string, message: Message }) => {
            setMessages(prev => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), { ...message, id: uuidv4() }]
            }));
        });

        socket.on('chatHistory', ({ chatId, messages: history }: { chatId: string, messages: Message[] }) => {
            setMessages(prev => ({
                ...prev,
                [chatId]: history.map(message => ({ ...message, id: uuidv4() }))
            }));
            setLoadingMessages(false); // Hide loading indicator after fetching history
        });

        socket.on('error', (error: { message: string }) => {
            console.error('Socket error:', error.message);
            setLoadingMessages(false); // Hide loading indicator if an error occurs
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleChatSelection = (chat: Chat) => {
        setSelectedChat(chat);

        if (!messages[chat.id]) {
            setLoadingMessages(true); // Show loading indicator while fetching history
            socket.emit('getChatHistory', { chatId: chat.id }); // Request chat history from the server
        }
    };

    const sendMessage = () => {
        if (!messageInput || !selectedChat) return;

        const isGroup = selectedChat.type === 'group';

        const message: Message = {
            id: uuidv4(),
            sender: USER_ID,
            text: messageInput,
            timestamp: Date.now(),
        };

        socket.emit('sendMessage', {
            chatId: selectedChat.id,
            message,
            isGroup,
        });

        setMessages(prev => ({
            ...prev,
            [selectedChat.id]: [...(prev[selectedChat.id] || []), { ...message, sender: USER_ID }],
        }));

        setMessageInput('');
    };

    const renderMessageItem = useCallback(({ item }: { item: Message }) => (
        <View style={item.sender === USER_ID ? styles.sentMessage : styles.receivedMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
    ), []);

    const chatInterface = useMemo(() => {
        if (!selectedChat) return null;

        return (
            <View style={styles.chatInterface}>
                {loadingMessages ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <FlatList
                        data={[...(messages[selectedChat.id] || [])].reverse()}
                        renderItem={renderMessageItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                        inverted
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
                            horizontal
                            showsHorizontalScrollIndicator={false}
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
                        />
                    </View>

                    <View style={styles.chatSection}>
                        <Text style={styles.sectionTitle}>Chat</Text>
                        <FlatList
                            data={chats}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.chatItem} onPress={() => handleChatSelection(item)}>
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