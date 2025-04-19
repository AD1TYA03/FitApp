<<<<<<< HEAD
// ChatScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { io, Socket } from 'socket.io-client';
=======
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { Feather } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< HEAD
import { router } from 'expo-router';

interface Message {
    senderid: string;
    text: string;
    timestamp: number;
}

interface Chat {
    id: string;
    name: string;
    userid: string;
    image?: any;
    email?: string;
    type: 'private' | 'group';
}

interface Story {
    id: string;
    name: string;
    image: any | null;
}

interface IUser {
    id: string;
    name: string;
    email: string;
    userid: string;
}



const USER_ID = 'ankit'; // Replace with actual logged-in user ID
const socket: Socket = io('http://192.168.201.25:3001');

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

const storiesofuser: Story[] = [
    { id: 'add', name: 'Add Story', image: null },
    { id: '67fb5f320cd4053d0fba3355', name: 'Ankit', image: require('../../assets/images/ankit.png') },
    { id: 'farhana', name: 'Farhana', image: require('../../assets/images/farhana.png') },
    { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png') },
]

const chatsOfUser: Chat[] = [
    { id: '67fb5f320cd4053d0fba3355', name: 'Alok Kumar', userid: 'alok', email: 'alok@gmail.com', type: 'private' },
    { id: '67fbb31522a90f53fae6fd97', name: 'Ankit kushwaha', userid: 'ankit', email: 'ankit@gmail.com', type: 'private' },
    { id: '67fb5f320cd4053sdfba3355', name: 'Morning Runners', userid: 'group_123', type: 'group' },
];

const ChatScreen: React.FC = () => {
    const [user, setUser] = useState<IUser>();
    const [stories, setStories] = useState<Story[]>(storiesofuser);
    const [chats, setChats] = useState<Chat[]>(chatsOfUser);
=======
>>>>>>> fc479dcbe9cb37faabaf80e730022a4d1b7d8476

interface Message {
  _id?: string;
  sender: string;
  text: string;
  timestamp: number;
  chatId: string;
}

interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
}

const ChatScreen: React.FC = () => {
<<<<<<< HEAD
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user] = useState('ankit');
  const [chats] = useState<Chat[]>([
    { id: 'group_123', name: 'Study Buddies', isGroup: true },
    { id: 'group_456', name: 'Project Team', isGroup: true },
    { id: 'verma', name: 'Verma', isGroup: false },
    { id: 'ketan', name: 'Ketan', isGroup: false },
    { id: 'farhana', name: 'Farhana', isGroup: false }
  ]);

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);
=======
    const [stories, setStories] = useState<Story[]>();
    const [chats, setChats] = useState<Chat[]>();
>>>>>>> b255b671b0c21bc2ed46457e0e06bed3d06f20b6
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
    const [messageInput, setMessageInput] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setUser(user);
                    console.log('User retrieved:', user);
                }
                else {
                    router.push('/(auth)/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
<<<<<<< HEAD
        fetchUser();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('online-socket', { Id: user.id });
        });

        socket.on('receiveMessage', ({ recieverid, message }: { recieverid: string, message: Message }) => {
            setMessages(prev => ({
                ...prev,
                [recieverid]: [...(prev[recieverid] || []), { ...message, id: uuidv4() }]
            }));
        });
=======
>>>>>>> fc479dcbe9cb37faabaf80e730022a4d1b7d8476

  // 🔌 Connect to socket
  useEffect(() => {
    const newSocket = io('http://192.168.29.119:3001', {
      auth: { token: user },
      transports: ['websocket']
    });

    setSocket(newSocket);

    newSocket.on('connect_error', err => console.error('Connection Error:', err));
    newSocket.on('error', err => console.error('Socket Error:', err));
>>>>>>> b255b671b0c21bc2ed46457e0e06bed3d06f20b6

    return () => newSocket.disconnect();
  }, [user]);

  // 📩 Listen to messages & typing
  useEffect(() => {
    if (!socket || !currentChat) return;

    socket.emit('getChatHistory', { chatId: currentChat.id, isGroup: currentChat.isGroup });

    socket.on('chatHistory', ({ chatId, messages: fetched }) => {
      if (chatId === currentChat.id) {
        setMessages(fetched.reverse());
        scrollToBottom();
      }
    });

<<<<<<< HEAD
        if (!messages[chat.id]) {
            setLoadingMessages(true); // Show loading indicator while fetching history
            console.log(chat.id);
            
            socket.emit('getChatHistory', { chatId: chat.id }); // Request chat history from the server
        }
=======
    socket.on('receiveMessage', ({ chatId, message }) => {
      if (chatId === currentChat.id || message.sender === currentChat.id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    socket.on('typing', ({ userId }) => {
      if (!typingUsers.includes(userId) && userId !== user)
        setTypingUsers(prev => [...prev, userId]);
    });

    socket.on('stopTyping', ({ userId }) => {
      setTypingUsers(prev => prev.filter(u => u !== userId));
    });

    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [socket, currentChat]);

  // ✉️ Handle message send
  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !currentChat) return;

    const payload = {
      chatId: currentChat.id,
      isGroup: currentChat.isGroup,
      message: {
        sender: user,
        text: newMessage.trim(),
        timestamp: Date.now(),
        chatId: currentChat.id
      }
>>>>>>> b255b671b0c21bc2ed46457e0e06bed3d06f20b6
    };

    socket.emit('sendMessage', payload);
    setNewMessage('');
  };

  const handleTyping = (text: string) => {
    setNewMessage(text);

<<<<<<< HEAD
        const message: Message = {
            senderid: user.id,
            text: messageInput,
            timestamp: Date.now(),
        };

        socket.emit('sendMessage', {
            recieverid: selectedChat.id,
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
        <View style={item.senderid === user.id ? styles.sentMessage : styles.receivedMessage}>
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
                        keyExtractor={(item) => item.senderid}
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
=======
    if (text && !isTyping) {
      setIsTyping(true);
      socket?.emit('typing', { chatId: currentChat?.id, userId: user, isGroup: currentChat?.isGroup });

      setTimeout(() => {
        setIsTyping(false);
        socket?.emit('stopTyping', { chatId: currentChat?.id, userId: user, isGroup: currentChat?.isGroup });
      }, 2000);
    } else if (!text.trim()) {
      setIsTyping(false);
      socket?.emit('stopTyping', { chatId: currentChat?.id, userId: user, isGroup: currentChat?.isGroup });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
>>>>>>> b255b671b0c21bc2ed46457e0e06bed3d06f20b6

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === user;
    return (
<<<<<<< HEAD
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
                        <Text style={styles.title}>{user?.name}</Text>
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
=======
      <View style={[styles.messageContainer, isMe ? styles.rightAlign : styles.leftAlign]}>
        <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
>>>>>>> b255b671b0c21bc2ed46457e0e06bed3d06f20b6
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.chatSelector}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chatButton,
                currentChat?.id === item.id && styles.selectedChatButton
              ]}
              onPress={() => {
                setCurrentChat(item);
                setMessages([]);
              }}
            >
              <Text style={styles.chatButtonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.chatArea}>
        {currentChat ? (
          <>
            <Text style={styles.chatHeader}>{currentChat.name}</Text>

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item._id || item.timestamp.toString()}
              renderItem={renderMessage}
              contentContainerStyle={{ paddingVertical: 10 }}
            />

            {typingUsers.length > 0 && (
              <Text style={styles.typingText}>
                {typingUsers.join(', ')} is typing...
              </Text>
            )}

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.inputRow}
            >
              <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={newMessage}
                onChangeText={handleTyping}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </>
        ) : (
          <View style={styles.emptyChat}>
            <Text style={{ fontSize: 16, color: '#888' }}>Select a chat to start messaging</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#f9f9f9',
    },
    chatSelector: {
      width: 120,
      backgroundColor: '#eaeaea',
      borderRightWidth: 1,
      borderRightColor: '#ddd',
    },
    chatButton: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    selectedChatButton: {
      backgroundColor: '#d0d0d0',
    },
    chatButtonText: {
      fontSize: 14,
    },
    chatArea: {
      flex: 1,
      padding: 10,
    },
    chatHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    messageContainer: {
      marginBottom: 8,
      paddingHorizontal: 10,
    },
    leftAlign: {
      alignItems: 'flex-start',
    },
    rightAlign: {
      alignItems: 'flex-end',
    },
    messageBubble: {
      maxWidth: '75%',
      padding: 8,
      borderRadius: 10,
    },
    myMessage: {
      backgroundColor: '#dcf8c6',
    },
    theirMessage: {
      backgroundColor: '#ffffff',
    },
    messageText: {
      fontSize: 15,
    },
    timestamp: {
      fontSize: 10,
      color: '#555',
      marginTop: 2,
      textAlign: 'right',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      borderTopWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      height: 40,
      backgroundColor: '#f1f1f1',
      borderRadius: 20,
      paddingHorizontal: 15,
      marginRight: 10,
    },
    sendButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      backgroundColor: '#007AFF',
      borderRadius: 20,
    },
    sendButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    typingText: {
      paddingHorizontal: 10,
      paddingBottom: 5,
      fontStyle: 'italic',
      color: '#666',
    },
    emptyChat: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  