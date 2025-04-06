import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import LoginScreen from './login';
import SignupScreen from './signup';

const AuthFlow = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Checking login status...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You're already logged in!</Text>
        <Button title="Go to Home" onPress={() => router.push('/(tabs)/home')} />
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSignup ? <SignupScreen /> : <LoginScreen />}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: '100%',

  },
  text: {
    fontSize: 18,
    marginBottom: '20%',
    position:'absolute'
  },
});

export default AuthFlow;