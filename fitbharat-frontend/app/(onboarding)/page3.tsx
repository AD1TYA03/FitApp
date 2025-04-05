import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function Page3() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../assets/images/login.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
        onLoadEnd={() => setLoading(false)}
      />

      {/* Content */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Set Your Goal, Crush Your Limits!</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleOnboardingComplete();
              router.push('/login');
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => {
              handleOnboardingComplete();
              router.push('/signup');
            }}
          >
            <Text style={[styles.buttonText, styles.outlineButtonText]}>Signup</Text>
          </TouchableOpacity>
        </View>

        {/* Skip Option */}
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0A0F24',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#8D41FC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8D41FC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#8D41FC',
  },
  skipText: {
    marginTop: 20,
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'underline',
  },
});

