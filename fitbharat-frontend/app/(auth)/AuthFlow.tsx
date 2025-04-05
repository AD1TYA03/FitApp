import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import LoginScreen from './login';
import SignupScreen from './signup';

const AuthFlow = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);

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
      <Button
        title={isSignup ? 'Already have an account? Login' : 'Don’t have an account? Signup'}
        onPress={() => setIsSignup((prev) => !prev)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AuthFlow;
