import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { Feather } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { connectSocket } from '@/utils/socket';

interface IMessage {
  sender: IUser;
  reciever: IUser;
  text: string;
  timestamp: number;
}


interface IUser {
  id: string;
  name: string;
  email: string;
  userid: string;
}

interface IGroup {
  id: string;
  name: string;
  image?: any | null;
  groupid: string;
  admin?: IUser;
}


interface IChat {
  chatid: string;
  name: string;
  isGroup: boolean;
  image?: any;
  details: IUser | IGroup
}

interface Story {
  id: string;
  name: string;
  image: any | null;
}




const storiesofuser: Story[] = [
  { id: 'add', name: 'Add Story', image: null },
  { id: '67fb5f320cd4053d0fba3355', name: 'Ankit', image: require('../../assets/images/ankit.png') },
  { id: 'farhana', name: 'Farhana', image: require('../../assets/images/farhana.png') },
  { id: 'alok', name: 'Alok', image: require('../../assets/images/alok.png') },
]

const chatsOfUser: IChat[] = [
  { chatid: 'alok', name: 'Alok Kumar', isGroup: false, details: { id: '67fb5f320cd4053d0fba3355', name: 'Alok Kumar', email: 'alok@gmail.com', userid: 'alok' } },
  { chatid: 'ankit', name: 'Ankit kushwaha', isGroup: false, details: { id: '67fbb31522a90f53fae6fd97', name: 'Ankit Kushwaha', email: 'ankit@gmail.com', userid: 'ankit' } },
  { chatid: 'aman', name: 'Aman Kumar', isGroup: false, details: { id: '6804cb2559c50da418b2e71d', name: 'Aman Kumar', email: 'aman@gmail.com', userid: 'aman' } },
  { chatid: 'group_123', name: 'Morning Runners', isGroup: true, details: { id: '', name: 'Morning Runners', groupid: 'group_123', admin: { id: '67fb5f320cd4053d0fba3355', name: 'Alok Kumar', email: 'alok@gmail.com', userid: 'alok' } } },
];

const socket = io('http://192.168.232.25:3001', {
  auth: {
    token: AsyncStorage.getItem('authToken'), // Send token during handshake
  },
  transports: ['websocket'], // optional: ensures websocket usage
});

const ChatScreen: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const [stories, setStories] = useState<Story[]>(storiesofuser);
  const [chats, setChats] = useState<IChat[]>(chatsOfUser);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const [messages, setMessages] = useState<{ [chatId: string]: IMessage[] }>({});
  const [messageInput, setMessageInput] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('authToken');
        if (userData && token) {
          const user = JSON.parse(userData);
          setUser(user);
          console.log('User retrieved:', user, token);
        }
        else {
          router.push('/(auth)/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('online-socket', { Id: user.id });
    });

    socket.on('receiveMessage', async ({ message }: { message: IMessage }) => {
      console.log(" ")
      console.log('Message received on :', message, await AsyncStorage.getItem('user'));
      console.log(" ")
      if (!message.sender || !message.sender.id) {
        console.error('Invalid message received:', message);
        return;
      }

      setMessages(prev => ({
        ...prev,
        [selectedChat?.chatid]: [...(prev[selectedChat?.chatid] || []), { ...message, id: uuidv4() }]
      }));
    });

    socket.on('chatHistory', ({ chatId, messages: history }: { chatId: string, messages: IMessage[] }) => {
      const validMessages = history.filter(msg => msg.sender && msg.sender.id); // Filter out invalid messages

      setMessages(prev => ({
        ...prev,
        [chatId]: validMessages.map(message => ({ ...message, id: uuidv4() }))
      }));
      setLoadingMessages(false);
    });

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
      setLoadingMessages(false); // Hide loading indicator if an error occurs
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChatSelection = (chat: IChat) => {
    setSelectedChat(chat);

    if (!messages[chat.chatid]) {
      setLoadingMessages(true); // Show loading indicator while fetching history
      console.log(chat.chatid);

      socket.emit('getChatHistory', { chatId: chat.chatid, isGroup: chat.isGroup }); // Request chat history from the server
    }
  };

  const sendMessage = () => {
    if (!messageInput || !selectedChat) return;

    const isGroup = selectedChat.isGroup;

    const message: IMessage = {
      reciever: selectedChat.isGroup ? undefined : (selectedChat.details as IUser),
      sender: user,
      text: messageInput,
      timestamp: Date.now(),
    };

    console.log(selectedChat);

    socket.emit('sendMessage', {
      message,
      isGroup,
    });

    setMessages(prev => ({
      ...prev,
      [selectedChat.chatid]: [...(prev[selectedChat.chatid] || []), { ...message }],
    }));

    setMessageInput('');
  };

  const renderMessageItem = useCallback(({ item }: { item: IMessage }) => {
    if (!item.sender || !item.sender.id) {
      console.warn('Invalid message item:', item);
      return null; // Skip rendering invalid messages
    }

    return (
      <View style={item.sender.id === user?.id ? styles.sentMessage : styles.receivedMessage}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    );
  }, [user]);

  const chatInterface = useMemo(() => {
    if (!selectedChat) return null;

    return (
      <View style={styles.chatInterface}>
        {loadingMessages ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={[...(messages[selectedChat.chatid] || [])].reverse()}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => {
              return item.sender?.id ? `${item.sender.id}-${index}` : `message-${item.timestamp}-${index}`;
            }}
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
              keyExtractor={(item) => item.chatid}
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