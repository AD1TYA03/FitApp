import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import LoginScreen from "./login";
import SignupScreen from "./signup";

const AuthFlow = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Avoid repeated redirects
    if (user && !redirected) {
      router.replace("/(tabs)/home");
      setRedirected(true);
    }
  }, [user, redirected]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Checking login status...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return null; // While redirecting
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <Button
          title={isSignup ? "Switch to Login" : "Switch to Signup"}
          onPress={() => setIsSignup((prev) => !prev)}
        />
      </View>

      <View style={styles.formContainer}>
        {isSignup ? <SignupScreen /> : <LoginScreen />}
      </View>
    </SafeAreaView>
  );
};

export default AuthFlow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginBottom: 10,
    fontSize: 18,
  },
  toggleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
});
