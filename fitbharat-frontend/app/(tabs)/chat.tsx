// ChatScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { io, Socket } from 'socket.io-client';

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

  // 🔌 Connect to socket
  useEffect(() => {
    const newSocket = io('http://192.168.29.119:3001', {
      auth: { token: user },
      transports: ['websocket']
    });

    setSocket(newSocket);

    newSocket.on('connect_error', err => console.error('Connection Error:', err));
    newSocket.on('error', err => console.error('Socket Error:', err));

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
    };

    socket.emit('sendMessage', payload);
    setNewMessage('');
  };

  const handleTyping = (text: string) => {
    setNewMessage(text);

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

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === user;
    return (
      <View style={[styles.messageContainer, isMe ? styles.rightAlign : styles.leftAlign]}>
        <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
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
  