// app/index.tsx
import { useRouter, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
        setShowOnboarding(onboardingCompleted === 'true');
      } catch (err) {
        console.error('Error checking onboarding status:', err);
        setError('An error occurred while checking onboarding status.');
        setShowOnboarding(false); // Default to auth if error occurs
      }
    };

    checkOnboardingStatus();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (showOnboarding === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!showOnboarding) {
    return <Redirect href="/(onboarding)" />;
  } else {
    return <Redirect href="/(auth)" />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});